import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-gray-100 py-12">
      <div className="container mx-auto px-4">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <h3 className="mb-4 text-xl font-bold text-blue-900">BlockEstate</h3>
            <p className="text-gray-600">
              Revolutionizing real estate investment through blockchain technology.
            </p>
          </div>
          <div>
            <h4 className="mb-4 text-lg font-semibold text-blue-900">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/explore-properties"
                  className="text-gray-600 transition-colors hover:text-blue-500"
                >
                  Explore Properties
                </Link>
              </li>
              <li>
                <Link
                  href="/secondary-market"
                  className="text-gray-600 transition-colors hover:text-blue-500"
                >
                  Secondary Market
                </Link>
              </li>
              <li>
                <Link
                  href="/#how-it-works"
                  className="text-gray-600 transition-colors hover:text-blue-500"
                >
                  How It Works
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="mb-4 text-lg font-semibold text-blue-900">Legal</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/terms" className="text-gray-600 transition-colors hover:text-blue-500">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-gray-600 transition-colors hover:text-blue-500"
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="mb-4 text-lg font-semibold text-blue-900">Contact Us</h4>
            <p className="text-gray-600">Email: info@blockestate.com</p>
            <p className="text-gray-600">Phone: +1 (555) 123-4567</p>
          </div>
        </div>
        <div className="mt-12 border-t border-gray-200 pt-8 text-center">
          <p className="text-gray-600">&copy; 2023 BlockEstate. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
