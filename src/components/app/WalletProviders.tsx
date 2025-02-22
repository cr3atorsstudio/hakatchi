"use client";

import { ReactNode } from "react";
import "@rainbow-me/rainbowkit/styles.css";

import { getDefaultConfig, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { WagmiProvider } from "wagmi";
import { mainnet, polygon, optimism, arbitrum, base } from "wagmi/chains";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

const config = getDefaultConfig({
  appName: "Hakatchi",
  projectId: process.env.NEXT_PUBLIC_WALLET_PROJECT_ID || "",
  chains: [mainnet, polygon, optimism, arbitrum, base],
  // ssr: true,
});

export const WalletProviders = ({ children }: { children: ReactNode }) => {
  const queryClient = new QueryClient();

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>{children}</RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};
