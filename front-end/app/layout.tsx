import "./globals.css";
import type { Metadata } from "next";
import { Inter, Noto_Sans_Devanagari } from "next/font/google";
import Providers from "./providers";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const notoSansDevanagari = Noto_Sans_Devanagari({
  subsets: ["devanagari"],
  variable: "--font-nepali"
});

export const metadata: Metadata = {
  title: "KacharaAlert",
  description: "Smart Waste Management",
  icons: {
    icon: "/icon.svg"
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning data-scroll-behavior="smooth">
      <body className={`${inter.className} ${inter.variable} ${notoSansDevanagari.variable}`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
