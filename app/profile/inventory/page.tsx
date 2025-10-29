"use client";

import { useEffect, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { Loader2, Package, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useOnchainData, OnchainItem } from "@/hooks/use-onchain-data";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

function InventoryItemCard({ item }: { item: OnchainItem }) {
  // This component can be used for both listed and unlisted items
  return (
    <Card className="hover:shadow-lg transition-shadow flex flex-col">
      <Link href={`/product/${item.itemId}`} className="flex flex-col h-full">
        <div className="aspect-square bg-secondary rounded-t-lg flex items-center justify-center overflow-hidden">
          <img src={item.image} alt={item.name} className="w-full h-full object-contain p-2" />
        </div>
        <div className="p-4 flex-grow flex flex-col">
          <h3 className="font-semibold mb-2 truncate text-lg flex-grow">{item.name}</h3>
          <div className="flex justify-between items-center">
             <span className={`text-sm capitalize px-2 py-1 rounded ${item.status === 'listed' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                {item.status === 'listed' ? 'Listed' : 'In Wallet'}
             </span>
             {item.listing && (
                <span className="text-lg font-bold text-primary">{item.listing.priceSol.toFixed(2)} SOL</span>
             )}
          </div>
        </div>
      </Link>
    </Card>
  );
}

export default function InventoryPage() {
  const { connected, publicKey } = useWallet();
  const { loading, error, fetchUserInventory } = useOnchainData();
  const [items, setItems] = useState<OnchainItem[]>([]);

  useEffect(() => {
    if (connected && publicKey) {
      fetchUserInventory(publicKey).then(setItems);
    }
  }, [connected, publicKey, fetchUserInventory]);

  if (!connected) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="p-8 text-center max-w-md">
          <Package className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <h2 className="text-2xl font-bold mb-2">Connect Wallet</h2>
          <p className="text-muted-foreground">Please connect your wallet to manage your inventory.</p>
        </Card>
      </div>
    );
  }

  const listedItems = items.filter(item => item.status === 'listed');
  const inVaultItems = items.filter(item => item.status === 'inVault');

  return (
    <div className="container mx-auto px-6 py-8 max-w-7xl">
       <div className="mb-8">
        <Link href="/profile" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4">
          <ArrowLeft className="w-4 h-4" />
          Back to Profile
        </Link>
        <h1 className="text-4xl font-bold mb-2">My Inventory</h1>
        <p className="text-muted-foreground">Items you own that are in your wallet or listed for sale.</p>
      </div>

      {loading ? (
         <div className="flex items-center justify-center min-h-[40vh]"><Loader2 className="w-8 h-8 animate-spin" /></div>
      ) : error ? (
        <div className="text-center py-12"><p className="text-destructive">Failed to load inventory: {error.message}</p></div>
      ) : (
        <Tabs defaultValue="vault" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="vault">In Wallet ({inVaultItems.length})</TabsTrigger>
            <TabsTrigger value="listed">Listed ({listedItems.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="vault">
            {inVaultItems.length === 0 ? (
                <div className="text-center py-12"><h3 className="text-lg font-semibold">Your wallet is empty.</h3></div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {inVaultItems.map(item => <InventoryItemCard key={item.pda} item={item} />)}
                </div>
            )}
          </TabsContent>
          <TabsContent value="listed">
          {listedItems.length === 0 ? (
                <div className="text-center py-12"><h3 className="text-lg font-semibold">You have no items listed for sale.</h3></div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {listedItems.map(item => <InventoryItemCard key={item.pda} item={item} />)}
                </div>
            )}
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
