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
import { useSolanaEvents } from "@/hooks/use-solana-events";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { PublicKey } from "@solana/web3.js";

interface ProductDetailProps {
  productId: string;
}

export function ProductDetail({ productId }: ProductDetailProps) {
  const { connected, publicKey } = useWallet();
  const { setVisible } = useWalletModal();
  const { buyItem, redeemRequest } = useMarketplace();
  const { useItemDetails } = useSolanaEvents();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const itemId = Number.parseInt(productId);
  const {
    item: itemDetails,
    loading: itemLoading,
    error: itemError,
  } = useItemDetails(itemId);

  const handleBuy = async () => {
    if (!connected) {
      setVisible(true);
      return;
    }

    try {
      setLoading(true);
      const signature = await buyItem(itemId);

      toast({
        title: "Purchase Successful!",
        description: `Transaction: ${signature.slice(0, 8)}...`,
      });
    } catch (error: any) {
      toast({
        title: "Purchase Failed",
        description: error.message || "Failed to complete purchase",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRedeem = async () => {
    if (!connected) {
      setVisible(true);
      return;
    }

    try {
      setLoading(true);
      const signature = await redeemRequest(itemId);

      toast({
        title: "Redemption Requested!",
        description: "Your physical item will be shipped soon.",
      });
    } catch (error: any) {
      toast({
        title: "Redemption Failed",
        description: error.message || "Failed to request redemption",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // 生成商品图片(基于itemId)
  const getItemImage = (itemId: number) => {
    const images = [
      "/pokemon-card-graded-slab.jpg",
      "/pokemon-card-graded-slab-blue.jpg",
      "/pokemon-card-graded-slab-green.jpg",
      "/pokemon-card-graded-slab-pink.jpg",
      "/pokemon-card-graded-slab-purple.jpg",
      "/pokemon-card-graded-slab-red.jpg",
    ];
    return images[itemId % images.length];
  };

  // 生成商品名称(基于itemId)
  const getItemName = (itemId: number) => {
    const names = [
      "Charizard VMAX",
      "Pikachu VMAX",
      "Mewtwo GX",
      "Rayquaza VMAX",
      "Umbreon VMAX",
      "Gengar VMAX",
      "Lugia V",
      "Mew VMAX",
      "Giratina VSTAR",
      "Arceus VSTAR",
      "Dialga VSTAR",
      "Palkia VSTAR",
    ];
    return names[itemId % names.length] || `Item #${itemId}`;
  };

  // 生成商品集合(基于itemId)
  const getItemSet = (itemId: number) => {
    const sets = [
      "Darkness Ablaze",
      "Vivid Voltage",
      "Shining Legends",
      "Evolving Skies",
      "Fusion Strike",
      "Silver Tempest",
      "Lost Origin",
      "Brilliant Stars",
      "Astral Radiance",
      "Chilling Reign",
      "Battle Styles",
      "Rebel Clash",
    ];
    return sets[itemId % sets.length] || "Unknown Set";
  };

  // 生成商品等级(基于itemId)
  const getItemGrade = (itemId: number) => {
    const grades = [
      "PSA 10",
      "PSA 9",
      "BGS 10",
      "BGS 9.5",
      "CGC 10",
      "CGC 9.5",
    ];
    return grades[itemId % grades.length] || "PSA 10";
  };

  // 使用链上数据或fallback到mock数据
  const product = {
    id: productId,
    name: itemDetails ? getItemName(itemDetails.itemId) : "Loading...",
    set: itemDetails ? getItemSet(itemDetails.itemId) : "Loading...",
    cardNumber: `${String(itemId).padStart(3, "0")}/189`,
    grade: itemDetails ? getItemGrade(itemDetails.itemId) : "PSA 10",
    price: itemDetails?.listing?.priceSOL || 0,
    image: getItemImage(itemId),
    rarity: "Ultra Rare",
    description: `This is a professionally graded ${getItemName(
      itemId
    )} card from the ${getItemSet(
      itemId
    )} set. The card has been authenticated and graded with a perfect rating, making it a highly sought-after collectible.`,
    attributes: [
      { trait: "Type", value: "Fire" },
      { trait: "HP", value: "330" },
      { trait: "Rarity", value: "Ultra Rare" },
      { trait: "Set", value: getItemSet(itemId) },
      { trait: "Card Number", value: `${String(itemId).padStart(3, "0")}/189` },
      { trait: "Grading Company", value: getItemGrade(itemId).split(" ")[0] },
    ],
    owner: itemDetails?.currentOwner?.toString().slice(0, 8) || "Loading...",
    mintAddress: itemDetails?.itemPubkey?.toString() || "Loading...",
    status: itemDetails?.status || { inVault: {} },
    isOwner:
      connected &&
      itemDetails?.currentOwner?.toString() === publicKey?.toString(),
  };

  const isListed = product.status.listed !== undefined;
  const isRedeemable =
    product.status.inVault !== undefined || product.status.sold !== undefined;

  // 加载状态
  if (itemLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center gap-2">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>Loading item details...</span>
        </div>
      </div>
    );
  }

  // 错误状态
  if (itemError) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-2">Failed to load item</h3>
          <p className="text-muted-foreground mb-4">{itemError}</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    );
  }

  // 商品不存在
  if (!itemDetails) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-2">Item not found</h3>
          <p className="text-muted-foreground mb-4">
            This item does not exist on the blockchain.
          </p>
          <Link href="/marketplace">
            <Button>Back to Marketplace</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
      {/* Image Section */}
      <div className="space-y-4">
        <div className="aspect-2/3 bg-secondary/50 rounded-lg overflow-hidden border border-border">
          <img
            src={product.image || "/placeholder.svg"}
            alt={product.name}
            className="w-full h-full object-contain p-8"
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 gap-2 bg-transparent"
          >
            <Heart className="w-4 h-4" />
            Favorite
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex-1 gap-2 bg-transparent"
          >
            <Share2 className="w-4 h-4" />
            Share
          </Button>
        </div>
      </div>

      {/* Details Section */}
      <div className="space-y-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="secondary">{product.set}</Badge>
            <Badge variant="outline">{product.grade}</Badge>
            {product.status.redeemPending && (
              <Badge variant="default">Redeem Pending</Badge>
            )}
            {product.status.redeemed && (
              <Badge variant="default">Redeemed</Badge>
            )}
          </div>
          <h1 className="text-4xl font-bold mb-2">{product.name}</h1>
          <p className="text-muted-foreground">Card #{product.cardNumber}</p>
        </div>

        <div className="p-6 bg-card border border-border rounded-lg">
          <div className="flex items-baseline gap-2 mb-4">
            <span className="text-sm text-muted-foreground">Current Price</span>
          </div>
          <div className="flex items-baseline gap-2 mb-6">
            <span className="text-4xl font-bold">
              {product.price.toFixed(2)} SOL
            </span>
            <span className="text-muted-foreground">
              ≈ ${(product.price * 100).toFixed(2)} USD
            </span>
          </div>
          <div className="flex gap-3">
            {!product.isOwner && isListed && (
              <Button
                size="lg"
                className="flex-1 gap-2"
                onClick={handleBuy}
                disabled={loading}
              >
                <ShoppingCart className="w-5 h-5" />
                {loading
                  ? "Processing..."
                  : connected
                  ? "Buy Now"
                  : "Connect Wallet to Buy"}
              </Button>
            )}
            {product.isOwner && isRedeemable && (
              <Button
                size="lg"
                className="flex-1 gap-2 bg-transparent"
                onClick={handleRedeem}
                disabled={loading}
                variant="outline"
              >
                <Package className="w-5 h-5" />
                {loading ? "Processing..." : "Redeem Physical Item"}
              </Button>
            )}
            {!product.isOwner && isListed && (
              <Button
                size="lg"
                variant="outline"
                className="flex-1 bg-transparent"
                onClick={handleBuy}
                disabled={loading}
              >
                Make Offer
              </Button>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold">Description</h3>
          <p className="text-muted-foreground leading-relaxed">
            {product.description}
          </p>
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold">Attributes</h3>
          <div className="grid grid-cols-2 gap-3">
            {product.attributes.map((attr, index) => (
              <div
                key={index}
                className="p-3 bg-secondary/50 rounded-lg border border-border"
              >
                <p className="text-xs text-muted-foreground mb-1">
                  {attr.trait}
                </p>
                <p className="font-medium">{attr.value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold">Details</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b border-border">
              <span className="text-muted-foreground">Owner</span>
              <Link
                href={`/profile/${product.owner}`}
                className="font-mono text-sm hover:text-primary"
              >
                {product.owner}
              </Link>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-border">
              <span className="text-muted-foreground">Item Address</span>
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm">
                  {product.mintAddress.slice(0, 8)}...
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={() =>
                    window.open(
                      `https://explorer.solana.com/address/${product.mintAddress}?cluster=devnet`,
                      "_blank"
                    )
                  }
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
