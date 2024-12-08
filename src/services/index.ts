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
    throw new ApiError(response.status, await response.text());
  }
  return response.json();
}

export async function getAllProperties(): Promise<Property[]> {
  const response = await fetch('/api/properties');
  return handleResponse<Property[]>(response);
}

export async function getPropertyById(id: string): Promise<Property> {
  const response = await fetch(`/api/properties/${id}`);
  return handleResponse<Property>(response);
}

// Export error type for external use
export type { ApiError };
