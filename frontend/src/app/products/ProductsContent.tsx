"use client";

import React, { useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal, ArrowUpDown, X, Loader2 } from "lucide-react";
import ProductGridSection from "@/src/components/home/ProductGridSection";
import type { Product } from "@/src/types/product.type";
import type { ApiCategory } from "@/src/lib/api";
import { useProducts, type ProductQueryParams } from "@/src/hooks/useProducts";

interface ProductsContentProps {
  products: Product[];
  categories: ApiCategory[];
}

const PRICE_RANGES = [
  { label: "Tất cả mức giá", min: undefined, max: undefined },
  { label: "Dưới 300.000₫", min: undefined, max: 300000 },
  { label: "300.000₫ - 600.000₫", min: 300000, max: 600000 },
  { label: "600.000₫ - 1.000.000₫", min: 600000, max: 1000000 },
  { label: "Trên 1.000.000₫", min: 1000000, max: undefined },
];

const SORT_OPTIONS: { label: string; value: ProductQueryParams["sort_by"] }[] = [
  { label: "Mới nhất", value: "newest" },
  { label: "Giá tăng dần", value: "price_asc" },
  { label: "Giá giảm dần", value: "price_desc" },
  { label: "Bán chạy / Giảm giá nhiều", value: "popular" },
];

export default function ProductsContent({
  products: initialProducts,
  categories,
}: ProductsContentProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentCategoryId = searchParams.get("category_id")
    ? Number(searchParams.get("category_id"))
    : undefined;
  const initialSearch = searchParams.get("q") || "";

  // Local filter states
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState<number | undefined>(currentCategoryId);
  const [selectedPriceIdx, setSelectedPriceIdx] = useState(0);
  const [sortBy, setSortBy] = useState<ProductQueryParams["sort_by"]>("newest");
  const [showFilters, setShowFilters] = useState(false);

  // TanStack Query params
  const activePriceRange = PRICE_RANGES[selectedPriceIdx];
  const queryParams: ProductQueryParams = {
    category_id: selectedCategory,
    q: searchTerm.trim() || undefined,
    min_price: activePriceRange.min,
    max_price: activePriceRange.max,
    sort_by: sortBy,
  };

  const { data: serverProducts, isLoading, isFetching } = useProducts(queryParams);

  // Sử dụng dữ liệu từ TanStack Query, fallback về initialProducts
  const displayProducts = (serverProducts as Product[] | undefined) ?? initialProducts;

  const activeCategory = selectedCategory
    ? categories.find((c) => c.id === selectedCategory)
    : undefined;

  const pageTitle = activeCategory
    ? `Sản phẩm - ${activeCategory.name}`
    : searchTerm
    ? `Kết quả tìm kiếm cho "${searchTerm}"`
    : "Tất cả sản phẩm thời trang";

  const handleCategoryClick = (catId?: number) => {
    setSelectedCategory(catId);
    if (catId) {
      router.push(`/products?category_id=${catId}`, { scroll: false });
    } else {
      router.push("/products", { scroll: false });
    }
  };

  const handleResetFilters = () => {
    setSearchTerm("");
    setSelectedCategory(undefined);
    setSelectedPriceIdx(0);
    setSortBy("newest");
    router.push("/products", { scroll: false });
  };

  const hasActiveFilters =
    !!selectedCategory || selectedPriceIdx !== 0 || !!searchTerm.trim() || sortBy !== "newest";

  return (
    <div className="min-h-screen bg-slate-50/50 py-8">
      <div className="mx-auto max-w-7xl px-4">
        {/* Breadcrumb & Tiêu đề */}
        <div className="mb-8">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400 font-semibold mb-1">
            Bộ sưu tập 2026
          </p>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
              {pageTitle}
            </h1>
            <p className="text-sm text-slate-500">
              Hiển thị <strong className="text-slate-800">{displayProducts.length}</strong> sản phẩm
              {isFetching && <Loader2 className="inline ml-2 h-4 w-4 animate-spin text-slate-400" />}
            </p>
          </div>
        </div>

        {/* Thanh công cụ / Filter Bar */}
        <div className="mb-8 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm space-y-4">
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
            {/* Thanh Search Debounce / Direct */}
            <div className="relative flex-1">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Tìm sản phẩm theo tên, chất liệu..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-10 text-xs md:text-sm text-slate-800 outline-none focus:border-slate-800 focus:bg-white transition"
              />
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Sort & Toggle Filter Buttons */}
            <div className="flex items-center gap-3">
              {/* Sort Dropdown */}
              <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700">
                <ArrowUpDown className="h-3.5 w-3.5 text-slate-500" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as ProductQueryParams["sort_by"])}
                  className="bg-transparent outline-none cursor-pointer text-slate-800 text-xs font-medium"
                >
                  {SORT_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Nút bật/tắt bộ lọc giá */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold uppercase tracking-wider transition ${
                  showFilters || selectedPriceIdx !== 0
                    ? "bg-slate-900 text-white"
                    : "border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100"
                }`}
              >
                <SlidersHorizontal className="h-3.5 w-3.5" />
                <span>Bộ lọc</span>
                {selectedPriceIdx !== 0 && (
                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[9px] text-white">
                    1
                  </span>
                )}
              </button>

              {/* Nút Xoá bộ lọc nếu có */}
              {hasActiveFilters && (
                <button
                  onClick={handleResetFilters}
                  className="text-xs font-semibold text-rose-600 hover:underline px-2 py-1"
                >
                  Xoá lọc
                </button>
              )}
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-2 no-scrollbar">
            <button
              onClick={() => handleCategoryClick(undefined)}
              className={`shrink-0 rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-wider transition ${
                !selectedCategory
                  ? "bg-slate-900 text-white shadow-sm"
                  : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
              }`}
            >
              Tất cả
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleCategoryClick(cat.id)}
                className={`shrink-0 rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-wider transition ${
                  selectedCategory === cat.id
                    ? "bg-slate-900 text-white shadow-sm"
                    : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Phần mở rộng: Lọc theo khoảng giá */}
          {showFilters && (
            <div className="border-t border-slate-100 pt-3">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                Khoảng giá:
              </p>
              <div className="flex flex-wrap gap-2">
                {PRICE_RANGES.map((range, idx) => (
                  <button
                    key={range.label}
                    onClick={() => setSelectedPriceIdx(idx)}
                    className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                      selectedPriceIdx === idx
                        ? "bg-slate-800 text-white"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    {range.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Loading Skeleton */}
        {isLoading ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 md:gap-6 py-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div
                key={i}
                className="animate-pulse flex flex-col rounded-xl border border-slate-100 bg-white p-4 space-y-3"
              >
                <div className="aspect-[3/4] w-full rounded-lg bg-slate-200" />
                <div className="h-4 w-3/4 rounded bg-slate-200 mx-auto" />
                <div className="h-4 w-1/2 rounded bg-slate-200 mx-auto" />
              </div>
            ))}
          </div>
        ) : (
          <ProductGridSection title="" products={displayProducts} />
        )}
      </div>
    </div>
  );
}
