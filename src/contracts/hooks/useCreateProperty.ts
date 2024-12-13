import { useState } from 'react';

import { createProperty } from '@/lib/supabase/queries';
import { uploadImages, uploadMetadata } from '@/lib/supabase/storage';
import type { PropertyMetadata } from '@/contracts/types';

import { useBlockEstateContract } from './useBlockEstateContract';

export function useCreateProperty() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { contract, isConnected, isWrongNetwork } = useBlockEstateContract();

  const create = async (
    metadata: PropertyMetadata,
    images: File[],
    quoteAsset: string,
    ownerAddress: string
  ) => {
    if (!isConnected) throw new Error('Please connect your wallet');
    if (isWrongNetwork) throw new Error('Please switch to the correct network');
    if (!contract) throw new Error('Contract not initialized');

    try {
      setIsLoading(true);
      setError(null);

      // 1. Upload images to Supabase
      const imageUrls = await uploadImages(images);
      metadata.images = imageUrls;

      // 2. Upload metadata to Supabase
      const metadataUrl = await uploadMetadata(metadata);

      // 3. Create property on blockchain
      const tx = await contract.write.createProperty([metadataUrl, quoteAsset]);
      const receipt = await tx.wait();

      // Get contract address from transaction receipt
      const contractAddress = receipt.logs[0].address;

      // 4. Create property in Supabase
      const property = await createProperty({
        address: metadata.location || '',
        metadata_uri: metadataUrl,
        image_url: imageUrls[0] || '',
        quote_asset: quoteAsset,
        start_timestamp: new Date().toISOString(),
        owner_address: ownerAddress,
        contract_address: contractAddress,
        status: 'pending',
      });

      return property;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to create property');
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    create,
    isLoading,
    error,
    isConnected,
    isWrongNetwork,
  };
}
