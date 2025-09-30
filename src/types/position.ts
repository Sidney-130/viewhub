// types/position.ts

export type Position = {
  id: string
  pair: string
  tvl: number
  feesEarned: number
  activeBinRange: string
  currentPrice: number
  inRange: boolean
  apy: number
  liquidity: number
  volume24h: number
  binStep: number
  activeBinId: number
  priceHistory: { time: string; price: number }[]
  binDistribution: { binId: number; liquidity: number; price: number }[]
}
