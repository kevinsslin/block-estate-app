import { DollarSign, Home, TrendingUp } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Property } from '@/types/property';

interface PropertyStatsProps {
  property: Property;
}

export function PropertyStats({ property }: PropertyStatsProps) {
  return (
    <div className="grid grid-cols-2 gap-2 sm:gap-4">
      <Card>
        <CardHeader className="p-3 pb-1 sm:p-4 sm:pb-2">
          <CardTitle className="text-xs font-medium sm:text-sm">
            <DollarSign className="mr-1 inline h-3 w-3 sm:h-4 sm:w-4" />
            Property Value
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3 sm:p-4">
          <div className="text-lg font-bold sm:text-2xl">${property.price.toLocaleString()}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="p-3 pb-1 sm:p-4 sm:pb-2">
          <CardTitle className="text-xs font-medium sm:text-sm">
            <Home className="mr-1 inline h-3 w-3 sm:h-4 sm:w-4" />
            Tokens
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3 sm:p-4">
          <div className="text-lg font-bold sm:text-2xl">{property.tokens.toLocaleString()}</div>
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
          <div className="text-lg font-bold sm:text-2xl">${property.tokenPrice}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="p-3 pb-1 sm:p-4 sm:pb-2">
          <CardTitle className="text-xs font-medium sm:text-sm">
            <TrendingUp className="mr-1 inline h-3 w-3 sm:h-4 sm:w-4" />
            Annual Return
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3 sm:p-4">
          <div className="text-lg font-bold sm:text-2xl">{property.annualReturn}%</div>
        </CardContent>
      </Card>
    </div>
  );
}
