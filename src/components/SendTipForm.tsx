'use client'

import { useState } from 'react'
import { parseEther } from 'viem'
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { useTipContract } from '@/hooks/useTipContract'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { Label } from './ui/label'
import { Checkbox } from './ui/checkbox'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card'
import { useToast } from '@/hooks/use-toast'
import { Loader2 } from 'lucide-react'

export default function SendTipForm() {
  const [to, setTo] = useState('')
  const [message, setMessage] = useState('')
  const [handle, setHandle] = useState('')
  const [amount, setAmount] = useState('')
  const [isPublic, setIsPublic] = useState(true)
  const { toast } = useToast()
  
  const contract = useTipContract()
  const { data: hash, writeContract, isPending: isWriting, error } = useWriteContract()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    writeContract({
        address: contract.address,
        abi: contract.abi,
        functionName: 'sendTip',
        args: [to, message, handle, isPublic],
        value: amount ? parseEther(amount) : undefined,
    })
  }

  const { isLoading: isPending, isSuccess } = useWaitForTransactionReceipt({ hash })

  if (isSuccess) {
    toast({
        title: "Tip Sent!",
        description: "Your transaction has been sent successfully.",
        action: (
          <a href={`https://sepolia.basescan.org/tx/${hash}`} target="_blank" rel="noopener noreferrer" className="underline">
            View on BaseScan
          </a>
        ),
    })
  }
  
  if (error) {
    toast({
        variant: "destructive",
        title: "Transaction Failed",
        description: error.message.split('\n')[0],
    })
  }

  const isProcessing = isWriting || isPending;

  return (
    <Card className="w-full max-w-md shadow-lg">
      <CardHeader>
        <CardTitle>Send a Tip</CardTitle>
        <CardDescription>Fill out the form below to send a tip.</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="recipient">Recipient Address</Label>
            <Input
              id="recipient"
              type="text"
              placeholder="0x..."
              value={to}
              onChange={(e) => setTo(e.target.value)}
              required
              disabled={isProcessing}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <Input
              id="message"
              type="text"
              placeholder="Great post!"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              disabled={isProcessing}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="handle">Farcaster Handle</Label>
            <Input
              id="handle"
              type="text"
              placeholder="@username"
              value={handle}
              onChange={(e) => setHandle(e.target.value)}
              required
              disabled={isProcessing}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="amount">Amount (ETH)</Label>
            <Input
              id="amount"
              type="number"
              placeholder="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              disabled={isProcessing}
              step="any"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
                id="isPublic"
                checked={isPublic} 
                onCheckedChange={() => setIsPublic(!isPublic)}
                disabled={isProcessing}
            />
            <Label htmlFor="isPublic">Make tip public</Label>
          </div>
        </CardContent>
        <CardFooter>
          <Button
            type="submit"
            className="w-full"
            disabled={isProcessing}
          >
            {isProcessing ? <><Loader2 className="animate-spin" /> Sending...</> : 'Send Tip'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
