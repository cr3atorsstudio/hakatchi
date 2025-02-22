import type { Metadata } from "next";
import { DotGothic16 } from "next/font/google";
import "./globals.css";
import { ChakraUiProvider } from "@/components/app/ChakraUiProvider";
import { HomeContainer } from "@/components/features/HomeContainer";
import { PrivyProvider } from "@/components/app/PrivyProvider";
import { WalletProviders } from "@/components/app/WalletProviders";

const dotGothic16 = DotGothic16({
  subsets: ["latin"],
  weight: ["400"],
});

export const metadata: Metadata = {
  title: "Hakatchi",
  description: "this is GameFi created by creator's studio",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${dotGothic16.className}`}>
        <ChakraUiProvider>
          <WalletProviders>
            {/* <PrivyProvider> */}
            <HomeContainer>{children}</HomeContainer>
            {/* </ PrivyProvider> */}
          </WalletProviders>
        </ChakraUiProvider>
      </body>
    </html>
  );
}
