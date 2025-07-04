import type { Metadata } from 'next'
import './globals.css'
import { WalletContextProvider } from '@/components/providers/wallet-provider'
import { Analytics } from "@vercel/analytics/next"

export const metadata: Metadata = {
  title: 'PikaVault - Digital Card Collection',
  description: 'Collect and trade digital cards. Only on Solana',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <meta property="og:site_name" content="PikaVault"></meta>
      <meta property="og:url" content="https://x.com/PikaVault_"></meta>
      <body>
        <WalletContextProvider>{children}</WalletContextProvider>
        <Analytics/>
      </body>
    </html>
  )
}
