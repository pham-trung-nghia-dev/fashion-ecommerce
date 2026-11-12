"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Search, ShoppingCart, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useAuth } from "../context/authContext";
import { useCartStore } from "../store/useCartStore";
import { useUIStore } from "../store/useUIStore";

const Header = () => {
  const router = useRouter();
  const { user, logout, isLoading } = useAuth();
  const { getTotalItems } = useCartStore();
  const { openCartDrawer } = useUIStore();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const totalQuantity = getTotalItems();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-white/80">
      {/* Top Banner Thông Tin */}
      <div className="border-b bg-slate-50 text-[11px] text-slate-600">
        <div className="container mx-auto flex items-center justify-center px-4 py-1 text-center">
          <p className="truncate">
            Hotline Mua Hàng: <strong>0973 285 886</strong> | Hotline CSKH: <strong>1900 886 803</strong> | Miễn phí đổi trả 30 ngày
          </p>
        </div>
      </div>

      {/* Thanh chính: Logo + Search Bar + User/Cart Icons */}
      <div className="border-b bg-white">
        <div className="container mx-auto flex items-center gap-4 px-4 py-3">
          {/* Logo bên trái */}
          <Link href="/" className="flex shrink-0 items-center">
            <Image src="/logo.svg" alt="Logo" width={56} height={56} className="h-10 w-auto" />
          </Link>

          {/* Ô tìm kiếm ở giữa */}
          <form onSubmit={handleSearch} className="flex-1 max-w-2xl mx-auto">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm kiếm sản phẩm (ví dụ: Áo thun, Sơ mi, Váy hoa, Quần túi hộp...)"
                className="w-full rounded-full border border-slate-200 bg-slate-50 py-2 pl-4 pr-10 text-xs md:text-sm text-slate-800 outline-none placeholder:text-slate-400 focus:border-slate-800 focus:bg-white focus:ring-1 focus:ring-slate-800 transition"
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-800 transition"
                aria-label="Tìm kiếm"
              >
                <Search className="h-4 w-4" />
              </button>
            </div>
          </form>

          {/* Icon user + cart bên phải */}
          <div className="flex items-center gap-2 md:gap-3">
            {/* User Account */}
            <div className="relative">
              {isLoading ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-slate-800" />
              ) : user ? (
                <>
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex h-9 items-center gap-2 rounded-full border border-slate-200 px-3 hover:bg-slate-50 transition-colors text-xs font-semibold text-slate-800 cursor-pointer"
                  >
                    <UserRound className="h-4 w-4 text-slate-600" />
                    <span className="hidden md:inline max-w-[100px] truncate">{user.name}</span>
                  </button>
                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 rounded-xl border border-slate-100 bg-white p-2 shadow-xl ring-1 ring-black/5 z-50">
                      <div className="px-3 py-2 border-b border-slate-100 mb-1">
                        <p className="text-xs font-semibold text-slate-800 truncate">{user.name}</p>
                        <p className="text-[10px] text-slate-500 truncate">{user.email}</p>
                      </div>
                      <Link
                        href="/orders"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="block rounded-lg px-3 py-2 text-xs font-semibold uppercase tracking-wider text-slate-700 hover:bg-slate-50 transition-colors"
                      >
                        Đơn hàng của tôi
                      </Link>
                      <button
                        onClick={async () => {
                          setIsUserMenuOpen(false);
                          await logout();
                        }}
                        className="w-full text-left rounded-lg px-3 py-2 text-xs font-semibold uppercase tracking-wider text-red-600 hover:bg-red-50 transition-colors border-t border-slate-100 mt-1 pt-2"
                      >
                        Đăng xuất
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <Link href="/login">
                  <Button variant="ghost" size="icon" className="rounded-full cursor-pointer h-9 w-9">
                    <UserRound className="h-4 w-4 text-slate-700" />
                  </Button>
                </Link>
              )}
            </div>

            {/* Cart Button -> Opens Modern Cart Drawer */}
            <Button
              variant="ghost"
              size="icon"
              className="relative rounded-full h-9 w-9 hover:bg-slate-100 transition cursor-pointer"
              onClick={openCartDrawer}
              aria-label="Mở giỏ hàng"
            >
              <ShoppingCart className="h-5 w-5 text-slate-800" />
              {totalQuantity > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-600 text-[10px] font-bold text-white shadow">
                  {totalQuantity > 99 ? "99+" : totalQuantity}
                </span>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="border-b bg-white">
        <div className="container mx-auto px-4">
          <ul className="flex flex-wrap items-center justify-center gap-4 py-2.5 text-xs font-semibold uppercase tracking-[0.2em] text-slate-700 md:gap-8">
            <li>
              <Link href="/about" className="hover:text-slate-900 transition">
                Giới thiệu
              </Link>
            </li>
            <li>
              <Link href="/products" className="hover:text-slate-900 transition">
                Sản phẩm
              </Link>
            </li>
            <li>
              <Link href="/promotion" className="hover:text-slate-900 transition">
                Khuyến mại
              </Link>
            </li>
            <li>
              <Link href="/news" className="hover:text-slate-900 transition">
                Tin tức
              </Link>
            </li>
            <li>
              <Link href="/careers" className="hover:text-slate-900 transition">
                Tuyển dụng
              </Link>
            </li>
            <li>
              <Link href="/stores" className="hover:text-slate-900 transition">
                Hệ thống cửa hàng
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
};

export default Header;
