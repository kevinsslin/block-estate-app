import type { PropertyMetadata } from '@/contracts/types';

import { supabase } from './client';

export async function uploadImages(files: File[]): Promise<string[]> {
  const imageUrls: string[] = [];

  for (const file of files) {
    const fileName = `${Date.now()}-${file.name}`;
    const { data, error } = await supabase.storage.from('property-images').upload(fileName, file);

    if (error) throw error;
    if (data) {
      const {
        data: { publicUrl },
      } = supabase.storage.from('property-images').getPublicUrl(data.path);
      imageUrls.push(publicUrl);
    }
  }

  return imageUrls;
}

export async function uploadMetadata(metadata: PropertyMetadata): Promise<string> {
  const fileName = `${Date.now()}-metadata.json`;
  const { data, error } = await supabase.storage
    .from('property-metadata')
    .upload(fileName, JSON.stringify(metadata));

  if (error) throw error;
  if (data) {
    const {
      data: { publicUrl },
    } = supabase.storage.from('property-metadata').getPublicUrl(data.path);
    return publicUrl;
  }

  throw new Error('Failed to upload metadata');
}
