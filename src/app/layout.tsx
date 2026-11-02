import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = { title: "Apato", description: "Kelola kamar, tagihan dan uang masuk kos kamu." };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <head>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap" />
      </head>
      <body>{children}</body>
    </html>
  );
}
