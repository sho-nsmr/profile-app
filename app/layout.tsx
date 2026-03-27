import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mazaalai Profile",
  description: "My QR Profile App",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="mn">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
