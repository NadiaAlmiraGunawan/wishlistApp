import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";
import { Navbar } from "../components/navbar";

export const metadata: Metadata = {
  title: "Wishly",
  description: "Catat, atur prioritas, dan pantau progres wishlist kamu.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className="min-h-screen bg-[#F8F9FA] text-foreground antialiased">
        <ThemeProvider>
          <div className="flex flex-col min-h-screen">
            <Navbar /> {/* Navbar di atas */}
            <main className="flex-1">
              {children}
            </main>
          </div>
          <Toaster position="top-right" richColors />
        </ThemeProvider>
      </body>
    </html>
  );
}