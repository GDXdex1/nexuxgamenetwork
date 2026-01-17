import { NextRequest, NextResponse } from 'next/server';
import { getMarketplaceCollection } from '@/lib/mongoDbService';
import { ObjectId } from 'mongodb';

/**
 * GET /api/marketplace/listings/[id]
 * Get a specific marketplace listing
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const marketplaceCollection = await getMarketplaceCollection();
    const listing = await marketplaceCollection.findOne({ _id: new ObjectId(id) });

    if (!listing) {
      return NextResponse.json(
        {
          success: false,
          error: 'Listing not found',
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: listing,
    });
  } catch (error: unknown) {
    console.error('Error fetching listing:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch listing',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/marketplace/listings/[id]
 * Update listing status or price
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json() as { status?: 'active' | 'sold' | 'cancelled'; price?: number };

    const marketplaceCollection = await getMarketplaceCollection();

    const updateData: Record<string, unknown> = {
      updatedAt: new Date(),
    };

    if (body.status) {
      updateData.status = body.status;
      if (body.status === 'sold') {
        updateData.soldAt = new Date();
      }
    }

    if (body.price !== undefined) {
      updateData.price = body.price;
    }

    const result = await marketplaceCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Listing not found',
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Listing updated successfully',
    });
  } catch (error: unknown) {
    console.error('Error updating listing:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update listing',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/marketplace/listings/[id]
 * Delete (delist) a marketplace listing
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const marketplaceCollection = await getMarketplaceCollection();
    
    // Soft delete - mark as cancelled instead of removing
    const result = await marketplaceCollection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          status: 'cancelled',
          updatedAt: new Date(),
        },
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Listing not found',
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Listing cancelled successfully',
    });
  } catch (error: unknown) {
    console.error('Error deleting listing:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to delete listing',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
