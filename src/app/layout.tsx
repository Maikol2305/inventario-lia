import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import { SessionProvider } from "next-auth/react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LÍA | Inventario de Laboratorio",
  description: "Sistema de gestión de inventario para el Laboratorio de Informática Aplicada",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-slate-50 min-h-screen flex flex-col`}>
        <SessionProvider>
          <Navbar />
          <main className="flex-grow">
            {children}
          </main>
          <footer className="border-t bg-white py-6">
            <div className="container mx-auto px-4 text-center text-slate-500 text-sm">
              © {new Date().getFullYear()} Laboratorio de Informática Aplicada (LÍA). Todos los derechos reservados.
            </div>
          </footer>
        </SessionProvider>
      </body>
    </html>
  );
}
