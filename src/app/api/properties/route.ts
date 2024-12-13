import { getProperties } from '@/lib/supabase/queries';

// GET /api/properties - Get all properties
export async function GET() {
  try {
    const properties = await getProperties();
    return Response.json(properties);
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
