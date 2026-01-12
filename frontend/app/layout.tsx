import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "YudiSwap | Decentralized Exchange on Supra Network",
  description: "The leading DEX on Supra Network. Swap tokens with lightning-fast speed, add liquidity to pools, and earn rewards.",
  keywords: ["DEX", "Supra", "Swap", "DeFi", "Web3", "Move", "Liquidity"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                const theme = localStorage.getItem('theme') || 'dark';
                document.documentElement.setAttribute('data-theme', theme);
              })();
            `,
          }}
        />
      </head>
      <body className={inter.variable}>
        {children}
      </body>
    </html>
  );
}
