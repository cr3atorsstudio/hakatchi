import type { Metadata } from "next";
import { DotGothic16 } from "next/font/google";
import "./globals.css";
import { ChakraUiProvider } from "@/components/app/ChakraUiProvider";
import { HomeContainer } from "@/components/features/HomeContainer";
import { ReactNode } from "react";
import ContextProvider from "@/context";
import { headers } from "next/headers";

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
  const cookies = headers().get("cookie");

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${dotGothic16.className}`}>
        <ChakraUiProvider>
          <ContextProvider cookies={cookies}>
            <HomeContainer>{children}</HomeContainer>
          </ContextProvider>
        </ChakraUiProvider>
      </body>
    </html>
  );
}
