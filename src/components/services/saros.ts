'use client'

import { LiquidityBookServices, MODE } from '@saros-finance/dlmm-sdk'
import { Connection, PublicKey } from '@solana/web3.js'

// DLMM service singleton
export const sarosDLMM = new LiquidityBookServices({
  mode: MODE.DEVNET,
  options: {
    rpcUrl: 'https://api.devnet.solana.com', // you can use helius rpc if you prefer
  },
})

// Your devnet pool id (PYUSD / WSOL)
export const POOL_ID = new PublicKey('H9EPqQKCvv9ddzK6KHjo8vvUPMLMJXmMmru9KUYNaDFQ')

// Fetch user positions directly from SDK
export async function fetchUserPositions(owner: PublicKey) {
  try {
    const connection: Connection = sarosDLMM.connection
    if (!connection) throw new Error('No connection available')

    // Pool info
    const pool = await sarosDLMM.getPoolInfo(POOL_ID)

    // Positions by owner
    const positions = await sarosDLMM.getPositionsByOwner(POOL_ID, owner)

    return positions.map((p: any) => ({
      id: p.publicKey.toBase58(),
      pair: `${pool.tokenX.symbol}/${pool.tokenY.symbol}`,
      tvl: Number(p.totalUsdValue ?? 0),
      feesEarned: Number(p.feesEarned?.usdValue ?? 0),
      activeBinRange: `${p.binRange?.min ?? 0}-${p.binRange?.max ?? 0}`,
      currentPrice: Number(pool.currentPrice ?? 0),
      inRange: p.inRange ?? false,
      apy: Number(p.apy ?? 0),
      liquidity: Number(p.liquidity ?? 0),
      volume24h: Number(pool.volume24h ?? 0),
      binStep: Number(p.binStep ?? 0),
      activeBinId: Number(p.activeBinId ?? 0),
      priceHistory: [], // optional: you can plug in a chart API later
      binDistribution: [], // optional: could map from pool bins
    }))
  } catch (err) {
    console.error('[DLMM Service] fetchUserPositions error:', err)
    return []
  }
}
