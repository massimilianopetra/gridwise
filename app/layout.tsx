import type { Metadata } from "next";
import "./globals.css";
import CookieConsent from "@/app/ui/cookieconsent";


export const metadata: Metadata = {
  title: "OpenTradeNet",
  description: "OpenTradeNet is an open-source platform offering free advanced tools and utilities for trading traditional assets and cryptocurrencies.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en">
      <body>
        <CookieConsent />
        {children}
      </body>
    </html>
  );

}
