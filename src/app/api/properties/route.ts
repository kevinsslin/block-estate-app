import type { Property } from '@/types/property';

// Mock data for development
const mockProperties: Property[] = [
  {
    id: 1,
    title: 'Luxury Apartment in Downtown',
    location: 'New York, NY',
    price: 500000,
    tokens: 10000,
    tokenPrice: 50,
    image: '/placeholder.svg?height=400&width=600',
    type: 'Residential',
    description:
      'Experience urban living at its finest with this luxurious downtown apartment. Featuring stunning city views, high-end finishes, and access to premium amenities.',
    tokensSold: 7500,
    annualReturn: 8.5,
    lastValuation: '2023-05-15',
  },
  {
    id: 2,
    title: 'Commercial Office Space',
    location: 'San Francisco, CA',
    price: 2000000,
    tokens: 20000,
    tokenPrice: 100,
    image: '/placeholder.svg?height=400&width=600',
    type: 'Commercial',
    description:
      "Prime commercial office space in the heart of San Francisco's business district. Ideal for startups or established companies looking for a prestigious address.",
    tokensSold: 15000,
    annualReturn: 7.2,
    lastValuation: '2023-06-01',
  },
  {
    id: 3,
    title: 'Beachfront Villa',
    location: 'Miami, FL',
    price: 1500000,
    tokens: 15000,
    tokenPrice: 100,
    image: '/placeholder.svg?height=400&width=600',
    type: 'Residential',
    description:
      "Escape to this stunning beachfront villa in Miami. With direct beach access, a private pool, and luxurious interiors, it's the perfect vacation home or investment property.",
    tokensSold: 10000,
    annualReturn: 9.1,
    lastValuation: '2023-05-30',
  },
];

// GET /api/properties - Get all properties
export async function GET(request: Request) {
  // Get the pathname from the request URL
  const pathname = new URL(request.url).pathname;
  const isDetailRequest = pathname.match(/\/api\/properties\/\d+$/);

  try {
    if (isDetailRequest) {
      // Extract ID from pathname
      const id = Number(pathname.split('/').pop());
      const property = mockProperties.find((p) => p.id === id);

      if (!property) {
        return new Response('Property not found', { status: 404 });
      }

      return Response.json(property);
    }

    // Return all properties
    return Response.json(mockProperties);
  } catch (error) {
    console.error('Error in GET /api/properties:', error);
    return new Response(
      JSON.stringify({
        error: 'Internal Server Error',
        message: error instanceof Error ? error.message : 'Unknown error occurred',
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
}
