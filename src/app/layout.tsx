import type { Metadata } from "next";
import { DotGothic16 } from "next/font/google";
import "./globals.css";
import { Provider } from "@/components/ui/provider";
import { HomeContainer } from "@/components/features/HomeContainer";

const dotGothic16 = DotGothic16({
  subsets: ["latin"],
  weight: ["400"],
});

export const metadata: Metadata = {
  title: "Hakatchi",
  description: "this is gameFi created by creator's studio",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${dotGothic16.className}`}>
        <Provider>
          <HomeContainer>{children}</HomeContainer>
        </Provider>
      </body>
    </html>
  );
}
