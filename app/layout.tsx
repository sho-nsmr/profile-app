import "./globals.css";

export const metadata = {
    title: 'My App',
    description: 'Next.js App',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="ja">
            {/* 2. body の class を空にするか、削除して Tailwind を優先させます */}
            <body className="antialiased">
                {children}
            </body>
        </html>
    )
}