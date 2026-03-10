<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Product extends Model
{
    use HasFactory;

    /**
     * @var list<string>
     */
    protected $fillable = [
        'primary_category_id',
        'name',
        'sub_title',
        'sku',
        'price',
        'old_price',
        'discount',
        'stock',
        'description',
        'image',
        'is_active',
        'is_new',
    ];

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
            'is_new' => 'boolean',
        ];
    }

    /**
     * Danh mục mà sản phẩm thuộc về (nhiều-nhiều).
     */
    public function categories(): BelongsToMany
    {
        return $this->belongsToMany(Category::class);
    }

    /**
     * Danh mục chính dùng để phân loại Đồ Nam/Đồ Nữ (lọc theo category_id trên API).
     */
    public function primaryCategory(): BelongsTo
    {
        return $this->belongsTo(Category::class, 'primary_category_id');
    }
}

