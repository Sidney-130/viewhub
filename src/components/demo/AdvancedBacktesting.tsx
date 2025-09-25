'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Slider } from '@/components/ui/slider'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Calculator,
  Play,
  Target,
  Download,
  Settings,
  LineChart,
  PieChart,
  Activity,
} from 'lucide-react'

interface BacktestResult {
  strategy: string
  timeframe: string
  totalReturn: number
  annualizedReturn: number
  maxDrawdown: number
  sharpeRatio: number
  sortinoRatio: number
  calmarRatio: number
  feesEarned: number
  impermanentLoss: number
  gasSpent: number
  rebalanceCount: number
  winRate: number
  profitFactor: number
  volatility: number
  beta: number
  alpha: number
  performanceData: { date: string; value: number; benchmark: number }[]
  drawdownData: { date: string; drawdown: number }[]
  rebalanceEvents: { date: string; reason: string; cost: number }[]
}

interface AdvancedBacktestingProps {
  pair: string
  initialCapital: number
}

export function AdvancedBacktesting({ pair, initialCapital }: AdvancedBacktestingProps) {
  const [isRunning, setIsRunning] = useState(false)
  const [results, setResults] = useState<BacktestResult[]>([])
  const [selectedResult, setSelectedResult] = useState<BacktestResult | null>(null)

  // Backtesting parameters
  const [timeframe, setTimeframe] = useState('90d')
  const [rangeWidth, setRangeWidth] = useState([20])
  const [rebalanceThreshold, setRebalanceThreshold] = useState([10])
  const [gasPrice, setGasPrice] = useState([0.001])
  const [slippage, setSlippage] = useState([0.5])
  const [includeWeekends, setIncludeWeekends] = useState(true)
  const [riskFreeRate, setRiskFreeRate] = useState('4.5')
  const [benchmarkStrategy, setBenchmarkStrategy] = useState('hodl')

  const strategies = [
    { id: 'conservative', name: 'Conservative DLMM', description: 'Wide ranges, minimal rebalancing' },
    { id: 'balanced', name: 'Balanced DLMM', description: 'Moderate ranges, optimal rebalancing' },
    { id: 'aggressive', name: 'Aggressive DLMM', description: 'Tight ranges, frequent rebalancing' },
    { id: 'adaptive', name: 'Adaptive DLMM', description: 'Dynamic ranges based on volatility' },
    { id: 'momentum', name: 'Momentum DLMM', description: 'Trend-following range adjustments' },
    { id: 'mean_reversion', name: 'Mean Reversion', description: 'Counter-trend positioning' },
  ]

  const runAdvancedBacktest = async () => {
    setIsRunning(true)

    // Simulate comprehensive backtesting
    await new Promise((resolve) => setTimeout(resolve, 4000))

    const backtestResults: BacktestResult[] = strategies.map((strategy) => {
      const baseReturn = Math.random() * 60 + 10
      const volatilityMultiplier = strategy.id === 'aggressive' ? 1.8 : strategy.id === 'conservative' ? 0.6 : 1
      const timeMultiplier = timeframe === '1y' ? 4 : timeframe === '90d' ? 1 : 0.25

      // Generate performance data
      const performanceData = Array.from({ length: 30 }, (_, i) => {
        const date = new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        const value = initialCapital * (1 + (baseReturn / 100) * (i / 30) + (Math.random() - 0.5) * 0.1)
        const benchmark = initialCapital * (1 + ((baseReturn * 0.7) / 100) * (i / 30))
        return { date, value, benchmark }
      })

      // Generate drawdown data
      const drawdownData = performanceData.map((point, i) => {
        const peak = Math.max(...performanceData.slice(0, i + 1).map((p) => p.value))
        const drawdown = ((point.value - peak) / peak) * 100
        return { date: point.date, drawdown }
      })

      // Generate rebalance events
      const rebalanceEvents = Array.from({ length: Math.floor(Math.random() * 15 + 5) }, (_, i) => ({
        date: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        reason: ['Price out of range', 'Volatility spike', 'Scheduled rebalance', 'Risk management'][
          Math.floor(Math.random() * 4)
        ],
        cost: Math.random() * 0.01 + 0.001,
      }))

      return {
        strategy: strategy.name,
        timeframe,
        totalReturn: baseReturn * volatilityMultiplier * timeMultiplier,
        annualizedReturn:
          baseReturn *
          volatilityMultiplier *
          timeMultiplier *
          (365 / (timeframe === '1y' ? 365 : timeframe === '90d' ? 90 : 30)),
        maxDrawdown: -(Math.random() * 20 + 5) * volatilityMultiplier,
        sharpeRatio: Math.random() * 2.5 + 0.3,
        sortinoRatio: Math.random() * 3 + 0.5,
        calmarRatio: Math.random() * 1.5 + 0.2,
        feesEarned: (Math.random() * 2000 + 800) * volatilityMultiplier * timeMultiplier,
        impermanentLoss: -(Math.random() * 12 + 3) * volatilityMultiplier,
        gasSpent: (Math.random() * 0.2 + 0.1) * (strategy.id === 'aggressive' ? 2.5 : 1) * timeMultiplier,
        rebalanceCount: Math.floor((Math.random() * 25 + 10) * (strategy.id === 'aggressive' ? 2 : 1) * timeMultiplier),
        winRate: Math.random() * 35 + 55,
        profitFactor: Math.random() * 2 + 1.2,
        volatility: Math.random() * 30 + 15,
        beta: Math.random() * 0.8 + 0.6,
        alpha: Math.random() * 8 - 2,
        performanceData,
        drawdownData,
        rebalanceEvents,
      }
    })

    setResults(backtestResults.sort((a, b) => b.sharpeRatio - a.sharpeRatio))
    setSelectedResult(backtestResults[0])
    setIsRunning(false)
  }

  const exportResults = () => {
    if (!selectedResult) return

    const csvData = [
      ['Metric', 'Value'],
      ['Strategy', selectedResult.strategy],
      ['Total Return', `${selectedResult.totalReturn.toFixed(2)}%`],
      ['Annualized Return', `${selectedResult.annualizedReturn.toFixed(2)}%`],
      ['Max Drawdown', `${selectedResult.maxDrawdown.toFixed(2)}%`],
      ['Sharpe Ratio', selectedResult.sharpeRatio.toFixed(3)],
      ['Sortino Ratio', selectedResult.sortinoRatio.toFixed(3)],
      ['Calmar Ratio', selectedResult.calmarRatio.toFixed(3)],
      ['Win Rate', `${selectedResult.winRate.toFixed(1)}%`],
      ['Profit Factor', selectedResult.profitFactor.toFixed(2)],
      ['Volatility', `${selectedResult.volatility.toFixed(1)}%`],
      ['Beta', selectedResult.beta.toFixed(3)],
      ['Alpha', `${selectedResult.alpha.toFixed(2)}%`],
    ]

    const csvContent = csvData.map((row) => row.join(',')).join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${selectedResult.strategy}_backtest_results.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6 ">
      {/* Advanced Configuration */}
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="flex items-center">
            <Settings className="w-5 h-5 mr-2" />
            <h2 className="leading-6"> Advanced Backtesting Configuration</h2>
          </CardTitle>
          <CardDescription>Comprehensive historical simulation with advanced risk metrics for {pair}</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="basic" className="space-y-4">
            <TabsList className="grid w-full grid-cols-3 text-xs">
              <TabsTrigger value="basic" className="text-[10px] md:text-sm">
                Basic Settings
              </TabsTrigger>
              <TabsTrigger value="advanced" className="text-[10px] md:text-sm">
                Advanced
              </TabsTrigger>
              <TabsTrigger value="risk" className="text-[10px] md:text-sm">
                Risk Parameters
              </TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="pb-2">Timeframe</Label>
                  <Select value={timeframe} onValueChange={setTimeframe}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="30d">30 Days</SelectItem>
                      <SelectItem value="90d">90 Days</SelectItem>
                      <SelectItem value="180d">6 Months</SelectItem>
                      <SelectItem value="1y">1 Year</SelectItem>
                      <SelectItem value="2y">2 Years</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="pb-2">Initial Capital</Label>
                  <div className="text-2xl font-bold">${initialCapital.toLocaleString()}</div>
                </div>

                <div>
                  <Label className="pb-2">Range Width: ±{rangeWidth[0]}%</Label>
                  <Slider
                    value={rangeWidth}
                    onValueChange={setRangeWidth}
                    min={5}
                    max={50}
                    step={5}
                    className="w-full"
                  />
                </div>

                <div>
                  <Label className="pb-2">Rebalance Threshold: {rebalanceThreshold[0]}%</Label>
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
            </TabsContent>

            <TabsContent value="advanced" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Gas Price: {gasPrice[0]} SOL</Label>
                  <Slider
                    value={gasPrice}
                    onValueChange={setGasPrice}
                    min={0.0001}
                    max={0.01}
                    step={0.0001}
                    className="w-full"
                  />
                </div>

                <div>
                  <Label>Slippage: {slippage[0]}%</Label>
                  <Slider
                    value={slippage}
                    onValueChange={setSlippage}
                    min={0.1}
                    max={2}
                    step={0.1}
                    className="w-full"
                  />
                </div>

                <div>
                  <Label>Benchmark Strategy</Label>
                  <Select value={benchmarkStrategy} onValueChange={setBenchmarkStrategy}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hodl">HODL</SelectItem>
                      <SelectItem value="dca">DCA</SelectItem>
                      <SelectItem value="simple_lp">Simple LP</SelectItem>
                      <SelectItem value="market">Market Index</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch id="weekends" checked={includeWeekends} onCheckedChange={setIncludeWeekends} />
                  <Label htmlFor="weekends">Include Weekends</Label>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="risk" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Risk-Free Rate (%)</Label>
                  <Input
                    type="number"
                    value={riskFreeRate}
                    onChange={(e) => setRiskFreeRate(e.target.value)}
                    placeholder="4.5"
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex space-x-3 mt-6">
            <Button onClick={runAdvancedBacktest} disabled={isRunning} className="flex-1">
              {isRunning ? (
                <>
                  <Calculator className="w-4 h-4 mr-2 animate-spin" />
                  Running Advanced Backtest...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  Run Advanced Backtest
                </>
              )}
            </Button>
            {selectedResult && (
              <Button variant="outline" onClick={exportResults}>
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Backtesting Progress */}
      {isRunning && (
        <Card>
          <CardContent className="py-8">
            <div className="text-center space-y-4">
              <BarChart3 className="w-12 h-12 mx-auto animate-pulse text-primary" />
              <div>
                <h3 className="text-lg font-semibold">Running Comprehensive Backtest</h3>
                <p className="text-muted-foreground">
                  Analyzing {strategies.length} strategies over {timeframe}...
                </p>
              </div>
              <Progress value={75} className="w-full max-w-md mx-auto" />
              <div className="text-sm text-muted-foreground">
                Processing historical data, calculating risk metrics, and optimizing parameters...
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Results Overview */}
      {results.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Best Strategy</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold">{results[0]?.strategy}</div>
              <p className="text-xs text-muted-foreground">Sharpe: {results[0]?.sharpeRatio.toFixed(2)}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Return</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold">
                {(results.reduce((sum, r) => sum + r.totalReturn, 0) / results.length).toFixed(1)}%
              </div>
              <p className="text-xs text-muted-foreground">Across all strategies</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Max Drawdown</CardTitle>
              <TrendingDown className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold text-red-600">
                {Math.min(...results.map((r) => r.maxDrawdown)).toFixed(1)}%
              </div>
              <p className="text-xs text-muted-foreground">Worst case scenario</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Strategies Tested</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold">{results.length}</div>
              <p className="text-xs text-muted-foreground">Over {timeframe}</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Detailed Results */}
      {results.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Strategy List */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Strategy Rankings</h3>
            {results.map((result, index) => (
              <Card
                key={result.strategy}
                className={`cursor-pointer transition-all ${
                  selectedResult?.strategy === result.strategy ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => setSelectedResult(result)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <Badge variant={index === 0 ? 'default' : 'outline'} className="text-xs">
                        #{index + 1}
                      </Badge>
                      <span className="font-medium">{result.strategy}</span>
                    </div>
                    <div className="text-right">
                      <div className={`font-bold ${result.totalReturn >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {result.totalReturn >= 0 ? '+' : ''}
                        {result.totalReturn.toFixed(1)}%
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-xs text-muted-foreground">
                    <div>Sharpe: {result.sharpeRatio.toFixed(2)}</div>
                    <div>DD: {result.maxDrawdown.toFixed(1)}%</div>
                    <div>Win: {result.winRate.toFixed(0)}%</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Detailed Analysis */}
          {selectedResult && (
            <div className="lg:col-span-2 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{selectedResult.strategy} Analysis</span>
                    <Badge variant="outline">{selectedResult.timeframe}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="performance" className="space-y-4">
                    <TabsList className="grid w-full grid-cols-4">
                      <TabsTrigger value="performance">Performance</TabsTrigger>
                      <TabsTrigger value="risk">Risk Metrics</TabsTrigger>
                      <TabsTrigger value="trades">Rebalances</TabsTrigger>
                      <TabsTrigger value="comparison">Compare</TabsTrigger>
                    </TabsList>

                    <TabsContent value="performance" className="space-y-4">
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <div className="text-center p-3 bg-muted/20 rounded-lg">
                          <div className="text-2xl font-bold text-green-600">
                            {selectedResult.totalReturn.toFixed(1)}%
                          </div>
                          <div className="text-sm text-muted-foreground">Total Return</div>
                        </div>
                        <div className="text-center p-3 bg-muted/20 rounded-lg">
                          <div className="text-2xl font-bold">{selectedResult.annualizedReturn.toFixed(1)}%</div>
                          <div className="text-sm text-muted-foreground">Annualized</div>
                        </div>
                        <div className="text-center p-3 bg-muted/20 rounded-lg">
                          <div className="text-2xl font-bold text-green-600">
                            ${selectedResult.feesEarned.toLocaleString()}
                          </div>
                          <div className="text-sm text-muted-foreground">Fees Earned</div>
                        </div>
                      </div>

                      {/* Performance Chart Placeholder */}
                      <div className="h-64 bg-muted/10 rounded-lg flex items-center justify-center">
                        <div className="text-center text-muted-foreground">
                          <LineChart className="w-12 h-12 mx-auto mb-2" />
                          <p>Performance Chart</p>
                          <p className="text-xs">Portfolio vs Benchmark over time</p>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="risk" className="space-y-4">
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <div className="text-center p-3 bg-muted/20 rounded-lg">
                          <div className="text-2xl font-bold">{selectedResult.sharpeRatio.toFixed(2)}</div>
                          <div className="text-sm text-muted-foreground">Sharpe Ratio</div>
                        </div>
                        <div className="text-center p-3 bg-muted/20 rounded-lg">
                          <div className="text-2xl font-bold">{selectedResult.sortinoRatio.toFixed(2)}</div>
                          <div className="text-sm text-muted-foreground">Sortino Ratio</div>
                        </div>
                        <div className="text-center p-3 bg-muted/20 rounded-lg">
                          <div className="text-2xl font-bold text-red-600">
                            {selectedResult.maxDrawdown.toFixed(1)}%
                          </div>
                          <div className="text-sm text-muted-foreground">Max Drawdown</div>
                        </div>
                        <div className="text-center p-3 bg-muted/20 rounded-lg">
                          <div className="text-2xl font-bold">{selectedResult.volatility.toFixed(1)}%</div>
                          <div className="text-sm text-muted-foreground">Volatility</div>
                        </div>
                        <div className="text-center p-3 bg-muted/20 rounded-lg">
                          <div className="text-2xl font-bold">{selectedResult.beta.toFixed(2)}</div>
                          <div className="text-sm text-muted-foreground">Beta</div>
                        </div>
                        <div className="text-center p-3 bg-muted/20 rounded-lg">
                          <div className="text-2xl font-bold">{selectedResult.alpha.toFixed(1)}%</div>
                          <div className="text-sm text-muted-foreground">Alpha</div>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="trades" className="space-y-4">
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="text-center p-3 bg-muted/20 rounded-lg">
                          <div className="text-2xl font-bold">{selectedResult.rebalanceCount}</div>
                          <div className="text-sm text-muted-foreground">Total Rebalances</div>
                        </div>
                        <div className="text-center p-3 bg-muted/20 rounded-lg">
                          <div className="text-2xl font-bold">{selectedResult.gasSpent.toFixed(4)} SOL</div>
                          <div className="text-sm text-muted-foreground">Gas Spent</div>
                        </div>
                      </div>

                      <div className="space-y-2 max-h-64 overflow-y-auto">
                        {selectedResult.rebalanceEvents.slice(0, 10).map((event, index) => (
                          <div key={index} className="flex items-center justify-between p-2 bg-muted/10 rounded">
                            <div className="flex items-center space-x-2">
                              <Activity className="w-4 h-4 text-primary" />
                              <span className="text-sm">{event.reason}</span>
                            </div>
                            <div className="text-right text-sm">
                              <div>{event.date}</div>
                              <div className="text-muted-foreground">{event.cost.toFixed(4)} SOL</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </TabsContent>

                    <TabsContent value="comparison" className="space-y-4">
                      <div className="text-center p-8 text-muted-foreground">
                        <PieChart className="w-12 h-12 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">Strategy Comparison</h3>
                        <p>Compare multiple strategies side-by-side</p>
                        <Button variant="outline" className="mt-4 bg-transparent">
                          Add Comparison
                        </Button>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
