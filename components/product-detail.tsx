"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Heart,
  Share2,
  ExternalLink,
  ShoppingCart,
  Package,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { useMarketplace } from "@/hooks/use-marketplace";
import { useOnchainData, OnchainItem } from "@/hooks/use-onchain-data";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface ProductDetailProps {
  productId: string;
}

export function ProductDetail({ productId }: ProductDetailProps) {
  const { connected, publicKey } = useWallet();
  const { setVisible } = useWalletModal();
  const { buyItem, redeemRequest } = useMarketplace();
  const { loading, error, fetchItemDetails } = useOnchainData();
  const { toast } = useToast();
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [item, setItem] = useState<OnchainItem | null>(null);

  useEffect(() => {
    fetchItemDetails(productId).then(setItem);
  }, [productId, fetchItemDetails]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center gap-2">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>Loading item details from the blockchain...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-2">Failed to load item</h3>
          <p className="text-muted-foreground mb-4">{error.message}</p>
          <Button onClick={() => fetchItemDetails(productId).then(setItem)}>
            Retry
          </Button>
        </div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-2">Item not found</h3>
          <p className="text-muted-foreground mb-4">
            This item does not seem to exist on the blockchain.
          </p>
          <Link href="/marketplace">
            <Button>Back to Marketplace</Button>
          </Link>
        </div>
      </div>
    );
  }

  const isOwner =
    connected && item.currentOwner === publicKey?.toString();
  const isListed = item.status === "listed";
  const isRedeemable = item.status === "inVault" || item.status === "sold";
  const explorerUrl = `https://explorer.solana.com/address/${item.pda}?cluster=devnet`;

  const handleBuy = async () => {
    if (!connected) {
      setVisible(true);
      return;
    }
    setIsActionLoading(true);
    try {
      await buyItem(Number.parseInt(item.itemId));
      toast({
        title: "Purchase Successful!",
        description: `You are now the new owner of ${item.name}.`,
      });
      fetchItemDetails(productId).then(setItem); // Refresh data
    } catch (e: any) {
      toast({
        title: "Purchase Failed",
        description: e.message,
        variant: "destructive",
      });
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleRedeem = async () => {
    if (!connected) {
      setVisible(true);
      return;
    }
    setIsActionLoading(true);
    try {
      await redeemRequest(Number.parseInt(item.itemId));
      toast({
        title: "Redemption Requested!",
        description: "Your physical item will be shipped soon.",
      });
      fetchItemDetails(productId).then(setItem); // Refresh data
    } catch (e: any) {
      toast({
        title: "Redemption Failed",
        description: e.message,
        variant: "destructive",
      });
    } finally {
      setIsActionLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
      {/* Image Section */}
      <div className="space-y-4">
        <div className="aspect-2/3 bg-secondary/50 rounded-lg overflow-hidden border border-border">
          <img
            src={item.image || "/placeholder.svg"}
            alt={item.name}
            className="w-full h-full object-contain p-8"
          />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="flex-1 gap-2 bg-transparent">
            <Heart className="w-4 h-4" /> Favorite
          </Button>
          <Button variant="outline" size="sm" className="flex-1 gap-2 bg-transparent">
            <Share2 className="w-4 h-4" /> Share
          </Button>
        </div>
      </div>

      {/* Details Section */}
      <div className="space-y-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="secondary">Kaiwu Collection</Badge>
            <Badge variant="outline">Grade A</Badge>
            {item.status === "redeemPending" && (
              <Badge variant="default">Redeem Pending</Badge>
            )}
            {item.status === "redeemed" && (
              <Badge variant="default">Redeemed</Badge>
            )}
          </div>
          <h1 className="text-4xl font-bold mb-2">{item.name}</h1>
          <p className="text-muted-foreground leading-relaxed">
            {item.description}
          </p>
        </div>

        <div className="p-6 bg-card border border-border rounded-lg">
          <div className="flex items-baseline gap-2 mb-4">
            <span className="text-sm text-muted-foreground">Current Price</span>
          </div>
          <div className="flex items-baseline gap-2 mb-6">
            <span className="text-4xl font-bold">
              {item.listing ? `${item.listing.priceSol.toFixed(2)} SOL` : "Not Listed"}
            </span>
            {item.listing && (
              <span className="text-muted-foreground">
                ≈ ${(item.listing.priceSol * 100).toFixed(2)} USD
              </span>
            )}
          </div>
          <div className="flex gap-3">
            {!isOwner && isListed && (
              <Button size="lg" className="flex-1 gap-2" onClick={handleBuy} disabled={isActionLoading}>
                <ShoppingCart className="w-5 h-5" />
                {isActionLoading ? "Processing..." : "Buy Now"}
              </Button>
            )}
            {isOwner && isRedeemable && (
              <Button size="lg" className="flex-1 gap-2" onClick={handleRedeem} disabled={isActionLoading} variant="outline">
                <Package className="w-5 h-5" />
                {isActionLoading ? "Processing..." : "Redeem Physical Item"}
              </Button>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold">Details</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b border-border">
              <span className="text-muted-foreground">Owner</span>
              <a
                href={`https://explorer.solana.com/address/${item.currentOwner}?cluster=devnet`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-sm hover:text-primary"
              >
                {item.currentOwner.slice(0, 8)}...
              </a>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-border">
              <span className="text-muted-foreground">Item Address</span>
              <div className="flex items-center gap-2">
                <a
                  href={explorerUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-sm hover:text-primary"
                >
                  {item.pda.slice(0, 8)}...
                </a>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={() => window.open(explorerUrl, "_blank")}
                >
                  <ExternalLink className="w-3 h-3" />
                </Button>
              </div>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-muted-foreground">Blockchain</span>
              <span className="font-medium">Solana</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
