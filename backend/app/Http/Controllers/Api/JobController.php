<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Job;
use Illuminate\Http\JsonResponse;

class JobController extends Controller
{
    public function index(): JsonResponse
    {
        $jobs = Job::where('is_active', true)
            ->orderBy('created_at', 'desc')
            ->limit(50)
            ->get();

        return response()->json([
            'data' => $jobs->map(fn (Job $j) => [
                'id' => $j->id,
                'title' => $j->title,
                'location' => $j->location ?? '',
                'description' => $j->description ?? '',
            ]),
        ]);
    }
}
