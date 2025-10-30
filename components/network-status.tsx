"use client";

import { useState, useEffect } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { Wifi, WifiOff, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function NetworkStatus() {
  const { connection } = useConnection();
  const { connected } = useWallet();
  const [isOnline, setIsOnline] = useState(true);
  const [isSolanaOnline, setIsSolanaOnline] = useState(true);
  const [solanaVersion, setSolanaVersion] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Check network connection status
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Check Solana network status - with timeout protection
    const checkSolanaStatus = async () => {
      if (!connection) return;

      try {
        // Set a timeout to avoid blocking
        const version = await Promise.race([
          connection.getVersion(),
          new Promise<any>((_, reject) =>
            setTimeout(() => reject(new Error("Connection timeout")), 5000)
          ),
        ]);

        if (
          version &&
          typeof version === "object" &&
          "solana-core" in version
        ) {
          setSolanaVersion(version["solana-core"] as string);
        }
        setIsSolanaOnline(true);
      } catch (error) {
        console.warn("Solana connection check failed:", error);
        setIsSolanaOnline(false);
      }
    };

    checkSolanaStatus();
    const interval = setInterval(checkSolanaStatus, 30000); // Check every 30 seconds

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      clearInterval(interval);
    };
  }, [connection]);

  // Don't hide when not connected, let the user know the status
  if (!mounted) return null;

  return (
    <div className="flex items-center gap-2">
      {isOnline && isSolanaOnline ? (
        <Badge variant="secondary" className="flex items-center gap-1">
          <Wifi className="w-3 h-3" />
          <span>Connected</span>
        </Badge>
      ) : (
        <Badge variant="destructive" className="flex items-center gap-1">
          <WifiOff className="w-3 h-3" />
          <span>Disconnected</span>
        </Badge>
      )}

      {solanaVersion && (
        <Badge variant="outline" className="text-xs">
          Solana {solanaVersion}
        </Badge>
      )}
    </div>
  );
}

export function TransactionStatus({
  signature,
  onComplete,
}: {
  signature?: string;
  onComplete?: () => void;
}) {
  const { connection } = useConnection();
  const [status, setStatus] = useState<
    "pending" | "confirmed" | "finalized" | "error"
  >("pending");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!signature) return;

    const checkStatus = async () => {
      try {
        const { value } = await connection.getSignatureStatus(signature, {
          searchTransactionHistory: true,
        });

        if (value?.err) {
          setStatus("error");
          setError(value.err.toString());
          onComplete?.();
        } else if (value?.confirmationStatus === "confirmed") {
          setStatus("confirmed");
        } else if (value?.confirmationStatus === "finalized") {
          setStatus("finalized");
          onComplete?.();
        }
      } catch (err) {
        setStatus("error");
        setError(err instanceof Error ? err.message : "Unknown error");
        onComplete?.();
      }
    };

    const interval = setInterval(checkStatus, 2000);
    checkStatus();

    return () => clearInterval(interval);
  }, [signature, connection, onComplete]);

  if (!signature) return null;

  return (
    <div className="flex items-center gap-2">
      {status === "pending" && (
        <Badge variant="secondary" className="flex items-center gap-1">
          <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />
          <span>Pending</span>
        </Badge>
      )}

      {status === "confirmed" && (
        <Badge variant="default" className="flex items-center gap-1">
          <div className="w-2 h-2 bg-green-500 rounded-full" />
          <span>Confirmed</span>
        </Badge>
      )}

      {status === "finalized" && (
        <Badge variant="default" className="flex items-center gap-1">
          <div className="w-2 h-2 bg-green-500 rounded-full" />
          <span>Finalized</span>
        </Badge>
      )}

      {status === "error" && (
        <Badge variant="destructive" className="flex items-center gap-1">
          <AlertCircle className="w-3 h-3" />
          <span>Failed</span>
        </Badge>
      )}

      <Button
        variant="ghost"
        size="sm"
        className="h-6 px-2 text-xs"
        onClick={() =>
          window.open(
            `https://explorer.solana.com/tx/${signature}?cluster=devnet`,
            "_blank"
          )
        }
      >
        View on Explorer
      </Button>
    </div>
  );
}
