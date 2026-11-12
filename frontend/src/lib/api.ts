import apiClient from "./axios";

export type ApiProduct = {
  id: number;
  name: string;
  subTitle: string;
  price: string;
  oldPrice?: string | null;
  discount?: number | null;
  image: string;
  isNew: boolean;
  sku?: string;
  stock?: number;
  description?: string;
};

export type ApiPost = {
  id: number;
  title: string;
  date: string;
  description: string;
  content: string;
  image: string;
};

export type ApiBanner = {
  id: number;
  image: string;
};

export type ApiCategory = {
  id: number;
  name: string;
  slug: string;
  href: string;
};

export type ApiPromotion = {
  id: number;
  title: string;
  time: string;
  description: string;
};

export type ApiJob = {
  id: number;
  title: string;
  location: string;
  description: string;
};

export type ApiStore = {
  id: number;
  name: string;
  address: string;
  hotline: string;
};

export type ApiOrderItem = {
  id: number;
  productId: number;
  productName: string;
  price: string;
  quantity: number;
  image: string;
};

export type ApiOrder = {
  id: number;
  orderCode: number;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  shippingAddress: string;
  city: string;
  district: string;
  notes: string;
  paymentMethod: "cod" | "payos";
  paymentStatus: "pending" | "paid" | "failed" | "cancelled";
  shippingStatus: "pending" | "shipping" | "delivered" | "cancelled";
  subtotal: string;
  discountAmount: string;
  shippingFee: string;
  total: string;
  payosPaymentLinkId?: string;
  createdAt: string;
  items: ApiOrderItem[];
};

// ==========================================
// 1. PRODUCT APIs (Axios)
// ==========================================

export async function getProducts(params?: {
  is_new?: boolean;
  limit?: number;
  category_id?: number;
  q?: string;
  min_price?: number;
  max_price?: number;
  sort_by?: string;
}): Promise<ApiProduct[]> {
  try {
    const res = await apiClient.get<{ data: ApiProduct[] }>("/products", {
      params,
    });
    return res.data.data || [];
  } catch {
    return [];
  }
}

export async function getProduct(id: number): Promise<ApiProduct | null> {
  try {
    const res = await apiClient.get<{ data: ApiProduct }>(`/products/${id}`);
    return res.data.data;
  } catch {
    return null;
  }
}

// ==========================================
// 2. CONTENT & RESOURCE APIs (Axios)
// ==========================================

export async function getPosts(): Promise<ApiPost[]> {
  try {
    const res = await apiClient.get<{ data: ApiPost[] }>("/posts");
    return res.data.data || [];
  } catch {
    return [];
  }
}

export async function getPost(id: number): Promise<ApiPost | null> {
  try {
    const res = await apiClient.get<{ data: ApiPost }>(`/posts/${id}`);
    return res.data.data;
  } catch {
    return null;
  }
}

export async function getBanners(): Promise<ApiBanner[]> {
  try {
    const res = await apiClient.get<{ data: ApiBanner[] }>("/banners");
    return res.data.data || [];
  } catch {
    return [];
  }
}

export async function getCategories(): Promise<ApiCategory[]> {
  try {
    const res = await apiClient.get<{ data: ApiCategory[] }>("/categories");
    return res.data.data || [];
  } catch {
    return [];
  }
}

export async function getPromotions(): Promise<ApiPromotion[]> {
  try {
    const res = await apiClient.get<{ data: ApiPromotion[] }>("/promotions");
    return res.data.data || [];
  } catch {
    return [];
  }
}

export async function getJobs(): Promise<ApiJob[]> {
  try {
    const res = await apiClient.get<{ data: ApiJob[] }>("/jobs");
    return res.data.data || [];
  } catch {
    return [];
  }
}

export async function getStores(): Promise<ApiStore[]> {
  try {
    const res = await apiClient.get<{ data: ApiStore[] }>("/stores");
    return res.data.data || [];
  } catch {
    return [];
  }
}

// ==========================================
// 3. AUTHENTICATION APIs (Axios)
// ==========================================

export async function apiLogin(credentials: Record<string, string>) {
  try {
    const res = await apiClient.post("/login", credentials);
    return { ok: true, status: res.status, data: res.data };
  } catch (error: any) {
    return {
      ok: false,
      status: error.response?.status || 500,
      data: error.response?.data || { message: "Đăng nhập thất bại" },
    };
  }
}

export async function apiRegister(userData: Record<string, string>) {
  try {
    const res = await apiClient.post("/register", userData);
    return { ok: true, status: res.status, data: res.data };
  } catch (error: any) {
    return {
      ok: false,
      status: error.response?.status || 500,
      data: error.response?.data || { message: "Đăng ký thất bại" },
    };
  }
}

export async function apiGetMe(token?: string) {
  try {
    const headers = token ? { Authorization: `Bearer ${token}` } : undefined;
    const res = await apiClient.get("/me", { headers });
    return { ok: true, status: res.status, data: res.data };
  } catch (error: any) {
    return {
      ok: false,
      status: error.response?.status || 401,
      data: error.response?.data,
    };
  }
}

export async function apiLogout(token?: string) {
  try {
    const headers = token ? { Authorization: `Bearer ${token}` } : undefined;
    const res = await apiClient.post("/logout", {}, { headers });
    return { ok: true, status: res.status };
  } catch (error: any) {
    return { ok: false, status: error.response?.status || 500 };
  }
}

// ==========================================
// 4. ORDER APIs (Axios)
// ==========================================

export async function apiCreateOrder(
  orderData: {
    customer_name: string;
    customer_phone: string;
    customer_email: string;
    shipping_address: string;
    city: string;
    district: string;
    notes?: string;
    payment_method: "cod" | "payos";
    items: { product_id: number; quantity: number }[];
    discount_amount?: number;
  },
  token?: string
) {
  try {
    const headers = token ? { Authorization: `Bearer ${token}` } : undefined;
    const res = await apiClient.post("/orders", orderData, { headers });
    return { ok: true, status: res.status, data: res.data };
  } catch (error: any) {
    return {
      ok: false,
      status: error.response?.status || 500,
      data: error.response?.data || { message: "Tạo đơn hàng thất bại" },
    };
  }
}

export async function apiGetOrders(token?: string) {
  try {
    const headers = token ? { Authorization: `Bearer ${token}` } : undefined;
    const res = await apiClient.get("/orders", { headers });
    return { ok: true, status: res.status, data: res.data };
  } catch (error: any) {
    return {
      ok: false,
      status: error.response?.status || 500,
      data: error.response?.data || { orders: [] },
    };
  }
}

export async function apiGetOrder(id: number, token?: string) {
  try {
    const headers = token ? { Authorization: `Bearer ${token}` } : undefined;
    const res = await apiClient.get(`/orders/${id}`, { headers });
    return { ok: true, status: res.status, data: res.data };
  } catch (error: any) {
    return {
      ok: false,
      status: error.response?.status || 500,
      data: error.response?.data,
    };
  }
}

export function getApiUrl(path: string): string {
  const base = (process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api").replace(/\/$/, "");
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${base}${p}`;
}
