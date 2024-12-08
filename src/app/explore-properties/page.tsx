'use client';

import { PropertyFilters } from '@/components/property-filters';
import { PropertyListings } from '@/components/property-listings';

export default function ExplorePropertiesPage() {
  return (
    <div className="bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <h1 className="mb-8 text-5xl font-bold text-blue-900">Explore Properties</h1>
        <div className="grid gap-8 lg:grid-cols-[300px_1fr]">
          <aside className="h-fit rounded-lg bg-white p-6 shadow-lg">
            <h2 className="mb-6 text-2xl font-semibold text-blue-900">Filters</h2>
            <PropertyFilters />
          </aside>
          <section>
            <div className="mb-8 rounded-lg bg-white p-6 shadow-lg">
              <h2 className="mb-4 text-2xl font-semibold text-blue-900">Available Properties</h2>
              <p className="mb-4 text-gray-600">
                Discover and invest in high-potential real estate opportunities.
              </p>
            </div>
            <PropertyListings />
          </section>
        </div>
      </div>
    </div>
  );
}
