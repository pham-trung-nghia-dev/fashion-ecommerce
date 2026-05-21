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
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Tạo tài khoản mẫu
        User::updateOrCreate(
            ['email' => 'test@example.com'],
            [
                'name' => 'Khách hàng thử nghiệm',
                'password' => Hash::make('password'),
            ]
        );

        User::updateOrCreate(
            ['email' => 'admin@gmail.com'],
            [
                'name' => 'Quản trị viên',
                'password' => Hash::make('admin123'),
            ]
        );

        // 2. Tạo danh mục sản phẩm
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

        // 3. Tạo banner quảng cáo trang chủ
        Banner::truncate();
        Banner::create([
            'image' => 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600&auto=format&fit=crop&q=80',
            'sort_order' => 1,
            'is_active' => true,
        ]);
        Banner::create([
            'image' => 'https://images.unsplash.com/photo-1479064555552-3ef4979f8908?w=1600&auto=format&fit=crop&q=80',
            'sort_order' => 2,
            'is_active' => true,
        ]);
        Banner::create([
            'image' => 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1600&auto=format&fit=crop&q=80',
            'sort_order' => 3,
            'is_active' => true,
        ]);

        // 4. Tạo sản phẩm thời trang mẫu
        Product::truncate();
        
        $p1 = Product::create([
            'id' => 1,
            'name' => 'Syltherine Tee',
            'sub_title' => 'Áo thun nam dáng rộng tối giản',
            'sku' => 'TS-SYL-01',
            'price' => 350000,
            'old_price' => 500000,
            'discount' => 30,
            'stock' => 100,
            'description' => 'Áo thun nam dáng rộng phong cách basic, chất liệu 100% cotton co giãn 4 chiều mềm mịn, thấm hút mồ hôi cực tốt thích hợp cho mùa hè năng động.',
            'image' => 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=600&auto=format&fit=crop&q=80',
            'primary_category_id' => 1,
            'is_active' => true,
            'is_new' => false,
        ]);

        $p2 = Product::create([
            'id' => 2,
            'name' => 'Leviosa Shirt',
            'sub_title' => 'Sơ mi nữ đũi tay phồng nhẹ nhàng',
            'sku' => 'SH-LEV-02',
            'price' => 450000,
            'old_price' => null,
            'discount' => null,
            'stock' => 50,
            'description' => 'Áo sơ mi nữ chất liệu đũi tự nhiên mát lạnh, tay phồng nhẹ thanh lịch thích hợp cho các nàng diện đi làm, đi chơi hay đi cafe dạo phố.',
            'image' => 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&auto=format&fit=crop&q=80',
            'primary_category_id' => 2,
            'is_active' => true,
            'is_new' => true,
        ]);

        $p3 = Product::create([
            'id' => 3,
            'name' => 'Lolito Denim Jacket',
            'sub_title' => 'Áo khoác denim nam vintage bụi bặm',
            'sku' => 'JK-LOL-03',
            'price' => 750000,
            'old_price' => 990000,
            'discount' => 24,
            'stock' => 40,
            'description' => 'Áo khoác bò denim nam phong cách retro vintage, đường may chắc chắn kết hợp hiệu ứng wash bụi bặm, thể hiện cá tính mạnh mẽ cho người mặc.',
            'image' => 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&auto=format&fit=crop&q=80',
            'primary_category_id' => 1,
            'is_active' => true,
            'is_new' => false,
        ]);

        $p4 = Product::create([
            'id' => 4,
            'name' => 'Respira Dress',
            'sub_title' => 'Đầm hoa nhí tay loe dịu dàng',
            'sku' => 'DR-RES-04',
            'price' => 590000,
            'old_price' => null,
            'discount' => null,
            'stock' => 30,
            'description' => 'Chiếc váy đầm hoa nhí điệu đà với thiết kế bo chun eo tôn dáng, chất voan hàn mềm rủ bay bổng giúp bạn thu hút mọi ánh nhìn trong những buổi hẹn hò.',
            'image' => 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&auto=format&fit=crop&q=80',
            'primary_category_id' => 2,
            'is_active' => true,
            'is_new' => true,
        ]);

        $p5 = Product::create([
            'id' => 5,
            'name' => 'Urban Street Hoodie',
            'sub_title' => 'Áo nỉ hoodie nam nữ Unisex',
            'sku' => 'HD-URB-05',
            'price' => 520000,
            'old_price' => 650000,
            'discount' => 20,
            'stock' => 120,
            'description' => 'Áo nỉ hoodie unisex mũ rộng dày dặn, chất nỉ bông cao cấp ấm áp thích hợp cho cả nam và nữ theo đuổi phong cách thời trang đường phố trẻ trung.',
            'image' => 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&auto=format&fit=crop&q=80',
            'primary_category_id' => 1,
            'is_active' => true,
            'is_new' => false,
        ]);

        $p6 = Product::create([
            'id' => 6,
            'name' => 'Pinky Woolen Coat',
            'sub_title' => 'Áo khoác dạ dáng dài thu đông sang trọng',
            'sku' => 'CT-PIN-06',
            'price' => 1250000,
            'old_price' => null,
            'discount' => null,
            'stock' => 25,
            'description' => 'Áo khoác dạ dáng dài thu đông chất dạ lông cừu ép siêu ấm áp, phom đứng thanh lịch và sang trọng, là điểm nhấn hoàn hảo cho tủ đồ đông của các quý cô.',
            'image' => 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=600&auto=format&fit=crop&q=80',
            'primary_category_id' => 2,
            'is_active' => true,
            'is_new' => true,
        ]);

        $p7 = Product::create([
            'id' => 7,
            'name' => 'Cargo Pants Tactical',
            'sub_title' => 'Quần túi hộp nam năng động',
            'sku' => 'PA-CAR-07',
            'price' => 480000,
            'old_price' => 600000,
            'discount' => 20,
            'stock' => 75,
            'description' => 'Quần kaki túi hộp nam phom rộng trẻ trung, chất vải kaki thô bền màu, chịu lực tốt kết hợp nhiều túi tiện dụng thoải mái hoạt động thể thao hay dã ngoại.',
            'image' => 'https://images.unsplash.com/photo-1517423568366-8b83523034fd?w=600&auto=format&fit=crop&q=80',
            'primary_category_id' => 1,
            'is_active' => true,
            'is_new' => false,
        ]);

        $p8 = Product::create([
            'id' => 8,
            'name' => 'Summer Pleated Skirt',
            'sub_title' => 'Chân váy xếp ly dáng chữ A',
            'sku' => 'SK-SUM-08',
            'price' => 290000,
            'old_price' => null,
            'discount' => null,
            'stock' => 90,
            'description' => 'Chân váy xếp ly dáng ngắn chữ A năng động, cạp cao tôn eo kèm quần bảo hộ bên trong, dễ dàng phối cùng áo thun hay sơ mi đi học đi chơi năng động.',
            'image' => 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=600&auto=format&fit=crop&q=80',
            'primary_category_id' => 2,
            'is_active' => true,
            'is_new' => true,
        ]);

        // Liên kết sản phẩm HOT vào bảng pivot category_product
        $p1->categories()->sync([1, 3]); // Syltherine (Đồ Nam, HOT)
        $p3->categories()->sync([1, 3]); // Lolito Denim Jacket (Đồ Nam, HOT)
        $p5->categories()->sync([1, 3]); // Urban Street Hoodie (Đồ Nam, HOT)
        $p2->categories()->sync([2]);    // Leviosa Shirt (Đồ Nữ)
        $p4->categories()->sync([2]);    // Respira Dress (Đồ Nữ)
        $p6->categories()->sync([2, 3]); // Pinky Woolen Coat (Đồ Nữ, HOT)
        $p7->categories()->sync([1]);    // Cargo Pants
        $p8->categories()->sync([2]);    // Summer Skirt

        // 5. Tạo tin tức bài viết mẫu
        Post::truncate();
        Post::create([
            'title' => 'Xu hướng thời trang Streetwear thống trị mùa hè 2026',
            'excerpt' => 'Khám phá các phong cách thời trang đường phố đang được giới trẻ vô cùng ưa chuộng và săn đón trong mùa hè năm nay.',
            'content' => '<p>Thời trang Streetwear luôn có sức hút kỳ lạ với giới trẻ nhờ sự năng động, phá cách và tự do thể hiện cá tính. Mùa hè năm 2026 chứng kiến sự lên ngôi của các mẫu áo thun oversized cực đại, quần túi hộp tactical bụi bặm và các gam màu trung tính kết hợp điểm nhấn neon độc đáo.</p><p>Chất liệu cotton tự nhiên, đũi mát lạnh hay các dòng vải tái chế thân thiện với môi trường cũng đang trở thành sự lựa chọn hàng đầu của các tín đồ thời trang.</p>',
            'thumbnail' => 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=600&auto=format&fit=crop&q=80',
            'status' => true,
            'published_at' => now(),
        ]);
        Post::create([
            'title' => 'Bí quyết phối đồ sơ mi phong cách Minimalism thanh lịch',
            'excerpt' => 'Sự đơn giản tạo nên đỉnh cao của phong cách. Cùng UrbanWear bỏ túi 5 cách phối đồ sơ mi thanh lịch cho cả tuần tự tin.',
            'content' => '<p>Phong cách tối giản Minimalism không bao giờ lỗi mốt. Chỉ với một chiếc sơ mi đũi phom rộng màu trắng hoặc pastel, bạn có thể biến hóa linh hoạt từ thanh lịch nơi công sở đến nhẹ nhàng khi hẹn hò cuối tuần.</p><p>Kết hợp cùng quần tây ống suông cạp cao hoặc chân váy chữ A xếp ly nhẹ nhàng sẽ giúp bạn ghi điểm tuyệt đối trong mắt đồng nghiệp và bạn bè.</p>',
            'thumbnail' => 'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=600&auto=format&fit=crop&q=80',
            'status' => true,
            'published_at' => now()->subDay(),
        ]);

        // 6. Tạo chương trình khuyến mãi mẫu
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

        // 7. Tạo tuyển dụng mẫu
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

        // 8. Tạo hệ thống cửa hàng
        Store::truncate();
        Store::create([
            'name' => 'UrbanWear Showroom Hà Nội',
            'address' => '123 Phố Huế, Phường Ngô Thì Nhậm, Quận Hai Bà Trưng, Hà Nội',
            'phone' => '0987 654 321',
            'sort_order' => 1,
        ]);
        Store::create([
            'name' => 'UrbanWear Showroom Sài Gòn',
            'address' => '456 Nguyễn Trãi, Phường Bến Thành, Quận 1, TP. Hồ Chí Minh',
            'phone' => '0912 345 678',
            'sort_order' => 2,
        ]);
    }
}
