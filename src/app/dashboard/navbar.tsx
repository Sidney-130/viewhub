// 'use client'

// import { useState } from 'react'
// import { Zap, RefreshCw, Menu, X } from 'lucide-react'
// import { Badge } from '@/components/ui/badge'
// import { Button } from '@/components/ui/button'
// import { ConnectWalletButton } from '@/components/ConnectWallet'

// interface NavbarProps {
//   handleRefresh: () => void
//   isLoading: boolean
// }

// export default function Navbar({ handleRefresh, isLoading }: NavbarProps) {
//   const [isOpen, setIsOpen] = useState(false)

//   return (
//     <nav className="border-b border-border/40 backdrop-blur-sm bg-background/80">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex justify-between items-center h-16">
//           <div className="flex items-center space-x-2">
//             <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
//               <Zap className="w-5 h-5 text-primary-foreground" />
//             </div>
//             <span className="text-lg sm:text-xl font-bold">Viewhub</span>
//           </div>
//           <div className="flex items-center space-x-2 sm:space-x-4">
//             <Button variant="ghost" onClick={handleRefresh} disabled={isLoading} className="text-sm sm:text-base">
//               <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
//               Refresh
//             </Button>
//             <Badge
//               variant="secondary"
//               className="hidden sm:flex bg-green-500/10 text-green-600 border-green-500/20 items-center"
//             >
//               <div className="w-2 h-2 bg-green-500 rounded-full mr-2" />
//               {publicKey?.toString().slice(0, 4)}...
//               {publicKey?.toString().slice(-4)}
//             </Badge>
//             <WalletButton />
//           </div>
//         </div>
//       </div>
//     </nav>
//   )
// }
