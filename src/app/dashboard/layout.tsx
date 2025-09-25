import type { Metadata } from 'next'
import { AppProviders } from '@/components/app-providers'
import { AppLayout } from '@/components/app-layout'
import React from 'react'

export const metadata: Metadata = {
  title: 'Viewhub',
}

const links: { label: string; path: string }[] = [
  { label: 'Home', path: '/' },
  { label: 'Dashboard', path: '/dashboard' },
  // { label: 'Backtest', path: '/backtest' },
  // { label: 'Account', path: '/account' },
]

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        <AppProviders>
          <AppLayout links={links}>{children}</AppLayout>
        </AppProviders>
        {children}
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
