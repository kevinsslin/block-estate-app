'use client';

import { motion } from 'framer-motion';
import { Building, Coins, ShieldCheck, TrendingUp } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const steps = [
  {
    id: 'property-selection',
    icon: Building,
    title: 'Property Selection',
    description:
      'Our team of experts carefully selects properties with high potential for value appreciation and rental income. Each property undergoes thorough due diligence before being tokenized and offered on our platform.',
  },
  {
    id: 'tokenization',
    icon: Coins,
    title: 'Tokenization',
    description:
      "Real estate properties are divided into digital tokens, each representing a fraction of the property's value. This allows investors to own a share of high-value properties with a lower capital requirement.",
  },
  {
    id: 'trading',
    icon: TrendingUp,
    title: 'Trading',
    description:
      'Investors can buy and sell property tokens on our secondary market, providing liquidity typically not available in traditional real estate investments. This allows for more flexible investment strategies and portfolio management.',
  },
  {
    id: 'security',
    icon: ShieldCheck,
    title: 'Security and Compliance',
    description:
      'All transactions are secured by blockchain technology, ensuring transparency and immutability. We comply with all relevant regulations to provide a safe and legal investment environment for our users.',
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
  show: { opacity: 1, y: 0 },
};

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="bg-white py-20">
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
          How It Works
        </motion.h2>
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '2rem',
          }}
        >
          {steps.map((step) => (
            <motion.div key={step.id} variants={item}>
              <Card className="transition-transform hover:scale-105">
                <CardHeader>
                  <CardTitle className="flex items-center text-xl">
                    <step.icon className="mr-3 h-8 w-8 text-blue-500" />
                    {step.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{step.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
