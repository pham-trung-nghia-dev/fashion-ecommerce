import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "../components/header";
import Footer from "../components/footer";
import { CartProvider } from "../context/cartContext";
import { AuthProvider } from "../context/authContext";
import { Toaster } from "react-hot-toast";
import CartDrawer from "../components/cart/CartDrawer";
import QueryProvider from "../providers/QueryProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FASHION – Hệ thống thời trang nam nữ hiện đại",
  description: "FASHION cung cấp các sản phẩm quần áo thiết kế thời thượng, trẻ trung với phom dáng chuẩn và dịch vụ cskh tốt nhất.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased selection:bg-slate-900 selection:text-white`}
      >
        <QueryProvider>
          <AuthProvider>
            <CartProvider>
              <Header />
              {children}
              <CartDrawer />
              <Footer />
              <Toaster
                position="top-right"
                toastOptions={{
                  duration: 3000,
                  style: {
                    background: "#0f172a",
                    color: "#f8fafc",
                    fontSize: "13px",
                    fontWeight: 500,
                    borderRadius: "12px",
                    boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.2)",
                  },
                }}
              />
            </CartProvider>
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
