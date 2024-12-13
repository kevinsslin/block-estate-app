import type { NextRequest } from 'next/server';

import { getPropertyById } from '@/lib/supabase/queries';

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(request: NextRequest, props: Props) {
  const params = await props.params;
  const id = params.id;

  try {
    const property = await getPropertyById(id);

    if (!property) {
      return new Response('Property not found', { status: 404 });
    }

    return Response.json(property);
  } catch (error) {
    console.error('Error in GET /api/properties/[id]:', error);
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
