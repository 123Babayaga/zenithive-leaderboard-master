"use client";

import { Geist, Geist_Mono } from "next/font/google";
import { usePathname } from "next/navigation";
import Sidebar from "./customComponent/Sidebar";
import "./globals.css";
import { Toaster } from "sonner";
import ReduxProvider from "@/components/providers/ReduxProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Note: You'll need to move metadata to a separate metadata.ts file or page component
// since this is now a client component

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const showSidebar = pathname !== "/change-password" && pathname !== "/";

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
          <ReduxProvider>
        <div className="flex">
          {showSidebar && <Sidebar />}
          <main className={`flex-1 p-4 ${!showSidebar ? "w-full" : ""}`}>
            {children}
          </main>
        </div>
        </ReduxProvider>
        <Toaster position="top-right" richColors /> {/* ✅ ADD THIS */}
      </body>
    </html>
  );
}
