import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import QueryProvider from "@/components/providers/QueryProvider";
import { ThemeProvider } from "@/components/providers/ThemeProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Dashboard Keuangan Desa",
  description: "Enterprise Financial Dashboard for Village Administration",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className={`${inter.className} min-h-screen antialiased bg-background text-foreground selection:bg-primary/20 selection:text-primary`}>
        <ThemeProvider />
        <QueryProvider>
          {children}
        </QueryProvider>
      </body>
    </html>
  );
}
