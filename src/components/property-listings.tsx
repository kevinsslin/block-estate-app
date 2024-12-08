import Image from 'next/image';
import Link from 'next/link';
import { DollarSign, Home, MapPin } from 'lucide-react';

import { ErrorDisplay } from '@/components/ErrorDisplay';
import { LoadingState } from '@/components/LoadingState';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useAsync } from '@/hooks/useAsync';
import { getAllProperties } from '@/services';
import type { Property } from '@/types/property';

export function PropertyListings() {
  const {
    data: properties,
    loading,
    error,
    execute,
  } = useAsync<Property[]>(getAllProperties, true);

  if (loading) {
    return (
      <div className="flex min-h-[300px] items-center justify-center sm:min-h-[400px]">
        <LoadingState />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[300px] items-center justify-center sm:min-h-[400px]">
        <ErrorDisplay title="Failed to Load Properties" message={error.message} onRetry={execute} />
      </div>
    );
  }

  if (!properties || properties.length === 0) {
    return (
      <div className="min-h-[300px] text-center text-gray-600 sm:min-h-[400px]">
        No properties available at the moment.
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
      {properties.map((property) => (
        <Card key={property.id} className="flex flex-col">
          <Link href={`/property/${property.id}`}>
            <Image
              src={property.image}
              alt={property.title}
              width={600}
              height={400}
              className="h-40 w-full object-cover sm:h-48"
            />
          </Link>
          <div className="flex flex-grow flex-col">
            <CardHeader className="p-4 sm:p-6">
              <div className="flex items-start justify-between gap-2">
                <CardTitle className="line-clamp-2 h-[48px] text-base sm:h-[56px] sm:text-lg">
                  <Link
                    href={`/property/${property.id}`}
                    className="transition-colors hover:text-blue-600"
                  >
                    {property.title}
                  </Link>
                </CardTitle>
                <Badge variant="secondary" className="shrink-0">
                  {property.type}
                </Badge>
              </div>
              <div className="flex items-center text-xs text-muted-foreground sm:text-sm">
                <MapPin className="mr-1 h-3 w-3 sm:h-4 sm:w-4" />
                {property.location}
              </div>
            </CardHeader>
            <CardContent className="flex-grow p-4 sm:p-6">
              <div className="mb-2 flex items-center justify-between">
                <div className="flex items-center">
                  <Home className="mr-1 h-3 w-3 text-blue-500 sm:h-4 sm:w-4" />
                  <span className="text-xs font-medium sm:text-sm">
                    {property.tokens.toLocaleString()} Tokens
                  </span>
                </div>
                <div className="flex items-center">
                  <DollarSign className="mr-1 h-3 w-3 text-green-500 sm:h-4 sm:w-4" />
                  <span className="text-xs font-medium sm:text-sm">
                    ${property.tokenPrice}/token
                  </span>
                </div>
              </div>
              <div className="text-base font-bold sm:text-lg">
                ${property.price.toLocaleString()}
              </div>
            </CardContent>
            <CardFooter className="mt-auto p-4 sm:p-6">
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
