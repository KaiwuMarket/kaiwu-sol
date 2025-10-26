"use client";

import { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { Package, Loader2, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useSolanaEvents } from "@/hooks/use-solana-events";
import { useMarketplace } from "@/hooks/use-marketplace";
import { useToast } from "@/hooks/use-toast";

export default function MarketplacePage() {
  const { connected, publicKey } = useWallet();
  const { buyItem } = useMarketplace();
  const { useListedItems } = useSolanaEvents();
  const { toast } = useToast();
  const [buyingItem, setBuyingItem] = useState<number | null>(null);

  // 获取所有上架的商品
  const {
    items: listedItems,
    loading: itemsLoading,
    error: itemsError,
  } = useListedItems();

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

  // 生成SKU(基于itemId)
  const getItemSku = (itemId: number) => {
    return `PSA-${String(itemId).padStart(5, "0")}`;
  };

  const handleBuyItem = async (itemId: number) => {
    if (!connected) {
      toast({
        title: "请先连接钱包",
        description: "您需要连接钱包才能购买商品",
        variant: "destructive",
      });
      return;
    }

    setBuyingItem(itemId);
    try {
      console.log("Buying item:", itemId);

      await buyItem(itemId);

      toast({
        title: "购买成功！",
        description: `${getItemName(itemId)} 已成功购买`,
      });

      // 刷新商品列表
      window.location.reload();
    } catch (error: any) {
      console.error("Buying error:", error);
      toast({
        title: "购买失败",
        description: error.message || "商品购买失败，请重试",
        variant: "destructive",
      });
    } finally {
      setBuyingItem(null);
    }
  };

  if (itemsLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex items-center gap-2">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>正在加载市场商品...</span>
        </div>
      </div>
    );
  }

  if (itemsError) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="p-8 text-center max-w-md">
          <h2 className="text-2xl font-bold mb-2">加载市场失败</h2>
          <p className="text-muted-foreground mb-4">{itemsError}</p>
          <Button onClick={() => window.location.reload()}>重试</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">市场</h1>
        <p className="text-muted-foreground">
          浏览和交易Solana上的Pokemon卡片NFT
        </p>
      </div>

      {listedItems.length === 0 ? (
        <div className="text-center py-12">
          <Package className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-2">市场为空</h3>
          <p className="text-muted-foreground">目前没有商品在市场上销售</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {listedItems.map((item) => (
            <Card
              key={item.itemId}
              className="p-6 hover:shadow-lg transition-shadow"
            >
              <div className="aspect-square bg-secondary rounded-lg mb-4 flex items-center justify-center overflow-hidden">
                <img
                  src={getItemImage(item.itemId)}
                  alt={getItemName(item.itemId)}
                  className="w-full h-full object-contain p-2"
                />
              </div>
              <h3 className="font-semibold mb-2 truncate text-lg">
                {getItemName(item.itemId)}
              </h3>
              <p className="text-sm text-muted-foreground mb-3">
                SKU: {getItemSku(item.itemId)}
              </p>
              <div className="text-2xl font-bold text-primary mb-4">
                {item.priceSOL} SOL
              </div>
              <Button
                className="w-full"
                onClick={() => handleBuyItem(item.itemId)}
                disabled={buyingItem === item.itemId || !connected}
              >
                {buyingItem === item.itemId ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    购买中...
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    {connected ? "立即购买" : "连接钱包购买"}
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
