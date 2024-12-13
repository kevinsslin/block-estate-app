import type { StorageError } from '@supabase/storage-js';

import type { PropertyMetadata } from '@/contracts/types';

import { supabase } from './client';

const BUCKET_NAMES = {
  IMAGES: 'property-images',
  METADATA: 'property-metadata',
} as const;

type BucketName = (typeof BUCKET_NAMES)[keyof typeof BUCKET_NAMES];

class StorageApiError extends Error {
  constructor(
    message: string,
    public originalError?: StorageError
  ) {
    super(message);
    this.name = 'StorageApiError';
  }
}

async function ensureBucketExists(bucketName: BucketName): Promise<void> {
  try {
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();

    if (listError) {
      throw new StorageApiError('Failed to list buckets', listError);
    }

    const bucketExists = buckets?.some((bucket) => bucket.name === bucketName);

    if (!bucketExists) {
      const { error: createError } = await supabase.storage.createBucket(bucketName, {
        public: true,
      });

      if (createError) {
        throw new StorageApiError(`Failed to create bucket ${bucketName}`, createError);
      }
    }
  } catch (error) {
    if (error instanceof StorageApiError) {
      throw error;
    }
    throw new StorageApiError(`Failed to setup bucket ${bucketName}`, error as StorageError);
  }
}

export async function uploadImages(files: File[]): Promise<string[]> {
  await ensureBucketExists(BUCKET_NAMES.IMAGES);
  const imageUrls: string[] = [];

  for (const file of files) {
    const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '')}`;
    const { data, error } = await supabase.storage
      .from(BUCKET_NAMES.IMAGES)
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      throw new StorageApiError('Failed to upload image', error);
    }

    if (!data) {
      throw new StorageApiError('No data returned from image upload');
    }

    const { data: urlData } = supabase.storage.from(BUCKET_NAMES.IMAGES).getPublicUrl(data.path);
    imageUrls.push(urlData.publicUrl);
  }

  return imageUrls;
}

export async function uploadMetadata(metadata: PropertyMetadata): Promise<string> {
  await ensureBucketExists(BUCKET_NAMES.METADATA);
  const fileName = `${Date.now()}-metadata.json`;

  const { data, error } = await supabase.storage
    .from(BUCKET_NAMES.METADATA)
    .upload(fileName, JSON.stringify(metadata), {
      contentType: 'application/json',
      cacheControl: '3600',
      upsert: false,
    });

  if (error) {
    throw new StorageApiError('Failed to upload metadata', error);
  }

  if (!data) {
    throw new StorageApiError('No data returned from metadata upload');
  }

  const { data: urlData } = supabase.storage.from(BUCKET_NAMES.METADATA).getPublicUrl(data.path);
  return urlData.publicUrl;
}
