import { Pangolin, Kiwi_Maru } from "next/font/google"; // ★ Kiwi_Maru を追加！
import "./globals.css";

// 1. モンゴル語・英語用（手書き）
const pangolin = Pangolin({
  weight: ["400"],
  subsets: ["latin", "cyrillic"],
  variable: "--font-pangolin", // CSS変数にする
});

// 2. 日本語用（手書き風丸文字）
const kiwiMaru = Kiwi_Maru({
  weight: ["400"],
  subsets: ["latin"],
  variable: "--font-kiwi", // CSS変数にする
  preload: false,
});

export const metadata = {
  title: 'Mazaalai Profile',
  description: 'Share your profile!',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="mn">
      {/* bodyに両方のフォント変数を仕込む */}
      <body className={`${pangolin.variable} ${kiwiMaru.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}