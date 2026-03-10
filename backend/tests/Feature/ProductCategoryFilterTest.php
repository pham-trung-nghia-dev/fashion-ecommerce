<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Str;
use Tests\TestCase;

class ProductCategoryFilterTest extends TestCase
{
    use RefreshDatabase;

    private function makeCategory(string $name, string $slug): Category
    {
        return Category::query()->create([
            'name' => $name,
            'slug' => $slug,
            'sort_order' => 0,
        ]);
    }

    private function makeProduct(string $name): Product
    {
        return Product::query()->create([
            'name' => $name,
            'sku' => Str::upper(Str::random(10)),
            'price' => 1000,
            'stock' => 10,
            'is_active' => true,
            'is_new' => false,
        ]);
    }

    public function test_filters_products_by_category_id(): void
    {
        $men = $this->makeCategory('Đồ Nam', 'do-nam');
        $women = $this->makeCategory('Đồ Nữ', 'do-nu');

        $pMenOnly = $this->makeProduct('Áo Nam');
        $pWomenOnly = $this->makeProduct('Váy Nữ');
        $pBoth = $this->makeProduct('Lỗi gắn cả 2');

        // primary_category_id là nguồn chân lý cho Đồ Nam/Đồ Nữ
        $pMenOnly->update(['primary_category_id' => $men->id]);
        $pWomenOnly->update(['primary_category_id' => $women->id]);
        $pBoth->update(['primary_category_id' => $women->id]); // giả lập sản phẩm bị gắn nhầm tag/pivot không ảnh hưởng filter

        // pivot có thể lộn xộn nhưng filter vẫn phải đúng theo primary_category_id
        $pBoth->categories()->sync([$men->id, $women->id]);

        // category_id = women -> should not include men-only or both (mutual exclusion)
        $womenRes = $this->getJson('/api/products?category_id='.$women->id)
            ->assertOk()
            ->json('data');

        $womenNames = collect($womenRes)->pluck('name')->all();
        $this->assertContains('Váy Nữ', $womenNames);
        $this->assertNotContains('Áo Nam', $womenNames);
        $this->assertContains('Lỗi gắn cả 2', $womenNames);

        // category_id = men -> should not include women-only or both (mutual exclusion)
        $menRes = $this->getJson('/api/products?category_id='.$men->id)
            ->assertOk()
            ->json('data');

        $menNames = collect($menRes)->pluck('name')->all();
        $this->assertContains('Áo Nam', $menNames);
        $this->assertNotContains('Váy Nữ', $menNames);
        $this->assertNotContains('Lỗi gắn cả 2', $menNames);
    }

    public function test_hot_category_does_not_apply_men_women_exclusion(): void
    {
        $men = $this->makeCategory('Đồ Nam', 'do-nam');
        $women = $this->makeCategory('Đồ Nữ', 'do-nu');
        $hot = $this->makeCategory('Sản phẩm Hot', 'san-pham-hot');

        $pHotMen = $this->makeProduct('Hot Nam');
        $pHotWomen = $this->makeProduct('Hot Nữ');
        $pHotBoth = $this->makeProduct('Hot cả 2');

        $pHotMen->categories()->sync([$men->id, $hot->id]);
        $pHotWomen->categories()->sync([$women->id, $hot->id]);
        $pHotBoth->categories()->sync([$men->id, $women->id, $hot->id]);

        $hotRes = $this->getJson('/api/products?category_id='.$hot->id)
            ->assertOk()
            ->json('data');

        $hotNames = collect($hotRes)->pluck('name')->all();
        $this->assertContains('Hot Nam', $hotNames);
        $this->assertContains('Hot Nữ', $hotNames);
        $this->assertContains('Hot cả 2', $hotNames);
    }
}

