# Fashion Ecommerce Web Application (Fullstack Enterprise Architecture)

Dự án website **Thương Mại Điện Tử Thời Trang Hiện Đại (Fashion Ecommerce)** được xây dựng theo kiến trúc **Decoupled Client-Server (Tách biệt Backend & Frontend)** chuẩn doanh nghiệp, tối ưu hóa trải nghiệm người dùng (UX/UI), hiệu năng tải trang và quản lý dữ liệu an toàn.

---

## 🛠 Công Nghệ Sử Dụng

### 1. Frontend Architecture (Next.js 16 App Router)
* **Framework:** Next.js 16 (App Router, Turbopack, React 19).
* **State Management:** **Zustand** kết hợp middleware `persist` (Local Storage Sync) quản lý Cart Store, Auth Store, UI Drawer Store độc lập, hạn chế tối đa re-render không cần thiết.
* **Server State & Caching:** **TanStack Query (React Query v5)** quản lý caching, stale-time, background refetching và đồng bộ bộ lọc sản phẩm.
* **HTTP Client:** **Axios** tập trung với Request & Response Interceptors:
  * Tự động đính kèm `Bearer Token` vào header mọi request.
  * Bắt lỗi tập trung (401 tự động dọn session, 422 hiển thị toast validation, 500 server error).
* **Form Validation:** **React Hook Form** kết hợp **Zod** schema type-safe validation (Checkout, Login, Register, regex số điện thoại Việt Nam).
* **UI & Styling:** TailwindCSS v4, shadcn/ui components, Framer Motion (slide animations), Lucide React Icons, React Hot Toast.

### 2. Backend & Admin Dashboard (Laravel 12 REST API)
* **Framework:** Laravel 12.x.
* **Admin Dashboard:** **FilamentPHP v3** (Quản trị sản phẩm, danh mục, bài viết, banner, khuyến mãi, hệ thống cửa hàng).
* **Authentication:** API Token Authentication (`api_token` Bearer Token).
* **Database:** MySQL 8.x / MariaDB.
* **Thanh toán:** Tích hợp phương thức COD & Cổng thanh toán trực tuyến PayOS (VietQR).

---

## 🏛 Kiến Trúc Hệ Thống (Architecture Flow)

```text
       Admin Panel (Filament PHP)
                   │
                   ▼
       Database Chính (MySQL)
                   ▲
                   │ (Eloquent ORM / Migrations)
       Laravel REST API Backend
         (API Controllers + Auth Middleware)
                   ▲
                   │ HTTP / JSON (Axios Client + Interceptors)
       Next.js 16 Frontend
         ├── TanStack Query (Server Cache / Hooks)
         ├── Zustand (Cart & Auth Global Store)
         └── React Hook Form + Zod (Validation)
                   │
                   ▼
             Khách Hàng (User)
```

---

## 🚀 Tính Năng Chính Nổi Bật

### Phía Khách Hàng (Frontend):
1. **Trang Chủ (Home):**
   * Hero Banner Slider tự động chuyển động.
   * Danh mục mua sắm nổi bật (Browse by Category).
   * Khối sản phẩm bán chạy & Hàng mới về (New Arrivals).
   * Khối tin tức thời trang & Lookbook.
2. **Bộ Lọc Sản Phẩm Đa Chiều (Catalog & Filter):**
   * Tìm kiếm realtime theo từ khóa tên sản phẩm / mô tả.
   * Lọc theo khoảng giá (Dưới 300k, 300k - 600k, 600k - 1tr, Trên 1tr).
   * Sắp xếp linh hoạt: Mới nhất, Giá tăng dần, Giá giảm dần, Bán chạy / Giảm giá nhiều.
   * Tabs lọc theo Danh mục sản phẩm (Đồ Nam, Đồ Nữ, HOT, Tops, Bottoms, Outerwear).
   * Hiệu ứng Loading Skeleton mượt mà khi lọc hoặc tải dữ liệu.
3. **Chi Tiết Sản Phẩm (Product Detail):**
   * Thư viện ảnh gallery với thumbnail tương tác.
   * Chọn Size (S, M, L, XL) và Bảng màu thời trang (Color Swatches).
   * Bộ đếm số lượng, tính toán mức giảm giá và giá gốc rõ ràng.
   * Nút **"Thêm vào giỏ hàng"** (mở Slide Drawer tức thì) & Nút **"Mua ngay"** (chuyển thẳng checkout).
4. **Mini Cart Drawer (Giỏ hàng trượt):**
   * Drawer dạng slide-over từ cạnh phải với backdrop blur.
   * Thanh tiến trình **"Mua thêm ...₫ để được FREESHIP"** kích thích giá trị đơn hàng.
   * Tăng giảm số lượng trực tiếp trong drawer, xoá sản phẩm, tính tổng tiền realtime.
5. **Thanh Toán (Checkout) Chuẩn Enterprise:**
   * Form điền địa chỉ giao hàng xác thực bằng React Hook Form + Zod.
   * Chọn phương thức thanh toán: COD (tiền mặt) hoặc Quét mã QR PayOS.
   * Hỗ trợ áp dụng mã giảm giá (Voucher Coupon: `FASHIONNEW`, `SUMMERSALE`).
6. **Tài Khoản & Lịch Sử Đơn Hàng:**
   * Đăng ký, đăng nhập bảo mật với validation đầy đủ.
   * Theo dõi trạng thái đơn hàng (Chờ xác nhận, Đang giao, Đã giao).

### Phía Quản Trị Viên (Admin Filament):
* **Products:** Quản lý sản phẩm, giá bán, giá cũ, SKU, tồn kho, ảnh đại diện, danh mục chính & phụ.
* **Categories:** Quản lý danh mục cha/con, slug URL.
* **Banners:** Quản lý slide banner trang chủ, thứ tự sắp xếp và kích hoạt.
* **Posts:** Quản lý tin tức, bài viết thời trang với Rich Editor.
* **Promotions & Stores:** Quản lý chương trình khuyến mãi và hệ thống showroom.

---

## 📁 Cấu Trúc Mã Nguồn (Directory Structure)

```text
fashion-ecommerce
│
├── backend/                              # Laravel 12 Backend API
│   ├── app/
│   │   ├── Filament/Resources/           # Filament Admin Resources
│   │   ├── Http/Controllers/Api/         # REST API Controllers (Product, Order, Auth...)
│   │   ├── Models/                       # Eloquent Models (Product, Category, Order...)
│   │   └── Providers/
│   ├── database/
│   │   ├── migrations/                   # Schema migrations
│   │   └── seeders/DatabaseSeeder.php    # Mock data seeder đồng bộ frontend
│   ├── routes/api.php                    # Khai báo các API routes
│   └── .env                              # Cấu hình Database & Environment
│
├── frontend/                             # Next.js 16 Frontend
│   ├── src/
│   │   ├── app/                          # App Router pages (home, products, shop, cart, checkout...)
│   │   ├── components/
│   │   │   ├── cart/CartDrawer.tsx       # Slide-over Mini Cart Drawer (Zustand)
│   │   │   ├── home/                     # HeroSection, ProductGrid, NewsSection...
│   │   │   └── layout/                   # Header, Footer
│   │   ├── hooks/                        # Custom TanStack Query Hooks (useProducts, useCategories)
│   │   ├── lib/
│   │   │   ├── axios.ts                  # Axios Client instance + Interceptors
│   │   │   └── api.ts                    # Centralized API service functions
│   │   ├── store/                        # Zustand stores (useCartStore, useAuthStore, useUIStore)
│   │   ├── types/                        # TypeScript Interfaces & Types
│   │   └── utils/                        # Format VND, notification helpers
│   └── package.json
│
└── README.md
```

---

## ⚙️ Hướng Dẫn Cài Đặt & Chạy Dự Án

### Yêu Cầu Môi Trường
* **PHP:** >= 8.2 (kèm PDO MySQL extension)
* **Composer:** >= 2.x
* **Node.js:** >= 18.x (khuyên dùng Node 20+)
* **MySQL:** >= 8.0 (hoặc MariaDB tương đương trên WampServer / XAMPP)

---

### Bước 1: Khởi động Backend (Laravel API)

1. Di chuyển vào thư mục backend:
   ```bash
   cd backend
   ```

2. Cài đặt các thư viện PHP:
   ```bash
   composer install
   ```

3. Cấu hình file môi trường `.env`:
   * Đảm bảo cấu hình kết nối đúng MySQL trong file `.env`:
     ```env
     DB_CONNECTION=mysql
     DB_HOST=127.0.0.1
     DB_PORT=3306
     DB_DATABASE=filament
     DB_USERNAME=root
     DB_PASSWORD=
     ```

4. Chạy migration tạo bảng:
   ```bash
   php artisan migrate
   ```

5. Nạp dữ liệu mẫu (Seeder) đồng bộ từ frontend:
   ```bash
   php artisan db:seed
   ```

6. Khởi động Backend Server:
   ```bash
   php artisan serve
   ```
   * *API Backend sẽ chạy tại: [http://127.0.0.1:8000](http://127.0.0.1:8000)*
   * *Trang Quản trị Admin: [http://127.0.0.1:8000/admin](http://127.0.0.1:8000/admin)*

> **Tài khoản quản trị mặc định:**
> * Email: `admin@gmail.com`
> * Mật khẩu: `admin123`

---

### Bước 2: Khởi động Frontend (Next.js)

1. Mở một cửa sổ Terminal mới và di chuyển vào thư mục frontend:
   ```bash
   cd frontend
   ```

2. Cài đặt các package:
   ```bash
   npm install
   ```

3. Khởi động Development Server:
   ```bash
   npm run dev
   ```
   * *Website Frontend sẽ chạy tại: [http://localhost:3000](http://localhost:3000)*

4. (Tùy chọn) Kiểm tra biên dịch Production Build:
   ```bash
   npm run build
   ```

---

## 📌 Điểm Nhấn Kiến Trúc Dành Cho Phỏng Vấn (CV Highlights)
* **Separation of Concerns:** Phân tách rõ ràng giữa Data Fetching (Axios Interceptors + Service Layer), Server State (TanStack Query), Client State (Zustand persist) và Presentation Components.
* **Performance:** Tận dụng Turbopack, ISR/SSR của Next.js 16, lazy loading ảnh và optimistic UI update trên giỏ hàng.
* **Security & Reliability:** Bảo vệ route API bằng Bearer Token, làm sạch dữ liệu đầu vào với Zod, kiểm soát lỗi tập trung tránh crash ứng dụng.
