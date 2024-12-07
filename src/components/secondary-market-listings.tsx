import { ArrowDownRight, ArrowUpRight, DollarSign, Percent } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function SecondaryMarketListings() {
  const listings = [
    {
      id: 1,
      propertyName: 'Luxury Apartment in Downtown',
      tokenId: 'LUXY-001',
      quantity: 100,
      price: 55,
      change: 10,
      positive: true,
    },
    {
      id: 2,
      propertyName: 'Commercial Office Space',
      tokenId: 'COMS-002',
      quantity: 500,
      price: 110,
      change: 5,
      positive: true,
    },
    {
      id: 3,
      propertyName: 'Beachfront Villa',
      tokenId: 'BEACH-003',
      quantity: 50,
      price: 95,
      change: 2,
      positive: false,
    },
  ];

  return (
    <div className="space-y-4">
      {listings.map((listing) => (
        <Card key={listing.id}>
          <CardHeader className="pb-2">
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-lg">{listing.propertyName}</CardTitle>
                <p className="text-sm text-muted-foreground">Token ID: {listing.tokenId}</p>
              </div>
              <Badge variant={listing.positive ? 'success' : 'destructive'}>
                {listing.positive ? (
                  <ArrowUpRight className="h-4 w-4" />
                ) : (
                  <ArrowDownRight className="h-4 w-4" />
                )}
                {listing.change}%
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <DollarSign className="mr-1 h-4 w-4 text-green-500" />
                <span className="text-lg font-bold">${listing.price}</span>
                <span className="ml-1 text-sm text-muted-foreground">per token</span>
              </div>
              <div className="flex items-center">
                <Percent className="mr-1 h-4 w-4 text-blue-500" />
                <span className="text-sm font-medium">{listing.quantity} available</span>
              </div>
            </div>
            <Button className="mt-2 w-full">Select</Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
