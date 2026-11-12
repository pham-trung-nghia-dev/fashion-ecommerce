<?php

namespace Database\Seeders;

use App\Models\Banner;
use App\Models\Category;
use App\Models\Job;
use App\Models\Post;
use App\Models\Product;
use App\Models\Promotion;
use App\Models\Store;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database with frontend mock data.
     */
    public function run(): void
    {
        // 1. Tài khoản admin & khách hàng mẫu
        User::updateOrCreate(
            ['email' => 'admin@gmail.com'],
            [
                'name' => 'Quản trị viên',
                'password' => Hash::make('admin123'),
            ]
        );

        User::updateOrCreate(
            ['email' => 'test@example.com'],
            [
                'name' => 'Khách hàng thử nghiệm',
                'password' => Hash::make('password'),
            ]
        );

        // 2. Danh mục sản phẩm
        $catMen = Category::updateOrCreate(
            ['id' => 1],
            ['name' => 'Đồ Nam', 'slug' => 'do-nam', 'sort_order' => 1]
        );

        $catWomen = Category::updateOrCreate(
            ['id' => 2],
            ['name' => 'Đồ Nữ', 'slug' => 'do-nu', 'sort_order' => 2]
        );

        $catHot = Category::updateOrCreate(
            ['id' => 3],
            ['name' => 'HOT', 'slug' => 'hot', 'sort_order' => 3]
        );

        $catTops = Category::updateOrCreate(
            ['id' => 4],
            ['name' => 'Tops', 'slug' => 'tops', 'sort_order' => 4]
        );

        $catBottoms = Category::updateOrCreate(
            ['id' => 5],
            ['name' => 'Bottoms', 'slug' => 'bottoms', 'sort_order' => 5]
        );

        $catOuterwear = Category::updateOrCreate(
            ['id' => 6],
            ['name' => 'Outerwear', 'slug' => 'outerwear', 'sort_order' => 6]
        );

        // 3. Banner quảng cáo khớp với frontend (HeroSection mock slides)
        Banner::truncate();
        Banner::create([
            'image' => '/hero-slide-1.png',
            'sort_order' => 1,
            'is_active' => true,
        ]);
        Banner::create([
            'image' => '/hero-slide-2.png',
            'sort_order' => 2,
            'is_active' => true,
        ]);
        Banner::create([
            'image' => '/hero-slide-3.png',
            'sort_order' => 3,
            'is_active' => true,
        ]);

        // 4. Lấy dữ liệu mock từ frontend/src/data/data.json
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        DB::table('category_product')->truncate();
        Product::truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        $frontendJsonPath = base_path('../frontend/src/data/data.json');
        if (file_exists($frontendJsonPath)) {
            $jsonContent = json_decode(file_get_contents($frontendJsonPath), true);
            $mockProducts = $jsonContent['products'] ?? [];

            foreach ($mockProducts as $index => $item) {
                // Parse giá "2.500.000" -> 2500000
                $cleanPrice = (float) preg_replace('/[^\d]/', '', (string) ($item['price'] ?? '0'));
                $cleanOldPrice = !empty($item['oldPrice'])
                    ? (float) preg_replace('/[^\d]/', '', (string) $item['oldPrice'])
                    : null;

                $primaryCatId = ($item['id'] % 2 === 1) ? 1 : 2; // Xen kẽ Đồ Nam (1), Đồ Nữ (2)

                $prod = Product::create([
                    'id' => (int) $item['id'],
                    'name' => $item['name'] ?? ('Product ' . $item['id']),
                    'sub_title' => $item['subTitle'] ?? 'Stylish cafe chair',
                    'sku' => 'MOCK-' . str_pad((string) $item['id'], 3, '0', STR_PAD_LEFT),
                    'price' => $cleanPrice,
                    'old_price' => $cleanOldPrice,
                    'discount' => isset($item['discount']) ? (int) $item['discount'] : null,
                    'stock' => 100,
                    'description' => 'Sản phẩm ' . ($item['name'] ?? '') . ' cao cấp từ BST Fashion E-commerce.',
                    'image' => $item['image'] ?? null,
                    'primary_category_id' => $primaryCatId,
                    'is_active' => true,
                    'is_new' => !empty($item['isNew']),
                ]);

                // Gán danh mục: HOT (3) và Đồ Nam / Nữ
                $syncCats = [$primaryCatId];
                if ($prod->is_new || ($prod->discount && $prod->discount > 0)) {
                    $syncCats[] = 3; // HOT
                }
                $prod->categories()->sync($syncCats);
            }
        }

        // Bổ sung thêm các sản phẩm thời trang mẫu để danh sách đầy đặn cho shop
        $extraProducts = [
            [
                'id' => 5,
                'name' => 'Lolito Denim Jacket',
                'sub_title' => 'Áo khoác denim nam vintage bụi bặm',
                'sku' => 'JK-LOL-05',
                'price' => 750000,
                'old_price' => 990000,
                'discount' => 24,
                'stock' => 40,
                'description' => 'Áo khoác bò denim nam phong cách retro vintage, đường may chắc chắn kết hợp hiệu ứng wash bụi bặm.',
                'image' => 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&auto=format&fit=crop&q=80',
                'primary_category_id' => 1,
                'is_active' => true,
                'is_new' => false,
                'categories' => [1, 3, 6],
            ],
            [
                'id' => 6,
                'name' => 'Respira Floral Dress',
                'sub_title' => 'Đầm hoa nhí tay loe dịu dàng',
                'sku' => 'DR-RES-06',
                'price' => 590000,
                'old_price' => null,
                'discount' => null,
                'stock' => 30,
                'description' => 'Chiếc váy đầm hoa nhí điệu đà với thiết kế bo chun eo tôn dáng, chất voan hàn mềm rủ bay bổng.',
                'image' => 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&auto=format&fit=crop&q=80',
                'primary_category_id' => 2,
                'is_active' => true,
                'is_new' => true,
                'categories' => [2, 3],
            ],
            [
                'id' => 7,
                'name' => 'Urban Street Hoodie',
                'sub_title' => 'Áo nỉ hoodie nam nữ Unisex',
                'sku' => 'HD-URB-07',
                'price' => 520000,
                'old_price' => 650000,
                'discount' => 20,
                'stock' => 120,
                'description' => 'Áo nỉ hoodie unisex mũ rộng dày dặn, chất nỉ bông cao cấp ấm áp.',
                'image' => 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&auto=format&fit=crop&q=80',
                'primary_category_id' => 1,
                'is_active' => true,
                'is_new' => false,
                'categories' => [1, 3, 4],
            ],
            [
                'id' => 8,
                'name' => 'Pinky Woolen Coat',
                'sub_title' => 'Áo khoác dạ dáng dài thu đông',
                'sku' => 'CT-PIN-08',
                'price' => 1250000,
                'old_price' => null,
                'discount' => null,
                'stock' => 25,
                'description' => 'Áo khoác dạ dáng dài thu đông chất dạ lông cừu ép siêu ấm áp, phom đứng thanh lịch và sang trọng.',
                'image' => 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=600&auto=format&fit=crop&q=80',
                'primary_category_id' => 2,
                'is_active' => true,
                'is_new' => true,
                'categories' => [2, 6],
            ],
            [
                'id' => 9,
                'name' => 'Cargo Tactical Pants',
                'sub_title' => 'Quần túi hộp nam năng động',
                'sku' => 'PA-CAR-09',
                'price' => 480000,
                'old_price' => 600000,
                'discount' => 20,
                'stock' => 75,
                'description' => 'Quần kaki túi hộp nam phom rộng trẻ trung, chất vải kaki thô bền màu, chịu lực tốt.',
                'image' => 'https://images.unsplash.com/photo-1517423568366-8b83523034fd?w=600&auto=format&fit=crop&q=80',
                'primary_category_id' => 1,
                'is_active' => true,
                'is_new' => false,
                'categories' => [1, 5],
            ],
            [
                'id' => 10,
                'name' => 'Summer Pleated Skirt',
                'sub_title' => 'Chân váy xếp ly dáng chữ A',
                'sku' => 'SK-SUM-10',
                'price' => 290000,
                'old_price' => null,
                'discount' => null,
                'stock' => 90,
                'description' => 'Chân váy xếp ly dáng ngắn chữ A năng động, cạp cao tôn eo kèm quần bảo hộ bên trong.',
                'image' => 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=600&auto=format&fit=crop&q=80',
                'primary_category_id' => 2,
                'is_active' => true,
                'is_new' => true,
                'categories' => [2, 5],
            ],
        ];

        foreach ($extraProducts as $extra) {
            $catIds = $extra['categories'];
            unset($extra['categories']);
            $prod = Product::create($extra);
            $prod->categories()->sync($catIds);
        }

        // 5. Bài viết / Tin tức mẫu (Khớp với mockNews trong frontend NewsSection)
        Post::truncate();
        Post::create([
            'id' => 1,
            'title' => 'Thử thách "MÙA YÊU" – 100% nhận quà',
            'excerpt' => 'Lòa loa loa! KẾT QUẢ VÒNG 1 đã có với rất nhiều bài dự thi đầy sáng tạo, cảm xúc...',
            'content' => '<p>Lòa loa loa! KẾT QUẢ VÒNG 1 đã có với rất nhiều bài dự thi đầy sáng tạo, cảm xúc. Chương trình "Thử thách MÙA YÊU" nhằm lan tỏa năng lượng tích cực, khuyến khích khách hàng chia sẻ khoảnh khắc cùng trang phục yêu thích. Khi tham gia, bạn chỉ cần chụp hình outfit cùng chúng tôi, đăng tải lên mạng xã hội kèm hashtag chương trình và tag fanpage để nhận ngay quà tặng.</p><p>Ngoài ra, khách hàng còn có cơ hội nhận thêm voucher mua sắm và quà tặng đặc biệt khi đến trực tiếp hệ thống cửa hàng trong thời gian diễn ra chương trình.</p>',
            'thumbnail' => '/shop-banner.png',
            'status' => true,
            'published_at' => now()->subDays(2),
        ]);
        Post::create([
            'id' => 2,
            'title' => 'Đón Xuân sang – Lên đồ Tết | Ưu đãi tới 50%',
            'excerpt' => 'Ưu đãi tới 50% cho hàng trăm sản phẩm trong BST Xuân – Hè tại toàn bộ hệ thống cửa hàng...',
            'content' => '<p>Chào đón mùa Xuân với chương trình ưu đãi lớn nhất năm: giảm giá lên tới 50% cho hàng trăm sản phẩm thuộc BST Xuân – Hè. Các thiết kế áo thun, sơ mi, quần jeans, kaki đều được cập nhật phom dáng mới, màu sắc tươi sáng, dễ phối đồ.</p><p>Ưu đãi áp dụng tại toàn bộ hệ thống cửa hàng và kênh online trong thời gian giới hạn. Đừng bỏ lỡ cơ hội làm mới tủ đồ với mức giá cực kỳ hấp dẫn.</p>',
            'thumbnail' => '/hero-bg.jpg',
            'status' => true,
            'published_at' => now()->subDay(),
        ]);
        Post::create([
            'id' => 3,
            'title' => 'Không khí năm mới, nhận lì xì cực hấp dẫn',
            'excerpt' => 'Check-in tại cửa hàng, tham gia minigame nhận lì xì đầu năm với nhiều phần quà bất ngờ...',
            'content' => '<p>Không khí năm mới rộn ràng với chương trình lì xì đầu năm dành cho mọi khách ghé cửa hàng. Chỉ cần check-in tại cửa hàng, tham gia minigame đơn giản, bạn đã có thể nhận ngay phong bao lì xì may mắn cùng nhiều phần quà dễ thương.</p><p>Bên cạnh đó, các combo mua sắm đầu năm cũng được áp dụng với mức giá ưu đãi, giúp bạn dễ dàng chọn lựa outfit phù hợp cho công việc và những buổi gặp mặt đầu xuân.</p>',
            'thumbnail' => '/shop-banner.png',
            'status' => true,
            'published_at' => now(),
        ]);

        // 6. Chương trình khuyến mãi mẫu
        Promotion::truncate();
        Promotion::create([
            'title' => 'MỪNG KHAI TRƯƠNG - SIÊU ƯU ĐÃI HÈ 2026',
            'description' => 'Giảm trực tiếp lên đến 30% cho hàng loạt sản phẩm bán chạy nhất tại hệ thống showroom. Đừng bỏ lỡ!',
            'start_at' => now(),
            'end_at' => now()->addDays(30),
            'is_active' => true,
        ]);
        Promotion::create([
            'title' => 'FREE SHIPPING TOÀN QUỐC',
            'description' => 'Nhập mã FREESHIP để được miễn phí hoàn toàn chi phí vận chuyển với mọi đơn hàng giá trị từ 500k trở lên.',
            'start_at' => now(),
            'end_at' => now()->addDays(15),
            'is_active' => true,
        ]);

        // 7. Tuyển dụng mẫu
        Job::truncate();
        Job::create([
            'title' => 'Nhân viên Tư vấn Thời trang (Showroom HN)',
            'location' => 'Hai Bà Trưng, Hà Nội',
            'description' => 'Chào đón khách hàng, tư vấn phong cách thời trang, hỗ trợ khách hàng thử đồ, duy trì hình ảnh quầy kệ showroom sạch đẹp, thanh toán hóa đơn.',
            'is_active' => true,
        ]);
        Job::create([
            'title' => 'Social Media Content Creator (TikTok/Insta)',
            'location' => 'Quận 1, TP. Hồ Chí Minh',
            'description' => 'Lên ý tưởng quay chụp lookbook thời trang, quay video review sản phẩm định dạng ngắn (TikTok/Reels), tương tác và phát triển cộng đồng khách hàng trẻ.',
            'is_active' => true,
        ]);

        // 8. Hệ thống cửa hàng
        Store::truncate();
        Store::create([
            'name' => 'Fashion Boutique Hà Nội',
            'address' => '123 Phố Huế, Phường Ngô Thì Nhậm, Quận Hai Bà Trưng, Hà Nội',
            'phone' => '0987 654 321',
            'sort_order' => 1,
        ]);
        Store::create([
            'name' => 'Fashion Boutique Sài Gòn',
            'address' => '456 Nguyễn Trãi, Phường Bến Thành, Quận 1, TP. Hồ Chí Minh',
            'phone' => '0912 345 678',
            'sort_order' => 2,
        ]);
    }
}
