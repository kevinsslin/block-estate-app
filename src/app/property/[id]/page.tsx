'use client';

import { use } from 'react';
import { notFound } from 'next/navigation';

import { PropertyDetail } from '@/components/PropertyDetail';
import { getPropertyById } from '@/services';

type Params = Promise<{ id: string }>;

export default function Page({ params }: { params: Params }) {
  const { id } = use(params);
  const property = use(getPropertyById(id));

  if (!property) {
    notFound();
  }

  return <PropertyDetail property={property} />;
}
