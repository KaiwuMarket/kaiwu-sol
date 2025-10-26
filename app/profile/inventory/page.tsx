"use client";

import type React from "react";

import { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { Package, Plus, List, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useMarketplace } from "@/hooks/use-marketplace";
import { useSolanaEvents } from "@/hooks/use-solana-events";
import { useToast } from "@/hooks/use-toast";

export default function InventoryPage() {
  const { connected, publicKey } = useWallet();
  const { listItem, delistItem, intakeItem } = useMarketplace();
  const { useUserItems } = useSolanaEvents();
  const { toast } = useToast();
  const [isIntaking, setIsIntaking] = useState(false);
  const [isListing, setIsListing] = useState(false);
  const [selectedItem, setSelectedItem] = useState<number | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // 获取用户拥有的商品
  const {
    items: userItems,
    loading: itemsLoading,
    error: itemsError,
    refetch: refetchItems,
  } = useUserItems(publicKey || undefined);

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

  const handleIntakeItem = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsIntaking(true);

    try {
      const formData = new FormData(e.currentTarget);
      const sku = formData.get("sku") as string;
      const name = formData.get("name") as string;
      const vault = formData.get("vault") as string;

      // 生成一个唯一的itemId (使用时间戳确保唯一性)
      const itemId =
        Math.floor(Date.now() / 1000) + Math.floor(Math.random() * 1000);

      console.log("Creating item:", { itemId, sku, vault, name });

      await intakeItem(itemId, sku, vault, publicKey!);

      toast({
        title: "商品创建成功！",
        description: `${name} 已成功添加到金库中`,
      });

      // 重置表单
      e.currentTarget.reset();

      // 刷新用户商品列表
      refetchItems();

      // 关闭弹窗
      setIsCreateOpen(false);
    } catch (error: any) {
      console.error("Intake error:", error);
      toast({
        title: "创建失败",
        description: error.message || "商品创建失败，请重试",
        variant: "destructive",
      });
    } finally {
      setIsIntaking(false);
    }
  };

  const handleListItem = async (itemId: number, price: number) => {
    setIsListing(true);
    try {
      console.log("Listing item:", { itemId, price });

      await listItem(itemId, price, 30); // List for 30 days

      toast({
        title: "商品上架成功！",
        description: `${getItemName(itemId)} 已成功上架销售`,
      });

      // 刷新用户商品列表
      refetchItems();
    } catch (error: any) {
      console.error("Listing error:", error);
      toast({
        title: "上架失败",
        description: error.message || "商品上架失败，请重试",
        variant: "destructive",
      });
    } finally {
      setIsListing(false);
      setSelectedItem(null);
    }
  };

  const handleDelistItem = async (itemId: number) => {
    try {
      console.log("Delisting item:", itemId);

      await delistItem(itemId);

      toast({
        title: "商品下架成功！",
        description: `${getItemName(itemId)} 已从市场下架`,
      });

      // 刷新用户商品列表
      refetchItems();
    } catch (error: any) {
      console.error("Delisting error:", error);
      toast({
        title: "下架失败",
        description: error.message || "商品下架失败，请重试",
        variant: "destructive",
      });
    }
  };

  // 分类用户商品
  const vaultItems = userItems.filter(
    (item) => item.status.inVault !== undefined
  );
  const listedItems = userItems.filter(
    (item) => item.status.listed !== undefined
  );

  if (!connected) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="p-8 text-center max-w-md">
          <Package className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <h2 className="text-2xl font-bold mb-2">连接钱包</h2>
          <p className="text-muted-foreground">请连接您的钱包来管理库存</p>
        </Card>
      </div>
    );
  }

  // 不再阻止UI，改为在页面内显示加载状态

  if (itemsError) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="p-8 text-center max-w-md">
          <h2 className="text-2xl font-bold mb-2">加载库存失败</h2>
          <p className="text-muted-foreground mb-4">{itemsError}</p>
          <Button onClick={() => window.location.reload()}>重试</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-8 max-w-7xl">
      {/* 头部区域 */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">我的库存</h1>
          <p className="text-muted-foreground">
            管理您的商品：创建、上架和下架
          </p>
          {itemsLoading && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>正在加载库存，您可以继续操作...</span>
            </div>
          )}
        </div>

        {/* 创建商品按钮 */}
        <Sheet open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <SheetTrigger asChild>
            <Button size="lg">
              <Plus className="w-5 h-5 mr-2" />
              创建商品
            </Button>
          </SheetTrigger>
          <SheetContent className="w-full sm:max-w-2xl">
            <SheetHeader>
              <SheetTitle>创建新商品</SheetTitle>
            </SheetHeader>
            <div className="mt-6">
              <form onSubmit={handleIntakeItem} className="space-y-4">
                <div>
                  <Label htmlFor="sku">SKU / 商品代码</Label>
                  <Input
                    id="sku"
                    name="sku"
                    placeholder="例如: PSA-12345"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="name">商品名称</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="例如: 2025 Pokemon Card PSA 10"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="vault">金库位置</Label>
                  <Input
                    id="vault"
                    name="vault"
                    placeholder="例如: Vault A-123"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="description">商品描述</Label>
                  <Input
                    id="description"
                    name="description"
                    placeholder="商品描述（可选）"
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isIntaking}>
                  {isIntaking ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      创建中...
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4 mr-2" />
                      创建商品
                    </>
                  )}
                </Button>
              </form>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <Tabs defaultValue="vault" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="vault">金库中 ({vaultItems.length})</TabsTrigger>
          <TabsTrigger value="listed">
            已上架 ({listedItems.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="vault" className="space-y-4">
          {vaultItems.length === 0 ? (
            <div className="text-center py-12">
              <Package className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">金库为空</h3>
              <p className="text-muted-foreground">您还没有任何商品在金库中</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {vaultItems.map((item) => (
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
                  <p className="text-sm text-muted-foreground mb-4">
                    SKU: {getItemSku(item.itemId)}
                  </p>
                  <Button
                    className="w-full"
                    onClick={() => setSelectedItem(item.itemId)}
                    disabled={selectedItem === item.itemId}
                  >
                    <List className="w-4 h-4 mr-2" />
                    上架销售
                  </Button>

                  {selectedItem === item.itemId && (
                    <div className="mt-4 p-4 bg-secondary rounded-lg space-y-3 border border-border">
                      <Label htmlFor={`price-${item.itemId}`}>价格 (SOL)</Label>
                      <Input
                        id={`price-${item.itemId}`}
                        type="number"
                        step="0.1"
                        placeholder="0.0"
                        defaultValue="10"
                      />
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          className="flex-1"
                          onClick={() => {
                            const input = document.getElementById(
                              `price-${item.itemId}`
                            ) as HTMLInputElement;
                            handleListItem(
                              item.itemId,
                              Number.parseFloat(input.value)
                            );
                          }}
                          disabled={isListing}
                        >
                          {isListing ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            "确认上架"
                          )}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setSelectedItem(null)}
                        >
                          取消
                        </Button>
                      </div>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="listed" className="space-y-4">
          {listedItems.length === 0 ? (
            <div className="text-center py-12">
              <Package className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">没有上架商品</h3>
              <p className="text-muted-foreground">
                您还没有任何商品在市场上销售
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                    {item.listing?.priceSOL || 0} SOL
                  </div>
                  <Button
                    variant="destructive"
                    className="w-full"
                    onClick={() => handleDelistItem(item.itemId)}
                  >
                    <X className="w-4 h-4 mr-2" />
                    下架商品
                  </Button>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
