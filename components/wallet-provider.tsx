"use client";

import type React from "react";
import { useEffect, useState, createContext } from "react";

// Mock wallet context for preview environment
const MockWalletContext = createContext<any>({
  publicKey: null,
  connected: false,
  connecting: false,
  disconnecting: false,
  wallet: null,
  wallets: [],
  select: () => {},
  connect: async () => {},
  disconnect: async () => {},
  sendTransaction: async () => "",
  signTransaction: undefined,
  signAllTransactions: undefined,
  signMessage: undefined,
});

function MockWalletProvider({ children }: { children: React.ReactNode }) {
  return (
    <MockWalletContext.Provider
      value={{
        publicKey: null,
        connected: false,
        connecting: false,
        disconnecting: false,
        wallet: null,
        wallets: [],
        select: () => {},
        connect: async () => {},
        disconnect: async () => {},
        sendTransaction: async () => "",
        signTransaction: undefined,
        signAllTransactions: undefined,
        signMessage: undefined,
      }}
    >
      {children}
    </MockWalletContext.Provider>
  );
}

export function SolanaWalletProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isPreview, setIsPreview] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const inIframe = window.self !== window.top;
    const isPreviewUrl =
      window.location.hostname.includes("vusercontent.net") ||
      window.location.hostname.includes("v0.app");
    setIsPreview(inIframe || isPreviewUrl);
  }, []);

  if (!mounted || isPreview) {
    return <MockWalletProvider>{children}</MockWalletProvider>;
  }

  const {
    ConnectionProvider,
    WalletProvider,
  } = require("@solana/wallet-adapter-react");
  const { WalletModalProvider } = require("@solana/wallet-adapter-react-ui");
  const { clusterApiUrl } = require("@solana/web3.js");
  const {
    PhantomWalletAdapter,
    SolflareWalletAdapter,
  } = require("@solana/wallet-adapter-wallets");

  require("@solana/wallet-adapter-react-ui/styles.css");

  const endpoint = clusterApiUrl("devnet");
  const wallets = [new PhantomWalletAdapter(), new SolflareWalletAdapter()];

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect={false}>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}
