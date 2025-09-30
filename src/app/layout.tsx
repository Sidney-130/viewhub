import type { Metadata } from 'next'
import './globals.css'
import React, { Suspense } from 'react'
import { WalletProvider } from '../components/demo/WalletProvider'

export const metadata: Metadata = {
  title: 'Viewhub',
  description: 'Advanced DLMM Position Management Dashboard',
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <Suspense fallback={<div>Loading...</div>}>
          <WalletProvider>{children}</WalletProvider>
        </Suspense>
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
