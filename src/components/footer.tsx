import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-gray-100 py-8 sm:py-12">
      <div className="container mx-auto px-4">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="text-center sm:text-left">
            <h3 className="mb-3 text-lg font-bold text-blue-900 sm:mb-4 sm:text-xl">
              BlockEstate 🏢
            </h3>
            <p className="text-sm text-gray-600 sm:text-base">
              🚀 Revolutionizing real estate investment through blockchain technology.
            </p>
          </div>
          <div className="text-center sm:text-left">
            <h4 className="mb-3 text-base font-semibold text-blue-900 sm:mb-4 sm:text-lg">
              🔗 Quick Links
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/explore-properties"
                  className="inline-flex items-center gap-2 text-sm text-gray-600 transition-colors hover:translate-x-1 hover:text-blue-500 sm:text-base"
                >
                  🏠 Explore Properties
                </Link>
              </li>
              <li>
                <Link
                  href="/secondary-market"
                  className="inline-flex items-center gap-2 text-sm text-gray-600 transition-colors hover:translate-x-1 hover:text-blue-500 sm:text-base"
                >
                  💱 Secondary Market
                </Link>
              </li>
              <li>
                <Link
                  href="/#how-it-works"
                  className="inline-flex items-center gap-2 text-sm text-gray-600 transition-colors hover:translate-x-1 hover:text-blue-500 sm:text-base"
                >
                  📖 How It Works
                </Link>
              </li>
            </ul>
          </div>
          <div className="text-center sm:text-left">
            <h4 className="mb-3 text-base font-semibold text-blue-900 sm:mb-4 sm:text-lg">Legal</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/terms"
                  className="text-sm text-gray-600 transition-colors hover:text-blue-500 sm:text-base"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-sm text-gray-600 transition-colors hover:text-blue-500 sm:text-base"
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
          <div className="text-center sm:text-left">
            <h4 className="mb-3 text-base font-semibold text-blue-900 sm:mb-4 sm:text-lg">
              Contact Us
            </h4>
            <p className="text-sm text-gray-600 sm:text-base">Email: info@blockestate.com</p>
            <p className="text-sm text-gray-600 sm:text-base">Phone: +1 (555) 123-4567</p>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-200 pt-6 text-center sm:mt-12 sm:pt-8">
          <p className="text-sm text-gray-600 sm:text-base">
            &copy; 2023 BlockEstate. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
