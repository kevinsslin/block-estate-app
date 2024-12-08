'use client';

import type { FormEvent } from 'react';
import { motion } from 'framer-motion';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function NewsletterSection() {
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // TODO: Handle newsletter subscription
  };

  return (
    <section className="bg-blue-50 py-20">
      <div className="container mx-auto px-4 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          style={{
            fontSize: '2.25rem',
            fontWeight: 'bold',
            color: '#1e3a8a',
            marginBottom: '1.5rem',
          }}
        >
          Stay Updated
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          style={{
            fontSize: '1.25rem',
            color: '#4b5563',
            marginBottom: '2.5rem',
            maxWidth: '32rem',
            margin: '0 auto 2.5rem',
          }}
        >
          Subscribe to our newsletter for the latest property listings, market insights, and
          investment opportunities.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          style={{
            display: 'flex',
            maxWidth: '28rem',
            margin: '0 auto',
          }}
        >
          <form onSubmit={handleSubmit} className="flex w-full">
            <Input
              type="email"
              placeholder="Enter your email"
              className="mr-2 flex-grow py-6 text-lg"
              required
            />
            <Button
              type="submit"
              size="lg"
              className="bg-blue-600 px-8 text-lg text-white hover:bg-blue-700"
            >
              Subscribe
            </Button>
          </form>
        </motion.div>
      </div>
    </section>
  );
}
