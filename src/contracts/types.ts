import type { Address } from 'viem';

export interface PropertyMetadata {
  name: string;
  description: string;
  images: string[];
  location?: string;
  propertyType?: string;
  size?: number;
  bedrooms?: number;
  bathrooms?: number;
  yearBuilt?: number;
  amenities?: string[];
}

export interface ContractPropertyToken {
  id: bigint;
  price: bigint;
  maxSupply: bigint;
  currentSupply: bigint;
  type?: string;
  description?: string;
}

export interface ContractProperty {
  address: Address;
  metadataUri: string;
  imageUrl: string;
  quoteAsset: Address;
  startTimestamp: bigint;
  tokens: ContractPropertyToken[];
}
