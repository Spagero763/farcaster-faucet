'use client'

import { useTipContract } from '@/hooks/useTipContract'
import { useAccount, useContractRead } from 'wagmi'
import { formatEther } from 'viem'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Skeleton } from './ui/skeleton'

export default function UserStats() {
  const { address } = useAccount()
  const contract = useTipContract()

  const { data, isLoading, isError } = useContractRead({
    address: contract.address,
    abi: contract.abi,
    functionName: 'getUserStats',
    args: [address],
    watch: true,
    enabled: !!address && !!contract,
  })

  if (!address) return null

  if (isLoading) {
    return (
        <Card className="w-full max-w-md shadow-lg">
            <CardHeader>
                <CardTitle>👤 Your Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-4 w-1/4" />
            </CardContent>
        </Card>
    )
  }

  if (isError || !data) {
    return (
        <Card className="w-full max-w-md shadow-lg">
            <CardHeader>
                <CardTitle>👤 Your Stats</CardTitle>
            </CardHeader>
            <CardContent>
                <p>Error loading your stats.</p>
            </CardContent>
        </Card>
    )
  }

  const [totalTipped, totalReceived, tipCount, handle] = data as [
    bigint,
    bigint,
    bigint,
    string
  ]

  return (
    <Card className="w-full max-w-md shadow-lg bg-primary/10">
      <CardHeader>
        <CardTitle>👤 Your Stats</CardTitle>
      </CardHeader>
      <CardContent className="text-sm space-y-2">
        <p><strong>Farcaster Handle:</strong> @{handle || 'Not set'}</p>
        <p><strong>Total Tipped:</strong> {formatEther(totalTipped)} ETH</p>
        <p><strong>Total Received:</strong> {formatEther(totalReceived)} ETH</p>
        <p><strong>Your Tip Count:</strong> {tipCount.toString()}</p>
      </CardContent>
    </Card>
  )
}
