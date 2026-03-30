// app/layout.tsx
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
            <body>
                {/* children に各ページのコンテンツが入ります */}
                {children}
            </body>
        </html>
    )
}