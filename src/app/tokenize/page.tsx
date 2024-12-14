'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { toast } from 'sonner';
import { decodeEventLog, parseEther } from 'viem';
import { useAccount, usePublicClient, useWalletClient } from 'wagmi';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/lib/supabase/client';
import { uploadImages, uploadMetadata } from '@/lib/supabase/storage';
import { BlockEstateFactoryABI } from '@/contracts/abis';

// Constants
const FACTORY_ADDRESS = process.env.NEXT_PUBLIC_FACTORY_ADDRESS;
const DEFAULT_TBUSD_ADDRESS = '0xaB1a4d4f1D656d2450692D237fdD6C7f9146e814';

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

interface PropertyData {
  name: string;
  description: string;
  location: string;
  propertyType: (typeof PROPERTY_TYPES)[number];
  size: string;
  bedrooms: string;
  bathrooms: string;
  yearBuilt: string;
  amenities: string[];
}

export default function TokenizePage() {
  const router = useRouter();
  const { address, isConnected } = useAccount();
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();

  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [propertyData, setPropertyData] = useState<PropertyData>({
    name: '',
    description: '',
    location: '',
    propertyType: PROPERTY_TYPES[0],
    size: '',
    bedrooms: '',
    bathrooms: '',
    yearBuilt: '',
    amenities: [],
  });
  const [images, setImages] = useState<File[]>([]);
  const [tokens, setTokens] = useState<TokenForm[]>([
    { id: 1, price: '', supply: 0, type: TOKEN_TYPES[0], description: '' },
  ]);
  const [quoteAsset, setQuoteAsset] = useState(DEFAULT_TBUSD_ADDRESS);
  const [startTime, setStartTime] = useState('');

  useEffect(() => {
    setMounted(true);
  }, []);

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
        toast.error('Too many images', {
          description: 'Please select up to 5 images',
        });
        return;
      }
      setImages(files);
      toast.success(`${files.length} images selected`);
    }
  };

  const handleTokenChange = (index: number, field: keyof TokenForm, value: string | number) => {
    setTokens((prev) =>
      prev.map((token, i) => (i === index ? { ...token, [field]: value } : token))
    );
  };

  const addToken = () => {
    if (tokens.length >= 5) {
      toast.error('Maximum tokens reached', {
        description: 'Maximum 5 tokens allowed per property',
      });
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
    toast.success('New token added');
  };

  const removeToken = (index: number) => {
    if (tokens.length <= 1) {
      toast.error('Cannot remove token', {
        description: 'At least one token is required',
      });
      return;
    }
    setTokens((prev) => prev.filter((_, i) => i !== index));
    toast.success('Token removed');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!isConnected) {
      toast.error('Wallet not connected', {
        description: 'Please connect your wallet first',
      });
      return;
    }

    if (!publicClient || !walletClient) {
      toast.error('Wallet error', {
        description: 'Wallet client not initialized. Please try again.',
      });
      return;
    }

    if (!address) {
      toast.error('Wallet error', {
        description: 'Wallet address not found. Please reconnect your wallet.',
      });
      return;
    }

    try {
      setIsLoading(true);

      // Check required fields with specific error messages
      const errors: string[] = [];

      if (!propertyData.name) {
        errors.push('Property Name is required');
      }

      if (!propertyData.description) {
        errors.push('Property Description is required');
      }

      if (!propertyData.location) {
        errors.push('Property Location is required');
      }

      if (!propertyData.size) {
        errors.push('Property Size is required');
      }

      if (!propertyData.bedrooms) {
        errors.push('Number of Bedrooms is required');
      }

      if (!propertyData.bathrooms) {
        errors.push('Number of Bathrooms is required');
      }

      if (!propertyData.yearBuilt) {
        errors.push('Year Built is required');
      }

      if (images.length === 0) {
        errors.push('At least one property image is required');
      }
      // Validate token fields
      tokens.forEach((token, index) => {
        if (!token.price) {
          errors.push(`Token #${index + 1}: Price is required`);
        }
        if (!token.supply) {
          errors.push(`Token #${index + 1}: Supply is required`);
        }
      });

      if (!quoteAsset) {
        errors.push('Quote Asset Address (USDT) is required');
      }

      if (!startTime) {
        errors.push('Start Time is required');
      }

      // If there are any errors, show all error messages
      if (errors.length > 0) {
        const errorMessage = errors.join('\\n');
        toast.error('Validation errors', {
          description: errorMessage,
        });
        throw new Error(errorMessage);
      }

      // Start the tokenization process
      toast.loading('Starting tokenization process...', {
        description: 'Uploading images...',
      });

      // Upload images
      const imageUrls = await uploadImages(images);

      toast.loading('Images uploaded', {
        description: 'Preparing metadata...',
      });

      // Create and upload metadata
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

      toast.loading('Metadata uploaded', {
        description: 'Preparing contract interaction...',
      });

      // Prepare contract parameters
      const tokenIds = tokens.map((t) => BigInt(t.id));
      const prices = tokens.map((t) => parseEther(t.price));
      const supplies = tokens.map((t) => BigInt(t.supply));
      const startTimestamp = BigInt(Math.floor(new Date(startTime).getTime() / 1000));

      // Simulate contract interaction
      const { request } = await publicClient.simulateContract({
        address: FACTORY_ADDRESS as `0x${string}`,
        abi: BlockEstateFactoryABI.abi,
        functionName: 'tokenizeProperty',
        args: [
          metadataUri,
          quoteAsset as `0x${string}`,
          tokenIds,
          prices,
          supplies,
          startTimestamp,
        ],
        account: address,
      });

      toast.loading('Contract prepared', {
        description: 'Please confirm the transaction in your wallet...',
      });

      const hash = await walletClient.writeContract(request);

      toast.loading('Transaction submitted', {
        description: 'Waiting for confirmation...',
      });

      const receipt = await publicClient.waitForTransactionReceipt({ hash });

      // Look for PropertyTokenized event
      const event = receipt.logs.find((log) => {
        try {
          const decoded = decodeEventLog({
            abi: BlockEstateFactoryABI.abi,
            data: log.data,
            topics: log.topics,
          });
          return decoded.eventName === 'PropertyTokenized';
        } catch {
          return false;
        }
      });

      if (!event) {
        throw new Error('Property tokenization failed: Event not found');
      }

      const estateAddress = event.topics[1] as `0x${string}`;

      toast.loading('Transaction confirmed', {
        description: 'Saving property details...',
      });

      // Save to Supabase
      const { data, error: dbError } = await supabase
        .from('properties')
        .insert({
          address: propertyData.location,
          metadata_uri: metadataUri,
          image_url: imageUrls[0],
          quote_asset: quoteAsset,
          start_timestamp: new Date(startTime).toISOString(),
          owner_address: address,
          contract_address: estateAddress,
          status: 'pending',
        })
        .select()
        .single();

      if (dbError) {
        console.error('Database error:', dbError);
        throw new Error('Failed to save property data');
      }

      // Save tokens
      const { error: tokensError } = await supabase.from('property_tokens').insert(
        tokens.map((token) => ({
          property_id: data.id,
          token_id: token.id,
          price: token.price,
          max_supply: token.supply,
          token_type: token.type,
          description: token.description,
        }))
      );

      if (tokensError) {
        console.error('Error saving tokens:', tokensError);
        throw new Error('Failed to save token data');
      }

      toast.success('Property tokenized successfully!', {
        description: 'Redirecting to property page...',
      });

      router.push(`/properties/${estateAddress}`);
    } catch (err) {
      console.error('Error tokenizing property:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to tokenize property';
      toast.error('Tokenization failed', {
        description: errorMessage,
      });
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Return null or loading state on server-side
  if (!mounted) {
    return (
      <div className="container mx-auto py-8">
        <Card className="mx-auto max-w-md">
          <CardContent className="flex flex-col items-center gap-4 p-8">
            <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-500" />
            <p className="text-center text-gray-600">Loading...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // If not connected, show connect wallet UI
  if (!isConnected) {
    return (
      <div className="container mx-auto py-8">
        <Card className="mx-auto max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Connect Your Wallet</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4">
            <p className="text-center text-gray-600">
              Please connect your wallet to tokenize your property
            </p>
            <ConnectButton />
          </CardContent>
        </Card>
      </div>
    );
  }

  // If loading, show loading state
  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <Card className="mx-auto max-w-md">
          <CardContent className="flex flex-col items-center gap-4 p-8">
            <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-500" />
            <p className="text-center text-gray-600">Processing your request...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-4xl space-y-8 p-6">
      {/* Property Details Section */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Property Details</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="propertyName" className="block text-sm font-medium text-gray-700">
              Property Name <span className="text-red-500">*</span>
            </label>
            <input
              id="propertyName"
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
            <label htmlFor="propertyType" className="block text-sm font-medium text-gray-700">
              Property Type <span className="text-red-500">*</span>
            </label>
            <select
              id="propertyType"
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
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              id="description"
              name="description"
              value={propertyData.description}
              onChange={handlePropertyDataChange}
              placeholder="Enter property description"
              className="min-h-[100px] w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="location" className="block text-sm font-medium text-gray-700">
              Location <span className="text-red-500">*</span>
            </label>
            <input
              id="location"
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
            <label htmlFor="size" className="block text-sm font-medium text-gray-700">
              Size (sqft) <span className="text-red-500">*</span>
            </label>
            <input
              id="size"
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
            <label htmlFor="bedrooms" className="block text-sm font-medium text-gray-700">
              Bedrooms <span className="text-red-500">*</span>
            </label>
            <input
              id="bedrooms"
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
            <label htmlFor="bathrooms" className="block text-sm font-medium text-gray-700">
              Bathrooms <span className="text-red-500">*</span>
            </label>
            <input
              id="bathrooms"
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
            <label htmlFor="yearBuilt" className="block text-sm font-medium text-gray-700">
              Year Built <span className="text-red-500">*</span>
            </label>
            <input
              id="yearBuilt"
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
          <fieldset>
            <legend className="block text-sm font-medium text-gray-700">Amenities</legend>
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
          </fieldset>
        </div>
      </section>

      {/* Images Section */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Property Images</h2>
        <div className="space-y-4">
          <label htmlFor="images" className="block text-sm font-medium text-gray-700">
            Property Images <span className="text-red-500">*</span>
          </label>
          <input
            id="images"
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
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
                <div key={`image-${index}-${image.name}`} className="relative aspect-square">
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
                  <label
                    htmlFor={`tokenType-${index}`}
                    className="block text-sm font-medium text-gray-700"
                  >
                    Token Type
                  </label>
                  <select
                    id={`tokenType-${index}`}
                    value={token.type}
                    onChange={(e) => handleTokenChange(index, 'type', e.target.value)}
                    className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  >
                    {TOKEN_TYPES.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor={`tokenPrice-${index}`}
                    className="block text-sm font-medium text-gray-700"
                  >
                    Token Price <span className="text-red-500">*</span>
                  </label>
                  <input
                    id={`tokenPrice-${index}`}
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
                  <label
                    htmlFor={`tokenSupply-${index}`}
                    className="block text-sm font-medium text-gray-700"
                  >
                    Token Supply <span className="text-red-500">*</span>
                  </label>
                  <input
                    id={`tokenSupply-${index}`}
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
                  <label
                    htmlFor={`tokenDescription-${index}`}
                    className="block text-sm font-medium text-gray-700"
                  >
                    Description
                  </label>
                  <input
                    id={`tokenDescription-${index}`}
                    type="text"
                    value={token.description}
                    onChange={(e) => handleTokenChange(index, 'description', e.target.value)}
                    placeholder="Token description"
                    className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500"
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
            <label htmlFor="quoteAsset" className="block text-sm font-medium text-gray-700">
              Quote Asset Address (BUSD) <span className="text-red-500">*</span>
            </label>
            <input
              id="quoteAsset"
              type="text"
              value={quoteAsset}
              onChange={(e) => setQuoteAsset(e.target.value)}
              placeholder="BUSD contract address"
              className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500"
              required
            />
            <p className="text-xs text-gray-500">
              Default: Test BUSD ({DEFAULT_TBUSD_ADDRESS.slice(0, 6)}...
              {DEFAULT_TBUSD_ADDRESS.slice(-4)})
            </p>
          </div>

          <div className="space-y-2">
            <label htmlFor="startTime" className="block text-sm font-medium text-gray-700">
              Start Time <span className="text-red-500">*</span>
            </label>
            <input
              id="startTime"
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
        disabled={isLoading}
        className="w-full rounded-lg bg-blue-600 px-4 py-3 text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isLoading ? 'Processing...' : 'Tokenize Property'}
      </button>

      {error && (
        <div className="rounded-lg bg-red-50 p-4 text-red-500">
          <p className="text-center">{error}</p>
        </div>
      )}
    </form>
  );
}
