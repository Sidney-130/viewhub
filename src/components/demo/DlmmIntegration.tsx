'use client'

import { useEffect, useState } from 'react'
import { sarosDLMM, POOL_ID } from '@/components/services/saros'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'

interface RealDLMMIntegrationProps {
  positions?: any[]
  poolId?: any
}

export function RealDLMMIntegration({ positions = [], poolId = POOL_ID }: RealDLMMIntegrationProps) {
  const [poolInfo, setPoolInfo] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchPoolData = async () => {
      setLoading(true)
      try {
        const pool = await sarosDLMM.getPoolInfo(poolId)
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
              {poolInfo.tokenX.symbol}/{poolInfo.tokenY.symbol}
            </div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Current Price</div>
            <div className="text-lg font-semibold">{poolInfo.currentPrice ?? 0}</div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">24h Volume</div>
            <div className="text-lg font-semibold">${poolInfo.volume24h?.toLocaleString() ?? 0}</div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Active Bins</div>
            <div className="text-lg font-semibold">{poolInfo.activeBins?.length ?? 0}</div>
          </div>
        </div>

        {/* Optional: visual representation of pool liquidity */}
        {poolInfo.totalLiquidity && (
          <div>
            <div className="text-sm text-muted-foreground mb-1">Total Liquidity</div>
            <Progress value={Math.min(100, (poolInfo.totalLiquidity / 1000000) * 100)} className="h-2" />
          </div>
        )}

        {/* Optional: show positions count */}
        {positions.length > 0 && (
          <div className="text-sm text-muted-foreground">
            Connected wallet has {positions.length} position{positions.length > 1 ? 's' : ''}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
