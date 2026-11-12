import { useQuery } from "@tanstack/react-query";
import apiClient from "../lib/axios";
import type { ApiCategory } from "../lib/api";

export const fetchCategories = async (): Promise<ApiCategory[]> => {
  const res = await apiClient.get<{ data: ApiCategory[] }>("/categories");
  return res.data.data;
};

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
    staleTime: 5 * 60 * 1000, // 5 minutes cache
  });
}

