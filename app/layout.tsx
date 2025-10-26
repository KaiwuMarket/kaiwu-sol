import type React from "react"
import "./globals.css"
import { SolanaWalletProvider } from "@/components/wallet-provider"
import ClientLayout from "./client-layout"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body>
        <SolanaWalletProvider>
          <ClientLayout>{children}</ClientLayout>
        </SolanaWalletProvider>
      </body>
    </html>
  )
}

export const metadata = {
      generator: 'v0.app'
    };
