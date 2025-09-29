// // PoolCreator.tsx
// 'use client'

// import { useEffect, useState } from 'react'
// import { useWallet, useConnection } from '@solana/wallet-adapter-react'
// import { PublicKey, Connection, Transaction, SystemProgram } from '@solana/web3.js'
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
// import { Button } from '@/components/ui/button'
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
// import { Input } from '@/components/ui/input'
// import { Label } from '@/components/ui/label'
// import { Badge } from '@/components/ui/badge'
// import { Loader2, Plus, ExternalLink, RefreshCcw } from 'lucide-react'
// import { BIN_STEP_CONFIGS } from '@saros-finance/dlmm-sdk'

// import { createDLMMPool, DEVNET_TOKENS, getDexInfo, fetchUserPositions } from './saros-dlmm-service'

// import {
//   getAssociatedTokenAddress,
//   createAssociatedTokenAccountInstruction,
//   createSyncNativeInstruction,
// } from '@solana/spl-token'
// import { LAMPORTS_PER_SOL } from '@solana/web3.js'

// // helper: wrap 1 SOL → WSOL
// async function wrapSOL(
//   connection: Connection,
//   publicKey: PublicKey,
//   sendTransaction: (tx: Transaction, conn: Connection) => Promise<string>,
//   amountSOL = 1,
// ): Promise<string> {
//   const lamports = Math.floor(amountSOL * LAMPORTS_PER_SOL)
//   const wsolMint = new PublicKey('So11111111111111111111111111111111111111112')
//   const ata = await getAssociatedTokenAddress(wsolMint, publicKey)
//   const tx = new Transaction()

//   tx.add(createAssociatedTokenAccountInstruction(publicKey, ata, publicKey, wsolMint))
//   tx.add(
//     SystemProgram.transfer({
//       fromPubkey: publicKey,
//       toPubkey: ata,
//       lamports,
//     }),
//   )
//   tx.add(createSyncNativeInstruction(ata))

//   const sig = await sendTransaction(tx, connection)
//   await connection.confirmTransaction(sig, 'confirmed')
//   return ata.toBase58()
// }

// export function PoolCreator() {
//   const { publicKey, sendTransaction } = useWallet()
//   const { connection } = useConnection()

//   const [isCreating, setIsCreating] = useState(false)
//   const [isWrapping, setIsWrapping] = useState(false)
//   const [createdPool, setCreatedPool] = useState<string | null>(null)
//   const [error, setError] = useState<string | null>(null)
//   const [positions, setPositions] = useState<any[] | null>(null)

//   const [tokenBase, setTokenBase] = useState<string>('')
//   const [tokenQuote, setTokenQuote] = useState<string>('')
//   const [binStep, setBinStep] = useState<number>(25)
//   const [ratePrice, setRatePrice] = useState<number>(1)

//   const dexInfo = getDexInfo()

//   // load user positions
//   useEffect(() => {
//     if (!publicKey) {
//       setPositions(null)
//       return
//     }
//     let mounted = true
//     ;(async () => {
//       try {
//         const pos = await fetchUserPositions(publicKey)
//         if (!mounted) return
//         const normalized = Array.isArray(pos) ? pos : (pos?.positions ?? [])
//         setPositions(normalized)
//       } catch (err) {
//         console.error('fetch positions failed', err)
//         setPositions([])
//       }
//     })()
//     return () => {
//       mounted = false
//     }
//   }, [publicKey])

//   const handleWrapSOL = async () => {
//     if (!publicKey) {
//       setError('Connect wallet first')
//       return
//     }
//     setIsWrapping(true)
//     setError(null)
//     try {
//       const ata = await wrapSOL(connection, publicKey, sendTransaction, 1)
//       console.log('WSOL ATA:', ata)
//       alert(`Wrapped 1 SOL into WSOL (ATA ${ata})`)
//     } catch (err: any) {
//       console.error('wrap failed', err)
//       setError(err?.message ?? String(err))
//     } finally {
//       setIsWrapping(false)
//     }
//   }

//   const handleCreatePool = async () => {
//     if (!publicKey) {
//       setError('Please connect wallet')
//       return
//     }
//     if (!tokenBase || !tokenQuote) {
//       setError('Select base and quote tokens')
//       return
//     }
//     if (tokenBase === tokenQuote) {
//       setError('Base and quote must differ')
//       return
//     }

//     setIsCreating(true)
//     setError(null)

//     try {
//       const baseToken = DEVNET_TOKENS[tokenBase as keyof typeof DEVNET_TOKENS]
//       const quoteToken = DEVNET_TOKENS[tokenQuote as keyof typeof DEVNET_TOKENS]

//       const { transaction, pairAddress } = await createDLMMPool({
//         tokenBase: { mintAddress: baseToken.mintAddress.toString(), decimal: baseToken.decimals },
//         tokenQuote: { mintAddress: quoteToken.mintAddress.toString(), decimal: quoteToken.decimals },
//         binStep,
//         ratePrice,
//         payer: publicKey,
//       })

//       // ensure recentBlockhash + lastValidBlockHeight
//       const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash()
//       transaction.feePayer = publicKey
//       transaction.recentBlockhash = blockhash
//       ;(transaction as any).lastValidBlockHeight = lastValidBlockHeight // avoid type clash

//       // unify type mismatch (SDK vs local)
//       const tx = transaction as unknown as Transaction

//       // debug print
//       console.log(
//         'Transaction instructions:',
//         tx.instructions.map((ix) => ({
//           programId: ix.programId.toBase58(),
//           keys: ix.keys.map((k) => k.pubkey.toBase58()),
//         })),
//       )

//       const sig = await sendTransaction(tx, connection)
//       console.log('createPair signature', sig)

//       await connection.confirmTransaction({ signature: sig, blockhash, lastValidBlockHeight }, 'confirmed')

//       setCreatedPool(pairAddress.toString())
//     } catch (err: any) {
//       console.error('Pool creation error', err)

//       // run simulation for details
//       try {
//         const sim = await connection.simulateTransaction(err.transaction ?? new Transaction())
//         console.log('Simulation logs:', sim.value.logs)
//       } catch (_) {}

//       setError(err?.message ?? String(err))
//     } finally {
//       setIsCreating(false)
//     }
//   }

//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle>Create DLMM Pool</CardTitle>
//         <CardDescription>Create a new pool on Saros (devnet)</CardDescription>
//         <div className="flex items-center gap-2 text-sm text-muted-foreground">
//           <Badge variant="outline">{dexInfo.name}</Badge>
//           <span className="font-mono text-xs">{dexInfo.programId.slice(0, 8)}...</span>
//         </div>
//       </CardHeader>

//       <CardContent className="space-y-6">
//         <Button onClick={handleWrapSOL} disabled={isWrapping} variant="secondary" className="w-full">
//           {isWrapping ? (
//             <>
//               <Loader2 className="w-4 h-4 mr-2 animate-spin" />
//               Wrapping...
//             </>
//           ) : (
//             <>
//               <RefreshCcw className="w-4 h-4 mr-2" />
//               Wrap 1 SOL → WSOL
//             </>
//           )}
//         </Button>

//         {createdPool && (
//           <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
//             <div className="flex items-center justify-between">
//               <div>
//                 <h3 className="font-semibold text-green-600">Pool Created</h3>
//                 <p className="text-sm text-muted-foreground mt-1">
//                   Address: <span className="font-mono">{createdPool}</span>
//                 </p>
//               </div>
//               <Button
//                 variant="outline"
//                 size="sm"
//                 onClick={() =>
//                   window.open(`https://explorer.solana.com/address/${createdPool}?cluster=devnet`, '_blank')
//                 }
//               >
//                 <ExternalLink className="w-4 h-4 mr-2" />
//                 View
//               </Button>
//             </div>
//           </div>
//         )}

//         {/* form */}
//         <div className="grid grid-cols-2 gap-4">
//           <div>
//             <Label>Base</Label>
//             <Select value={tokenBase} onValueChange={setTokenBase}>
//               <SelectTrigger>
//                 <SelectValue placeholder="Select base" />
//               </SelectTrigger>
//               <SelectContent>
//                 {Object.entries(DEVNET_TOKENS).map(([k, t]) => (
//                   <SelectItem key={k} value={k}>
//                     {t.symbol} — {t.name}
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>
//           </div>
//           <div>
//             <Label>Quote</Label>
//             <Select value={tokenQuote} onValueChange={setTokenQuote}>
//               <SelectTrigger>
//                 <SelectValue placeholder="Select quote" />
//               </SelectTrigger>
//               <SelectContent>
//                 {Object.entries(DEVNET_TOKENS).map(([k, t]) => (
//                   <SelectItem key={k} value={k}>
//                     {t.symbol} — {t.name}
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>
//           </div>
//         </div>

//         <div className="grid grid-cols-2 gap-4">
//           <div>
//             <Label>Bin Step (bps)</Label>
//             <Select value={binStep.toString()} onValueChange={(v) => setBinStep(Number(v))}>
//               <SelectTrigger>
//                 <SelectValue />
//               </SelectTrigger>
//               <SelectContent>
//                 {BIN_STEP_CONFIGS.map((c) => (
//                   <SelectItem key={c.binStep} value={c.binStep.toString()}>
//                     {c.binStep} bps ({(c.binStep / 100).toFixed(2)}%)
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>
//           </div>
//           <div>
//             <Label>Rate Price</Label>
//             <Input value={ratePrice} onChange={(e) => setRatePrice(Number(e.target.value))} type="number" step="0.1" />
//           </div>
//         </div>

//         {error && <div className="text-destructive text-sm">{error}</div>}

//         <Button onClick={handleCreatePool} disabled={isCreating || !tokenBase || !tokenQuote} className="w-full">
//           {isCreating ? (
//             <>
//               <Loader2 className="w-4 h-4 mr-2 animate-spin" />
//               Creating...
//             </>
//           ) : (
//             <>
//               <Plus className="w-4 h-4 mr-2" />
//               Create DLMM Pool
//             </>
//           )}
//         </Button>

//         {positions && positions.length > 0 && (
//           <div>
//             <h4 className="font-semibold">Your Positions</h4>
//             {positions.map((p: any) => (
//               <div key={p.id ?? p.position ?? JSON.stringify(p)} className="font-mono text-xs">
//                 {JSON.stringify(p).slice(0, 200)}...
//               </div>
//             ))}
//           </div>
//         )}
//       </CardContent>
//     </Card>
//   )
// }
