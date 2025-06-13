import type { Metadata } from 'next'
import './globals.css'
import { WalletContextProvider } from '@/components/providers/wallet-provider'

export const metadata: Metadata = {
  title: 'PikaVault - Digital Card Collection',
  description: 'Collect and trade digital cards on the Solana blockchain',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <WalletContextProvider>{children}</WalletContextProvider>
      </body>
    </html>
  )
}
