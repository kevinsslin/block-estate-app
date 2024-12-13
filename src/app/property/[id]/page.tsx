'use client';

import { use, useEffect, useState } from 'react';
import { notFound } from 'next/navigation';

import { LoadingState } from '@/components/LoadingState';
import { PropertyDetail } from '@/components/PropertyDetail';
import { getPropertyById } from '@/lib/supabase/queries';
import type { PropertyWithTokens } from '@/lib/supabase/types';

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [property, setProperty] = useState<PropertyWithTokens | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchProperty() {
      try {
        const data = await getPropertyById(id);
        setProperty(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch property'));
      } finally {
        setIsLoading(false);
      }
    }

    fetchProperty();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <LoadingState />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="mb-4 text-2xl font-bold text-red-600">Error</h1>
          <p className="text-gray-600">{error.message}</p>
        </div>
      </div>
    );
  }

  if (!property) {
    notFound();
  }

  return <PropertyDetail property={property} />;
}
