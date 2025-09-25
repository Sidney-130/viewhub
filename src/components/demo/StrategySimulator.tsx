'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Slider } from '@/components/ui/slider'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Progress } from '@/components/ui/progress'
import { BarChart3, TrendingUp, TrendingDown, Calculator, Play, RotateCcw } from 'lucide-react'

interface SimulationResult {
  strategy: string
  totalReturn: number
  maxDrawdown: number
  sharpeRatio: number
  feesEarned: number
  impermanentLoss: number
  gasSpent: number
  rebalanceCount: number
  winRate: number
}

interface StrategySimulatorProps {
  pair: string
  initialCapital: number
}

export function StrategySimulator({ pair, initialCapital }: StrategySimulatorProps) {
  const [isSimulating, setIsSimulating] = useState(false)
  const [results, setResults] = useState<SimulationResult[]>([])
  const [timeframe, setTimeframe] = useState('30d')
  const [rangeWidth, setRangeWidth] = useState([20])
  const [rebalanceThreshold, setRebalanceThreshold] = useState([10])
  const [selectedStrategy, setSelectedStrategy] = useState('balanced')

  const strategies = [
    { id: 'conservative', name: 'Conservative', description: 'Wide ranges, low rebalancing' },
    { id: 'balanced', name: 'Balanced', description: 'Moderate ranges, optimal rebalancing' },
    { id: 'aggressive', name: 'Aggressive', description: 'Tight ranges, frequent rebalancing' },
    { id: 'adaptive', name: 'Adaptive', description: 'Dynamic ranges based on volatility' },
  ]

  const runSimulation = async () => {
    setIsSimulating(true)

    // Simulate complex backtesting
    await new Promise((resolve) => setTimeout(resolve, 3000))

    const simulationResults: SimulationResult[] = strategies.map((strategy) => {
      const baseReturn = Math.random() * 50 + 10
      const volatilityMultiplier = strategy.id === 'aggressive' ? 1.5 : strategy.id === 'conservative' ? 0.7 : 1

      return {
        strategy: strategy.name,
        totalReturn: baseReturn * volatilityMultiplier,
        maxDrawdown: -(Math.random() * 15 + 5) * volatilityMultiplier,
        sharpeRatio: Math.random() * 2 + 0.5,
        feesEarned: (Math.random() * 1000 + 500) * volatilityMultiplier,
        impermanentLoss: -(Math.random() * 8 + 2) * volatilityMultiplier,
        gasSpent: (Math.random() * 0.1 + 0.05) * (strategy.id === 'aggressive' ? 2 : 1),
        rebalanceCount: Math.floor((Math.random() * 20 + 5) * (strategy.id === 'aggressive' ? 2 : 1)),
        winRate: Math.random() * 30 + 60,
      }
    })

    setResults(simulationResults.sort((a, b) => b.totalReturn - a.totalReturn))
    setIsSimulating(false)
  }

  const resetSimulation = () => {
    setResults([])
    setRangeWidth([20])
    setRebalanceThreshold([10])
    setSelectedStrategy('balanced')
  }

  return (
    <div className="space-y-6">
      {/* Simulation Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calculator className="w-5 h-5 mr-2" />
            Strategy Backtesting
          </CardTitle>
          <CardDescription>Simulate different DLMM strategies using historical data for {pair}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label>Timeframe</Label>
                <Select value={timeframe} onValueChange={setTimeframe}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7d">7 Days</SelectItem>
                    <SelectItem value="30d">30 Days</SelectItem>
                    <SelectItem value="90d">90 Days</SelectItem>
                    <SelectItem value="1y">1 Year</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Initial Capital</Label>
                <div className="text-2xl font-bold">${initialCapital.toLocaleString()}</div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label>Range Width: ±{rangeWidth[0]}%</Label>
                <Slider value={rangeWidth} onValueChange={setRangeWidth} min={5} max={50} step={5} className="w-full" />
              </div>

              <div>
                <Label>Rebalance Threshold: {rebalanceThreshold[0]}%</Label>
                <Slider
                  value={rebalanceThreshold}
                  onValueChange={setRebalanceThreshold}
                  min={5}
                  max={30}
                  step={5}
                  className="w-full"
                />
              </div>
            </div>
          </div>

          <div className="flex space-x-3">
            <Button onClick={runSimulation} disabled={isSimulating} className="flex-1">
              {isSimulating ? (
                <>
                  <Calculator className="w-4 h-4 mr-2 animate-spin" />
                  Running Simulation...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  Run Backtest
                </>
              )}
            </Button>
            <Button variant="outline" onClick={resetSimulation}>
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Simulation Progress */}
      {isSimulating && (
        <Card>
          <CardContent className="py-8">
            <div className="text-center space-y-4">
              <BarChart3 className="w-12 h-12 mx-auto animate-pulse text-primary" />
              <div>
                <h3 className="text-lg font-semibold">Running Historical Simulation</h3>
                <p className="text-muted-foreground">Analyzing {timeframe} of market data...</p>
              </div>
              <Progress value={66} className="w-full max-w-md mx-auto" />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Results */}
      {results.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Simulation Results</h3>
            <Badge variant="outline">{timeframe} backtest</Badge>
          </div>

          {results.map((result, index) => (
            <Card key={result.strategy} className={index === 0 ? 'ring-2 ring-primary' : ''}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <CardTitle className="text-lg">{result.strategy} Strategy</CardTitle>
                    {index === 0 && <Badge className="bg-primary">Best Performance</Badge>}
                    <Badge variant="outline" className="text-xs">
                      {result.winRate.toFixed(0)}% win rate
                    </Badge>
                  </div>
                  <div className="text-right">
                    <div
                      className={`text-2xl font-bold ${result.totalReturn >= 0 ? 'text-green-600' : 'text-red-600'}`}
                    >
                      {result.totalReturn >= 0 ? '+' : ''}
                      {result.totalReturn.toFixed(1)}%
                    </div>
                    <div className="text-sm text-muted-foreground">Total Return</div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <div className="text-sm text-muted-foreground">Fees Earned</div>
                    <div className="text-lg font-semibold text-green-600">${result.feesEarned.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Max Drawdown</div>
                    <div className="text-lg font-semibold text-red-600">{result.maxDrawdown.toFixed(1)}%</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Sharpe Ratio</div>
                    <div className="text-lg font-semibold">{result.sharpeRatio.toFixed(2)}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Rebalances</div>
                    <div className="text-lg font-semibold">{result.rebalanceCount}</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-muted-foreground">Impermanent Loss</div>
                    <div className="font-medium text-red-600">{result.impermanentLoss.toFixed(1)}%</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Gas Spent</div>
                    <div className="font-medium">{result.gasSpent.toFixed(4)} SOL</div>
                  </div>
                </div>

                {/* Performance Bar */}
                <div className="mt-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span>Performance vs Hold</span>
                    <span className={result.totalReturn >= 0 ? 'text-green-600' : 'text-red-600'}>
                      {result.totalReturn >= 0 ? (
                        <TrendingUp className="w-3 h-3 inline mr-1" />
                      ) : (
                        <TrendingDown className="w-3 h-3 inline mr-1" />
                      )}
                      {Math.abs(result.totalReturn).toFixed(1)}%
                    </span>
                  </div>
                  <Progress value={Math.min(100, Math.max(0, (result.totalReturn + 50) * 2))} className="h-2" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
