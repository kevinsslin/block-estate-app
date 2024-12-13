'use client';

import { useState } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { ArrowDown } from 'lucide-react';
import { useAccount } from 'wagmi';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export function TokenSwapInterface() {
  const [fromToken, setFromToken] = useState('USDC');
  const [toToken, setToToken] = useState('LUXY-001');
  const { isConnected } = useAccount();

  if (!isConnected) {
    return (
      <Card className="mx-auto w-full max-w-md">
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="text-xl font-bold sm:text-2xl">Connect Wallet</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4 p-4 sm:p-6">
          <p className="text-center text-sm text-muted-foreground">
            Please connect your wallet to access token swapping
          </p>
          <ConnectButton />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mx-auto w-full max-w-md">
      <CardHeader className="p-4 sm:p-6">
        <CardTitle className="text-xl font-bold sm:text-2xl">Swap Tokens</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 p-4 sm:p-6">
        <div className="space-y-2">
          <div className="flex justify-between">
            <label htmlFor="from-amount" className="text-xs font-medium sm:text-sm">
              From
            </label>
            <span className="text-xs text-muted-foreground sm:text-sm">Balance: 1000 USDC</span>
          </div>
          <div className="flex gap-2">
            <Input
              id="from-amount"
              type="number"
              placeholder="0.0"
              className="flex-grow text-sm sm:text-base"
            />
            <Select value={fromToken} onValueChange={setFromToken}>
              <SelectTrigger className="w-[100px] text-sm sm:w-[120px] sm:text-base">
                <SelectValue placeholder="Select token" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="USDC">USDC</SelectItem>
                <SelectItem value="ETH">ETH</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex justify-center py-2">
          <Button variant="ghost" size="icon" className="rounded-full">
            <ArrowDown className="h-5 w-5 sm:h-6 sm:w-6" />
          </Button>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <label htmlFor="to-amount" className="text-xs font-medium sm:text-sm">
              To
            </label>
            <span className="text-xs text-muted-foreground sm:text-sm">Balance: 0 LUXY-001</span>
          </div>
          <div className="flex gap-2">
            <Input
              id="to-amount"
              type="number"
              placeholder="0.0"
              className="flex-grow text-sm sm:text-base"
              readOnly
            />
            <Select value={toToken} onValueChange={setToToken}>
              <SelectTrigger className="w-[100px] text-sm sm:w-[120px] sm:text-base">
                <SelectValue placeholder="Select token" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="LUXY-001">LUXY-001</SelectItem>
                <SelectItem value="COMS-002">COMS-002</SelectItem>
                <SelectItem value="BEACH-003">BEACH-003</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-1 text-xs text-muted-foreground sm:text-sm">
          <p>1 LUXY-001 = 50 USDC</p>
          <p>Max slippage: 0.5%</p>
        </div>
      </CardContent>
      <CardFooter className="p-4 sm:p-6">
        <Button className="w-full py-5 text-sm sm:py-6 sm:text-base">Swap Tokens</Button>
      </CardFooter>
    </Card>
  );
}
