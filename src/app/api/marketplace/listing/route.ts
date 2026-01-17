import { NextRequest, NextResponse } from 'next/server';
import { getMarketplaceCollection } from '@/lib/mongoDbService';
import type { MarketplaceListing } from '@/lib/mongoDbService';

/**
 * GET /api/marketplace/listings
 * Get all active marketplace listings
 * Query params:
 * - type: 'elemental' | 'special' | 'all' (default: 'all')
 * - seller: wallet address (optional)
 * - minPrice: minimum price in JXC (optional)
 * - maxPrice: maximum price in JXC (optional)
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get('type') || 'all';
    const seller = searchParams.get('seller');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');

    const marketplaceCollection = await getMarketplaceCollection();

    // Build query
    const query: Record<string, unknown> = { status: 'active' };

    if (type !== 'all') {
      query.jablixType = type;
    }

    if (seller) {
      query.seller = seller;
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) {
        (query.price as Record<string, unknown>).$gte = parseInt(minPrice, 10);
      }
      if (maxPrice) {
        (query.price as Record<string, unknown>).$lte = parseInt(maxPrice, 10);
      }
    }

    const listings = await marketplaceCollection
      .find(query)
      .sort({ listedAt: -1 })
      .toArray();

    return NextResponse.json({
      success: true,
      data: listings,
      total: listings.length,
    });
  } catch (error: unknown) {
    console.error('Error fetching marketplace listings:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch marketplace listings',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/marketplace/listings
 * Create a new marketplace listing
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as Partial<MarketplaceListing>;

    if (!body.jablixId || !body.jablixType || !body.typeId || !body.seller || !body.price) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields',
        },
        { status: 400 }
      );
    }

    const marketplaceCollection = await getMarketplaceCollection();

    // Check if already listed
    const existing = await marketplaceCollection.findOne({
      jablixId: body.jablixId,
      status: 'active',
    });

    if (existing) {
      return NextResponse.json(
        {
          success: false,
          error: 'Jablix is already listed',
        },
        { status: 400 }
      );
    }

    const newListing: MarketplaceListing = {
      jablixId: body.jablixId,
      jablixType: body.jablixType as 'elemental' | 'special',
      typeId: body.typeId,
      seller: body.seller,
      price: body.price,
      status: 'active',
      listedAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await marketplaceCollection.insertOne(newListing);

    return NextResponse.json({
      success: true,
      data: { ...newListing, _id: result.insertedId },
      message: 'Listing created successfully',
    }, { status: 201 });
  } catch (error: unknown) {
    console.error('Error creating marketplace listing:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create listing',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
