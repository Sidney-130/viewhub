import type { Metadata } from 'next';
import './globals.css';
import { AppProviders } from '@/components/app-providers';
import { AppLayout } from '@/components/app-layout';
import React from 'react';

export const metadata: Metadata = {
  title: 'Saros DLMM Demo',
  description: 'Built with create-solana-dapp, Next.js, and Saros SDKs',
};

// Links for the sidebar / navbar
const links: { label: string; path: string }[] = [
  { label: 'Home', path: '/' },
  { label: 'Dashboard', path: '/dashboard' },
  { label: 'Backtest', path: '/backtest' },
  { label: 'Account', path: '/account' },
  { label: 'Basic Program', path: '/basic' },
];

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased bg-gray-50 text-gray-800">
        <AppProviders>
          <AppLayout links={links}>{children}</AppLayout>
        </AppProviders>
      </body>
    </html>
  );
}

// Allow BigInt to serialize to JSON (needed for on-chain data)
declare global {
  interface BigInt {
    toJSON(): string;
  }
}

BigInt.prototype.toJSON = function () {
  return this.toString();
};
