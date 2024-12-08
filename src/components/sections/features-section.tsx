'use client';

import { motion } from 'framer-motion';
import { Building, Coins, Lock } from 'lucide-react';

const features = [
  {
    id: 'tokenized',
    icon: Building,
    title: 'Tokenized Properties',
    description:
      'Invest in fractions of high-value real estate assets, lowering the barrier to entry for premium property investments.',
  },
  {
    id: 'secure',
    icon: Lock,
    title: 'Secure Transactions',
    description:
      'Blockchain-powered security ensures transparent, immutable, and safe transactions for all your investments.',
  },
  {
    id: 'liquid',
    icon: Coins,
    title: 'Liquid Real Estate',
    description:
      'Trade property tokens easily on our secondary market, providing unprecedented liquidity in real estate investments.',
  },
];

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export function FeaturesSection() {
  return (
    <section className="py-12 md:py-20">
      <div className="container mx-auto px-4">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{
            fontSize: 'clamp(1.75rem, 4vw, 2.25rem)',
            fontWeight: 'bold',
            marginBottom: '2.5rem',
            textAlign: 'center',
            color: '#1e3a8a',
          }}
        >
          ✨ Why Choose BlockEstate? ✨
        </motion.h2>
        <div className="grid gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-3">
          {features.map((feature) => (
            <motion.div
              key={feature.id}
              variants={item}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              whileHover={{
                scale: 1.05,
                rotate: [0, -1, 1, -1, 0],
                transition: { duration: 0.3 },
              }}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                backgroundColor: 'white',
                padding: '1.5rem',
                borderRadius: '1rem',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                border: '2px solid #e5e7eb',
              }}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                style={{
                  marginBottom: '1rem',
                }}
              >
                <feature.icon className="h-10 w-10 text-blue-500 sm:h-12 sm:w-12" />
              </motion.div>
              <h3 className="mb-2 text-lg font-semibold sm:mb-4 sm:text-xl">{feature.title}</h3>
              <p className="text-sm text-gray-600 sm:text-base">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
