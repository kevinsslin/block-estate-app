'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAccount } from 'wagmi';

import { supabase } from '@/lib/supabase/client';
import { uploadImages, uploadMetadata } from '@/lib/supabase/storage';
import { useBlockEstateContract } from '@/contracts/hooks/useBlockEstateContract';
import { tokenizeProperty } from '@/contracts/utils/contractHelpers';

// Constants for dropdown options
const PROPERTY_TYPES = ['Apartment', 'House', 'Villa', 'Commercial', 'Land', 'Other'] as const;

const TOKEN_TYPES = ['Ownership', 'Revenue Share', 'Usage Rights', 'Development Rights'] as const;

const AMENITIES = [
  'Swimming Pool',
  'Gym',
  'Parking',
  'Security',
  'Garden',
  'Elevator',
  'Air Conditioning',
  'Furnished',
  'Pet Friendly',
  'Storage',
] as const;

interface TokenForm {
  id: number;
  price: string;
  supply: number;
  type: string;
  description: string;
}

export default function TokenizePage() {
  const router = useRouter();
  const { address } = useAccount();
  const { contract, isConnected, isWrongNetwork } = useBlockEstateContract();

  const [isLoading, setIsLoading] = useState(false);
  const [propertyData, setPropertyData] = useState({
    name: '',
    description: '',
    location: '',
    propertyType: PROPERTY_TYPES[0],
    size: '',
    bedrooms: '',
    bathrooms: '',
    yearBuilt: '',
    amenities: [] as string[],
  });
  const [images, setImages] = useState<File[]>([]);
  const [tokens, setTokens] = useState<TokenForm[]>([
    { id: 1, price: '', supply: 0, type: TOKEN_TYPES[0], description: '' },
  ]);
  const [quoteAsset, setQuoteAsset] = useState('');
  const [startTime, setStartTime] = useState('');

  const handlePropertyDataChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setPropertyData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAmenityToggle = (amenity: string) => {
    setPropertyData((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((a) => a !== amenity)
        : [...prev.amenities, amenity],
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      // Limit to 5 images
      if (files.length > 5) {
        alert('Please select up to 5 images');
        return;
      }
      setImages(files);
    }
  };

  const handleTokenChange = (index: number, field: keyof TokenForm, value: string | number) => {
    setTokens((prev) =>
      prev.map((token, i) => (i === index ? { ...token, [field]: value } : token))
    );
  };

  const addToken = () => {
    if (tokens.length >= 5) {
      alert('Maximum 5 tokens allowed per property');
      return;
    }
    setTokens((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        price: '',
        supply: 0,
        type: TOKEN_TYPES[0],
        description: '',
      },
    ]);
  };

  const removeToken = (index: number) => {
    if (tokens.length <= 1) {
      alert('At least one token is required');
      return;
    }
    setTokens((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isConnected) {
      alert('Please connect your wallet');
      return;
    }
    if (isWrongNetwork) {
      alert('Please switch to the correct network');
      return;
    }
    if (!contract || !address) return;

    try {
      setIsLoading(true);

      // 1. Upload images to Supabase Storage
      const imageUrls = await uploadImages(images);

      // 2. Create metadata object and upload to Supabase Storage
      const metadata = {
        name: propertyData.name,
        description: propertyData.description,
        images: imageUrls,
        location: propertyData.location,
        propertyType: propertyData.propertyType,
        size: Number(propertyData.size),
        bedrooms: Number(propertyData.bedrooms),
        bathrooms: Number(propertyData.bathrooms),
        yearBuilt: Number(propertyData.yearBuilt),
        amenities: propertyData.amenities,
      };
      const metadataUri = await uploadMetadata(metadata);

      // 3. Call smart contract
      const tokenIds = tokens.map((t) => t.id);
      const prices = tokens.map((t) => t.price);
      const supplies = tokens.map((t) => t.supply);
      const startTimestamp = Math.floor(new Date(startTime).getTime() / 1000);

      const estateAddress = await tokenizeProperty(
        contract,
        metadataUri,
        quoteAsset,
        tokenIds,
        prices,
        supplies,
        startTimestamp
      );

      // 4. Save to Supabase
      const { data, error } = await supabase
        .from('properties')
        .insert({
          address: propertyData.location,
          metadata_uri: metadataUri,
          image_url: imageUrls[0] || '',
          quote_asset: quoteAsset,
          start_timestamp: new Date(startTime).toISOString(),
          owner_address: address,
          contract_address: estateAddress,
          status: 'pending',
        })
        .select()
        .single();

      if (error) throw error;

      // 5. Save tokens
      await supabase.from('property_tokens').insert(
        tokens.map((token) => ({
          property_id: data.id,
          token_id: token.id,
          price: token.price,
          max_supply: token.supply,
          token_type: token.type,
          description: token.description,
        }))
      );

      router.push(`/properties/${estateAddress}`);
    } catch (error) {
      console.error('Error tokenizing property:', error);
      alert('Failed to tokenize property. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-4xl space-y-8 p-6">
      {/* Property Details Section */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Property Details</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Property Name</label>
            <input
              type="text"
              name="name"
              value={propertyData.name}
              onChange={handlePropertyDataChange}
              placeholder="Enter property name"
              className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Property Type</label>
            <select
              name="propertyType"
              value={propertyData.propertyType}
              onChange={handlePropertyDataChange}
              className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500"
              required
            >
              {PROPERTY_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              name="description"
              value={propertyData.description}
              onChange={handlePropertyDataChange}
              placeholder="Enter property description"
              className="min-h-[100px] w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Location</label>
            <input
              type="text"
              name="location"
              value={propertyData.location}
              onChange={handlePropertyDataChange}
              placeholder="Enter property location"
              className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Size (sqft)</label>
            <input
              type="number"
              name="size"
              value={propertyData.size}
              onChange={handlePropertyDataChange}
              placeholder="Enter property size"
              className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500"
              required
              min="0"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Bedrooms</label>
            <input
              type="number"
              name="bedrooms"
              value={propertyData.bedrooms}
              onChange={handlePropertyDataChange}
              placeholder="Number of bedrooms"
              className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500"
              required
              min="0"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Bathrooms</label>
            <input
              type="number"
              name="bathrooms"
              value={propertyData.bathrooms}
              onChange={handlePropertyDataChange}
              placeholder="Number of bathrooms"
              className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500"
              required
              min="0"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Year Built</label>
            <input
              type="number"
              name="yearBuilt"
              value={propertyData.yearBuilt}
              onChange={handlePropertyDataChange}
              placeholder="Year built"
              className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500"
              required
              min="1800"
              max={new Date().getFullYear()}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Amenities</label>
          <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
            {AMENITIES.map((amenity) => (
              <label
                key={amenity}
                className={`flex cursor-pointer items-center rounded border p-2 transition-colors ${
                  propertyData.amenities.includes(amenity)
                    ? 'border-blue-500 bg-blue-50'
                    : 'hover:bg-gray-50'
                }`}
              >
                <input
                  type="checkbox"
                  checked={propertyData.amenities.includes(amenity)}
                  onChange={() => handleAmenityToggle(amenity)}
                  className="mr-2"
                />
                {amenity}
              </label>
            ))}
          </div>
        </div>
      </section>

      {/* Images Section */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Property Images</h2>
        <div className="space-y-4">
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
            id="images"
            required
          />
          <label
            htmlFor="images"
            className="block w-full cursor-pointer rounded-lg border-2 border-dashed p-4 text-center hover:bg-gray-50"
          >
            Click to upload images (max 5)
          </label>
          {images.length > 0 && (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
              {Array.from(images).map((image, index) => (
                <div key={index} className="relative aspect-square">
                  <Image
                    src={URL.createObjectURL(image)}
                    alt={`Preview ${index + 1}`}
                    fill
                    className="rounded object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Tokens Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Token Configuration</h2>
          <button
            type="button"
            onClick={addToken}
            className="rounded bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-600"
          >
            Add Token
          </button>
        </div>
        <div className="space-y-4">
          {tokens.map((token, index) => (
            <div key={token.id} className="space-y-4 rounded-lg border p-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Token #{index + 1}</h3>
                {tokens.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeToken(index)}
                    className="text-red-500 hover:text-red-600"
                  >
                    Remove
                  </button>
                )}
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Token Type</label>
                  <select
                    value={token.type}
                    onChange={(e) => handleTokenChange(index, 'type', e.target.value)}
                    className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    {TOKEN_TYPES.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Price (USDT)</label>
                  <input
                    type="number"
                    value={token.price}
                    onChange={(e) => handleTokenChange(index, 'price', e.target.value)}
                    placeholder="Token price"
                    className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500"
                    required
                    min="0"
                    step="0.01"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Supply</label>
                  <input
                    type="number"
                    value={token.supply}
                    onChange={(e) => handleTokenChange(index, 'supply', Number(e.target.value))}
                    placeholder="Token supply"
                    className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500"
                    required
                    min="1"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <input
                    type="text"
                    value={token.description}
                    onChange={(e) => handleTokenChange(index, 'description', e.target.value)}
                    placeholder="Token description"
                    className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Additional Settings */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Additional Settings</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Quote Asset Address (USDT)
            </label>
            <input
              type="text"
              value={quoteAsset}
              onChange={(e) => setQuoteAsset(e.target.value)}
              placeholder="USDT contract address"
              className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Start Time</label>
            <input
              type="datetime-local"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500"
              required
              min={new Date().toISOString().slice(0, 16)}
            />
          </div>
        </div>
      </section>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading || !isConnected || isWrongNetwork}
        className="w-full rounded-lg bg-blue-600 px-4 py-3 text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isLoading ? 'Processing...' : 'Tokenize Property'}
      </button>

      {!isConnected && <p className="text-center text-red-500">Please connect your wallet</p>}
      {isWrongNetwork && (
        <p className="text-center text-red-500">Please switch to the correct network</p>
      )}
    </form>
  );
}
