"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useOnchainData, OnchainItem } from "@/hooks/use-onchain-data";
import { Loader2 } from "lucide-react";

export function RelatedProducts() {
  const { fetchAllListedItems, loading } = useOnchainData();
  const [relatedItems, setRelatedItems] = useState<OnchainItem[]>([]);

  useEffect(() => {
    fetchAllListedItems().then((items) => {
      // Get first 3 items, or all if less than 3
      setRelatedItems(items.slice(0, 3));
    });
  }, [fetchAllListedItems]);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Related Toys</h2>
      {loading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin" />
        </div>
      ) : (
        <div className="space-y-4">
          {relatedItems.map((item) => (
            <Link key={item.pda} href={`/product/${item.itemId}`} className="block group">
              <div className="flex gap-4 p-4 bg-card border border-border rounded-lg hover:border-muted transition-colors">
                <div className="w-20 h-28 flex-shrink-0 bg-secondary/50 rounded overflow-hidden">
                  <img
                    src={item.image || "/placeholder.svg"}
                    alt={item.name}
                    className="w-full h-full object-contain p-2"
                  />
                </div>
                <div className="flex-1 flex flex-col justify-between py-1">
                  <div>
                    <h3 className="font-semibold mb-1 line-clamp-2">{item.name}</h3>
                  </div>
                  {item.listing && (
                     <p className="font-bold">{item.listing.priceSol.toFixed(2)} SOL</p>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
