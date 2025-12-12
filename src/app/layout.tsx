import type { Metadata } from "next";
import { Archivo, JetBrains_Mono } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";
import { SessionProvider } from "@/context/SessionContext";
import CartDrawer from "@/components/CartDrawer";

const archivo = Archivo({
  variable: "--font-sans",
  subsets: ["latin"],
  axes: ["wdth"], // Variable width axis
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SOLUNA",
  description: "High-performance cognitive enhancement protocol.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${archivo.variable} ${jetbrainsMono.variable} antialiased bg-[#F2F0E9] text-[#121212]`}
        suppressHydrationWarning
      >
        <AuthProvider>
          <Suspense fallback={null}>
            <SessionProvider>
              <CartProvider>
                {children}
                <CartDrawer />
              </CartProvider>
            </SessionProvider>
          </Suspense>
        </AuthProvider>
      </body>
    </html>
  );
}
