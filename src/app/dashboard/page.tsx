'use client'

import { useWallet } from '@solana/wallet-adapter-react'
import WalletButton from '@/components/dashboard/WalletButton'
import PositionCard from '@/components/dashboard/PositionCard'

export default function DashboardPage() {
  const { publicKey } = useWallet()

  return (
    <main className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">View your portfoilio</h1>
      </div>

      {!publicKey ? (
        <div className="p-6 rounded shadow text-center">Connect your wallet to see your positions.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <PositionCard pool="SOL/USDC" tvl="1200" range={{ min: 20, max: 25 }} fees="3.2" outOfRange={true} />
        </div>
      )}
    </main>
  )
}
