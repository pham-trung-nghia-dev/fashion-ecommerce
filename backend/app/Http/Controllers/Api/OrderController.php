<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class OrderController extends Controller
{
    /**
     * Display a listing of the user's orders.
     */
    public function index(Request $request): JsonResponse
    {
        $user = auth()->user();
        if (!$user) {
            return response()->json(['message' => 'Unauthenticated.'], 401);
        }

        $orders = Order::where('user_id', $user->id)
            ->with('items')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'data' => $orders->map(fn(Order $o) => $this->formatOrder($o)),
        ]);
    }

    /**
     * Display the specified order.
     */
    public function show(int $id): JsonResponse
    {
        $user = auth()->user();
        if (!$user) {
            return response()->json(['message' => 'Unauthenticated.'], 401);
        }

        $order = Order::where('user_id', $user->id)
            ->with('items')
            ->find($id);

        if (!$order) {
            return response()->json(['message' => 'Order not found.'], 404);
        }

        return response()->json([
            'data' => $this->formatOrder($order),
        ]);
    }

    /**
     * Store a newly created order in storage.
     */
    public function store(Request $request): JsonResponse
    {
        $user = auth()->user();
        if (!$user) {
            return response()->json(['message' => 'Unauthenticated.'], 401);
        }

        $request->validate([
            'customer_name' => 'required|string|max:255',
            'customer_phone' => 'required|string|max:20',
            'customer_email' => 'required|email|max:255',
            'shipping_address' => 'required|string',
            'city' => 'required|string|max:100',
            'district' => 'required|string|max:100',
            'notes' => 'nullable|string',
            'payment_method' => 'required|string|in:cod,payos',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|integer',
            'items.*.quantity' => 'required|integer|min:1',
            'discount_amount' => 'nullable|numeric|min:0',
        ]);

        $itemsInput = $request->input('items');
        $discountAmount = floatval($request->input('discount_amount', 0));

        // 1. Calculate prices from database to prevent client manipulation
        $subtotal = 0;
        $orderItemsData = [];

        foreach ($itemsInput as $item) {
            $product = Product::find($item['product_id']);
            if (!$product || !$product->is_active) {
                return response()->json(['message' => "Sản phẩm (ID: {$item['product_id']}) không khả dụng."], 422);
            }

            // Check stock
            if ($product->stock < $item['quantity']) {
                return response()->json(['message' => "Sản phẩm {$product->name} chỉ còn {$product->stock} sản phẩm trong kho."], 422);
            }

            $price = floatval($product->price);
            $qty = intval($item['quantity']);
            $subtotal += $price * $qty;

            // Format image URL
            $imageUrl = '';
            if ($product->image) {
                if (str_starts_with($product->image, 'http') || str_starts_with($product->image, 'data:')) {
                    $imageUrl = $product->image;
                } else {
                    $imageUrl = asset('storage/' . $product->image);
                }
            }

            $orderItemsData[] = [
                'product_id' => $product->id,
                'product_name' => $product->name,
                'price' => $price,
                'quantity' => $qty,
                'image' => $imageUrl,
                'model' => $product // Keep reference to deduct stock later
            ];
        }

        // Calculate shipping fee: free shipping for orders > 1,000,000 VND, otherwise 30,000 VND
        $shippingFee = $subtotal > 1000000 ? 0 : 30000;
        $total = $subtotal - $discountAmount + $shippingFee;
        if ($total < 0) {
            $total = 0;
        }

        // Unique numeric order code for PayOS (max 9007199254740991)
        $orderCode = time() + rand(100000, 999999);

        // 2. Create Order in Pending state
        $order = Order::create([
            'user_id' => $user->id,
            'order_code' => $orderCode,
            'customer_name' => $request->input('customer_name'),
            'customer_phone' => $request->input('customer_phone'),
            'customer_email' => $request->input('customer_email'),
            'shipping_address' => $request->input('shipping_address'),
            'city' => $request->input('city'),
            'district' => $request->input('district'),
            'notes' => $request->input('notes'),
            'payment_method' => $request->input('payment_method'),
            'payment_status' => 'pending',
            'shipping_status' => 'pending',
            'subtotal' => $subtotal,
            'discount_amount' => $discountAmount,
            'shipping_fee' => $shippingFee,
            'total' => $total,
        ]);

        // 3. Save Order Items and deduct stock
        foreach ($orderItemsData as $itemData) {
            OrderItem::create([
                'order_id' => $order->id,
                'product_id' => $itemData['product_id'],
                'product_name' => $itemData['product_name'],
                'price' => $itemData['price'],
                'quantity' => $itemData['quantity'],
                'image' => $itemData['image'],
            ]);

            // Deduct product stock
            $product = $itemData['model'];
            $product->decrement('stock', $itemData['quantity']);
        }

        // 4. Handle Payment
        $checkoutUrl = null;
        $payosConfigured = !empty(env('PAYOS_CLIENT_ID')) && !empty(env('PAYOS_API_KEY')) && !empty(env('PAYOS_CHECKSUM_KEY'));

        if ($request->input('payment_method') === 'payos') {
            $frontendUrl = $request->header('Origin') ?: 'http://localhost:3000';
            $cancelUrl = "{$frontendUrl}/orders?payment=cancel&orderCode={$orderCode}";
            $returnUrl = "{$frontendUrl}/orders?payment=success&orderCode={$orderCode}";

            if ($payosConfigured) {
                try {
                    // PayOS API credentials
                    $clientId = env('PAYOS_CLIENT_ID');
                    $apiKey = env('PAYOS_API_KEY');
                    $checksumKey = env('PAYOS_CHECKSUM_KEY');

                    // PayOS description: max 25 chars, alphanumeric + spaces only
                    $description = "DH" . $orderCode;

                    // Sort keys alphabetically for signature
                    // amount, cancelUrl, description, orderCode, returnUrl
                    $signatureData = [
                        'amount' => intval($total),
                        'cancelUrl' => $cancelUrl,
                        'description' => $description,
                        'orderCode' => intval($orderCode),
                        'returnUrl' => $returnUrl,
                    ];
                    ksort($signatureData);

                    // Generate Raw String manually to prevent urlencode mismatch
                    $stringParts = [];
                    foreach ($signatureData as $key => $val) {
                        $stringParts[] = "{$key}={$val}";
                    }
                    $signatureString = implode('&', $stringParts);
                    $signature = hash_hmac('sha256', $signatureString, $checksumKey);

                    // Add items for display on PayOS checkout (optional but good)
                    $payosItems = [];
                    foreach ($orderItemsData as $itemData) {
                        $payosItems[] = [
                            'name' => mb_substr($itemData['product_name'], 0, 40), // Truncate if long
                            'quantity' => $itemData['quantity'],
                            'price' => intval($itemData['price']),
                        ];
                    }

                    // Request payload
                    $payload = [
                        'orderCode' => intval($orderCode),
                        'amount' => intval($total),
                        'description' => $description,
                        'cancelUrl' => $cancelUrl,
                        'returnUrl' => $returnUrl,
                        'signature' => $signature,
                        'items' => $payosItems,
                    ];

                    $response = Http::withHeaders([
                        'x-client-id' => $clientId,
                        'x-api-key' => $apiKey,
                        'Content-Type' => 'application/json',
                    ])->post('https://api-merchant.payos.vn/v2/payment-requests', $payload);

                    if ($response->successful()) {
                        $resData = $response->json();
                        if (isset($resData['code']) && $resData['code'] === '00') {
                            $checkoutUrl = $resData['data']['checkoutUrl'];
                            $paymentLinkId = $resData['data']['paymentLinkId'];

                            // Update order with PayOS payment link ID
                            $order->update(['payos_payment_link_id' => $paymentLinkId]);
                        } else {
                            Log::error("PayOS error response: " . json_encode($resData));
                            return response()->json([
                                'message' => 'Lỗi khởi tạo thanh toán với PayOS: ' . ($resData['desc'] ?? 'Unknown'),
                                'dev_fallback' => true,
                                'checkoutUrl' => "{$frontendUrl}/orders?payment=success&orderCode={$orderCode}&mock=1"
                            ], 200);
                        }
                    } else {
                        Log::error("PayOS API Connection failed: " . $response->body());
                        return response()->json([
                            'message' => 'Không thể kết nối tới cổng thanh toán PayOS.',
                            'dev_fallback' => true,
                            'checkoutUrl' => "{$frontendUrl}/orders?payment=success&orderCode={$orderCode}&mock=1"
                        ], 200);
                    }
                } catch (\Exception $e) {
                    Log::error("PayOS Integration Exception: " . $e->getMessage());
                    return response()->json([
                        'message' => 'Lỗi kết nối cổng thanh toán: ' . $e->getMessage(),
                        'dev_fallback' => true,
                        'checkoutUrl' => "{$frontendUrl}/orders?payment=success&orderCode={$orderCode}&mock=1"
                    ], 200);
                }
            } else {
                // Mock Flow fallback if PayOS keys are missing
                $checkoutUrl = "{$frontendUrl}/orders?payment=success&orderCode={$orderCode}&mock=1";
                
                // Immediately auto-pay the mock order so they can see the Paid status
                $order->update(['payment_status' => 'paid']);
            }
        } else {
            // COD Payment method is immediately success but payment_status = pending (since they pay on delivery)
            $checkoutUrl = null;
        }

        return response()->json([
            'message' => 'Đặt hàng thành công!',
            'order' => $this->formatOrder($order),
            'checkoutUrl' => $checkoutUrl,
            'is_mock' => !$payosConfigured && $request->input('payment_method') === 'payos',
        ]);
    }

    /**
     * Public webhook for PayOS payment notifications.
     */
    public function webhook(Request $request): JsonResponse
    {
        $payload = $request->all();
        Log::info("PayOS Webhook received: " . json_encode($payload));

        $checksumKey = env('PAYOS_CHECKSUM_KEY');
        if (empty($checksumKey)) {
            Log::warning("PayOS Webhook received but PAYOS_CHECKSUM_KEY is not configured.");
            return response()->json(['message' => 'Webhook received but checksum key missing.'], 200);
        }

        // Verify webhook signature manually
        if (!isset($payload['data']) || !isset($payload['signature'])) {
            return response()->json(['message' => 'Invalid webhook payload.'], 400);
        }

        $transaction = $payload['data'];
        $receivedSignature = $payload['signature'];

        // Sort keys alphabetically
        ksort($transaction);

        // Build signature raw string
        $stringParts = [];
        foreach ($transaction as $key => $val) {
            if (is_null($val)) {
                $val = '';
            } elseif (is_bool($val)) {
                $val = $val ? 'true' : 'false';
            }
            $stringParts[] = "{$key}={$val}";
        }
        $signatureString = implode('&', $stringParts);
        $calculatedSignature = hash_hmac('sha256', $signatureString, $checksumKey);

        if (!hash_equals($calculatedSignature, $receivedSignature)) {
            Log::error("PayOS Webhook Signature verification failed.");
            return response()->json(['message' => 'Invalid signature.'], 400);
        }

        // Process successful payment
        $orderCode = $transaction['orderCode'];
        $order = Order::where('order_code', $orderCode)->first();

        if ($order) {
            if ($transaction['code'] === '00') {
                $order->update(['payment_status' => 'paid']);
                Log::info("Order #{$orderCode} marked as PAID via PayOS Webhook.");
            } else {
                $order->update(['payment_status' => 'failed']);
                Log::info("Order #{$orderCode} marked as FAILED via PayOS Webhook.");
            }
        }

        return response()->json(['success' => true]);
    }

    /**
     * Format Eloquent Order structure for JSON response.
     */
    private function formatOrder(Order $o): array
    {
        return [
            'id' => $o->id,
            'orderCode' => $o->order_code,
            'customerName' => $o->customer_name,
            'customerPhone' => $o->customer_phone,
            'customerEmail' => $o->customer_email,
            'shippingAddress' => $o->shipping_address,
            'city' => $o->city,
            'district' => $o->district,
            'notes' => $o->notes ?? '',
            'paymentMethod' => $o->payment_method,
            'paymentStatus' => $o->payment_status,
            'shippingStatus' => $o->shipping_status,
            'subtotal' => (string) $o->subtotal,
            'discountAmount' => (string) $o->discount_amount,
            'shippingFee' => (string) $o->shipping_fee,
            'total' => (string) $o->total,
            'payosPaymentLinkId' => $o->payos_payment_link_id,
            'createdAt' => $o->created_at->toISOString(),
            'items' => $o->items->map(fn(OrderItem $item) => [
                'id' => $item->id,
                'productId' => $item->product_id,
                'productName' => $item->product_name,
                'price' => (string) $item->price,
                'quantity' => (int) $item->quantity,
                'image' => $item->image ?? '',
            ])->toArray(),
        ];
    }
}
