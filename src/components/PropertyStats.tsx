import { DollarSign, Home, TrendingUp } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Property } from '@/types/property';

interface PropertyStatsProps {
  property: Property;
}

export function PropertyStats({ property }: PropertyStatsProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">
            <DollarSign className="mr-1 inline h-4 w-4" />
            Property Value
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${property.price.toLocaleString()}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">
            <Home className="mr-1 inline h-4 w-4" />
            Tokens
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{property.tokens.toLocaleString()}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">
            <DollarSign className="mr-1 inline h-4 w-4" />
            Token Price
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${property.tokenPrice}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">
            <TrendingUp className="mr-1 inline h-4 w-4" />
            Annual Return
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{property.annualReturn}%</div>
        </CardContent>
      </Card>
    </div>
  );
}
