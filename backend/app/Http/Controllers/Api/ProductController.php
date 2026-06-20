<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ProductController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        // Lọc sản phẩm đang bán
        $query = Product::where('is_active', true)
            ->orderBy('created_at', 'desc');

        if ($request->boolean('is_new')) {
            $query->where('is_new', true);
        }

        // Lọc theo ID danh mục nếu có ?category_id=...
        // Đồ Nam/Đồ Nữ dựa trên cột products.primary_category_id để tránh lẫn pivot.
        // HOT (id=3) dựa trên pivot categories.
        if ($categoryId = (int) $request->query('category_id', 0)) {
            if (in_array($categoryId, [1, 2], true)) {
                $query->where('primary_category_id', $categoryId);
            } elseif ($categoryId === 3) {
                $query->whereHas('categories', function ($q) {
                    $q->where('categories.id', 3);
                });
            }
        }

        $limit = $request->integer('limit', 100);
        $products = $query->with(['categories', 'primaryCategory'])->limit($limit)->get();

        return response()->json([
            'data' => $products->map(fn (Product $p) => $this->formatProduct($p)),
        ]);
    }

    public function show(int $id): JsonResponse
    {
        $product = Product::where('is_active', true)->find($id);

        if (! $product) {
            return response()->json(['message' => 'Not found'], 404);
        }

        return response()->json(['data' => $this->formatProduct($product)]);
    }

    private function formatProduct(Product $p): array
    {
        $imageUrl = '';
        if ($p->image) {
            if (str_starts_with($p->image, 'http') || str_starts_with($p->image, 'data:')) {
                $imageUrl = $p->image;
            } else {
                $imageUrl = asset('storage/'.$p->image);
            }
        }

        return [
            'id' => $p->id,
            'name' => $p->name,
            'subTitle' => $p->sub_title ?? '',
            'price' => (string) $p->price,
            'oldPrice' => $p->old_price ? (string) $p->old_price : null,
            'discount' => $p->discount,
            'sku' => $p->sku ?? '',
            'stock' => (int) $p->stock,
            'description' => $p->description ?? '',
            'image' => $imageUrl,
            'isNew' => (bool) $p->is_new,
        ];
    }
}
