'use client';

import { motion } from 'framer-motion';
import { Building2, DollarSign, TrendingUp, Users } from 'lucide-react';

const metrics = [
  {
    id: 'investors',
    icon: Users,
    value: '5,000+',
    label: 'Active Investors',
  },
  {
    id: 'properties',
    icon: Building2,
    value: '100+',
    label: 'Properties Listed',
  },
  {
    id: 'returns',
    icon: TrendingUp,
    value: '12%',
    label: 'Average Annual Return',
  },
  {
    id: 'volume',
    icon: DollarSign,
    value: '$50M+',
    label: 'Trading Volume',
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export function KeyMetricsSection() {
  return (
    <section className="bg-white py-20">
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
          Platform Overview
        </motion.h2>
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '2rem',
          }}
        >
          {metrics.map((metric) => (
            <motion.div
              key={metric.id}
              variants={item}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                padding: '1.5rem',
                backgroundColor: '#eff6ff',
                borderRadius: '0.5rem',
              }}
            >
              <metric.icon
                style={{
                  width: '2.5rem',
                  height: '2.5rem',
                  color: '#3b82f6',
                  marginBottom: '1rem',
                }}
              />
              <h3
                style={{
                  fontSize: '1.875rem',
                  fontWeight: 'bold',
                  color: '#1e3a8a',
                  marginBottom: '0.5rem',
                }}
              >
                {metric.value}
              </h3>
              <p style={{ color: '#4b5563' }}>{metric.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
