import Image from 'next/image';
import Link from 'next/link';
import { DollarSign, Home, MapPin } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

const properties = [
  {
    id: 1,
    title: 'Luxury Apartment in Downtown',
    location: 'New York, NY',
    price: 500000,
    tokens: 10000,
    tokenPrice: 50,
    image: '/placeholder.svg?height=400&width=600',
    type: 'Residential',
  },
  {
    id: 2,
    title: 'Commercial Office Space',
    location: 'San Francisco, CA',
    price: 2000000,
    tokens: 20000,
    tokenPrice: 100,
    image: '/placeholder.svg?height=400&width=600',
    type: 'Commercial',
  },
  {
    id: 3,
    title: 'Beachfront Villa',
    location: 'Miami, FL',
    price: 1500000,
    tokens: 15000,
    tokenPrice: 100,
    image: '/placeholder.svg?height=400&width=600',
    type: 'Residential',
  },
];

export function PropertyListings() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {properties.map((property) => (
        <Card key={property.id} className="flex flex-col">
          <Link href={`/property/${property.id}`}>
            <Image
              src={property.image}
              alt={property.title}
              width={600}
              height={400}
              className="h-48 w-full object-cover"
            />
          </Link>
          <div className="flex flex-grow flex-col">
            <CardHeader>
              <div className="flex items-start justify-between">
                <CardTitle className="line-clamp-2 h-[56px] text-lg">
                  <Link
                    href={`/property/${property.id}`}
                    className="transition-colors hover:text-blue-600"
                  >
                    {property.title}
                  </Link>
                </CardTitle>
                <Badge variant="secondary">{property.type}</Badge>
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <MapPin className="mr-1 h-4 w-4" />
                {property.location}
              </div>
            </CardHeader>
            <CardContent className="flex-grow">
              <div className="mb-2 flex items-center justify-between">
                <div className="flex items-center">
                  <Home className="mr-1 h-4 w-4 text-blue-500" />
                  <span className="text-sm font-medium">
                    {property.tokens.toLocaleString()} Tokens
                  </span>
                </div>
                <div className="flex items-center">
                  <DollarSign className="mr-1 h-4 w-4 text-green-500" />
                  <span className="text-sm font-medium">${property.tokenPrice}/token</span>
                </div>
              </div>
              <div className="text-lg font-bold">${property.price.toLocaleString()}</div>
            </CardContent>
            <CardFooter className="mt-auto">
              <Button asChild className="w-full">
                <Link href={`/property/${property.id}`}>View Details</Link>
              </Button>
            </CardFooter>
          </div>
        </Card>
      ))}
    </div>
  );
}
