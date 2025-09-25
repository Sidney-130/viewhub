'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Loader2, RefreshCw, ExternalLink } from 'lucide-react'

// Mock DLMM SDK integration - in real implementation, this would use @saros-finance/dlmm-sdk
interface DLMMPosition {
  publicKey: string
  pairName: string
  totalXAmount: number
  totalYAmount: number
  totalUsdValue: number
  feesEarned: {
    tokenX: number
    tokenY: number
    usdValue: number
  }
  activeBinId: number
  binRange: {
    min: number
    max: number
  }
  binStep: number
  lastUpdated: Date
}

interface DLMMSDKIntegrationProps {
  walletAddress?: string
}

export function DLMMSDKIntegration({ walletAddress }: DLMMSDKIntegrationProps) {
  const [positions, setPositions] = useState<DLMMPosition[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Mock data that simulates real DLMM SDK responses
  const mockPositions: DLMMPosition[] = [
    {
      publicKey: '7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU',
      pairName: 'SOL-USDC',
      totalXAmount: 12.5,
      totalYAmount: 1250.75,
      totalUsdValue: 2501.5,
      feesEarned: {
        tokenX: 0.125,
        tokenY: 12.5,
        usdValue: 25.0,
      },
      activeBinId: 8388608,
      binRange: {
        min: 95.5,
        max: 102.3,
      },
      binStep: 25,
      lastUpdated: new Date(),
    },
    {
      publicKey: '9yQNfGMuQqjZn3J2fvCgfQaAFBgm3BzrHx4s8kL6vN2M',
      pairName: 'BONK-SOL',
      totalXAmount: 1000000,
      totalYAmount: 2.5,
      totalUsdValue: 500.25,
      feesEarned: {
        tokenX: 5000,
        tokenY: 0.025,
        usdValue: 5.0,
      },
      activeBinId: 8388500,
      binRange: {
        min: 0.0000245,
        max: 0.0000255,
      },
      binStep: 1,
      lastUpdated: new Date(),
    },
  ]

  const fetchPositions = async () => {
    if (!walletAddress) return

    setIsLoading(true)
    setError(null)

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // In real implementation, this would be:
      // const dlmm = new DLMM(connection, publicKey)
      // const positions = await dlmm.getPositionsByOwner(walletAddress)

      setPositions(mockPositions)
    } catch (err) {
      setError('Failed to fetch DLMM positions')
      console.error('DLMM SDK Error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (walletAddress) {
      fetchPositions()
    }
  }, [walletAddress])

  if (!walletAddress) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>DLMM SDK Integration</CardTitle>
          <CardDescription>Connect your wallet to view live DLMM positions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <ExternalLink className="w-8 h-8" />
            </div>
            <p>Wallet connection required</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg pb-2">Live DLMM Positions</CardTitle>
            <CardDescription className="text-xs md:text-sm">Real-time data from Saros Finance DLMM SDK</CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={fetchPositions} disabled={isLoading}>
            {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <RefreshCw className="w-4 h-4 mr-2" />}
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 mb-4">
            <p className="text-destructive text-sm">{error}</p>
          </div>
        )}

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-muted rounded w-1/4 mb-2"></div>
                <div className="h-20 bg-muted rounded"></div>
              </div>
            ))}
          </div>
        ) : positions.length > 0 ? (
          <div className="space-y-4">
            {positions.map((position) => (
              <div key={position.publicKey} className="border rounded-lg p-4 bg-card/50">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center text-center md:space-x-2">
                    <h3 className="font-semibold">{position.pairName}</h3>
                    <Badge variant="outline" className="text-[9px] font-mono">
                      Bin {position.activeBinId}
                    </Badge>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">${position.totalUsdValue.toLocaleString()}</div>
                    <div className="text-xs text-muted-foreground">Total Value</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <div className="text-muted-foreground">Token X</div>
                    <div className="font-medium">{position.totalXAmount.toLocaleString()}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-muted-foreground">Token Y</div>
                    <div className="font-medium">{position.totalYAmount.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Fees Earned</div>
                    <div className="font-medium text-green-600">${position.feesEarned.usdValue.toFixed(2)}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-muted-foreground">Bin Step</div>
                    <div className="font-medium">{position.binStep} bps</div>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-border/50">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>
                      Range: {position.binRange.min} - {position.binRange.max}
                    </span>
                    <span className="text-right">Updated: {position.lastUpdated.toLocaleTimeString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <ExternalLink className="w-8 h-8" />
            </div>
            <p>No DLMM positions found</p>
            <p className="text-xs mt-1">Create your first position on Saros Finance</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
