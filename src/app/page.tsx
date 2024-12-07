import Link from 'next/link';
import { ArrowRight, Building, Coins, Lock, ShieldCheck, TrendingUp } from 'lucide-react';

import { KeyMetrics } from '@/components/key-metrics';
import { PropertyListings } from '@/components/property-listings';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

export default function Home() {
  return (
    <div className="bg-gray-50">
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 py-20 text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="mb-6 text-5xl font-bold md:text-6xl">
            Welcome to <span className="text-yellow-400">BlockEstate</span>
          </h1>
          <p className="mx-auto mb-10 max-w-3xl text-xl leading-relaxed md:text-2xl">
            Revolutionizing Real Estate Investment Through Blockchain Technology. Invest in premium
            properties with minimal capital, enjoy high liquidity, and benefit from fractional
            ownership.
          </p>
          <Button
            size="lg"
            className="bg-yellow-400 px-8 py-6 text-lg font-semibold text-blue-900 hover:bg-yellow-300"
            asChild
          >
            <Link href="/explore-properties">
              Start Investing <ArrowRight className="ml-2 h-6 w-6" />
            </Link>
          </Button>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="mb-10 text-center text-4xl font-bold text-blue-900">
            Why Choose BlockEstate?
          </h2>
          <div className="grid gap-12 md:grid-cols-3">
            <div className="flex flex-col items-center rounded-lg bg-white p-8 text-center shadow-lg transition-transform hover:scale-105">
              <Building className="mb-6 h-16 w-16 text-blue-500" />
              <h3 className="mb-4 text-xl font-semibold">Tokenized Properties</h3>
              <p className="text-gray-600">
                Invest in fractions of high-value real estate assets, lowering the barrier to entry
                for premium property investments.
              </p>
            </div>
            <div className="flex flex-col items-center rounded-lg bg-white p-8 text-center shadow-lg transition-transform hover:scale-105">
              <Lock className="mb-6 h-16 w-16 text-blue-500" />
              <h3 className="mb-4 text-xl font-semibold">Secure Transactions</h3>
              <p className="text-gray-600">
                Blockchain-powered security ensures transparent, immutable, and safe transactions
                for all your investments.
              </p>
            </div>
            <div className="flex flex-col items-center rounded-lg bg-white p-8 text-center shadow-lg transition-transform hover:scale-105">
              <Coins className="mb-6 h-16 w-16 text-blue-500" />
              <h3 className="mb-4 text-xl font-semibold">Liquid Real Estate</h3>
              <p className="text-gray-600">
                Trade property tokens easily on our secondary market, providing unprecedented
                liquidity in real estate investments.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="container mx-auto px-4">
          <h2 className="mb-10 text-center text-4xl font-bold text-blue-900">Platform Overview</h2>
          <KeyMetrics />
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="mb-10 text-center text-4xl font-bold text-blue-900">
            Featured Properties
          </h2>
          <PropertyListings />
        </div>
      </section>

      <section id="how-it-works" className="bg-white py-20">
        <div className="container mx-auto px-4">
          <h2 className="mb-10 text-center text-4xl font-bold text-blue-900">How It Works</h2>
          <div className="grid gap-8 md:grid-cols-2">
            <Card className="transition-transform hover:scale-105">
              <CardHeader>
                <CardTitle className="flex items-center text-xl">
                  <Building className="mr-3 h-8 w-8 text-blue-500" />
                  Property Selection
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Our team of experts carefully selects properties with high potential for value
                  appreciation and rental income. Each property undergoes thorough due diligence
                  before being tokenized and offered on our platform.
                </p>
              </CardContent>
            </Card>
            <Card className="transition-transform hover:scale-105">
              <CardHeader>
                <CardTitle className="flex items-center text-xl">
                  <Coins className="mr-3 h-8 w-8 text-blue-500" />
                  Tokenization
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Real estate properties are divided into digital tokens, each representing a
                  fraction of the property&apos;s value. This allows investors to own a share of
                  high-value properties with a lower capital requirement.
                </p>
              </CardContent>
            </Card>
            <Card className="transition-transform hover:scale-105">
              <CardHeader>
                <CardTitle className="flex items-center text-xl">
                  <TrendingUp className="mr-3 h-8 w-8 text-blue-500" />
                  Trading
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Investors can buy and sell property tokens on our secondary market, providing
                  liquidity typically not available in traditional real estate investments. This
                  allows for more flexible investment strategies and portfolio management.
                </p>
              </CardContent>
            </Card>
            <Card className="transition-transform hover:scale-105">
              <CardHeader>
                <CardTitle className="flex items-center text-xl">
                  <ShieldCheck className="mr-3 h-8 w-8 text-blue-500" />
                  Security and Compliance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  All transactions are secured by blockchain technology, ensuring transparency and
                  immutability. We comply with all relevant regulations to provide a safe and legal
                  investment environment for our users.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="bg-blue-50 py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-6 text-4xl font-bold text-blue-900">Stay Updated</h2>
          <p className="mx-auto mb-10 max-w-2xl text-xl text-gray-600">
            Subscribe to our newsletter for the latest property listings, market insights, and
            investment opportunities.
          </p>
          <form className="mx-auto flex max-w-md">
            <Input
              type="email"
              placeholder="Enter your email"
              className="mr-2 flex-grow py-6 text-lg"
            />
            <Button
              type="submit"
              size="lg"
              className="bg-blue-600 px-8 text-lg text-white hover:bg-blue-700"
            >
              Subscribe
            </Button>
          </form>
        </div>
      </section>
    </div>
  );
}
