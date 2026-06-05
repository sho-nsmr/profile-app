import { Zen_Maru_Gothic } from "next/font/google";
import "./globals.css";

const maruGothic = Zen_Maru_Gothic({
  weight: ["400", "500", "700", "900"], 
  subsets: ["latin", "cyrillic"], // モンゴル語もこれでバッチリ！
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
      {/* ここで丸ゴシックを全体に適用 */}
      <body className={`${maruGothic.className} antialiased`}>
        {children}
      </body>
    </html>
  );
}