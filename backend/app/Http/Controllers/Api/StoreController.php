<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Store;
use Illuminate\Http\JsonResponse;

class StoreController extends Controller
{
    public function index(): JsonResponse
    {
        $stores = Store::orderBy('sort_order')->orderBy('id')->get();

        return response()->json([
            'data' => $stores->map(fn (Store $s) => [
                'id' => $s->id,
                'name' => $s->name,
                'address' => $s->address ?? '',
                'hotline' => $s->phone ?? '',
            ]),
        ]);
    }
}
