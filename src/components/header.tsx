'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Gem } from 'lucide-react';

export function Header() {
  return (
    <header className="p-4 border-b">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Gem className="h-6 w-6 text-primary" />
          <h1 className="text-xl font-bold">Farcaster Faucet</h1>
        </div>
        <ConnectButton />
      </div>
    </header>
  );
}
