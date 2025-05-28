import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'PikaVault',
  description: 'RWA Marketplace',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
