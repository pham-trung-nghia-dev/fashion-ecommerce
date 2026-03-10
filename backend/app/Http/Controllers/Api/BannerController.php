<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Banner;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Storage;

class BannerController extends Controller
{
    public function index(): JsonResponse
    {
        $banners = Banner::where('is_active', true)
            ->orderBy('sort_order')
            ->orderBy('id')
            ->get();

        return response()->json([
            'data' => $banners->map(fn (Banner $b) => [
                'id' => $b->id,
                'image' => $b->image ? Storage::disk('public')->url($b->image) : '',
            ]),
        ]);
    }
}
