'use client'

import { useState, useEffect } from 'react'
import { useWriteContract, useWaitForTransactionReceipt, useAccount } from 'wagmi'
import { useTipContract } from '@/hooks/useTipContract'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { Label } from './ui/label'
import { useToast } from '@/hooks/use-toast'
import { Loader2 } from 'lucide-react'

export default function UpdateHandleForm() {
  const [handle, setHandle] = useState('')
  const { address } = useAccount()
  const contract = useTipContract()
  const { toast } = useToast()

  const { data: hash, writeContract, isPending: isWriting, error, reset } = useWriteContract()

  const { isLoading: isPending, isSuccess } = useWaitForTransactionReceipt({ hash })

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (writeContract) {
      writeContract({
        address: contract.address,
        abi: contract.abi,
        functionName: 'updateFarcasterHandle',
        args: [handle],
      })
    }
  }

  useEffect(() => {
    if (isSuccess) {
      toast({
        title: "Handle Updated!",
        description: "Your Farcaster handle has been successfully updated.",
      })
      setHandle('')
      reset()
    }
  }, [isSuccess, toast, reset])
  
  useEffect(() => {
    if (error) {
      toast({
        variant: "destructive",
        title: "Update Failed",
        description: error.message.split('\n')[0],
      })
      reset()
    }
  }, [error, toast, reset])

  if (!address) return null

  const isProcessing = isWriting || isPending;

  return (
    <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
            <CardTitle>🔗 Update Farcaster Handle</CardTitle>
            <CardDescription>Link your address to your Farcaster handle.</CardDescription>
        </CardHeader>
        <form onSubmit={onSubmit}>
            <CardContent>
                <div className="space-y-2">
                    <Label htmlFor="handle-update">Farcaster Handle</Label>
                    <Input
                        id="handle-update"
                        type="text"
                        placeholder="@username"
                        value={handle}
                        onChange={(e) => setHandle(e.target.value)}
                        required
                        disabled={isProcessing}
                    />
                </div>
            </CardContent>
            <CardFooter>
                <Button 
                    type="submit" 
                    className="w-full"
                    disabled={isProcessing || handle.length < 3}
                >
                    {isProcessing ? <><Loader2 className="animate-spin" /> : null}
                    {isProcessing ? 'Updating...' : 'Update Handle'}
                </Button>
            </CardFooter>
        </form>
         {hash && (
            <div className='p-4 pt-0 text-center text-sm'>
                 <a href={`https://sepolia.basescan.org/tx/${hash}`} target="_blank" rel="noopener noreferrer" className="underline text-muted-foreground">
                    View transaction on BaseScan
                 </a>
            </div>
        )}
    </Card>
  )
}
