import { toast } from 'sonner';

import type { Property } from '@/types/property';

class ApiError extends Error {
  constructor(
    public status: number,
    message: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorMessage = await response.text();
    toast.error(`API Error: ${errorMessage}`);
    throw new ApiError(response.status, errorMessage);
  }
  return response.json();
}

export async function getAllProperties(): Promise<Property[]> {
  try {
    const response = await fetch('/api/properties');
    return handleResponse<Property[]>(response);
  } catch (error) {
    console.error('Failed to fetch properties:', error);
    toast.error('Failed to load properties. Please try again later.');
    throw error;
  }
}

export async function getPropertyById(id: string): Promise<Property> {
  try {
    const response = await fetch(`/api/properties/${id}`);
    return handleResponse<Property>(response);
  } catch (error) {
    console.error(`Failed to fetch property ${id}:`, error);
    toast.error('Failed to load property details. Please try again later.');
    throw error;
  }
}

// Export error type for external use
export type { ApiError };
