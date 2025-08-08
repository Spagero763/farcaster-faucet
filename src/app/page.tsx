'use client'

import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useAccount } from 'wagmi'
import SendTipForm from '@/components/SendTipForm'
import { Header } from '@/components/header'
import ContractStats from '@/components/ContractStats'
import RecentTipsFeed from '@/components/RecentTipsFeed'

export default function Home() {
  const { address } = useAccount()

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow flex flex-col items-center justify-center p-4 gap-6">
        {address ? (
          <>
            <SendTipForm />
          </>
        ) : (
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Welcome to Farcaster Faucet</h1>
            <p className="text-muted-foreground mb-6">Connect your wallet to start tipping other users.</p>
            <ConnectButton />
          </div>
        )}
        <div className="w-full max-w-md space-y-6">
            <ContractStats />
            <RecentTipsFeed />
        </div>
      </main>
    </div>
  )
}
