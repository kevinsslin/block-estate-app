import Image from 'next/image';
import Link from 'next/link';
import { DollarSign, MapPin, TrendingUp } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import type { PropertyWithTokens } from '@/lib/supabase/types';

interface PropertyCardProps {
  property: PropertyWithTokens;
}

export function PropertyCard({ property }: PropertyCardProps) {
  // Get the first token for this property
  const token = property.tokens[0];
  if (!token) return null;

  // Ensure numbers are valid
  const price = Number(token.price) || 0;
  const maxSupply = token.max_supply || 0;
  const currentSupply = token.current_supply || 0;
  const totalPrice = price * maxSupply;

  return (
    <Link href={`/property/${property.id}`}>
      <Card className="h-full transition-transform hover:scale-105">
        <Image
          src={property.image_url}
          alt={property.address}
          width={400}
          height={250}
          className="h-[200px] w-full object-cover sm:h-[250px]"
        />
        <CardHeader className="space-y-2 p-4 sm:p-6">
          <CardTitle className="text-lg sm:text-xl">{property.address}</CardTitle>
          <div className="flex items-center text-sm text-gray-600 sm:text-base">
            <MapPin className="mr-1 h-4 w-4" />
            {property.address}
          </div>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <div className="mb-4 grid grid-cols-2 gap-2 sm:gap-4">
            <div className="text-xs sm:text-sm">
              <DollarSign className="mr-1 inline h-3 w-3 sm:h-4 sm:w-4" />$
              {totalPrice.toLocaleString()}
            </div>
            <div className="text-xs sm:text-sm">
              <TrendingUp className="mr-1 inline h-3 w-3 sm:h-4 sm:w-4" />${price.toLocaleString()}
              /token
            </div>
          </div>
          <div className="space-y-2">
            <Progress value={(currentSupply / maxSupply) * 100} />
            <div className="flex justify-between text-xs text-gray-600 sm:text-sm">
              <span>{((currentSupply / maxSupply) * 100).toFixed(1)}% Funded</span>
              <span>{maxSupply.toLocaleString()} Total Tokens</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
