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

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="bg-gray-50 py-12 md:py-20">
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
          How It Works
        </motion.h2>
        <div className="grid gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-4">
          {steps.map((step) => (
            <motion.div
              key={step.id}
              variants={item}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
            >
              <Card className="h-full transition-transform hover:scale-105">
                <CardHeader className="p-4 pb-2 sm:p-6 sm:pb-3">
                  <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                    <step.icon className="h-5 w-5 text-blue-500 sm:h-6 sm:w-6" />
                    {step.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-2 text-sm text-gray-600 sm:p-6 sm:pt-3 sm:text-base">
                  {step.description}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
