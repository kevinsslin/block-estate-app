import type { Property } from '@/types/property';

// Mock data for development
export const mockProperties: Property[] = [
  {
    id: 1,
    title: 'Luxury Apartment in Downtown',
    location: 'New York, NY',
    price: 500000,
    tokens: 10000,
    tokenPrice: 50,
    image:
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80',
    type: 'Residential',
    description:
      'Experience urban living at its finest with this luxurious downtown apartment. Featuring stunning city views, high-end finishes, and access to premium amenities.',
    tokensSold: 7500,
    annualReturn: 8.5,
    lastValuation: '2024-11-15',
  },
  {
    id: 2,
    title: 'Commercial Office Space',
    location: 'San Francisco, CA',
    price: 2000000,
    tokens: 20000,
    tokenPrice: 100,
    image:
      'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=800&q=80',
    type: 'Commercial',
    description:
      "Prime commercial office space in the heart of San Francisco's business district. Ideal for startups or established companies looking for a prestigious address.",
    tokensSold: 15000,
    annualReturn: 7.2,
    lastValuation: '2024-12-07',
  },
  {
    id: 3,
    title: 'Beachfront Villa',
    location: 'Miami, FL',
    price: 1500000,
    tokens: 15000,
    tokenPrice: 100,
    image:
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=800&q=80',
    type: 'Residential',
    description:
      "Escape to this stunning beachfront villa in Miami. With direct beach access, a private pool, and luxurious interiors, it's the perfect vacation home or investment property.",
    tokensSold: 10000,
    annualReturn: 9.1,
    lastValuation: '2024-12-11',
  },
];
