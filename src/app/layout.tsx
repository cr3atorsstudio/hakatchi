import { ChakraUiProvider } from "@/components/app/ChakraUiProvider";
import { PrivyProvider } from "@/components/app/PrivyProvider";
import { HomeContainer } from "@/components/features/HomeContainer";
import type { Metadata } from "next";
import { DotGothic16 } from "next/font/google";
import { ReactNode } from "react";
import { GraveProvider } from "./contexts/GraveContext";
import "./globals.css";

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
  children: ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${dotGothic16.className}`}>
        <ChakraUiProvider>
          <PrivyProvider>
            <GraveProvider>
              <HomeContainer>{children}</HomeContainer>
            </GraveProvider>
          </PrivyProvider>
        </ChakraUiProvider>
      </body>
    </html>
  );
}
