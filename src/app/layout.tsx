import type { Metadata } from 'next'
import './globals.css'
import React from 'react'
import { Analytics } from '@vercel/analytics/next'
import { WalletProvider } from '../components/demo/WalletProvider'
import { Suspense } from 'react'

export const metadata: Metadata = {
  title: 'Viewhub',
  description: 'Advanced DLMM Position Management Dashboard',
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <body>
        <Suspense fallback={<div>Loading...</div>}>
          <WalletProvider>{children}</WalletProvider>
        </Suspense>
        <Analytics />
      </body>
    </html>
  )
}

// Allow BigInt to serialize to JSON (needed for on-chain data)
declare global {
  interface BigInt {
    toJSON(): string
  }
}

BigInt.prototype.toJSON = function () {
  return this.toString()
}
