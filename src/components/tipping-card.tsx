"use client";

import { useEffect, useState } from "react";
import { useAccount, useBalance, useSendTransaction, useWaitForTransactionReceipt } from "wagmi";
import { isAddress, parseEther } from "viem";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2, CheckCircle, AlertTriangle } from "lucide-react";

export function TippingCard() {
  const { address, isConnected } = useAccount();
  const { data: balance } = useBalance({ address });
  const { toast } = useToast();

  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [isRecipientValid, setIsRecipientValid] = useState(true);

  const { data: hash, sendTransaction, isPending: isSendPending, error: sendError } = useSendTransaction();

  const { isLoading: isConfirming, isSuccess: isConfirmed, error: receiptError } =
    useWaitForTransactionReceipt({
      hash,
    });
  
  const handleSendTip = () => {
    if (!isAddress(recipient)) {
      setIsRecipientValid(false);
      return;
    }
    setIsRecipientValid(true);

    if (!amount || parseFloat(amount) <= 0) {
        toast({
            variant: "destructive",
            title: "Invalid Amount",
            description: "Please enter a valid amount to tip.",
        });
        return;
    }
    
    sendTransaction({
      to: recipient,
      value: parseEther(amount),
    });
  };

  useEffect(() => {
    if (recipient) {
      setIsRecipientValid(isAddress(recipient));
    } else {
      setIsRecipientValid(true);
    }
  }, [recipient]);

  useEffect(() => {
    if (isConfirmed) {
      toast({
        title: "Tip Sent!",
        description: "Your transaction has been confirmed.",
        action: (
          <a href={`https://sepolia.etherscan.io/tx/${hash}`} target="_blank" rel="noopener noreferrer" className="underline">
            View on Etherscan
          </a>
        ),
      });
      setRecipient("");
      setAmount("");
    }
  }, [isConfirmed, hash, toast]);

  useEffect(() => {
    const error = sendError || receiptError;
    if (error) {
        toast({
            variant: "destructive",
            title: "Transaction Failed",
            description: error.message.split('\n')[0],
        });
    }
  }, [sendError, receiptError, toast]);


  if (!isConnected) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Welcome to Farcaster Faucet</CardTitle>
          <CardDescription>Connect your wallet to start tipping other users.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-8 bg-muted rounded-lg">
            <p className="text-muted-foreground">Please connect your wallet.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const isProcessing = isSendPending || isConfirming;

  return (
    <Card className="w-full max-w-md shadow-lg">
      <CardHeader>
        <CardTitle>Send a Tip</CardTitle>
        <CardDescription>
          Your Balance: {balance?.formatted.slice(0, 6)} {balance?.symbol}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="recipient">Farcaster Username or Address</Label>
          <Input
            id="recipient"
            placeholder="e.g., vitalik.eth or 0x... "
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            disabled={isProcessing}
          />
          {!isRecipientValid && (
            <p className="text-sm text-destructive flex items-center gap-1"><AlertTriangle className="h-4 w-4" /> Please enter a valid Ethereum address.</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="amount">Amount (ETH)</Label>
          <Input
            id="amount"
            type="number"
            placeholder="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            disabled={isProcessing}
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full" 
          onClick={handleSendTip} 
          disabled={isProcessing || !recipient || !amount || !isRecipientValid}
        >
          {isSendPending ? (
            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending...</>
          ) : isConfirming ? (
            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Confirming...</>
          ) : isConfirmed ? (
            <><CheckCircle className="mr-2 h-4 w-4" /> Tip Sent!</>
          ) : (
            "Send Tip"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
