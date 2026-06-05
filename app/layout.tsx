import { Noto_Sans, Noto_Sans_JP } from "next/font/google";
import "./globals.css";

// ① 英語・キリル文字用のベースフォント（超軽量・爆速ロード）
const notoSans = Noto_Sans({
  weight: ["400", "500", "700"],
  subsets: ["latin", "cyrillic"], // Noto Sansはキリル文字を完璧にサポートしています
  variable: "--font-noto-sans",    // CSS変数として登録
});

// ② 日本語用のフォント（日本語の時だけ適用されるようにする）
const notoSansJP = Noto_Sans_JP({
  weight: ["400", "500", "700"],
  subsets: ["latin"],              // 日本語フォント内の英数は使わないのでlatinだけでOK
  variable: "--font-noto-sans-jp", // CSS変数として登録
});

export const metadata = {
  title: 'Mazaalai Profile',
  description: 'Share your profile with friends!',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    // モンゴル語主体のサイトなら lang="mn" で大正解です！
    <html lang="mn">
      <body 
        className={`
          ${notoSans.variable} 
          ${notoSansJP.variable} 
          font-sans 
          antialiased
        `}
      >
        {children}
      </body>
    </html>
  );
}