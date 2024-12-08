'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

import { Button } from '@/components/ui/button';

export function HeroSection() {
  return (
    <section className="bg-gradient-to-r from-blue-600 to-blue-800 py-12 text-white md:py-20">
      <div className="container mx-auto px-4 text-center">
        <div className="mx-auto max-w-4xl">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{
              marginBottom: '1.5rem',
              fontSize: 'clamp(1.875rem, 5vw, 3.75rem)',
              fontWeight: 'bold',
            }}
          >
            Welcome to <span className="text-yellow-400">BlockEstate</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            style={{
              margin: '0 auto 2rem',
              maxWidth: '42rem',
              fontSize: 'clamp(0.875rem, 2vw, 1.25rem)',
              color: '#bfdbfe',
            }}
          >
            Revolutionizing Real Estate Investment Through Blockchain Technology. Invest in premium
            properties with minimal capital, enjoy high liquidity, and benefit from fractional
            ownership.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Button
              size="lg"
              className="bg-yellow-400 px-6 py-3 text-base font-semibold text-blue-900 hover:bg-yellow-300 sm:px-8 sm:py-4 sm:text-lg"
              asChild
            >
              <Link href="/explore-properties" className="inline-flex items-center gap-2">
                Start Investing
                <ArrowRight className="h-5 w-5 md:h-6 md:w-6" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
