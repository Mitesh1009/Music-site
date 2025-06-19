import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Header from "./_components/header/Header";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Music App - Playlist Manager",
  description:
    "Create and manage your music playlists with Spotify integration",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <>
          <Header />
          <main>{children}</main>
        </>
      </body>
    </html>
  );
}
