'use client'

import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useAccount } from 'wagmi'
import SendTipForm from '@/components/SendTipForm'
import { Header } from '@/components/header'
import ContractStats from '@/components/ContractStats'
import UserStats from '@/components/UserStats'
import UpdateHandleForm from '@/components/UpdateHandleForm'
import ClientOnly from '@/components/ClientOnly'
import UserTipHistory from '@/components/UserTipHistory'

export default function Home() {
  const { address } = useAccount()

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow flex flex-col items-center justify-start p-4 sm:p-8">
        <div className="w-full max-w-xl mx-auto space-y-6">
          <ClientOnly>
            {address ? (
            <div className="space-y-6">
                <SendTipForm />
                <UpdateHandleForm />
                <UserStats />
                <UserTipHistory />
            </div>
            ) : (
            <div className="text-center bg-card shadow-lg rounded-lg p-8 mt-10">
                <h1 className="text-2xl font-bold mb-4">Welcome to Farcaster Faucet</h1>
                <p className="text-muted-foreground mb-6">Connect your wallet to start tipping other users.</p>
                <ConnectButton />
            </div>
            )}
          </ClientOnly>
          <ClientOnly>
            <ContractStats />
          </ClientOnly>
        </div>
      </main>
    </div>
  )
}
