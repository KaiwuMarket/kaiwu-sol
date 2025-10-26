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
import { useMarketplace } from "@/hooks/use-marketplace";
import { useSolanaEvents } from "@/hooks/use-solana-events";
import { useToast } from "@/hooks/use-toast";

export default function InventoryPage() {
  const wallet = useWallet();
  const { connected, publicKey } = wallet || { connected: false, publicKey: null };
  const { listItem, delistItem, intakeItem } = useMarketplace();
  const { useUserItems } = useSolanaEvents();
  const { toast } = useToast();
  const [isIntaking, setIsIntaking] = useState(false);
  const [isListing, setIsListing] = useState(false);
  const [selectedItem, setSelectedItem] = useState<number | null>(null);

  // 获取用户拥有的商品
  const {
    items: userItems,
    loading: itemsLoading,
    error: itemsError,
  } = useUserItems(publicKey);

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

      // 生成一个唯一的itemId (实际应用中应该从后端获取)
      const itemId = Date.now() % 1000000;

      await intakeItem(itemId, sku, vault, publicKey!);

      toast({
        title: "Item Intaked Successfully!",
        description: `${name} has been added to the vault.`,
      });

      // 重置表单
      e.currentTarget.reset();
    } catch (error: any) {
      toast({
        title: "Intake Failed",
        description: error.message || "Failed to intake item",
        variant: "destructive",
      });
    } finally {
      setIsIntaking(false);
    }
  };

  const handleListItem = async (itemId: number, price: number) => {
    setIsListing(true);
    try {
      await listItem(itemId, price, 30); // List for 30 days

      toast({
        title: "Item Listed Successfully!",
        description: `${getItemName(itemId)} is now available for purchase.`,
      });
    } catch (error: any) {
      toast({
        title: "Listing Failed",
        description: error.message || "Failed to list item",
        variant: "destructive",
      });
    } finally {
      setIsListing(false);
      setSelectedItem(null);
    }
  };

  const handleDelistItem = async (itemId: number) => {
    try {
      await delistItem(itemId);

      toast({
        title: "Item Delisted Successfully!",
        description: `${getItemName(
          itemId
        )} has been removed from the marketplace.`,
      });
    } catch (error: any) {
      toast({
        title: "Delisting Failed",
        description: error.message || "Failed to delist item",
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
          <h2 className="text-2xl font-bold mb-2">Connect Your Wallet</h2>
          <p className="text-muted-foreground">
            Please connect your wallet to manage your inventory.
          </p>
        </Card>
      </div>
    );
  }

  if (itemsLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex items-center gap-2">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>Loading your inventory...</span>
        </div>
      </div>
    );
  }

  if (itemsError) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="p-8 text-center max-w-md">
          <h2 className="text-2xl font-bold mb-2">Failed to Load Inventory</h2>
          <p className="text-muted-foreground mb-4">{itemsError}</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-2">My Inventory</h1>
        <p className="text-muted-foreground">
          Manage your items: intake, list, and delist
        </p>
      </div>

      <Tabs defaultValue="vault" className="w-full">
        <TabsList>
          <TabsTrigger value="vault">
            In Vault ({vaultItems.length})
          </TabsTrigger>
          <TabsTrigger value="listed">
            Listed ({listedItems.length})
          </TabsTrigger>
          <TabsTrigger value="intake">Intake New Item</TabsTrigger>
        </TabsList>

        <TabsContent value="vault" className="space-y-4">
          {vaultItems.length === 0 ? (
            <div className="text-center py-12">
              <Package className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No Items in Vault</h3>
              <p className="text-muted-foreground">
                You don't have any items in your vault yet.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {vaultItems.map((item) => (
                <Card key={item.itemId} className="p-4">
                  <div className="aspect-square bg-secondary rounded-lg mb-4 flex items-center justify-center overflow-hidden">
                    <img
                      src={getItemImage(item.itemId)}
                      alt={getItemName(item.itemId)}
                      className="w-full h-full object-contain p-2"
                    />
                  </div>
                  <h3 className="font-semibold mb-1 truncate">
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
                    List for Sale
                  </Button>

                  {selectedItem === item.itemId && (
                    <div className="mt-4 p-4 bg-secondary rounded-lg space-y-3">
                      <Label htmlFor={`price-${item.itemId}`}>
                        Price (SOL)
                      </Label>
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
                            "Confirm"
                          )}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setSelectedItem(null)}
                        >
                          Cancel
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
              <h3 className="text-lg font-semibold mb-2">No Listed Items</h3>
              <p className="text-muted-foreground">
                You don't have any items listed for sale.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {listedItems.map((item) => (
                <Card key={item.itemId} className="p-4">
                  <div className="aspect-square bg-secondary rounded-lg mb-4 flex items-center justify-center overflow-hidden">
                    <img
                      src={getItemImage(item.itemId)}
                      alt={getItemName(item.itemId)}
                      className="w-full h-full object-contain p-2"
                    />
                  </div>
                  <h3 className="font-semibold mb-1 truncate">
                    {getItemName(item.itemId)}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    SKU: {getItemSku(item.itemId)}
                  </p>
                  <div className="text-lg font-bold text-primary mb-4">
                    {item.listing?.priceSOL || 0} SOL
                  </div>
                  <Button
                    variant="destructive"
                    className="w-full"
                    onClick={() => handleDelistItem(item.itemId)}
                  >
                    <X className="w-4 h-4 mr-2" />
                    Delist Item
                  </Button>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="intake">
          <Card className="p-6 max-w-2xl">
            <h2 className="text-2xl font-bold mb-6">Intake New Item</h2>
            <form onSubmit={handleIntakeItem} className="space-y-4">
              <div>
                <Label htmlFor="sku">SKU / Item Code</Label>
                <Input id="sku" placeholder="e.g., PSA-12345" required />
              </div>
              <div>
                <Label htmlFor="name">Item Name</Label>
                <Input
                  id="name"
                  placeholder="e.g., 2025 Pokemon Card PSA 10"
                  required
                />
              </div>
              <div>
                <Label htmlFor="vault">Vault Location</Label>
                <Input id="vault" placeholder="e.g., Vault A-123" required />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Input id="description" placeholder="Item description" />
              </div>
              <Button type="submit" className="w-full" disabled={isIntaking}>
                {isIntaking ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-2" />
                    Intake Item
                  </>
                )}
              </Button>
            </form>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
