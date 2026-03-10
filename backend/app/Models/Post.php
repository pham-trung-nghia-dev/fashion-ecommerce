<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Post extends Model
{
    protected $fillable = [
        'title',
        'excerpt',
        'slug',
        'content',
        'thumbnail',
        'status',
        'published_at',
    ];

    protected function casts(): array
    {
        return [
            'status' => 'boolean',
            'published_at' => 'datetime',
        ];
    }

    protected static function booted(): void
    {
        // Auto-generate slug from title on creation
        static::creating(function (Post $post) {
            if (empty($post->slug)) {
                $post->slug = static::generateUniqueSlug($post->title);
            }
        });
    }

    /**
     * Generate a unique slug, appending a suffix if needed.
     */
    public static function generateUniqueSlug(string $title): string
    {
        $slug = Str::slug($title);
        $original = $slug;
        $counter = 1;

        while (static::where('slug', $slug)->exists()) {
            $slug = "{$original}-{$counter}";
            $counter++;
        }

        return $slug;
    }
}
