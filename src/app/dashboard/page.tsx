'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { PositionChart } from '@/components/demo/PositionChart'
import { DLMMSDKIntegration } from '@/components//demo/DlmmSdkIntegration'
import { RebalancingEngine } from '@/components/demo/RebalancingEngine'
import { AdvancedBacktesting } from '@/components/demo/AdvancedBacktesting'
import { TrendingUp, DollarSign, Zap, RefreshCw, BarChart3, Wallet, ArrowUpRight, ArrowDownRight } from 'lucide-react'
import Navbar from './navbar'

// Enhanced mock data with more DLMM-specific information
const mockPositions = [
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
  {
    id: '3',
    pair: 'RAY/USDC',
    tvl: 28900.25,
    feesEarned: 890.15,
    activeBinRange: '1.8-2.2',
    currentPrice: 2.05,
    inRange: true,
    apy: 15.8,
    liquidity: 18000,
    volume24h: 78000,
    binStep: 10,
    activeBinId: 8388650,
    priceHistory: [
      { time: '00:00', price: 1.95 },
      { time: '04:00', price: 2.02 },
      { time: '08:00', price: 2.08 },
      { time: '12:00', price: 2.03 },
      { time: '16:00', price: 2.05 },
    ],
    binDistribution: Array.from({ length: 10 }, (_, i) => ({
      binId: 8388645 + i,
      liquidity: Math.random() * 8000 + 800,
      price: 1.6 + i * 0.08,
    })),
  },
]

export default function DashboardPage() {
  const [positions, setPositions] = useState(mockPositions)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedPosition, setSelectedPosition] = useState(positions[0])

  const totalTVL = positions.reduce((sum, pos) => sum + pos.tvl, 0)
  const totalFees = positions.reduce((sum, pos) => sum + pos.feesEarned, 0)
  const avgAPY = positions.reduce((sum, pos) => sum + pos.apy, 0) / positions.length

  const handleRefresh = () => {
    setIsLoading(true)
    setTimeout(() => setIsLoading(false), 1000)
  }

  return (
    <div className="min-h-screen bg-background px-3">
      <Navbar handleRefresh={handleRefresh} isLoading={isLoading} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">DLMM Position Dashboard</h1>
          <p className="text-muted-foreground">Monitor and manage your dynamic liquidity positions</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total TVL</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalTVL.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600 flex items-center">
                  <ArrowUpRight className="w-3 h-3 mr-1" />
                  +12.5% from last week
                </span>
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Fees Earned</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalFees.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600 flex items-center">
                  <ArrowUpRight className="w-3 h-3 mr-1" />
                  +8.2% from last week
                </span>
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average APY</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{avgAPY.toFixed(1)}%</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-red-600 flex items-center">
                  <ArrowDownRight className="w-3 h-3 mr-1" />
                  -2.1% from last week
                </span>
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Positions</CardTitle>
              <Wallet className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{positions.length}</div>
              <p className="text-sm text-muted-foreground">
                {positions.filter((p) => p.inRange).length} in range, {positions.filter((p) => !p.inRange).length} out
                of range
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="positions" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="positions">Positions</TabsTrigger>
            <TabsTrigger value="rebalancing">Rebalancing</TabsTrigger>
            <TabsTrigger value="backtesting">Backtesting</TabsTrigger>
          </TabsList>
          <TabsContent value="positions" className="space-y-6">
            <DLMMSDKIntegration walletAddress="7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU" />
            <PositionChart
              pair={selectedPosition.pair}
              currentPrice={selectedPosition.currentPrice}
              activeBinRange={selectedPosition.activeBinRange}
              priceHistory={selectedPosition.priceHistory}
              binDistribution={selectedPosition.binDistribution}
            />
            <div className="grid gap-6">
              {positions.map((position) => (
                <Card
                  key={position.id}
                  className={`overflow-hidden cursor-pointer transition-all ${
                    selectedPosition.id === position.id ? 'ring-2 ring-primary' : ''
                  }`}
                  onClick={() => setSelectedPosition(position)}
                >
                  <CardHeader>
                    <div className="flex flex-col md:flex-row justify-between">
                      <div className="flex items-center text-center justify-center space-x-1 md:space-x-3">
                        <CardTitle className="text-left text-[13px] md:text-xl">{position.pair}</CardTitle>
                        <Badge className="text-xs" variant={position.inRange ? 'default' : 'destructive'}>
                          {position.inRange ? 'In Range' : 'Out of Range'}
                        </Badge>
                        <Badge variant="outline" className="text-[10px] font-mono">
                          Bin {position.activeBinId}
                        </Badge>
                      </div>
                      <div className="justify-start md:text-right flex items-center space-x-2 pt-2">
                        <div className="text-md md:text-2xl font-bold">${position.tvl.toLocaleString()}</div>
                        <div className="text-sm text-muted-foreground">TVL</div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                      <div>
                        <div className="text-sm text-muted-foreground">Fees Earned</div>
                        <div className="text-lg font-semibold text-green-600">
                          ${position.feesEarned.toLocaleString()}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Active Range</div>
                        <div className="text-lg font-semibold font-mono">{position.activeBinRange}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Current Price</div>
                        <div className="text-lg font-semibold">{position.currentPrice}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">APY</div>
                        <div className="text-lg font-semibold">{position.apy}%</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Bin Step</div>
                        <div className="text-lg font-semibold">{position.binStep} bps</div>
                      </div>
                    </div>
                    <div className="mt-4">
                      <div className="flex justify-between text-sm text-muted-foreground mb-2">
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
