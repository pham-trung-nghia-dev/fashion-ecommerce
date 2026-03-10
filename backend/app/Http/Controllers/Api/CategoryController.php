<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\JsonResponse;

class CategoryController extends Controller
{
    public function index(): JsonResponse
    {
        $categories = Category::orderBy('sort_order')->orderBy('id')->get();

        return response()->json([
            'data' => $categories->map(fn (Category $c) => [
                'id' => $c->id,
                'name' => $c->name,
                'slug' => $c->slug,
                'href' => '/products?category_id='.$c->id,
            ]),
        ]);
    }
}
