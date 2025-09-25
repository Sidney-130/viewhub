'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { TrendingUp, TrendingDown } from 'lucide-react'

interface PositionChartProps {
  pair: string
  currentPrice: number
  activeBinRange: string
  priceHistory: { time: string; price: number }[]
  binDistribution: { binId: number; liquidity: number; price: number }[]
}

export function PositionChart({
  pair,
  currentPrice,
  activeBinRange,
  priceHistory,
  binDistribution,
}: PositionChartProps) {
  const [minRange, maxRange] = activeBinRange.split('-').map(Number)
  const isInRange = currentPrice >= minRange && currentPrice <= maxRange
  const priceChange =
    priceHistory.length > 1
      ? ((priceHistory[priceHistory.length - 1].price - priceHistory[0].price) / priceHistory[0].price) * 100
      : 0

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg pb-2">
              {pair} <br /> Price Chart
            </CardTitle>
            <CardDescription>Current price and liquidity distribution</CardDescription>
          </div>
          <div className="text-right">
            <div className="text-lg md:text-2xl font-bold">{currentPrice.toFixed(6)}</div>
            <div className={`flex items-center text-sm ${priceChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {priceChange >= 0 ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
              {Math.abs(priceChange).toFixed(2)}%
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Price Range Indicator */}
          <div className="relative">
            <div className="flex justify-between text-xs text-muted-foreground mb-2">
              <span>Min: {minRange}</span>
              <span>Current: {currentPrice.toFixed(6)}</span>
              <span>Max: {maxRange}</span>
            </div>
            <div className="h-2 bg-muted rounded-full relative overflow-hidden">
              <div className="absolute h-full bg-primary/30 rounded-full" style={{ left: '10%', right: '10%' }} />
              <div
                className="absolute w-1 h-full bg-primary rounded-full"
                style={{
                  left: `${Math.max(0, Math.min(100, ((currentPrice - minRange) / (maxRange - minRange)) * 80 + 10))}%`,
                }}
              />
            </div>
            <Badge variant={isInRange ? 'default' : 'destructive'} className="mt-2 text-xs">
              {isInRange ? 'In Range' : 'Out of Range'}
            </Badge>
          </div>

          {/* Simplified Liquidity Distribution */}
          <div className="px-6 md:px-20">
            <div className="text-sm font-medium mb-2">Liquidity Distribution</div>
            <div className="grid grid-cols-10 gap-1 h-13 md:h-16">
              {binDistribution.map((bin, index) => (
                <div
                  key={bin.binId}
                  className="bg-primary/20 rounded-sm relative"
                  style={{
                    height: `${(bin.liquidity / Math.max(...binDistribution.map((b) => b.liquidity))) * 100}%`,
                    backgroundColor:
                      bin.price >= minRange && bin.price <= maxRange ? 'oklch(0.65 0.2 142)' : 'oklch(0.3 0.1 142)',
                  }}
                  title={`Bin ${bin.binId}: $${bin.liquidity.toLocaleString()}`}
                />
              ))}
            </div>
            <div className="flex justify-between text-xs text-muted-foreground mt-1 gap-2">
              <span>Lower Bins</span>
              <span>Active Range</span>
              <span>Upper Bins</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
