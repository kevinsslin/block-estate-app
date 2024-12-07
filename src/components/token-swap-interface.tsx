'use client';

import { useState } from 'react';
import { ArrowDown } from 'lucide-react';

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

  return (
    <Card className="mx-auto w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Swap Tokens</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between">
            <label htmlFor="from-amount" className="text-sm font-medium">
              From
            </label>
            <span className="text-sm text-muted-foreground">Balance: 1000 USDC</span>
          </div>
          <div className="flex space-x-2">
            <Input id="from-amount" type="number" placeholder="0.0" className="flex-grow" />
            <Select value={fromToken} onValueChange={setFromToken}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Select token" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="USDC">USDC</SelectItem>
                <SelectItem value="ETH">ETH</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex justify-center">
          <Button variant="ghost" size="icon" className="rounded-full">
            <ArrowDown className="h-6 w-6" />
          </Button>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <label htmlFor="to-amount" className="text-sm font-medium">
              To
            </label>
            <span className="text-sm text-muted-foreground">Balance: 0 LUXY-001</span>
          </div>
          <div className="flex space-x-2">
            <Input id="to-amount" type="number" placeholder="0.0" className="flex-grow" readOnly />
            <Select value={toToken} onValueChange={setToToken}>
              <SelectTrigger className="w-[120px]">
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

        <div className="text-sm text-muted-foreground">
          <p>1 LUXY-001 = 50 USDC</p>
          <p>Max slippage: 0.5%</p>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full">Swap Tokens</Button>
      </CardFooter>
    </Card>
  );
}
