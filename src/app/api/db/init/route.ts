// src/app/api/db/init/route.ts

import { NextResponse } from 'next/server';
import { initializeDatabase, pingDatabase, isMongoDBEnabled } from '@/lib/mongodb';
import {
  insertElementalJablixes,
  insertSpecialJablixes,
  getAllElementalJablixes,
  getAllSpecialJablixes
} from '@/lib/mongoDbService';
import { ELEMENTAL_JABLIX_DATABASE } from '@/data/elementalJablixDatabase';
import { SPECIAL_JABLIX_DATABASE } from '@/data/specialJablixDatabase';

/**
 * Initialize MongoDB database with Jablix data
 * POST /api/db/init
 */
export async function POST() {
  try {
    // Check if MongoDB is configured
    if (!isMongoDBEnabled()) {
      return NextResponse.json(
        { success: false, error: 'MongoDB is not configured. Set MONGODB_URI environment variable.' },
        { status: 503 }
      );
    }

    // Check database connection
    const isConnected = await pingDatabase();
    if (!isConnected) {
      return NextResponse.json(
        { success: false, error: 'Database connection failed' },
        { status: 500 }
      );
    }

    // Initialize database indexes
    await initializeDatabase();

    // Check if data already exists
    const existingElemental = await getAllElementalJablixes();
    const existingSpecial = await getAllSpecialJablixes();

    let elementalInserted = 0;
    let specialInserted = 0;

    // Insert elemental jablixes if not exists
    if (existingElemental.length === 0) {
      const elementalData = Object.values(ELEMENTAL_JABLIX_DATABASE);
      await insertElementalJablixes(elementalData);
      elementalInserted = elementalData.length;
    }

    // Insert special jablixes if not exists
    if (existingSpecial.length === 0) {
      const specialData = Object.values(SPECIAL_JABLIX_DATABASE);
      await insertSpecialJablixes(specialData);
      specialInserted = specialData.length;
    }

    return NextResponse.json({
      success: true,
      message: 'Database initialized successfully',
      data: {
        elementalJablixes: {
          existing: existingElemental.length,
          inserted: elementalInserted,
          total: existingElemental.length + elementalInserted
        },
        specialJablixes: {
          existing: existingSpecial.length,
          inserted: specialInserted,
          total: existingSpecial.length + specialInserted
        }
      }
    });
  } catch (error) {
    console.error('Error initializing database:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      },
      { status: 500 }
    );
  }
}

/**
 * Check database status
 * GET /api/db/init
 */
export async function GET() {
  try {
    // Check if MongoDB is configured
    if (!isMongoDBEnabled()) {
      return NextResponse.json(
        { success: false, connected: false, error: 'MongoDB is not configured' },
        { status: 503 }
      );
    }

    const isConnected = await pingDatabase();
    
    if (!isConnected) {
      return NextResponse.json(
        { success: false, connected: false, error: 'Database connection failed' },
        { status: 500 }
      );
    }

    const elementalCount = (await getAllElementalJablixes()).length;
    const specialCount = (await getAllSpecialJablixes()).length;

    return NextResponse.json({
      success: true,
      connected: true,
      data: {
        elementalJablixes: elementalCount,
        specialJablixes: specialCount
      }
    });
  } catch (error) {
    console.error('Error checking database status:', error);
    return NextResponse.json(
      {
        success: false,
        connected: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      },
      { status: 500 }
    );
  }
}
