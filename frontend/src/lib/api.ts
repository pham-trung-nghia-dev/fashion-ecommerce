const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

function getApiUrl(path: string): string {
  const base = API_URL.replace(/\/$/, "")
  const p = path.startsWith("/") ? path : `/${path}`
  return `${base}/api${p}`
}

async function fetchApi<T>(path: string): Promise<T> {
  const url = getApiUrl(path)
  const res = await fetch(url, { next: { revalidate: 60 } })
  if (!res.ok) {
    throw new Error(`API error: ${res.status} ${path}`)
  }
  return res.json()
}

export type ApiProduct = {
  id: number
  name: string
  subTitle: string
  price: string
  oldPrice?: string | null
  discount?: number | null
  image: string
  isNew: boolean
  sku?: string
  stock?: number
  description?: string
}

export type ApiPost = {
  id: number
  title: string
  date: string
  description: string
  content: string
  image: string
}

export type ApiBanner = { id: number; image: string }

export type ApiCategory = {
  id: number
  name: string
  slug: string
  href: string
}

export type ApiPromotion = {
  id: number
  title: string
  time: string
  description: string
}

export type ApiJob = {
  id: number
  title: string
  location: string
  description: string
}

export type ApiStore = {
  id: number
  name: string
  address: string
  hotline: string
}

export async function getProducts(params?: {
  is_new?: boolean
  limit?: number
  category_id?: number
}): Promise<ApiProduct[]> {
  const search = new URLSearchParams()
  if (params?.is_new) search.set("is_new", "1")
  if (params?.limit) search.set("limit", String(params.limit))
  if (params?.category_id) search.set("category_id", String(params.category_id))
  const q = search.toString()
  const data = await fetchApi<{ data: ApiProduct[] }>(`/products${q ? `?${q}` : ""}`)
  return data.data
}

export async function getProduct(id: number): Promise<ApiProduct | null> {
  try {
    const data = await fetchApi<{ data: ApiProduct }>(`/products/${id}`)
    return data.data
  } catch {
    return null
  }
}

export async function getPosts(): Promise<ApiPost[]> {
  const data = await fetchApi<{ data: ApiPost[] }>("/posts")
  return data.data
}

export async function getPost(id: number): Promise<ApiPost | null> {
  try {
    const data = await fetchApi<{ data: ApiPost }>(`/posts/${id}`)
    return data.data
  } catch {
    return null
  }
}

export async function getBanners(): Promise<ApiBanner[]> {
  const data = await fetchApi<{ data: ApiBanner[] }>("/banners")
  return data.data
}

export async function getCategories(): Promise<ApiCategory[]> {
  const data = await fetchApi<{ data: ApiCategory[] }>("/categories")
  return data.data
}

export async function getPromotions(): Promise<ApiPromotion[]> {
  const data = await fetchApi<{ data: ApiPromotion[] }>("/promotions")
  return data.data
}

export async function getJobs(): Promise<ApiJob[]> {
  const data = await fetchApi<{ data: ApiJob[] }>("/jobs")
  return data.data
}

export async function getStores(): Promise<ApiStore[]> {
  const data = await fetchApi<{ data: ApiStore[] }>("/stores")
  return data.data
}

// Authentication Helpers
export async function apiLogin(credentials: Record<string, string>) {
  const url = getApiUrl("/login")
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", "Accept": "application/json" },
    body: JSON.stringify(credentials)
  })
  return { ok: res.ok, status: res.status, data: await res.json() }
}

export async function apiRegister(userData: Record<string, string>) {
  const url = getApiUrl("/register")
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", "Accept": "application/json" },
    body: JSON.stringify(userData)
  })
  return { ok: res.ok, status: res.status, data: await res.json() }
}

export async function apiGetMe(token: string) {
  const url = getApiUrl("/me")
  const res = await fetch(url, {
    headers: {
      "Authorization": `Bearer ${token}`,
      "Accept": "application/json"
    }
  })
  return { ok: res.ok, status: res.status, data: await res.json() }
}

export async function apiLogout(token: string) {
  const url = getApiUrl("/logout")
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Accept": "application/json"
    }
  })
  return { ok: res.ok, status: res.status }
}

// Order types & APIs
export type ApiOrderItem = {
  id: number
  productId: number
  productName: string
  price: string
  quantity: number
  image: string
}

export type ApiOrder = {
  id: number
  orderCode: number
  customerName: string
  customerPhone: string
  customerEmail: string
  shippingAddress: string
  city: string
  district: string
  notes: string
  paymentMethod: 'cod' | 'payos'
  paymentStatus: 'pending' | 'paid' | 'failed' | 'cancelled'
  shippingStatus: 'pending' | 'shipping' | 'delivered' | 'cancelled'
  subtotal: string
  discountAmount: string
  shippingFee: string
  total: string
  payosPaymentLinkId?: string
  createdAt: string
  items: ApiOrderItem[]
}

export async function apiCreateOrder(
  orderData: {
    customer_name: string
    customer_phone: string
    customer_email: string
    shipping_address: string
    city: string
    district: string
    notes?: string
    payment_method: 'cod' | 'payos'
    items: { product_id: number; quantity: number }[]
    discount_amount?: number
  },
  token: string
) {
  const url = getApiUrl("/orders")
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(orderData)
  })
  return { ok: res.ok, status: res.status, data: await res.json() }
}

export async function apiGetOrders(token: string) {
  const url = getApiUrl("/orders")
  const res = await fetch(url, {
    headers: {
      "Accept": "application/json",
      "Authorization": `Bearer ${token}`
    }
  })
  return { ok: res.ok, status: res.status, data: await res.json() }
}

export async function apiGetOrder(id: number, token: string) {
  const url = getApiUrl(`/orders/${id}`)
  const res = await fetch(url, {
    headers: {
      "Accept": "application/json",
      "Authorization": `Bearer ${token}`
    }
  })
  return { ok: res.ok, status: res.status, data: await res.json() }
}

export { getApiUrl }
