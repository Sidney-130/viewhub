'use client'

import { useState, useEffect } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { PositionChart } from '@/components/demo/PositionChart'
import { RealDLMMIntegration } from '@/components/demo/DlmmIntegration'
import { RebalancingEngine } from '@/components/demo/RebalancingEngine'
import { AdvancedBacktesting } from '@/components/demo/AdvancedBacktesting'
import { TrendingUp, DollarSign, Zap, RefreshCw, BarChart3, Wallet, ArrowUpRight, ArrowDownRight } from 'lucide-react'
import { POOL_ID, fetchPoolInfo } from '@/components/services/saros'
import type { Position } from '../../types/position'
import { WalletButton } from '@/components/demo/WalletButton'

// Demo fallback positions
const demoPositions: Position[] = [
  {
    id: '1',
    pair: 'SOL/USDC',
    tvl: 45230.5,
    feesEarned: 1250.3,
    activeBinRange: '95.5-102.3',
    currentPrice: 98.45,
    inRange: true,
    apy: 12.5,
    liquidity: 25000,
    volume24h: 125000,
    binStep: 25,
    activeBinId: 8388608,
    priceHistory: [
      { time: '00:00', price: 97.2 },
      { time: '04:00', price: 98.1 },
      { time: '08:00', price: 97.8 },
      { time: '12:00', price: 98.9 },
      { time: '16:00', price: 98.45 },
    ],
    binDistribution: Array.from({ length: 10 }, (_, i) => ({
      binId: 8388600 + i,
      liquidity: Math.random() * 10000 + 1000,
      price: 95 + i * 1.5,
    })),
  },
  {
    id: '2',
    pair: 'BONK/SOL',
    tvl: 12450.75,
    feesEarned: 340.2,
    activeBinRange: '0.0000245-0.0000255',
    currentPrice: 0.00004,
    inRange: false,
    apy: 8.2,
    liquidity: 8500,
    volume24h: 45000,
    binStep: 1,
    activeBinId: 8388500,
    priceHistory: [
      { time: '00:00', price: 0.000025 },
      { time: '04:00', price: 0.000028 },
      { time: '08:00', price: 0.000032 },
      { time: '12:00', price: 0.000038 },
      { time: '16:00', price: 0.00004 },
    ],
    binDistribution: Array.from({ length: 10 }, (_, i) => ({
      binId: 8388495 + i,
      liquidity: Math.random() * 5000 + 500,
      price: 0.00002 + i * 0.000003,
    })),
  },
]

export default function DashboardPage() {
  const { connected, publicKey } = useWallet()
  const [positions, setPositions] = useState<Position[]>(demoPositions)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedPosition, setSelectedPosition] = useState<Position>(demoPositions[0])
  const [poolInfo, setPoolInfo] = useState<any>(null)
  const [poolLoading, setPoolLoading] = useState(false)

  // Fetch pool info (always, wallet optional)
  useEffect(() => {
    const loadPoolInfo = async () => {
      setPoolLoading(true)
      try {
        const pool = await fetchPoolInfo(POOL_ID, publicKey ?? undefined)
        setPoolInfo(pool)
      } catch (err) {
        console.error('Error fetching pool info', err)
        setPoolInfo(null)
      } finally {
        setPoolLoading(false)
      }
    }
    loadPoolInfo()
  }, [publicKey])

  const totalTVL = positions.reduce((sum, pos) => sum + pos.tvl, 0)
  const totalFees = positions.reduce((sum, pos) => sum + pos.feesEarned, 0)
  const avgAPY = positions.length > 0 ? positions.reduce((sum, pos) => sum + pos.apy, 0) / positions.length : 0

  const handleRefresh = async () => {
    setIsLoading(true)
    try {
      // Optionally reload positions from your API if you implement fetchPositions
      setPositions(demoPositions)
      setSelectedPosition(demoPositions[0])
    } catch (err) {
      console.error('Error refreshing positions', err)
    } finally {
      setIsLoading(false)
    }
  }

  if (!connected) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Wallet className="w-8 h-8 text-primary" />
            </div>
            <CardTitle>Connect Your Wallet</CardTitle>
            <p className="text-muted-foreground text-sm">
              Connect your Solana wallet to access the DLMM Position Dashboard
            </p>
          </CardHeader>
          <CardContent className="text-center">
            <WalletButton />
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border/40 backdrop-blur-sm bg-background/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-lg sm:text-xl font-bold">Viewhub</span>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <Button variant="ghost" onClick={handleRefresh} disabled={isLoading} className="text-sm sm:text-base">
                <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Badge
                variant="secondary"
                className="hidden sm:flex bg-green-500/10 text-green-600 border-green-500/20 items-center"
              >
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2" />
                {publicKey?.toString().slice(0, 4)}...
                {publicKey?.toString().slice(-4)}
              </Badge>
              <WalletButton />
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">DLMM Position Dashboard</h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Monitor and manage your dynamic liquidity positions on Saros Finance
          </p>
        </div>

        {/* Overview */}
        <RealDLMMIntegration positions={positions} poolId={POOL_ID} />

        {/* Tabs */}
        <Tabs defaultValue="positions" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 text-xs sm:text-sm">
            <TabsTrigger value="positions">Positions</TabsTrigger>
            <TabsTrigger value="rebalancing">Rebalancing</TabsTrigger>
            <TabsTrigger value="backtesting">Backtesting</TabsTrigger>
          </TabsList>

          <TabsContent value="positions" className="space-y-6">
            <PositionChart
              pair={selectedPosition.pair}
              currentPrice={selectedPosition.currentPrice}
              activeBinRange={selectedPosition.activeBinRange}
              priceHistory={selectedPosition.priceHistory}
              binDistribution={selectedPosition.binDistribution}
            />

            <div className="grid gap-4 sm:gap-6">
              {positions.map((position) => (
                <Card
                  key={position.id}
                  className={`overflow-hidden cursor-pointer transition-all ${
                    selectedPosition.id === position.id ? 'ring-2 ring-primary' : ''
                  }`}
                  onClick={() => setSelectedPosition(position)}
                >
                  <CardHeader>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <CardTitle className="text-base sm:text-xl">{position.pair}</CardTitle>
                        <Badge variant={position.inRange ? 'default' : 'destructive'}>
                          {position.inRange ? 'In Range' : 'Out of Range'}
                        </Badge>
                        <Badge variant="outline" className="text-xs font-mono">
                          Bin {position.activeBinId}
                        </Badge>
                      </div>
                      <div className="text-right">
                        <div className="text-lg sm:text-2xl font-bold">${position.tvl.toLocaleString()}</div>
                        <div className="text-xs sm:text-sm text-muted-foreground">TVL</div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                      <div>
                        <div className="text-xs sm:text-sm text-muted-foreground">Fees Earned</div>
                        <div className="text-sm sm:text-lg font-semibold text-green-600">
                          ${position.feesEarned.toLocaleString()}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs sm:text-sm text-muted-foreground">Active Range</div>
                        <div className="text-sm sm:text-lg font-semibold font-mono">{position.activeBinRange}</div>
                      </div>
                      <div>
                        <div className="text-xs sm:text-sm text-muted-foreground">Current Price</div>
                        <div className="text-sm sm:text-lg font-semibold">{position.currentPrice}</div>
                      </div>
                      <div>
                        <div className="text-xs sm:text-sm text-muted-foreground">APY</div>
                        <div className="text-sm sm:text-lg font-semibold">{position.apy}%</div>
                      </div>
                      <div>
                        <div className="text-xs sm:text-sm text-muted-foreground">Bin Step</div>
                        <div className="text-sm sm:text-lg font-semibold">{position.binStep} bps</div>
                      </div>
                    </div>

                    <div className="mt-4">
                      <div className="flex justify-between text-xs sm:text-sm text-muted-foreground mb-2">
                        <span>Price Range</span>
                        <span>{position.inRange ? 'Active' : 'Needs Rebalancing'}</span>
                      </div>
                      <Progress value={position.inRange ? 75 : 25} className="h-2" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="rebalancing" className="space-y-6">
            <RebalancingEngine
              positions={positions}
              onRebalance={(positionId, recommendation) => {
                console.log(`Rebalancing position ${positionId} with strategy: ${recommendation.strategy}`)
              }}
            />
          </TabsContent>

          <TabsContent value="backtesting" className="space-y-6">
            <AdvancedBacktesting pair={selectedPosition.pair} initialCapital={selectedPosition.tvl} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
