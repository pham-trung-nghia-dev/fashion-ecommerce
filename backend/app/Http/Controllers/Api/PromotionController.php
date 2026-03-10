<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Promotion;
use Illuminate\Http\JsonResponse;

class PromotionController extends Controller
{
    public function index(): JsonResponse
    {
        $promotions = Promotion::where('is_active', true)
            ->orderBy('start_at', 'desc')
            ->limit(50)
            ->get();

        return response()->json([
            'data' => $promotions->map(fn (Promotion $p) => [
                'id' => $p->id,
                'title' => $p->title,
                'time' => $p->start_at && $p->end_at
                    ? $p->start_at->format('d/m/Y').' - '.$p->end_at->format('d/m/Y')
                    : ($p->start_at ? $p->start_at->format('d/m/Y') : ''),
                'description' => $p->description ?? '',
            ]),
        ]);
    }
}
