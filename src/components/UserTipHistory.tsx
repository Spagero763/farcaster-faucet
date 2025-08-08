'use client'

import { useAccount, useContractRead, useContractReads } from 'wagmi'
import { useTipContract } from '@/hooks/useTipContract'
import { formatEther } from 'viem'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Skeleton } from './ui/skeleton'

type TipDetails = readonly [string, string, bigint, string, string, bigint]

function shorten(address: string) {
    if (!address) return ''
    return address.slice(0, 6) + '...' + address.slice(-4)
}

export default function UserTipHistory() {
  const { address } = useAccount()
  const contract = useTipContract()

  const { data: tipIds, isLoading: isLoadingIds } = useContractRead({
    address: contract.address,
    abi: contract.abi,
    functionName: 'getUserTips',
    args: [address!, BigInt(0), BigInt(10)], // offset, limit
    watch: true,
    enabled: !!address,
  })

  const { data: tipDetails, isLoading: isLoadingDetails, isError } = useContractReads({
    contracts: (tipIds as bigint[] | undefined)?.filter(id => id !== 0n).map((id) => ({
      address: contract.address,
      abi: contract.abi,
      functionName: 'getTipDetails',
      args: [id],
    })) ?? [],
    enabled: !!tipIds && (tipIds as bigint[]).some(id => id !== 0n),
  })
  
  const isLoading = isLoadingIds || isLoadingDetails;

  if (isLoading && !tipDetails) {
    return (
        <Card className="w-full max-w-xl shadow-lg">
            <CardHeader>
                <CardTitle>🧾 Your Tip History</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                </div>
            </CardContent>
        </Card>
    )
  }

  if (isError) {
    return (
        <Card className="w-full max-w-xl shadow-lg">
            <CardHeader>
                <CardTitle>🧾 Your Tip History</CardTitle>
            </CardHeader>
            <CardContent>
                <p>Error loading your tip history.</p>
            </CardContent>
        </Card>
    )
  }
  
  const validTips = tipDetails?.filter(tip => tip.status === 'success' && tip.result && (tip.result as TipDetails)[0] !== '0x0000000000000000000000000000000000000000') ?? []

  if (validTips.length === 0) {
     return (
        <Card className="w-full max-w-xl shadow-lg">
            <CardHeader>
                <CardTitle>🧾 Your Tip History</CardTitle>
            </CardHeader>
            <CardContent>
                <p>You haven't sent or received any tips yet.</p>
            </CardContent>
        </Card>
    )
  }

  return (
    <Card className="w-full max-w-xl shadow-lg">
        <CardHeader>
            <CardTitle>🧾 Your Tip History</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
        {validTips.slice().reverse().map((tip, i) => {
          if (!tip.result) return null
          const [sender, recipient, amount, message, handle, timestamp] = tip.result as TipDetails;

          const isSender = sender.toLowerCase() === address?.toLowerCase();

          return (
            <div key={i} className="border rounded-lg p-3 bg-card text-sm space-y-1 break-all">
                 <div className='flex justify-between items-center'>
                    <p className="truncate">
                        <strong>{isSender ? 'To:' : 'From:'}</strong> 
                        {handle ? `@${handle}` : ` ${shorten(isSender ? recipient : sender)}`}
                    </p>
                    <p className={`font-bold ${isSender ? 'text-destructive' : 'text-green-500'}`}>
                      {isSender ? '-' : '+'}
                      {formatEther(amount)} ETH
                    </p>
                 </div>
                {message && <p className="truncate"><strong>Message:</strong> "{message}"</p>}
              <p className="text-muted-foreground text-xs pt-1">{new Date(Number(timestamp) * 1000).toLocaleString()}</p>
            </div>
          )
        })}
        </CardContent>
    </Card>
  )
}
