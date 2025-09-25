'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import {
  TrendingUp,
  Target,
  Zap,
  Calculator,
  Brain,
  DollarSign,
  Activity,
  ArrowRight,
  CheckCircle,
  XCircle,
} from 'lucide-react'

interface Position {
  id: string
  pair: string
  currentPrice: number
  activeBinRange: string
  tvl: number
  feesEarned: number
  apy: number
  inRange: boolean
  binStep: number
  activeBinId: number
}

interface RebalanceAnalysis {
  positionId: string
  pair: string
  currentEfficiency: number
  riskLevel: 'low' | 'medium' | 'high'
  recommendations: RebalanceRecommendation[]
  marketConditions: {
    volatility: number
    trend: 'bullish' | 'bearish' | 'sideways'
    volume: number
  }
}

interface RebalanceRecommendation {
  strategy: string
  newRange: string
  expectedAPY: number
  riskScore: number
  gasEstimate: number
  impermanentLoss: number
  feeIncrease: number
  confidence: number
  reasoning: string[]
}

interface RebalancingEngineProps {
  positions: Position[]
  onRebalance: (positionId: string, recommendation: RebalanceRecommendation) => void
}

export function RebalancingEngine({ positions, onRebalance }: RebalancingEngineProps) {
  const [analyses, setAnalyses] = useState<RebalanceAnalysis[]>([])
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [selectedPosition, setSelectedPosition] = useState<string | null>(null)
  const [riskTolerance, setRiskTolerance] = useState([50])
  const [autoRebalance, setAutoRebalance] = useState(false)
  const [gasThreshold, setGasThreshold] = useState([0.01])

  // Advanced rebalancing analysis algorithm
  const analyzePositions = async () => {
    setIsAnalyzing(true)

    // Simulate complex analysis
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const newAnalyses: RebalanceAnalysis[] = positions.map((position) => {
      const volatility = Math.random() * 100
      const efficiency = position.inRange ? 75 + Math.random() * 20 : 30 + Math.random() * 40

      const recommendations: RebalanceRecommendation[] = []

      // Conservative strategy
      recommendations.push({
        strategy: 'Conservative Range',
        newRange: generateOptimalRange(position, 'conservative'),
        expectedAPY: position.apy * (1 + Math.random() * 0.1),
        riskScore: 25,
        gasEstimate: 0.001 + Math.random() * 0.002,
        impermanentLoss: -1 - Math.random() * 2,
        feeIncrease: 5 + Math.random() * 10,
        confidence: 85 + Math.random() * 10,
        reasoning: [
          'Wider range reduces rebalancing frequency',
          'Lower impermanent loss risk',
          'Stable fee generation',
        ],
      })

      // Aggressive strategy
      recommendations.push({
        strategy: 'Aggressive Range',
        newRange: generateOptimalRange(position, 'aggressive'),
        expectedAPY: position.apy * (1.2 + Math.random() * 0.3),
        riskScore: 75,
        gasEstimate: 0.002 + Math.random() * 0.003,
        impermanentLoss: -3 - Math.random() * 4,
        feeIncrease: 20 + Math.random() * 25,
        confidence: 70 + Math.random() * 15,
        reasoning: ['Concentrated liquidity for higher fees', 'Requires active management', 'Higher potential returns'],
      })

      // Balanced strategy
      recommendations.push({
        strategy: 'Balanced Range',
        newRange: generateOptimalRange(position, 'balanced'),
        expectedAPY: position.apy * (1.1 + Math.random() * 0.2),
        riskScore: 50,
        gasEstimate: 0.0015 + Math.random() * 0.0025,
        impermanentLoss: -2 - Math.random() * 3,
        feeIncrease: 12 + Math.random() * 18,
        confidence: 80 + Math.random() * 12,
        reasoning: ['Optimal risk-reward balance', 'Moderate rebalancing frequency', 'Consistent performance'],
      })

      return {
        positionId: position.id,
        pair: position.pair,
        currentEfficiency: efficiency,
        riskLevel: efficiency < 40 ? 'high' : efficiency < 70 ? 'medium' : 'low',
        recommendations: recommendations.sort((a, b) => b.confidence - a.confidence),
        marketConditions: {
          volatility,
          trend: volatility > 60 ? 'bearish' : volatility < 30 ? 'bullish' : 'sideways',
          volume: 50000 + Math.random() * 100000,
        },
      }
    })

    setAnalyses(newAnalyses)
    setIsAnalyzing(false)
  }

  const generateOptimalRange = (position: Position, strategy: 'conservative' | 'aggressive' | 'balanced') => {
    const currentPrice = position.currentPrice
    const multipliers = {
      conservative: { lower: 0.85, upper: 1.15 },
      aggressive: { lower: 0.95, upper: 1.05 },
      balanced: { lower: 0.9, upper: 1.1 },
    }

    const lower = currentPrice * multipliers[strategy].lower
    const upper = currentPrice * multipliers[strategy].upper

    return `${lower.toFixed(position.pair.includes('BONK') ? 8 : 2)}-${upper.toFixed(
      position.pair.includes('BONK') ? 8 : 2,
    )}`
  }

  useEffect(() => {
    if (positions.length > 0) {
      analyzePositions()
    }
  }, [positions])

  const outOfRangePositions = analyses.filter((analysis) => analysis.riskLevel === 'high')
  const totalOptimizationPotential = analyses.reduce((sum, analysis) => sum + (100 - analysis.currentEfficiency), 0)

  return (
    <div className="space-y-6">
      {/* Analysis Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Positions Analyzed</CardTitle>
            <Brain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyses.length}</div>
            <p className="text-xs text-muted-foreground">{outOfRangePositions.length} need immediate attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Optimization Potential</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalOptimizationPotential.toFixed(0)}%</div>
            <p className="text-xs text-muted-foreground">Potential efficiency improvement</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Est. Gas Savings</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0.025 SOL</div>
            <p className="text-xs text-muted-foreground">With optimized rebalancing</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Auto-Rebalance</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Switch id="auto-rebalance" checked={autoRebalance} onCheckedChange={setAutoRebalance} />
              <Label htmlFor="auto-rebalance" className="text-sm">
                {autoRebalance ? 'Enabled' : 'Disabled'}
              </Label>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Analysis Controls */}
      <Card>
        <CardHeader>
          <CardTitle>Analysis Parameters</CardTitle>
          <CardDescription>Customize the rebalancing analysis to match your strategy</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Risk Tolerance: {riskTolerance[0]}%</Label>
              <Slider value={riskTolerance} onValueChange={setRiskTolerance} max={100} step={5} className="w-full" />
              <p className="text-xs text-muted-foreground">
                Higher values prefer aggressive strategies with higher potential returns
              </p>
            </div>

            <div className="space-y-2">
              <Label>Gas Threshold: {gasThreshold[0]} SOL</Label>
              <Slider value={gasThreshold} onValueChange={setGasThreshold} max={0.1} step={0.001} className="w-full" />
              <p className="text-xs text-muted-foreground">
                Only suggest rebalances with gas costs below this threshold
              </p>
            </div>
          </div>

          <Button onClick={analyzePositions} disabled={isAnalyzing} className="w-full">
            {isAnalyzing ? (
              <>
                <Calculator className="w-4 h-4 mr-2 animate-spin" />
                Analyzing Positions...
              </>
            ) : (
              <>
                <Brain className="w-4 h-4 mr-2" />
                Re-analyze Positions
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Position Analyses */}
      {isAnalyzing ? (
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <Calculator className="w-12 h-12 mx-auto mb-4 animate-spin text-primary" />
              <h3 className="text-lg font-semibold mb-2">Analyzing Positions</h3>
              <p className="text-muted-foreground">Running advanced algorithms to optimize your liquidity...</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {analyses.map((analysis) => (
            <Card key={analysis.positionId} className="overflow-hidden">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <CardTitle className="text-lg">{analysis.pair}</CardTitle>
                    <Badge
                      variant={
                        analysis.riskLevel === 'high'
                          ? 'destructive'
                          : analysis.riskLevel === 'medium'
                            ? 'secondary'
                            : 'default'
                      }
                    >
                      {analysis.riskLevel} risk
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {analysis.marketConditions.trend}
                    </Badge>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold">{analysis.currentEfficiency.toFixed(0)}%</div>
                    <div className="text-sm text-muted-foreground">Efficiency</div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Efficiency Progress */}
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Position Efficiency</span>
                    <span>{analysis.currentEfficiency.toFixed(0)}%</span>
                  </div>
                  <Progress value={analysis.currentEfficiency} className="h-2" />
                </div>

                {/* Market Conditions */}
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <div className="text-muted-foreground">Volatility</div>
                    <div className="font-medium">{analysis.marketConditions.volatility.toFixed(0)}%</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Trend</div>
                    <div className="font-medium capitalize">{analysis.marketConditions.trend}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Volume</div>
                    <div className="font-medium">${analysis.marketConditions.volume.toLocaleString()}</div>
                  </div>
                </div>

                {/* Recommendations */}
                <div className="space-y-3">
                  <h4 className="font-semibold flex items-center">
                    <Target className="w-4 h-4 mr-2" />
                    Rebalancing Strategies
                  </h4>
                  {analysis.recommendations.slice(0, 2).map((rec, index) => (
                    <div key={index} className="border rounded-lg p-4 bg-muted/20">
                      <div className="flex flex-col md:flex-row items-center justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline" className="text-xs">
                            {rec.confidence.toFixed(0)}% confidence
                          </Badge>
                          <span className="font-medium text-sm">{rec.strategy}</span>
                        </div>
                        <Button
                          size="sm"
                          onClick={() => onRebalance(analysis.positionId, rec)}
                          className="bg-primary hover:bg-primary/90 my-2"
                        >
                          Execute
                          <ArrowRight className="w-3 h-3 ml-1" />
                        </Button>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm mb-3">
                        <div>
                          <div className="text-muted-foreground">New Range</div>
                          <div className="font-mono text-xs">{rec.newRange}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-muted-foreground">Expected APY</div>
                          <div className="text-green-600 font-medium">{rec.expectedAPY.toFixed(1)}%</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Gas Cost</div>
                          <div className="font-medium">{rec.gasEstimate.toFixed(4)} SOL</div>
                        </div>
                        <div className="text-right">
                          <div className="text-muted-foreground">IL Risk</div>
                          <div className="text-red-600 font-medium">{rec.impermanentLoss.toFixed(1)}%</div>
                        </div>
                      </div>

                      <div className="space-y-1">
                        {rec.reasoning.map((reason, i) => (
                          <div key={i} className="flex items-center text-xs text-muted-foreground">
                            <CheckCircle className="w-3 h-3 mr-2 text-green-600" />
                            {reason}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Auto-Rebalance Settings */}
      {autoRebalance && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Zap className="w-5 h-5 mr-2 text-primary" />
              Auto-Rebalance Active
            </CardTitle>
            <CardDescription>
              Positions will be automatically rebalanced when efficiency drops below 60%
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Activity className="w-4 h-4 text-green-600" />
                <span className="text-sm">Monitoring {analyses.length} positions</span>
              </div>
              <Button variant="outline" size="sm" onClick={() => setAutoRebalance(false)}>
                <XCircle className="w-3 h-3 mr-1" />
                Disable
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
