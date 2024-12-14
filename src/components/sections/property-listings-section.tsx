'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

import { ErrorDisplay } from '@/components/ErrorDisplay';
import { LoadingState } from '@/components/LoadingState';
import { PropertyCard } from '@/components/PropertyCard';
import { useAsync } from '@/hooks/useAsync';
import { getAllProperties } from '@/services';
import type { Property } from '@/types/property';

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
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
};

export function PropertyListingsSection() {
  const {
    data: properties,
    loading,
    error,
    execute,
  } = useAsync<Property[]>(getAllProperties, true);
  const [currentPage, setCurrentPage] = useState(1);
  const propertiesPerPage = 6;

  if (loading) {
    return (
      <div
        style={{
          display: 'flex',
          minHeight: '400px',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <LoadingState />
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          display: 'flex',
          minHeight: '400px',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <ErrorDisplay title="Failed to Load Properties" message={error.message} onRetry={execute} />
      </div>
    );
  }

  if (!properties || properties.length === 0) {
    return (
      <div style={{ textAlign: 'center', color: '#6b7280' }}>
        No properties available at the moment.
      </div>
    );
  }

  // Calculate pagination
  const totalPages = Math.ceil(properties.length / propertiesPerPage);
  const startIndex = (currentPage - 1) * propertiesPerPage;
  const visibleProperties = properties.slice(startIndex, startIndex + propertiesPerPage);

  return (
    <section style={{ padding: '5rem 0' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 1rem' }}>
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
          Featured Properties
        </motion.h2>
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.5rem',
          }}
        >
          {visibleProperties.map((property) => (
            <motion.div key={property.id} variants={item} style={{ height: '100%' }}>
              <PropertyCard property={property} />
            </motion.div>
          ))}
        </motion.div>
        
        {/* Pagination */}
        {totalPages > 1 && (
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            gap: '0.5rem', 
            marginTop: '2rem' 
          }}>
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              style={{
                padding: '0.5rem 1rem',
                border: '1px solid #e5e7eb',
                borderRadius: '0.375rem',
                backgroundColor: currentPage === 1 ? '#f3f4f6' : 'white',
                cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
              }}
            >
              Previous
            </button>
            <span style={{ 
              display: 'flex', 
              alignItems: 'center', 
              padding: '0 1rem' 
            }}>
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              style={{
                padding: '0.5rem 1rem',
                border: '1px solid #e5e7eb',
                borderRadius: '0.375rem',
                backgroundColor: currentPage === totalPages ? '#f3f4f6' : 'white',
                cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
              }}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </section>
  );
}