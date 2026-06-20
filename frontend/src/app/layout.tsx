import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "../components/header";
import Footer from "../components/footer";
import { CartProvider } from "../context/cartContext";
import { AuthProvider } from "../context/authContext";
import { Toaster } from "react-hot-toast";
import CartPopup from "../components/cart";


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
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <CartProvider>
            <Header />
            {children}
            <CartPopup />
            <Footer />
            <Toaster position="top-right" reverseOrder={false} />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
