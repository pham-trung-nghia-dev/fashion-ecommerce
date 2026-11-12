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
        $query = Product::where('is_active', true);

        if ($request->boolean('is_new')) {
            $query->where('is_new', true);
        }

        // Tìm kiếm theo từ khóa (q)
        if ($search = $request->query('q')) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('sub_title', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        // Lọc theo khoảng giá
        if ($minPrice = $request->query('min_price')) {
            $query->where('price', '>=', (float) $minPrice);
        }
        if ($maxPrice = $request->query('max_price')) {
            $query->where('price', '<=', (float) $maxPrice);
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
            } else {
                $query->whereHas('categories', function ($q) use ($categoryId) {
                    $q->where('categories.id', $categoryId);
                });
            }
        }

        // Sắp xếp
        $sortBy = $request->query('sort_by', 'newest');
        if ($sortBy === 'price_asc') {
            $query->orderBy('price', 'asc');
        } elseif ($sortBy === 'price_desc') {
            $query->orderBy('price', 'desc');
        } elseif ($sortBy === 'popular') {
            $query->orderByRaw('COALESCE(discount, 0) DESC')->orderBy('created_at', 'desc');
        } else {
            $query->orderBy('created_at', 'desc');
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
