"use client"

import Link from "next/link"
import Image from "next/image"
import { Search, ShoppingCart, UserRound } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useContext } from "react"
import { CartContext } from "../context/cartContext"
import { useAuth } from "../context/authContext"
import { useState } from "react"

const Header = () => {
  const { cart, setIsOpen } = useContext(CartContext) || { cart: [], setIsOpen: () => {} }
  const { user, logout, isLoading } = useAuth()
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)

  const totalQuantity = cart.reduce(
    (acc: number, item: { quantity?: number }) => acc + (item.quantity || 0),
    0
  )

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-white/80">
      {/* Thanh info trên cùng – text ở giữa giống ảnh */}
      <div className="border-b bg-slate-50 text-[11px] text-slate-600">
        <div className="container mx-auto flex items-center justify-center px-4 py-1 text-center">
          <p className="truncate">
            Hotline Mua Hàng: 0973 285 886 | Hotline CSKH: 1900 886 803 - Ext 1 | Email CSKH:
            360boutique.vn@gmail.com
          </p>
        </div>
      </div>

      {/* Hàng logo + ô tìm kiếm + icon */}
      <div className="border-b bg-white">
        <div className="container mx-auto flex items-center gap-4 px-4 py-3">
          {/* Logo bên trái */}
          <Link href="/" className="flex shrink-0 items-center">
            <Image src="/logo.svg" alt="Logo" width={60} height={60} />
          </Link>

          {/* Ô tìm kiếm ở giữa giống thanh dài trong ảnh */}
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                placeholder="Tìm kiếm sản phẩm ..."
                className="w-full rounded-none border border-slate-200 bg-slate-100 px-4 py-2 text-sm text-slate-700 outline-none placeholder:text-slate-400 focus:border-slate-400 focus:bg-white"
              />
              <Search className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            </div>
          </div>

          {/* Icon user + cart bên phải, ẩn search icon vì đã có trong ô input */}
          <div className="hidden items-center gap-4 md:flex">
            <div className="relative">
              {isLoading ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-slate-800" />
              ) : user ? (
                <>
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex h-10 items-center gap-2 rounded-full border border-slate-200 px-3 py-1.5 hover:bg-slate-50 transition-colors text-xs font-semibold uppercase tracking-wider text-slate-800 cursor-pointer"
                  >
                    <UserRound className="h-4 w-4 text-slate-600" />
                    <span className="max-w-[100px] truncate">{user.name}</span>
                  </button>
                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 rounded-xl border border-slate-100 bg-white p-2 shadow-lg ring-1 ring-black/5 z-50">
                      <div className="px-3 py-2 border-b border-slate-100 mb-1">
                        <p className="text-xs font-semibold text-slate-800 truncate">{user.name}</p>
                        <p className="text-[10px] text-slate-500 truncate">{user.email}</p>
                      </div>
                      <button
                        onClick={async () => {
                          setIsUserMenuOpen(false);
                          await logout();
                        }}
                        className="w-full text-left rounded-lg px-3 py-2 text-xs font-semibold uppercase tracking-wider text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                      >
                        Đăng xuất
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <Link href="/login">
                  <Button variant="ghost" size="icon" className="rounded-full cursor-pointer">
                    <UserRound className="h-5 w-5" />
                  </Button>
                </Link>
              )}
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="relative rounded-full"
              onClick={() => setIsOpen(true)}
            >
              <ShoppingCart className="h-5 w-5" />
              {totalQuantity > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#E97171] text-[10px] font-bold text-white">
                  {totalQuantity}
                </span>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Hàng menu chữ ngay dưới, căn giữa */}
      <nav className="border-b bg-white">
        <div className="container mx-auto px-4">
          <ul className="flex flex-wrap items-center justify-center gap-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-slate-800 md:gap-8">
            <li>
              <Link href="/about" className="hover:text-primary">
                Giới thiệu
              </Link>
            </li>
            <li>
              <Link href="/products" className="hover:text-primary">
                Sản phẩm
              </Link>
            </li>
            <li>
              <Link href="/promotion" className="hover:text-primary">
                Khuyến mại
              </Link>
            </li>
            <li>
              <Link href="/news" className="hover:text-primary">
                Tin tức
              </Link>
            </li>
            <li>
              <Link href="/careers" className="hover:text-primary">
                Tuyển dụng
              </Link>
            </li>
            <li>
              <Link href="/stores" className="hover:text-primary">
                Hệ thống cửa hàng
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  )
}

export default Header