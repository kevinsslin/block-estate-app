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
    <div className="space-y-3 sm:space-y-4">
      {listings.map((listing) => (
        <Card key={listing.id}>
          <CardHeader className="p-4 pb-2 sm:p-6 sm:pb-3">
            <div className="flex items-start justify-between gap-4">
              <div>
                <CardTitle className="text-base sm:text-lg">{listing.propertyName}</CardTitle>
                <p className="text-xs text-muted-foreground sm:text-sm">
                  Token ID: {listing.tokenId}
                </p>
              </div>
              <Badge
                variant={listing.positive ? 'default' : 'secondary'}
                className="flex shrink-0 items-center gap-0.5"
              >
                {listing.positive ? (
                  <ArrowUpRight className="h-3 w-3 sm:h-4 sm:w-4" />
                ) : (
                  <ArrowDownRight className="h-3 w-3 sm:h-4 sm:w-4" />
                )}
                {listing.change}%
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center">
                <DollarSign className="mr-1 h-3 w-3 text-green-500 sm:h-4 sm:w-4" />
                <span className="text-base font-bold sm:text-lg">${listing.price}</span>
                <span className="ml-1 text-xs text-muted-foreground sm:text-sm">per token</span>
              </div>
              <div className="flex items-center">
                <Percent className="mr-1 h-3 w-3 text-blue-500 sm:h-4 sm:w-4" />
                <span className="text-xs font-medium sm:text-sm">{listing.quantity} available</span>
              </div>
            </div>
            <Button className="mt-3 w-full sm:mt-4">Select</Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
