"use client";

import { useEffect, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { Package, Loader2, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useOnchainData, OnchainItem } from "@/hooks/use-onchain-data";
import { useMarketplace } from "@/hooks/use-marketplace";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";

export default function MarketplacePage() {
  const { connected } = useWallet();
  const { buyItem } = useMarketplace();
  const {
    loading: itemsLoading,
    error: itemsError,
    fetchAllListedItems,
  } = useOnchainData();
  const { toast } = useToast();
  const [buyingItem, setBuyingItem] = useState<string | null>(null);
  const [items, setItems] = useState<OnchainItem[]>([]);

  useEffect(() => {
    fetchAllListedItems().then(setItems);
  }, [fetchAllListedItems]);


  const handleBuyItem = async (item: OnchainItem) => {
    if (!connected) {
      toast({
        title: "Please Connect Your Wallet",
        description: "You need to connect your wallet to buy items",
        variant: "destructive",
      });
      return;
    }

    setBuyingItem(item.itemId);
    try {
      await buyItem(Number.parseInt(item.itemId));

      toast({
        title: "Purchase Successful!",
        description: `${item.name} has been purchased successfully`,
      });

      // 重新获取最新商品列表
      fetchAllListedItems().then(setItems);
    } catch (error: any) {
      console.error("Buying error:", error);
      toast({
        title: "Purchase Failed",
        description: error.message || "Failed to purchase item, please try again",
        variant: "destructive",
      });
    } finally {
      setBuyingItem(null);
    }
  };

  if (itemsLoading && items.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex items-center gap-2">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>Loading marketplace items...</span>
        </div>
      </div>
    );
  }

  if (itemsError) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="p-8 text-center max-w-md">
          <h2 className="text-2xl font-bold mb-2">Failed to Load Marketplace</h2>
          <p className="text-muted-foreground mb-4">{itemsError.message}</p>
          <Button onClick={() => fetchAllListedItems().then(setItems)}>
            Retry
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Marketplace</h1>
        <p className="text-muted-foreground">
          Browse and trade Popmart collectible toy NFTs on Solana
        </p>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-12">
          <Package className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-2">Marketplace is Empty</h3>
          <p className="text-muted-foreground">There are currently no items for sale in the marketplace</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {items.map((item) => (
            <Card
              key={item.pda}
              className="p-6 hover:shadow-lg transition-shadow flex flex-col"
            >
              <Link
                href={`/product/${item.itemId}`}
                className="flex flex-col h-full"
              >
                <div className="aspect-square bg-secondary rounded-lg mb-4 flex items-center justify-center overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-contain p-2"
                  />
                </div>
                <div className="flex-grow">
                  <h3 className="font-semibold mb-2 truncate text-lg">
                    {item.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Item ID: {item.itemId}
                  </p>
                </div>
                <div className="text-2xl font-bold text-primary mb-4">
                  {item.listing?.priceSol.toFixed(2)} SOL
                </div>
              </Link>
              <Button
                className="w-full"
                onClick={() => handleBuyItem(item)}
                disabled={buyingItem === item.itemId || !connected}
              >
                {buyingItem === item.itemId ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    {connected ? "Buy Now" : "Connect Wallet to Buy"}
                  </>
                )}
              </Button>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
