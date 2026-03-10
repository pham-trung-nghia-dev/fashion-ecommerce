<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Category extends Model
{
    protected $fillable = [
        'name',
        'slug',
        'image',
        'sort_order',
    ];

    protected static function booted(): void
    {
        static::creating(function (Category $category) {
            if (empty($category->slug)) {
                $category->slug = Str::slug($category->name);
            }
        });
    }

    /**
     * Sản phẩm thuộc danh mục này (nhiều-nhiều).
     */
    public function products(): BelongsToMany
    {
        return $this->belongsToMany(Product::class);
    }
}
