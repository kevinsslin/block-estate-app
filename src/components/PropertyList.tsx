import React from 'react';
import Image from 'next/image';

import type { PropertyWithTokens } from '@/lib/supabase/types';

import { useProperties } from '../contracts/hooks/useProperties';

interface PropertyCardProps {
  property: PropertyWithTokens;
}

function PropertyCard({ property }: PropertyCardProps) {
  return (
    <div className="overflow-hidden rounded-lg border shadow-sm transition-shadow hover:shadow-md">
      <div className="relative h-48 w-full">
        <Image
          src={property.image_url}
          alt="Property"
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      <div className="p-4">
        <h3 className="mb-2 text-lg font-semibold">{property.address}</h3>
        <div className="space-y-2">
          {property.tokens.map((token) => (
            <div key={token.id} className="flex justify-between text-sm">
              <span>Token #{token.token_id}</span>
              <span>{token.price} USDT</span>
              <span>
                {token.current_supply}/{token.max_supply}
              </span>
            </div>
          ))}
        </div>
        <div className="mt-4 text-sm text-gray-600">
          <p>Start Time: {new Date(property.start_timestamp).toLocaleString()}</p>
          <p>
            Status:{' '}
            <span
              className={`capitalize ${
                property.status === 'active'
                  ? 'text-green-600'
                  : property.status === 'pending'
                    ? 'text-yellow-600'
                    : 'text-red-600'
              }`}
            >
              {property.status}
            </span>
          </p>
          <p>
            Owner: {property.owner_address.slice(0, 6)}...{property.owner_address.slice(-4)}
          </p>
        </div>
      </div>
    </div>
  );
}

export function PropertyList() {
  const { properties, isLoading, error } = useProperties();

  if (isLoading) {
    return (
      <div className="flex min-h-[200px] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return <div className="p-4 text-center text-red-600">Error: {error.message}</div>;
  }

  if (!properties.length) {
    return <div className="p-4 text-center text-gray-600">No properties found.</div>;
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {properties.map((property) => (
        <PropertyCard key={property.id} property={property} />
      ))}
    </div>
  );
}
