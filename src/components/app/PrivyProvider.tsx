"use client";

import { PrivyProvider as Provider } from "@privy-io/react-auth";
import { ReactNode } from "react";

type ProviderProps = {
  children: ReactNode;
};

export const PrivyProvider = ({ children }: ProviderProps) => {
  return (
    <Provider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID || ""}
      config={{
        // Customize Privy's appearance in your app
        appearance: {
          theme: "light",
          accentColor: "#676FFF",
          logo: "https://hakatchi.vercel.app/logo.png",
        },
        // Create embedded wallets for users who don't have a wallet
        embeddedWallets: {
          createOnLogin: "users-without-wallets",
        },
      }}
    >
      {children}
    </Provider>
  );
};
