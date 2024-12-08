import Image from 'next/image';
import Link from 'next/link';
import { DollarSign, MapPin, TrendingUp } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import type { Property } from '@/types/property';

interface PropertyCardProps {
  property: Property;
}

export function PropertyCard({ property }: PropertyCardProps) {
  return (
    <Link href={`/property/${property.id}`}>
      <Card className="h-full transition-transform hover:scale-105">
        <Image
          src={property.image}
          alt={property.title}
          width={400}
          height={250}
          className="h-[250px] w-full object-cover"
        />
        <CardHeader>
          <CardTitle className="text-xl">{property.title}</CardTitle>
          <div className="flex items-center text-gray-600">
            <MapPin className="mr-1 h-4 w-4" />
            {property.location}
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4 grid grid-cols-2 gap-4">
            <div className="text-sm">
              <DollarSign className="mr-1 inline h-4 w-4" />${property.price.toLocaleString()}
            </div>
            <div className="text-sm">
              <TrendingUp className="mr-1 inline h-4 w-4" />
              {property.annualReturn}% Return
            </div>
          </div>
          <div className="space-y-2">
            <Progress value={(property.tokensSold / property.tokens) * 100} />
            <div className="flex justify-between text-sm text-gray-600">
              <span>{((property.tokensSold / property.tokens) * 100).toFixed(1)}% Funded</span>
              <span>${property.tokenPrice}/token</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
