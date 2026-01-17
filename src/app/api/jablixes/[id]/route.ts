import { NextRequest, NextResponse } from 'next/server';
import { getElementalJablixesCollection, getSpecialJablixesCollection } from '@/lib/mongoDbService';

/**
 * GET /api/jablixes/[id]
 * Get a specific jablix by its type ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const jablixId = parseInt(id, 10);

    if (isNaN(jablixId)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid jablix ID',
        },
        { status: 400 }
      );
    }

    // Try to find in elementals first
    const elementalCollection = await getElementalJablixesCollection();
    const elemental = await elementalCollection.findOne({ id: jablixId });

    if (elemental) {
      return NextResponse.json({
        success: true,
        data: {
          ...elemental,
          type: 'elemental',
        },
      });
    }

    // If not found in elementals, try specials
    const specialCollection = await getSpecialJablixesCollection();
    const special = await specialCollection.findOne({ id: jablixId });

    if (special) {
      return NextResponse.json({
        success: true,
        data: {
          ...special,
          type: 'special',
        },
      });
    }

    // Not found in either collection
    return NextResponse.json(
      {
        success: false,
        error: 'Jablix not found',
      },
      { status: 404 }
    );
  } catch (error: unknown) {
    console.error('Error fetching jablix:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch jablix',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
