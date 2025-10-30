"use client";

import { useEffect, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { Loader2, ShoppingCart, Truck, CheckCircle, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useOnchainData, OnchainItem } from "@/hooks/use-onchain-data";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useMarketplace } from "@/hooks/use-marketplace";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";


function PurchaseItemCard({ item }: { item: OnchainItem }) {
    const { redeemRequest } = useMarketplace();
    const { toast } = useToast();
    const [isRequesting, setIsRequesting] = useState(false);

    const handleRedeemRequest = async () => {
        setIsRequesting(true);
        try {
            await redeemRequest(Number.parseInt(item.itemId));
            toast({ title: "Redemption Requested!", description: "Your physical item will be shipped soon." });
            // Note: We might need a way to refetch data here
        } catch (e: any) {
            toast({ title: "Redemption Failed", description: e.message, variant: "destructive" });
        } finally {
            setIsRequesting(false);
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
          case "sold":
            return <Badge variant="secondary">Owned</Badge>
          case "redeemPending":
            return <Badge className="bg-yellow-100 text-yellow-800">Pending Delivery</Badge>
          case "redeemed":
            return <Badge className="bg-green-100 text-green-800">Delivered</Badge>
        }
      }

  return (
    <Card className="p-4">
        <div className="flex items-start gap-4">
             <Link href={`/product/${item.itemId}`} className="flex-shrink-0">
                <div className="w-32 h-32 bg-secondary rounded-lg flex items-center justify-center overflow-hidden">
                    <img src={item.image} alt={item.name} className="w-full h-full object-contain p-2" />
                </div>
            </Link>
            <div className="flex-1">
                 <div className="flex items-start justify-between mb-2">
                    <div>
                        <h3 className="text-lg font-semibold mb-1">{item.name}</h3>
                        <p className="text-sm text-muted-foreground">Item ID: {item.itemId}</p>
                    </div>
                   {getStatusBadge(item.status)}
                </div>
                {item.status === 'sold' && (
                    <Button onClick={handleRedeemRequest} disabled={isRequesting} size="sm">
                        {isRequesting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Truck className="w-4 h-4 mr-2" />}
                        Request Delivery
                    </Button>
                )}
                 {item.status === "redeemPending" && (
                  <div className="flex items-center gap-2 text-yellow-600"><Truck className="w-4 h-4" /><span className="text-sm">Awaiting confirmation...</span></div>
                )}
                {item.status === "redeemed" && (
                  <div className="flex items-center gap-2 text-green-600"><CheckCircle className="w-4 h-4" /><span className="text-sm">Delivered</span></div>
                )}
            </div>
        </div>
    </Card>
  );
}

export default function PurchasesPage() {
  const { connected, publicKey } = useWallet();
  const { loading, error, fetchUserPurchases } = useOnchainData();
  const [items, setItems] = useState<OnchainItem[]>([]);

  useEffect(() => {
    if (connected && publicKey) {
      fetchUserPurchases(publicKey).then(setItems);
    }
  }, [connected, publicKey, fetchUserPurchases]);

  return (
    <div className="container mx-auto px-6 py-8 max-w-7xl">
      <div className="mb-8">
        <Link href="/profile" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4">
          <ArrowLeft className="w-4 h-4" />
          Back to Profile
        </Link>
        <h1 className="text-4xl font-bold mb-2">My Purchases</h1>
        <p className="text-muted-foreground">Items you have successfully purchased from the marketplace.</p>
      </div>

       {loading ? (
        <div className="flex items-center justify-center min-h-[40vh]"><Loader2 className="w-8 h-8 animate-spin" /></div>
      ) : error ? (
        <div className="text-center py-12"><p className="text-destructive">Failed to load your purchases: {error.message}</p></div>
      ) : items.length === 0 ? (
        <div className="text-center py-12">
            <ShoppingCart className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold">You haven't purchased any items yet.</h3>
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((item) => <PurchaseItemCard key={item.pda} item={item} />)}
        </div>
      )}
    </div>
  );
}
