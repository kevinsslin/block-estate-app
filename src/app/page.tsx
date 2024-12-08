'use client';

import { ErrorDisplay } from '@/components/ErrorDisplay';
import { LoadingState } from '@/components/LoadingState';
import { PropertyCard } from '@/components/PropertyCard';
import { useAsync } from '@/hooks/useAsync';
import { getAllProperties } from '@/services/api';

export default function HomePage() {
  const { data: properties, loading, error, execute } = useAsync(getAllProperties);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <LoadingState />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <ErrorDisplay title="Failed to Load Properties" message={error.message} onRetry={execute} />
      </div>
    );
  }

  if (!properties || properties.length === 0) {
    return (
      <main className="container mx-auto px-4 py-12">
        <h1 className="mb-8 text-4xl font-bold text-blue-900">Available Properties</h1>
        <p className="text-center text-gray-500">No properties available at the moment.</p>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4 py-12">
      <h1 className="mb-8 text-4xl font-bold text-blue-900">Available Properties</h1>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
        {properties.map((property) => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </div>
    </main>
  );
}
