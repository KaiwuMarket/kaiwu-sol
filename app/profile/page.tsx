"use client"

import { useWallet } from "@solana/wallet-adapter-react"
import { User, Package, ShoppingCart, Wallet } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export default function ProfilePage() {
  const { publicKey, connected } = useWallet()

  if (!connected) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="p-8 text-center max-w-md">
          <Wallet className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <h2 className="text-2xl font-bold mb-2">Connect Your Wallet</h2>
          <p className="text-muted-foreground mb-6">
            Please connect your Solana wallet to view your profile and manage your items.
          </p>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-2">Profile</h1>
        <p className="text-muted-foreground">Manage your items and purchases</p>
      </div>

      {/* Wallet Info */}
      <Card className="p-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
            <User className="w-8 h-8 text-white" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold mb-1">Your Wallet</h2>
            <p className="text-sm text-muted-foreground font-mono">{publicKey?.toBase58()}</p>
          </div>
        </div>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link href="/profile/inventory">
          <Card className="p-6 hover:bg-secondary/50 transition-colors cursor-pointer h-full">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Package className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold mb-2">My Inventory</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Manage your items: intake new items, list them for sale, or delist from marketplace
                </p>
                <Button variant="outline" size="sm">
                  Manage Inventory →
                </Button>
              </div>
            </div>
          </Card>
        </Link>

        <Link href="/profile/purchases">
          <Card className="p-6 hover:bg-secondary/50 transition-colors cursor-pointer h-full">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg bg-success/10 flex items-center justify-center flex-shrink-0">
                <ShoppingCart className="w-6 h-6 text-success" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold mb-2">My Purchases</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  View your purchased items and request physical redemption for delivery
                </p>
                <Button variant="outline" size="sm">
                  View Purchases →
                </Button>
              </div>
            </div>
          </Card>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="text-sm text-muted-foreground mb-1">Total Items Owned</div>
          <div className="text-3xl font-bold">0</div>
        </Card>
        <Card className="p-6">
          <div className="text-sm text-muted-foreground mb-1">Items Listed</div>
          <div className="text-3xl font-bold">0</div>
        </Card>
        <Card className="p-6">
          <div className="text-sm text-muted-foreground mb-1">Total Purchases</div>
          <div className="text-3xl font-bold">0</div>
        </Card>
      </div>
    </div>
  )
}
