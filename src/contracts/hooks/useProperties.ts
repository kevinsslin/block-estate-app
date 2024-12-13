import { useCallback, useEffect, useState } from 'react';

import { supabase } from '@/lib/supabase/client';
import { getProperties, searchProperties } from '@/lib/supabase/queries';
import type { PropertyWithTokens } from '@/lib/supabase/types';

interface UsePropertiesParams {
  status?: 'pending' | 'active' | 'sold';
  searchTerm?: string;
}

export function useProperties(params: UsePropertiesParams = {}) {
  const { status, searchTerm } = params;
  const [properties, setProperties] = useState<PropertyWithTokens[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchProperties = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      if (searchTerm) {
        const data = await searchProperties(searchTerm);
        setProperties(data);
      } else {
        const data = await getProperties(status);
        setProperties(data);
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch properties'));
    } finally {
      setIsLoading(false);
    }
  }, [status, searchTerm]);

  useEffect(() => {
    fetchProperties();

    // Subscribe to realtime changes
    const propertiesSubscription = supabase
      .channel('properties')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'properties' }, async () => {
        await fetchProperties();
      })
      .subscribe();

    const tokensSubscription = supabase
      .channel('property_tokens')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'property_tokens' },
        async () => {
          await fetchProperties();
        }
      )
      .subscribe();

    return () => {
      propertiesSubscription.unsubscribe();
      tokensSubscription.unsubscribe();
    };
  }, [fetchProperties]);

  return {
    properties,
    isLoading,
    error,
    refetch: fetchProperties,
  };
}
