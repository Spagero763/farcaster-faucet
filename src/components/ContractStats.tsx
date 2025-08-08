'use client'

import { useTipContract } from '@/hooks/useTipContract'
import { useContractRead } from 'wagmi'
import { formatEther } from 'viem'
import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Skeleton } from './ui/skeleton'

export default function ContractStats() {
  const contract = useTipContract()
  const [stats, setStats] = useState<{
    totalTips: string
    contractBalance: string
    feesCollected: string
  } | null>(null)

  const { data, isLoading, isError } = useContractRead({
    address: contract?.address,
    abi: contract?.abi,
    functionName: 'getContractStats',
    watch: true,
    enabled: !!contract,
  })

  useEffect(() => {
    if (data) {
      const [totalTips, contractBalance, feesCollected] = data as [bigint, bigint, bigint]
      setStats({
        totalTips: totalTips.toString(),
        contractBalance: formatEther(contractBalance),
        feesCollected: formatEther(feesCollected),
      })
    }
  }, [data])

  if (isLoading) {
    return (
        <Card className="w-full max-w-md shadow-lg">
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
        <Card className="w-full max-w-md shadow-lg">
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
    <Card className="w-full max-w-md shadow-lg">
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
