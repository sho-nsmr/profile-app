import { Zen_Maru_Gothic } from "next/font/google"; // ① Google Fonts からインポート
import "./globals.css";

// ② フォントの設定
const maruGothic = Zen_Maru_Gothic({
  weight: ["400", "500", "750", "900"], // 必要な太さを指定（数字が大きいほど太くなります）
  subsets: ["latin", "cyrillic-ext"],   // ★超重要：これでモンゴル語（キリル文字）も綺麗になります
  preload: false,                       // 日本語フォントは容量が大きいためpreloadをオフにすると安定します
});

export const metadata = {
  title: 'Mazaalai Profile', // タイトルもアプリ名に合わせておきました！
  description: 'Share your profile with friends!',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    // ③ langを「mn（モンゴル語）」か「ja（日本語）」にする（今回はmn推奨、または消してもOK）
    <html lang="mn">
      {/* ④ bodyのclassNameに maruGothic.className を追加 */}
      <body className={`${maruGothic.className} antialiased`}>
        {children}
      </body>
    </html>
  );
}