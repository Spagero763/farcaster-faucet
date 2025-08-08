'use client'

import { useTipContract } from '@/hooks/useTipContract'
import { useContractRead } from 'wagmi'
import { formatEther } from 'viem'
import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Skeleton } from './ui/skeleton'

type PublicTip = {
  id: string
  from: string
  to: string
  amount: string
  message: string
  handle: string
  timestamp: number
}

function shorten(address: string) {
    if (!address) return ''
    return address.slice(0, 6) + '...' + address.slice(-4)
}

export default function RecentTipsFeed() {
  const contract = useTipContract()
  const [tips, setTips] = useState<PublicTip[]>([])

  const { data, isLoading, isError } = useContractRead({
    address: contract.address,
    abi: contract.abi,
    functionName: 'getRecentPublicTips',
    args: [10], // latest 10 public tips
    watch: true,
  })

  useEffect(() => {
    if (data) {
      const [
        ids,
        froms,
        tos,
        amounts,
        messages,
        handles,
        timestamps,
      ] = data as [
        bigint[],
        string[],
        string[],
        bigint[],
        string[],
        string[],
        bigint[]
      ]

      const tipsFormatted: PublicTip[] = (ids || []).map((id, i) => ({
        id: id.toString(),
        from: froms[i],
        to: tos[i],
        amount: formatEther(amounts[i]),
        message: messages[i],
        handle: handles[i],
        timestamp: Number(timestamps[i]),
      })).filter(tip => tip.id !== '0')

      setTips(tipsFormatted.reverse())
    }
  }, [data])

  if (isLoading) {
    return (
        <Card className="w-full max-w-md shadow-lg">
            <CardHeader>
                <CardTitle>📰 Recent Public Tips</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                </div>
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
        <Card className="w-full max-w-md shadow-lg">
            <CardHeader>
                <CardTitle>📰 Recent Public Tips</CardTitle>
            </CardHeader>
            <CardContent>
                <p>Error loading tips.</p>
            </CardContent>
        </Card>
    )
  }
  
  if (tips.length === 0) {
     return (
        <Card className="w-full max-w-md shadow-lg">
            <CardHeader>
                <CardTitle>📰 Recent Public Tips</CardTitle>
            </CardHeader>
            <CardContent>
                <p>No public tips found yet.</p>
            </CardContent>
        </Card>
    )
  }

  return (
    <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
            <CardTitle>📰 Recent Public Tips</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
        {tips.map((tip) => (
            <div key={tip.id} className="border rounded-lg p-3 bg-card text-sm space-y-1">
                <div className='flex justify-between items-center'>
                    <p><strong>From:</strong> {shorten(tip.from)}</p>
                    <p><strong>To:</strong> {tip.handle ? `@${tip.handle}` : shorten(tip.to)}</p>
                </div>
                <p><strong>Amount:</strong> {tip.amount} ETH</p>
                {tip.message && <p><strong>Message:</strong> "{tip.message}"</p>}
                <p className="text-muted-foreground text-xs pt-1">{new Date(tip.timestamp * 1000).toLocaleString()}</p>
            </div>
        ))}
        </CardContent>
    </Card>
  )
}
