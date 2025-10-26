"use client"

import { useState } from "react"
import { useWallet } from "@solana/wallet-adapter-react"
import { ShoppingCart, Package, Truck, CheckCircle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useMarketplace } from "@/hooks/use-marketplace"

type PurchaseStatus = "Sold" | "RedeemPending" | "Redeemed"

interface Purchase {
  id: number
  name: string
  sku: string
  price: number
  purchasedAt: string
  status: PurchaseStatus
}

export default function PurchasesPage() {
  const { connected } = useWallet()
  const { redeemRequest } = useMarketplace()
  const [isRequesting, setIsRequesting] = useState(false)

  // Mock data - replace with actual contract data
  const purchases: Purchase[] = [
    {
      id: 1,
      name: "2025 Pokemon Japanese SV Terastal",
      sku: "PSA-001",
      price: 45.5,
      purchasedAt: "2024-01-15",
      status: "Sold",
    },
    {
      id: 2,
      name: "2024 Pokemon Scarlet & Violet",
      sku: "PSA-002",
      price: 67.8,
      purchasedAt: "2024-01-10",
      status: "RedeemPending",
    },
    {
      id: 3,
      name: "2023 Pokemon Japanese SWSH",
      sku: "PSA-003",
      price: 89.2,
      purchasedAt: "2024-01-05",
      status: "Redeemed",
    },
  ]

  const handleRedeemRequest = async (itemId: number) => {
    setIsRequesting(true)
    try {
      await redeemRequest(itemId)
      alert("Redemption request submitted! The operator will process your physical delivery.")
    } catch (error) {
      console.error("Error requesting redemption:", error)
      alert("Failed to request redemption")
    } finally {
      setIsRequesting(false)
    }
  }

  const getStatusBadge = (status: PurchaseStatus) => {
    switch (status) {
      case "Sold":
        return <Badge variant="secondary">Owned</Badge>
      case "RedeemPending":
        return <Badge className="bg-warning/20 text-warning">Pending Delivery</Badge>
      case "Redeemed":
        return <Badge className="bg-success/20 text-success">Delivered</Badge>
    }
  }

  const getStatusIcon = (status: PurchaseStatus) => {
    switch (status) {
      case "Sold":
        return <Package className="w-5 h-5" />
      case "RedeemPending":
        return <Truck className="w-5 h-5" />
      case "Redeemed":
        return <CheckCircle className="w-5 h-5" />
    }
  }

  if (!connected) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="p-8 text-center max-w-md">
          <ShoppingCart className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <h2 className="text-2xl font-bold mb-2">Connect Your Wallet</h2>
          <p className="text-muted-foreground">Please connect your wallet to view your purchases.</p>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-2">My Purchases</h1>
        <p className="text-muted-foreground">View your purchased items and request physical redemption</p>
      </div>

      {/* Purchase Flow Info */}
      <Card className="p-6 bg-secondary/50">
        <h3 className="font-semibold mb-3">Redemption Process</h3>
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Package className="w-4 h-4 text-primary" />
            <span>1. Purchase Item</span>
          </div>
          <span className="text-muted-foreground">→</span>
          <div className="flex items-center gap-2">
            <Truck className="w-4 h-4 text-warning" />
            <span>2. Request Delivery</span>
          </div>
          <span className="text-muted-foreground">→</span>
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-success" />
            <span>3. Confirm Receipt</span>
          </div>
        </div>
      </Card>

      {/* Purchases List */}
      <div className="space-y-4">
        {purchases.map((purchase) => (
          <Card key={purchase.id} className="p-6">
            <div className="flex items-start gap-6">
              <div className="w-32 h-32 bg-secondary rounded-lg flex items-center justify-center flex-shrink-0">
                {getStatusIcon(purchase.status)}
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="text-xl font-semibold mb-1">{purchase.name}</h3>
                    <p className="text-sm text-muted-foreground">SKU: {purchase.sku}</p>
                  </div>
                  {getStatusBadge(purchase.status)}
                </div>
                <div className="flex items-center gap-6 mb-4">
                  <div>
                    <div className="text-sm text-muted-foreground">Purchase Price</div>
                    <div className="text-lg font-bold text-primary">{purchase.price} SOL</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Purchased On</div>
                    <div className="text-sm">{purchase.purchasedAt}</div>
                  </div>
                </div>

                {purchase.status === "Sold" && (
                  <Button onClick={() => handleRedeemRequest(purchase.id)} disabled={isRequesting}>
                    {isRequesting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Requesting...
                      </>
                    ) : (
                      <>
                        <Truck className="w-4 h-4 mr-2" />
                        Request Physical Delivery
                      </>
                    )}
                  </Button>
                )}

                {purchase.status === "RedeemPending" && (
                  <div className="flex items-center gap-2 text-warning">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-sm">Waiting for operator to confirm delivery...</span>
                  </div>
                )}

                {purchase.status === "Redeemed" && (
                  <div className="flex items-center gap-2 text-success">
                    <CheckCircle className="w-4 h-4" />
                    <span className="text-sm">Physical item delivered and confirmed</span>
                  </div>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {purchases.length === 0 && (
        <Card className="p-12 text-center">
          <ShoppingCart className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-xl font-semibold mb-2">No Purchases Yet</h3>
          <p className="text-muted-foreground mb-6">Start exploring the marketplace to find your first item!</p>
          <Button asChild>
            <a href="/marketplace">Browse Marketplace</a>
          </Button>
        </Card>
      )}
    </div>
  )
}
