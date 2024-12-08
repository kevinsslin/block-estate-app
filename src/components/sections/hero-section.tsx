'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

import { Button } from '@/components/ui/button';

export function HeroSection() {
  return (
    <section className="bg-gradient-to-r from-blue-600 to-blue-800 py-20 text-white">
      <div className="container mx-auto px-4 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{
            fontSize: 'clamp(3rem, 5vw, 3.75rem)',
            fontWeight: 'bold',
            marginBottom: '1.5rem',
          }}
        >
          Welcome to <span style={{ color: '#facc15' }}>BlockEstate</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          style={{
            fontSize: 'clamp(1.25rem, 2vw, 1.5rem)',
            maxWidth: '48rem',
            margin: '0 auto 2.5rem',
            lineHeight: '1.625',
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
            className="bg-yellow-400 px-8 py-6 text-lg font-semibold text-blue-900 hover:bg-yellow-300"
            asChild
          >
            <Link href="/explore-properties">
              Start Investing <ArrowRight className="ml-2 h-6 w-6" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
