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

  useEffect(() => {
    // 检查网络连接状态
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // 检查Solana网络状态
    const checkSolanaStatus = async () => {
      try {
        const version = await connection.getVersion();
        setSolanaVersion(version["solana-core"]);
        setIsSolanaOnline(true);
      } catch (error) {
        console.error("Solana connection error:", error);
        setIsSolanaOnline(false);
      }
    };

    checkSolanaStatus();
    const interval = setInterval(checkSolanaStatus, 30000); // 每30秒检查一次

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      clearInterval(interval);
    };
  }, [connection]);

  if (!connected) return null;

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
