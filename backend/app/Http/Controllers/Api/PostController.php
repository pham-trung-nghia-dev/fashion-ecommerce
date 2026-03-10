<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Post;
use Illuminate\Http\JsonResponse;

class PostController extends Controller
{
    public function index(): JsonResponse
    {
        $posts = Post::where('status', true)
            ->whereNotNull('published_at')
            ->orderBy('published_at', 'desc')
            ->limit(50)
            ->get();

        return response()->json([
            'data' => $posts->map(fn (Post $p) => $this->formatPost($p)),
        ]);
    }

    public function show(int $id): JsonResponse
    {
        $post = Post::where('status', true)->find($id);

        if (! $post) {
            return response()->json(['message' => 'Not found'], 404);
        }

        return response()->json(['data' => $this->formatPost($post)]);
    }

    private function formatPost(Post $p): array
    {
        return [
            'id' => $p->id,
            'title' => $p->title,
            'date' => $p->published_at?->format('d/m/Y') ?? $p->created_at->format('d/m/Y'),
            // Trả về đúng HTML mô tả / nội dung như đã nhập
            'description' => $p->excerpt ?? ($p->content ?? ''),
            'content' => $p->content ?? '',
            'image' => $p->thumbnail ? asset('storage/'.$p->thumbnail) : '',
        ];
    }
}
