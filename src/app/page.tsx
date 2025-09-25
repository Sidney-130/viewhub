'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, Wallet, TrendingUp, BarChart3, Zap } from 'lucide-react'
import Link from 'next/link'

export default function HomePage() {
  const [isConnected, setIsConnected] = useState(false)

  const handleConnectWallet = () => {
    setIsConnected(true)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <nav className="border-b border-border/40 backdrop-blur-sm bg-background/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold">Viewhub</span>
            </div>
            <div className="flex items-center space-x-4">
              {isConnected ? (
                <>
                  <Link href="/dashboard">
                    <Button variant="ghost">Dashboard</Button>
                  </Link>
                  <Badge variant="secondary" className="bg-green-500/10 text-green-600 border-green-500/20">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2" />
                    Connected
                  </Badge>
                </>
              ) : (
                <Button onClick={handleConnectWallet} className="bg-primary hover:bg-primary/90">
                  <Wallet className="w-4 h-4 mr-2" />
                  Connect Wallet
                </Button>
              )}
            </div>
          </div>
        </div>
      </nav>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-6 bg-primary/10 text-primary border-primary/20">
            Powered by Saros Finance DLMM SDK
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-balance">
            Advanced DLMM Position
            <span className="text-primary"> Management</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto text-pretty">
            Real-time position tracking, automated rebalancing suggestions, and backtesting tools for sophisticated DeFi
            liquidity providers.
          </p>
          {isConnected ? (
            <Link href="/dashboard">
              <Button size="lg" className="bg-primary hover:bg-primary/90">
                Open Dashboard
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          ) : (
            <Button size="lg" onClick={handleConnectWallet} className="bg-primary hover:bg-primary/90">
              <Wallet className="w-4 h-4 mr-2" />
              Connect Wallet to Start
            </Button>
          )}
        </div>
        <div className="grid md:grid-cols-3 gap-8 mt-20">
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>Real-time Dashboard</CardTitle>
              <CardDescription>
                Monitor all your DLMM positions with live TVL, active bin ranges, and fees earned across all pools.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>Smart Rebalancing</CardTitle>
              <CardDescription>
                Automated analysis identifies out-of-range positions and suggests optimal rebalancing strategies with
                gas estimates.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <BarChart3 className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>Backtesting Suite</CardTitle>
              <CardDescription>
                Simulate different strategies and analyze historical performance to optimize your liquidity provision
                approach.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    </div>
  )
}
