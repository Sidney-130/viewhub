import type { Metadata } from 'next'
import React from 'react'

export const metadata: Metadata = {
  title: 'Viewhub',
  description: 'Advanced DLMM Position Management Dashboard',
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">{children}</body>
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
