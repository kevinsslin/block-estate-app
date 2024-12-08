'use client';

import { motion } from 'framer-motion';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function NewsletterSection() {
  return (
    <section className="bg-blue-900 py-12 text-white md:py-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{
            maxWidth: '42rem',
            margin: '0 auto',
            textAlign: 'center',
          }}
        >
          <h2 className="mb-3 text-2xl font-bold sm:mb-4 sm:text-3xl md:text-4xl">
            Stay Updated with BlockEstate
          </h2>
          <p className="mb-6 text-sm text-blue-200 sm:text-base md:mb-8">
            Subscribe to our newsletter for the latest property listings, market insights, and
            investment opportunities.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row sm:gap-0">
            <Input
              type="email"
              placeholder="Enter your email"
              className="border-blue-700 bg-blue-800 text-white placeholder:text-blue-300 sm:rounded-r-none"
            />
            <Button
              size="lg"
              className="bg-yellow-400 text-blue-900 hover:bg-yellow-300 sm:rounded-l-none"
            >
              Subscribe
            </Button>
          </div>
          <p className="mt-3 text-xs text-blue-300 sm:text-sm">
            We respect your privacy. Unsubscribe at any time.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
