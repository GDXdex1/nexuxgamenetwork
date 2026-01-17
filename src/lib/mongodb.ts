// src/lib/mongodb.ts

import { MongoClient, Db, Collection, Document } from 'mongodb';

// MongoDB is optional - if not configured, operations will gracefully fail
const MONGODB_ENABLED = !!process.env.MONGODB_URI;

if (!MONGODB_ENABLED) {
  console.warn('⚠️ MongoDB not configured - database features will be disabled');
}

const uri: string = process.env.MONGODB_URI || 'mongodb://localhost:27017/jablix';
const options = {};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (MONGODB_ENABLED) {
  if (process.env.NODE_ENV === 'development') {
    // In development mode, use a global variable so that the value
    // is preserved across module reloads caused by HMR (Hot Module Replacement).
    const globalWithMongo = global as typeof globalThis & {
      _mongoClientPromise?: Promise<MongoClient>;
    };

    if (!globalWithMongo._mongoClientPromise) {
      client = new MongoClient(uri, options);
      globalWithMongo._mongoClientPromise = client.connect();
    }
    clientPromise = globalWithMongo._mongoClientPromise;
  } else {
    // In production mode, it's best to not use a global variable.
    client = new MongoClient(uri, options);
    clientPromise = client.connect();
  }
} else {
  // Create a mock promise that rejects when MongoDB is not configured
  clientPromise = Promise.reject(new Error('MongoDB not configured'));
}

// Export a module-scoped MongoClient promise. By doing this in a
// separate module, the client can be shared across functions.
export default clientPromise;

/**
 * Check if MongoDB is enabled
 */
export function isMongoDBEnabled(): boolean {
  return MONGODB_ENABLED;
}

/**
 * Get MongoDB database instance
 */
export async function getDatabase(): Promise<Db> {
  if (!MONGODB_ENABLED) {
    throw new Error('MongoDB is not configured');
  }
  const client = await clientPromise;
  return client.db('jablixarena');
}

/**
 * Get a collection from the database
 */
export async function getCollection<T extends Document = Document>(
  collectionName: string
): Promise<Collection<T>> {
  const db = await getDatabase();
  return db.collection<T>(collectionName);
}

/**
 * Collection names enum for type safety
 */
export enum Collections {
  JABLIXES = 'jablixes',
  ELEMENTAL_JABLIXES = 'elemental_jablixes',
  SPECIAL_JABLIXES = 'special_jablixes',
  USERS = 'users',
  BATTLES = 'battles',
  MARKETPLACE = 'marketplace',
  EVOLUTION_CHAINS = 'evolution_chains',
  CARDS = 'cards',
  MATCHMAKING = 'matchmaking'
}

/**
 * Initialize database collections with indexes
 */
export async function initializeDatabase(): Promise<void> {
  try {
    const db = await getDatabase();

    // Create indexes for jablixes
    await db.collection(Collections.JABLIXES).createIndex({ id: 1 }, { unique: true });
    await db.collection(Collections.JABLIXES).createIndex({ name: 1 });
    await db.collection(Collections.JABLIXES).createIndex({ elements: 1 });

    // Create indexes for elemental jablixes
    await db.collection(Collections.ELEMENTAL_JABLIXES).createIndex({ id: 1 }, { unique: true });
    await db.collection(Collections.ELEMENTAL_JABLIXES).createIndex({ mintable: 1 });
    await db.collection(Collections.ELEMENTAL_JABLIXES).createIndex({ phase: 1 });

    // Create indexes for special jablixes
    await db.collection(Collections.SPECIAL_JABLIXES).createIndex({ id: 1 }, { unique: true });
    await db.collection(Collections.SPECIAL_JABLIXES).createIndex({ tier: 1 });
    await db.collection(Collections.SPECIAL_JABLIXES).createIndex({ mintable: 1 });

    // Create indexes for users
    await db.collection(Collections.USERS).createIndex({ walletAddress: 1 }, { unique: true });
    await db.collection(Collections.USERS).createIndex({ username: 1 });

    // Create indexes for marketplace
    await db.collection(Collections.MARKETPLACE).createIndex({ jablixId: 1 });
    await db.collection(Collections.MARKETPLACE).createIndex({ seller: 1 });
    await db.collection(Collections.MARKETPLACE).createIndex({ price: 1 });
    await db.collection(Collections.MARKETPLACE).createIndex({ listed: 1 });

    // Create indexes for battles
    await db.collection(Collections.BATTLES).createIndex({ battleId: 1 }, { unique: true });
    await db.collection(Collections.BATTLES).createIndex({ player1: 1 });
    await db.collection(Collections.BATTLES).createIndex({ player2: 1 });
    await db.collection(Collections.BATTLES).createIndex({ timestamp: -1 });

    // Create indexes for matchmaking
    await db.collection(Collections.MATCHMAKING).createIndex({ playerId: 1 });
    await db.collection(Collections.MATCHMAKING).createIndex({ rating: 1 });
    await db.collection(Collections.MATCHMAKING).createIndex({ status: 1 });
    await db.collection(Collections.MATCHMAKING).createIndex({ timestamp: -1 });

    console.log('✅ Database indexes created successfully');
  } catch (error) {
    console.error('❌ Error initializing database:', error);
    throw error;
  }
}

/**
 * Ping database to check connection
 */
export async function pingDatabase(): Promise<boolean> {
  try {
    const db = await getDatabase();
    await db.admin().ping();
    return true;
  } catch (error) {
    console.error('❌ Database ping failed:', error);
    return false;
  }
}
