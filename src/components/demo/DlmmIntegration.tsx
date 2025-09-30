'use client'

import { useEffect, useState } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { POOL_ID, fetchPoolInfo } from '@/components/services/saros'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'

interface PositionData {
  /* ...same as before... */
}

interface RealDLMMIntegrationProps {
  positions?: PositionData[]
  poolId?: string
}

interface PoolInfo {
  token_x_symbol: string
  token_y_symbol: string
  current_price: number
  total_liquidity: number
  volume_24h: number
  active_bins: any[]
}

export function RealDLMMIntegration({ positions = [], poolId = POOL_ID }: RealDLMMIntegrationProps) {
  const { publicKey } = useWallet()
  const [poolInfo, setPoolInfo] = useState<PoolInfo | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchPoolData = async () => {
      setLoading(true)
      try {
        // Fetch pool info without requiring wallet
        const pool: PoolInfo | null = await fetchPoolInfo(poolId)
        setPoolInfo(pool)
      } catch (err) {
        console.error('[DLMM Integration] Error fetching pool info:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchPoolData()
  }, [poolId])

  if (loading) return <div>Loading pool info...</div>
  if (!poolInfo) return <div>No pool info available</div>

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>DLMM Pool Overview</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <div className="text-sm text-muted-foreground">Token Pair</div>
            <div className="text-lg font-semibold">
              {poolInfo.token_x_symbol}/{poolInfo.token_y_symbol}
            </div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Current Price</div>
            <div className="text-lg font-semibold">{poolInfo.current_price ?? 0}</div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">24h Volume</div>
            <div className="text-lg font-semibold">${poolInfo.volume_24h?.toLocaleString() ?? 0}</div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Active Bins</div>
            <div className="text-lg font-semibold">{poolInfo.active_bins?.length ?? 0}</div>
          </div>
        </div>

        {poolInfo.total_liquidity && (
          <div>
            <div className="text-sm text-muted-foreground mb-1">Total Liquidity</div>
            <Progress value={Math.min(100, (poolInfo.total_liquidity / 1000000) * 100)} className="h-2" />
          </div>
        )}

        {/* Show user positions only if wallet is connected */}
        {publicKey && positions.length > 0 && (
          <div className="text-sm text-muted-foreground">
            Connected wallet has {positions.length} position{positions.length > 1 ? 's' : ''}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
