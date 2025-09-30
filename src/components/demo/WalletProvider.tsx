'use client'

import { type FC, type ReactNode, useMemo } from 'react'
import { ConnectionProvider, WalletProvider as SolanaWalletProvider } from '@solana/wallet-adapter-react'
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base'
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui'
import { PhantomWalletAdapter, SolflareWalletAdapter, TorusWalletAdapter } from '@solana/wallet-adapter-wallets'

// Import wallet adapter CSS
import '@solana/wallet-adapter-react-ui/styles.css'

interface WalletProviderProps {
  children: ReactNode
}

export const WalletProvider: FC<WalletProviderProps> = ({ children }) => {
  // Use devnet for development
  const network = WalletAdapterNetwork.Devnet

  // Use Helius RPC for better performance on devnet
  const endpoint = useMemo(
    () => 'https://devnet.helius-rpc.com/?api-key=f831b443-8520-4f01-8228-59af9bb829b7',
    [network],
  )

  const wallets = useMemo(
    () => [new PhantomWalletAdapter(), new SolflareWalletAdapter(), new TorusWalletAdapter()],
    [network],
  )

  return (
    <ConnectionProvider endpoint={endpoint}>
      <SolanaWalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </SolanaWalletProvider>
    </ConnectionProvider>
  )
}
