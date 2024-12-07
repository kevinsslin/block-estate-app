import { Header } from '@/components/header';
import { PropertyFilters } from '@/components/property-filters';
import { PropertyListings } from '@/components/property-listings';

export default function ExplorePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <h1 className="mb-6 text-3xl font-bold text-blue-900">Explore Properties</h1>
        <div className="grid gap-6 md:grid-cols-[300px_1fr]">
          <aside>
            <PropertyFilters />
          </aside>
          <section>
            <PropertyListings />
          </section>
        </div>
      </main>
    </div>
  );
}
