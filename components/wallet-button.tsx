"use client";

import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { Wallet, AlertCircle } from "lucide-react";
import { useEffect, useState } from "react";

export function WalletButton({ collapsed = false }: { collapsed?: boolean }) {
  const { connected, publicKey } = useWallet();
  const [isPreview, setIsPreview] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const inIframe = window.self !== window.top;
    const isPreviewUrl =
      window.location.hostname.includes("vusercontent.net") ||
      window.location.hostname.includes("v0.app");
    setIsPreview(inIframe || isPreviewUrl);
  }, []);

  // Prevent SSR hydration errors
  if (!mounted) {
    return collapsed ? (
      <div className="h-10 w-10 flex items-center justify-center bg-muted/50 border border-border rounded-lg">
        <div className="w-4 h-4" />
      </div>
    ) : (
      <div className="h-10 w-[180px] flex items-center gap-2 justify-center bg-muted/50 border border-border rounded-lg">
        <div className="w-4 h-4" />
        <div className="text-sm font-medium">Connecting...</div>
      </div>
    );
  }

  if (isPreview && !collapsed) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 bg-muted/50 border border-border rounded-lg text-xs text-muted-foreground">
        <AlertCircle className="w-3 h-3" />
        <span>Wallet available in production</span>
      </div>
    );
  }

  if (isPreview && collapsed) {
    return (
      <button
        disabled
        className="bg-muted/50 border border-border text-muted-foreground h-10 w-10 p-0 rounded-lg text-sm font-medium flex items-center justify-center cursor-not-allowed"
      >
        <Wallet className="w-4 h-4" />
      </button>
    );
  }

  if (collapsed) {
    return (
      <WalletMultiButton className="!bg-primary !text-primary-foreground hover:!bg-primary/90 !h-10 !w-10 !p-0 !rounded-lg !text-sm !font-medium !flex !items-center !justify-center">
        <Wallet className="w-4 h-4" />
      </WalletMultiButton>
    );
  }

  if (connected && publicKey) {
    return (
      <div className="flex items-center gap-2">
        <div className="px-3 py-2 bg-secondary rounded-lg text-sm font-mono">
          {publicKey.toString().slice(0, 4)}...{publicKey.toString().slice(-4)}
        </div>
        <WalletMultiButton className="!bg-transparent !border !border-border hover:!bg-secondary !h-10 !px-4 !rounded-lg !text-sm !font-medium" />
      </div>
    );
  }

  return (
    <WalletMultiButton className="!bg-primary !text-primary-foreground hover:!bg-primary/90 !h-10 !px-4 !rounded-lg !text-sm !font-medium !flex !items-center !gap-2">
      <Wallet className="w-4 h-4" />
      Connect Wallet
    </WalletMultiButton>
  );
}
