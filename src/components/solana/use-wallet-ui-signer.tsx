import { UiWalletAccount, useWalletAccountTransactionSendingSigner } from '@/react'
import { useSolana } from '@/components/solana/use-solana'

export function useWalletUiSigner() {
  const { account, cluster } = useSolana()

  return useWalletAccountTransactionSendingSigner(account as UiWalletAccount, cluster.id)
}
