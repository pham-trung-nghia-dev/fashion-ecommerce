# Fashion Ecommerce Web Application

Đây là một project **website thương mại điện tử thời trang** được xây dựng theo kiến trúc **tách biệt giữa backend và frontend**.

* **Backend** chịu trách nhiệm quản lý dữ liệu, xử lý logic và cung cấp API.
* **Frontend** chịu trách nhiệm hiển thị giao diện và tương tác với người dùng.

Hai phần này giao tiếp với nhau thông qua **REST API**.

---

# Công nghệ sử dụng

## Backend

Backend được xây dựng bằng các công nghệ sau:

* **Laravel** – Framework PHP dùng để xây dựng hệ thống backend.
* **FilamentPHP** – Framework admin panel giúp tạo giao diện quản trị nhanh chóng.
* **MySQL** – Hệ quản trị cơ sở dữ liệu dùng để lưu trữ dữ liệu.

FilamentPHP được sử dụng để xây dựng **trang quản trị (Admin Dashboard)** cho phép quản lý nội dung của website.

---

## Frontend

Frontend được xây dựng bằng các công nghệ:

* **Next.js** – Framework React dùng để xây dựng web application hiện đại.
* **TailwindCSS** – Framework CSS giúp xây dựng giao diện nhanh và linh hoạt.
* **shadcn/ui** – Thư viện UI component giúp xây dựng giao diện đồng bộ và dễ tái sử dụng.

Frontend có nhiệm vụ hiển thị dữ liệu từ backend thông qua API.

---

# Kiến trúc hệ thống

Project được xây dựng theo kiến trúc **tách backend và frontend**.

Luồng hoạt động của hệ thống:

```id="archflow1"
Admin (Filament Admin Panel)
        │
        ▼
Database (MySQL)
        │
        ▼
Laravel Backend API
        │
        ▼
Next.js Frontend
        │
        ▼
Người dùng (User)
```

### Giải thích

* **Admin** sử dụng trang quản trị Filament để tạo và quản lý dữ liệu.
* Dữ liệu được lưu trong **database**.
* **Laravel Backend** cung cấp các API để truy xuất dữ liệu.
* **Frontend Next.js** gọi các API này và hiển thị dữ liệu cho người dùng.

---

# Cấu trúc project

```id="projectstructure1"
fashion-ecommerce
│
├── backend
│   ├── app
│   ├── routes
│   ├── database
│   └── composer.json
│
├── frontend
│   ├── src
│   ├── components
│   └── package.json
│
└── README.md
```

### Thư mục backend

Thư mục `backend` chứa project **Laravel** bao gồm:

* Models
* API Controllers
* Filament Resources
* Database migrations
* Business logic

Backend có nhiệm vụ:

* quản lý dữ liệu
* cung cấp API cho frontend

---

### Thư mục frontend

Thư mục `frontend` chứa project **Next.js**.

Frontend chịu trách nhiệm:

* xây dựng giao diện website
* gọi API từ backend
* hiển thị dữ liệu cho người dùng

---

# Chức năng chính của hệ thống

## Admin (Filament)

Trang quản trị cho phép quản lý:

* **Products** – quản lý sản phẩm
* **Categories** – quản lý danh mục
* **Posts** – quản lý bài viết/tin tức
* **Banners** – quản lý banner trang chủ
* **Promotions** – quản lý chương trình khuyến mãi
* **Stores** – quản lý thông tin cửa hàng

Admin có thể:

* tạo dữ liệu
* chỉnh sửa dữ liệu
* xóa dữ liệu
* tìm kiếm và lọc dữ liệu

---

## Người dùng (Frontend)

Người dùng có thể:

* xem danh sách sản phẩm
* xem chi tiết sản phẩm
* xem tin tức
* xem chương trình khuyến mãi
* xem thông tin cửa hàng

Giao diện được xây dựng bằng **Next.js + TailwindCSS + shadcn/ui** để đảm bảo:

* giao diện hiện đại
* responsive
* dễ mở rộng

---

# API Backend

Frontend giao tiếp với backend thông qua các API.

Ví dụ một số API:

```id="apiexample1"
GET /api/products
GET /api/categories
GET /api/posts
GET /api/promotions
GET /api/stores
```

Các API này trả về dữ liệu dạng **JSON**, sau đó frontend sẽ render dữ liệu lên giao diện.

---

# Cài đặt project

## Backend

Di chuyển vào thư mục backend:

```id="backendinstall1"
cd backend
```

Cài đặt dependencies:

```id="backendinstall2"
composer install
```

Chạy migration:

```id="backendinstall3"
php artisan migrate
```

Khởi chạy server Laravel:

```id="backendinstall4"
php artisan serve
```

---

## Frontend

Di chuyển vào thư mục frontend:

```id="frontendinstall1"
cd frontend
```

Cài đặt dependencies:

```id="frontendinstall2"
npm install
```

Chạy server development:

```id="frontendinstall3"
npm run dev
```

---

# Hướng phát triển trong tương lai

Một số tính năng có thể phát triển thêm:

* chức năng giỏ hàng
* thanh toán online
* hệ thống đăng nhập / đăng ký
* quản lý đơn hàng
* tìm kiếm và filter sản phẩm nâng cao

---

# Tổng kết

Project được xây dựng theo mô hình **Fullstack Web Application** với:

* **Laravel + FilamentPHP** cho backend và hệ thống quản trị
* **Next.js + shadcn/ui** cho frontend

Việc tách backend và frontend giúp hệ thống:

* dễ mở rộng
* dễ bảo trì
* có thể phát triển thêm các client khác như mobile app trong tương lai.
