import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

const myProperties = [
  {
    id: 1,
    name: 'Luxury Apartment in Downtown',
    tokenId: 'LUXY-001',
    tokensOwned: 100,
    totalTokens: 10000,
    currentValue: 5500,
    purchaseValue: 5000,
  },
  {
    id: 2,
    name: 'Commercial Office Space',
    tokenId: 'COMS-002',
    tokensOwned: 500,
    totalTokens: 20000,
    currentValue: 55000,
    purchaseValue: 50000,
  },
  {
    id: 3,
    name: 'Beachfront Villa',
    tokenId: 'BEACH-003',
    tokensOwned: 50,
    totalTokens: 15000,
    currentValue: 4750,
    purchaseValue: 5000,
  },
];

export default function MyPropertiesPage() {
  return (
    <div className="bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <h1 className="mb-8 text-5xl font-bold text-blue-900">My Properties</h1>
        <div className="grid gap-6">
          {myProperties.map((property) => (
            <Card key={property.id} className="transition-shadow hover:shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl text-blue-900">
                  <Link
                    href={`/property/${property.id}`}
                    className="transition-colors hover:text-blue-600"
                  >
                    {property.name}
                  </Link>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Token ID:</span>
                    <span className="font-medium">{property.tokenId}</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Tokens Owned:</span>
                      <span className="font-medium">
                        {property.tokensOwned} / {property.totalTokens}
                      </span>
                    </div>
                    <Progress
                      value={(property.tokensOwned / property.totalTokens) * 100}
                      className="h-2"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Current Value:</span>
                    <span className="font-medium text-green-600">
                      ${property.currentValue.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Purchase Value:</span>
                    <span className="font-medium">${property.purchaseValue.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <Badge
                      variant={
                        property.currentValue >= property.purchaseValue ? 'default' : 'destructive'
                      }
                    >
                      {property.currentValue >= property.purchaseValue ? '+' : '-'}
                      {Math.abs(
                        ((property.currentValue - property.purchaseValue) /
                          property.purchaseValue) *
                          100
                      ).toFixed(2)}
                      %
                    </Badge>
                    <p className="text-sm text-muted-foreground">
                      Last updated: {new Date().toLocaleDateString()}
                    </p>
                  </div>
                  <Button asChild>
                    <Link href={`/property/${property.id}`}>View Details</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
