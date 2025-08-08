'use client'

import { useTipContract } from '@/hooks/useTipContract'
import { useContractRead } from 'wagmi'
import { formatEther } from 'viem'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Skeleton } from './ui/skeleton'

export default function ContractStats() {
  const contract = useTipContract()
  
  const { data, isLoading, isError } = useContractRead({
    address: contract.address,
    abi: contract.abi,
    functionName: 'getContractStats',
    watch: true,
  })

  const stats = data ? {
    totalTips: (data as [bigint, bigint, bigint])[0].toString(),
    contractBalance: formatEther((data as [bigint, bigint, bigint])[1]),
    feesCollected: formatEther((data as [bigint, bigint, bigint])[2]),
  } : null

  if (isLoading) {
    return (
        <Card className="w-full max-w-xl shadow-lg">
            <CardHeader>
                <CardTitle>📊 Contract Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-2/3" />
            </CardContent>
        </Card>
    )
  }

  if (isError || !stats) {
    return (
        <Card className="w-full max-w-xl shadow-lg">
            <CardHeader>
                <CardTitle>📊 Contract Stats</CardTitle>
            </CardHeader>
            <CardContent>
                <p>Error loading stats.</p>
            </CardContent>
        </Card>
    )
  }

  return (
    <Card className="w-full max-w-xl shadow-lg">
        <CardHeader>
            <CardTitle>📊 Contract Stats</CardTitle>
        </CardHeader>
        <CardContent className="text-sm space-y-2">
            <p><strong>Total Tips Sent:</strong> {stats.totalTips}</p>
            <p><strong>Contract Balance:</strong> {stats.contractBalance} ETH</p>
            <p><strong>Platform Fees Collected:</strong> {stats.feesCollected} ETH</p>
        </CardContent>
    </Card>
  )
}
