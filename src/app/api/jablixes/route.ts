import { NextRequest, NextResponse } from 'next/server';
import { getElementalJablixesCollection, getSpecialJablixesCollection } from '@/lib/mongoDbService';

/**
 * GET /api/jablixes
 * Get all jablixes (elemental and special) or filter by type
 * Query params:
 * - type: 'elemental' | 'special' | 'all' (default: 'all')
 * - mintable: 'true' | 'false' (optional filter)
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get('type') || 'all';
    const mintableOnly = searchParams.get('mintable') === 'true';

    let elementals: unknown[] = [];
    let specials: unknown[] = [];

    if (type === 'all' || type === 'elemental') {
      const elementalCollection = await getElementalJablixesCollection();
      const query = mintableOnly ? { mintable: true } : {};
      elementals = await elementalCollection.find(query).toArray();
    }

    if (type === 'all' || type === 'special') {
      const specialCollection = await getSpecialJablixesCollection();
      const query = mintableOnly ? { mintable: true } : {};
      specials = await specialCollection.find(query).toArray();
    }

    return NextResponse.json({
      success: true,
      data: {
        elementals,
        specials,
        total: elementals.length + specials.length,
      },
    });
  } catch (error: unknown) {
    console.error('Error fetching jablixes:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch jablixes',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
