import { SecondaryMarketListings } from '@/components/secondary-market-listings';
import { TokenSwapInterface } from '@/components/token-swap-interface';

export default function SecondaryMarketPage() {
  return (
    <div className="bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <h1 className="mb-8 text-5xl font-bold text-blue-900">Secondary Market</h1>
        <div className="grid gap-8 lg:grid-cols-2">
          <div>
            <div className="mb-8 rounded-lg bg-white p-6 shadow-lg">
              <h2 className="mb-4 text-2xl font-semibold text-blue-900">Token Swap</h2>
              <p className="mb-4 text-gray-600">
                Easily exchange your property tokens or invest in new opportunities.
              </p>
            </div>
            <TokenSwapInterface />
          </div>
          <div>
            <div className="mb-8 rounded-lg bg-white p-6 shadow-lg">
              <h2 className="mb-4 text-2xl font-semibold text-blue-900">Available Listings</h2>
              <p className="mb-4 text-gray-600">
                Browse and invest in tokenized properties on the secondary market.
              </p>
            </div>
            <SecondaryMarketListings />
          </div>
        </div>
      </div>
    </div>
  );
}
