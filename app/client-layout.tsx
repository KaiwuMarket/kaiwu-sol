"use client";

import type React from "react";
import { Inter } from "next/font/google";
import { Sidebar } from "@/components/sidebar";
import { TopBanner } from "@/components/top-banner";
import { NetworkStatus } from "@/components/network-status";
import { useState } from "react";

const inter = Inter({ subsets: ["latin"] });

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <div className={inter.className}>
      <TopBanner />
      <div className="flex min-h-screen pt-10">
        <Sidebar onCollapseChange={setIsSidebarCollapsed} />
        <main
          className={`flex-1 transition-all duration-300 ${
            isSidebarCollapsed ? "ml-16" : "ml-64"
          }`}
        >
          <div className="relative">
            <div className="absolute top-4 right-4 z-10">
              <NetworkStatus />
            </div>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
