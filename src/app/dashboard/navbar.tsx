'use client'

import { useState } from 'react'
import { Zap, RefreshCw, Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ConnectWalletButton } from '@/components/ConnectWallet'

interface NavbarProps {
  handleRefresh: () => void
  isLoading: boolean
}

export default function Navbar({ handleRefresh, isLoading }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="border-b border-border/40 backdrop-blur-sm bg-background/80 relative z-50">
      <div className="md:max-w-7xl w-full px-4 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo + Brand */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">Viewhub</span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="ghost" onClick={handleRefresh} disabled={isLoading}>
              <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>

            <ConnectWalletButton />
          </div>

          {/* Mobile Hamburger */}
          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="p-2 rounded-md hover:bg-accent transition">
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {isOpen && (
          <div className="absolute bg-background w-full md:hidden mt-2 space-y-3 pb-4 pt-3 border-b border-gray/40 rounded-b-2xl">
            <Button variant="ghost" onClick={handleRefresh} disabled={isLoading} className="w-full justify-start">
              <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>

            <ConnectWalletButton />
          </div>
        )}
      </div>
    </nav>
  )
}
