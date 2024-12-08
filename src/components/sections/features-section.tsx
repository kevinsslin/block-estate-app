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

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
};

export function FeaturesSection() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          style={{
            fontSize: '2.25rem',
            fontWeight: 'bold',
            marginBottom: '2.5rem',
            textAlign: 'center',
            color: '#1e3a8a',
          }}
        >
          Why Choose BlockEstate?
        </motion.h2>
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '3rem' }}
        >
          {features.map((feature) => (
            <motion.div
              key={feature.id}
              variants={item}
              whileHover={{
                scale: 1.05,
                transition: { duration: 0.2 },
              }}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                backgroundColor: 'white',
                padding: '2rem',
                borderRadius: '0.5rem',
                boxShadow:
                  '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
              }}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <feature.icon
                  style={{
                    width: '4rem',
                    height: '4rem',
                    color: '#3b82f6',
                    marginBottom: '1.5rem',
                  }}
                />
              </motion.div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>
                {feature.title}
              </h3>
              <p style={{ color: '#4b5563' }}>{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
