import { useQuery } from "@tanstack/react-query";
import apiClient from "../lib/axios";
import type { ApiProduct } from "../lib/api";

export interface ProductQueryParams {
  category_id?: number;
  q?: string;
  min_price?: number;
  max_price?: number;
  sort_by?: "newest" | "price_asc" | "price_desc" | "popular";
  is_new?: boolean;
  limit?: number;
}

export const fetchProducts = async (params?: ProductQueryParams): Promise<ApiProduct[]> => {
  const res = await apiClient.get<{ data: ApiProduct[] }>("/products", {
    params,
  });
  return res.data.data;
};

export const fetchProductById = async (id: number): Promise<ApiProduct> => {
  const res = await apiClient.get<{ data: ApiProduct }>(`/products/${id}`);
  return res.data.data;
};

export function useProducts(params?: ProductQueryParams) {
  return useQuery({
    queryKey: ["products", params],
    queryFn: () => fetchProducts(params),
  });
}

export function useProduct(id: number) {
  return useQuery({
    queryKey: ["product", id],
    queryFn: () => fetchProductById(id),
    enabled: !!id,
  });
}

