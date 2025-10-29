"use client";

import type React from "react";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { clusterApiUrl } from "@solana/web3.js";
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
} from "@solana/wallet-adapter-wallets";

// Import wallet adapter styles
import "@solana/wallet-adapter-react-ui/styles.css";

export function SolanaWalletProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const httpEndpoint =
    process.env.NEXT_PUBLIC_SOLANA_RPC ?? clusterApiUrl("devnet");

  const wsEndpoint = httpEndpoint.startsWith("http")
    ? httpEndpoint
        .replace("https://", "wss://")
        .replace("http://", "ws://")
    : undefined;

  const wallets = [new PhantomWalletAdapter(), new SolflareWalletAdapter()];

  console.log("🔗 Using RPC endpoint:", httpEndpoint);

  return (
    <ConnectionProvider
      endpoint={httpEndpoint}
      config={{
        commitment: "confirmed",
        confirmTransactionInitialTimeout: 60000,
      }}
      wsEndpoint={wsEndpoint}
    >
      <WalletProvider wallets={wallets} autoConnect={false}>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}
