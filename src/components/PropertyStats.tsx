import { DollarSign, Home, TrendingUp } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { PropertyToken } from '@/lib/supabase/types';

interface PropertyStatsProps {
  token: PropertyToken;
}

export function PropertyStats({ token }: PropertyStatsProps) {
  // Ensure numbers are valid
  const price = Number(token.price) || 0;
  const maxSupply = token.max_supply || 0;
  const currentSupply = token.current_supply || 0;
  const totalPrice = price * maxSupply;

  return (
    <div className="grid grid-cols-2 gap-2 sm:gap-4">
      <Card>
        <CardHeader className="p-3 pb-1 sm:p-4 sm:pb-2">
          <CardTitle className="text-xs font-medium sm:text-sm">
            <DollarSign className="mr-1 inline h-3 w-3 sm:h-4 sm:w-4" />
            Total Value
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3 sm:p-4">
          <div className="text-lg font-bold sm:text-2xl">${totalPrice.toLocaleString()}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="p-3 pb-1 sm:p-4 sm:pb-2">
          <CardTitle className="text-xs font-medium sm:text-sm">
            <Home className="mr-1 inline h-3 w-3 sm:h-4 sm:w-4" />
            Total Tokens
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3 sm:p-4">
          <div className="text-lg font-bold sm:text-2xl">{maxSupply.toLocaleString()}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="p-3 pb-1 sm:p-4 sm:pb-2">
          <CardTitle className="text-xs font-medium sm:text-sm">
            <DollarSign className="mr-1 inline h-3 w-3 sm:h-4 sm:w-4" />
            Token Price
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3 sm:p-4">
          <div className="text-lg font-bold sm:text-2xl">${price.toLocaleString()}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="p-3 pb-1 sm:p-4 sm:pb-2">
          <CardTitle className="text-xs font-medium sm:text-sm">
            <TrendingUp className="mr-1 inline h-3 w-3 sm:h-4 sm:w-4" />
            Current Supply
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3 sm:p-4">
          <div className="text-lg font-bold sm:text-2xl">{currentSupply.toLocaleString()}</div>
        </CardContent>
      </Card>
    </div>
  );
}
