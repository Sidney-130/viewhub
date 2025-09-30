'use client'

import { PublicKey } from '@solana/web3.js'

// Your devnet pool id (PYUSD / WSOL)
export const POOL_ID = 'H9EPqQKCvv9ddzK6KHjo8vvUPMLMJXmMmru9KUYNaDFQ'

// Define proper types
interface PositionData {
  /* same as before */
}

interface PoolPositionResponse {
  data: Array<{
    pair_id: string
    pair_name: string
    total_liquidity: number
    total_x_amount: number
    total_y_amount: number
    current_price: number
    fees_earned: number
    apy: number
    volume_24h: number
    bin_step: number
    active_bin_id: number
    lower_bin_id: number
    upper_bin_id: number
    in_range: boolean
    token_x_symbol: string
    token_y_symbol: string
  }>
  total: number
  page_num: number
  page_size: number
}

// Fetch pool info (user_id optional)
export async function fetchPoolInfo(poolId: string = POOL_ID, owner?: PublicKey) {
  try {
    const params: any = {
      page_num: '1',
      page_size: '100',
      pair_id: poolId,
    }

    if (owner) {
      params.user_id = owner.toBase58()
    }

    const response = await fetch(`/api/pool-position?${new URLSearchParams(params)}`)

    if (!response.ok) {
      throw new Error('Failed to fetch pool info')
    }

    const result: PoolPositionResponse = await response.json()
    if (!result.data || result.data.length === 0) return null

    const pool = result.data[0]

    // Map to expected poolInfo structure
    return {
      token_x_symbol: pool.token_x_symbol,
      token_y_symbol: pool.token_y_symbol,
      current_price: pool.current_price,
      total_liquidity: pool.total_liquidity,
      volume_24h: pool.volume_24h,
      active_bins: [], // optional
    }
  } catch (err) {
    console.error('[API] fetchPoolInfo error:', err)
    return null
  }
}
