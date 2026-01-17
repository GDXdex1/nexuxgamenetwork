// src/lib/mongoDbService.ts

import type { ElementalJablixData } from '@/data/elementalJablixDatabase';
import type { SpecialJablixData } from '@/data/specialJablixDatabase';
import { getCollection, Collections } from './mongodb';
import type { Element } from '@/types/game.types';
import type { ObjectId } from 'mongodb';

/**
 * MongoDB Service for Jablix Arena
 * Provides methods to interact with MongoDB collections
 */

// ==================== ELEMENTAL JABLIXES ====================

export async function getAllElementalJablixes(): Promise<ElementalJablixData[]> {
  const collection = await getCollection<ElementalJablixData>(Collections.ELEMENTAL_JABLIXES);
  return await collection.find({}).toArray();
}

export async function getElementalJablixById(id: number): Promise<ElementalJablixData | null> {
  const collection = await getCollection<ElementalJablixData>(Collections.ELEMENTAL_JABLIXES);
  return await collection.findOne({ id });
}

export async function getMintableElementalJablixes(): Promise<ElementalJablixData[]> {
  const collection = await getCollection<ElementalJablixData>(Collections.ELEMENTAL_JABLIXES);
  return await collection.find({ mintable: true }).toArray();
}

export async function getElementalJablixesByPhase(phase: number): Promise<ElementalJablixData[]> {
  const collection = await getCollection<ElementalJablixData>(Collections.ELEMENTAL_JABLIXES);
  return await collection.find({ phase }).toArray();
}

export async function getElementalJablixesByElement(element: Element): Promise<ElementalJablixData[]> {
  const collection = await getCollection<ElementalJablixData>(Collections.ELEMENTAL_JABLIXES);
  return await collection.find({ elements: element }).toArray();
}

export async function insertElementalJablixes(jablixes: ElementalJablixData[]): Promise<void> {
  const collection = await getCollection<ElementalJablixData>(Collections.ELEMENTAL_JABLIXES);
  await collection.insertMany(jablixes);
}

export async function updateElementalJablix(id: number, update: Partial<ElementalJablixData>): Promise<void> {
  const collection = await getCollection<ElementalJablixData>(Collections.ELEMENTAL_JABLIXES);
  await collection.updateOne({ id }, { $set: update });
}

// ==================== SPECIAL JABLIXES ====================

export async function getAllSpecialJablixes(): Promise<SpecialJablixData[]> {
  const collection = await getCollection<SpecialJablixData>(Collections.SPECIAL_JABLIXES);
  return await collection.find({}).toArray();
}

export async function getSpecialJablixById(id: number): Promise<SpecialJablixData | null> {
  const collection = await getCollection<SpecialJablixData>(Collections.SPECIAL_JABLIXES);
  return await collection.findOne({ id });
}

export async function getMintableSpecialJablixes(): Promise<SpecialJablixData[]> {
  const collection = await getCollection<SpecialJablixData>(Collections.SPECIAL_JABLIXES);
  return await collection.find({ mintable: true }).toArray();
}

export async function getSpecialJablixesByTier(
  tier: 'exrix' | 'dragon' | 'minidragon' | 'cosmic'
): Promise<SpecialJablixData[]> {
  const collection = await getCollection<SpecialJablixData>(Collections.SPECIAL_JABLIXES);
  return await collection.find({ tier }).toArray();
}

export async function insertSpecialJablixes(jablixes: SpecialJablixData[]): Promise<void> {
  const collection = await getCollection<SpecialJablixData>(Collections.SPECIAL_JABLIXES);
  await collection.insertMany(jablixes);
}

export async function updateSpecialJablix(id: number, update: Partial<SpecialJablixData>): Promise<void> {
  const collection = await getCollection<SpecialJablixData>(Collections.SPECIAL_JABLIXES);
  await collection.updateOne({ id }, { $set: update });
}

// ==================== MARKETPLACE ====================

export interface MarketplaceListing {
  _id?: ObjectId;
  jablixId: string;
  jablixType: 'elemental' | 'special';
  typeId: number;
  seller: string;
  price: number;
  status: 'active' | 'sold' | 'cancelled';
  listedAt: Date;
  soldAt?: Date;
  buyer?: string;
  updatedAt: Date;
}

export async function getMarketplaceListings(): Promise<MarketplaceListing[]> {
  const collection = await getCollection<MarketplaceListing>(Collections.MARKETPLACE);
  return await collection.find({ listed: true }).sort({ timestamp: -1 }).toArray();
}

export async function getMarketplaceListingById(jablixId: string): Promise<MarketplaceListing | null> {
  const collection = await getCollection<MarketplaceListing>(Collections.MARKETPLACE);
  return await collection.findOne({ jablixId, listed: true });
}

export async function getMarketplaceListingsBySeller(seller: string): Promise<MarketplaceListing[]> {
  const collection = await getCollection<MarketplaceListing>(Collections.MARKETPLACE);
  return await collection.find({ seller, listed: true }).toArray();
}

export async function insertMarketplaceListing(listing: MarketplaceListing): Promise<void> {
  const collection = await getCollection<MarketplaceListing>(Collections.MARKETPLACE);
  await collection.insertOne(listing);
}

export async function updateMarketplaceListing(
  jablixId: string,
  update: Partial<MarketplaceListing>
): Promise<void> {
  const collection = await getCollection<MarketplaceListing>(Collections.MARKETPLACE);
  await collection.updateOne({ jablixId }, { $set: update });
}

export async function deleteMarketplaceListing(jablixId: string): Promise<void> {
  const collection = await getCollection<MarketplaceListing>(Collections.MARKETPLACE);
  await collection.deleteOne({ jablixId });
}

// ==================== USERS ====================

export interface User {
  _id?: ObjectId;
  walletAddress: string;
  username?: string;
  jxcBalance?: number;
  totalBattles: number;
  wins: number;
  losses: number;
  rating: number;
  ownedJablixes?: Array<{
    jablixId: string;
    typeId: number;
    type: 'elemental' | 'special';
    acquiredAt: Date;
  }>;
  achievements?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export async function getUserByWallet(walletAddress: string): Promise<User | null> {
  const collection = await getCollection<User>(Collections.USERS);
  return await collection.findOne({ walletAddress });
}

export async function createUser(user: User): Promise<void> {
  const collection = await getCollection<User>(Collections.USERS);
  await collection.insertOne(user);
}

export async function updateUser(walletAddress: string, update: Partial<User>): Promise<void> {
  const collection = await getCollection<User>(Collections.USERS);
  await collection.updateOne({ walletAddress }, { $set: update });
}

export async function addJablixToUser(walletAddress: string, jablixId: string): Promise<void> {
  const collection = await getCollection<User>(Collections.USERS);
  await collection.updateOne({ walletAddress }, { $addToSet: { jablixes: jablixId } });
}

export async function removeJablixFromUser(walletAddress: string, jablixId: string): Promise<void> {
  const collection = await getCollection<User>(Collections.USERS);
  await collection.updateOne({ walletAddress }, { $pull: { jablixes: jablixId } });
}

// ==================== BATTLES ====================

export interface Battle {
  _id?: ObjectId;
  player1Wallet: string;
  player1JablixId: string;
  player2Wallet: string | null;
  player2JablixId: string | null;
  battleType: 'pvp' | 'pve';
  result: 'win' | 'loss' | 'draw';
  rewardJxc: number;
  duration: number;
  turns: number;
  timestamp: Date;
}

export async function getBattleById(battleId: string): Promise<Battle | null> {
  const collection = await getCollection<Battle>(Collections.BATTLES);
  return await collection.findOne({ battleId });
}

export async function getBattlesByPlayer(walletAddress: string): Promise<Battle[]> {
  const collection = await getCollection<Battle>(Collections.BATTLES);
  return await collection
    .find({
      $or: [{ player1: walletAddress }, { player2: walletAddress }]
    })
    .sort({ timestamp: -1 })
    .toArray();
}

export async function insertBattle(battle: Battle): Promise<void> {
  const collection = await getCollection<Battle>(Collections.BATTLES);
  await collection.insertOne(battle);
}

export async function updateBattle(battleId: string, update: Partial<Battle>): Promise<void> {
  const collection = await getCollection<Battle>(Collections.BATTLES);
  await collection.updateOne({ battleId }, { $set: update });
}

// ==================== MATCHMAKING ====================

export interface MatchmakingEntry {
  _id?: ObjectId;
  playerId: string;
  rating: number;
  team: string[];
  status: 'waiting' | 'matched' | 'cancelled';
  timestamp: Date;
  matchId?: string;
}

export async function getWaitingPlayers(): Promise<MatchmakingEntry[]> {
  const collection = await getCollection<MatchmakingEntry>(Collections.MATCHMAKING);
  return await collection.find({ status: 'waiting' }).sort({ timestamp: 1 }).toArray();
}

export async function getMatchmakingEntryByPlayer(playerId: string): Promise<MatchmakingEntry | null> {
  const collection = await getCollection<MatchmakingEntry>(Collections.MATCHMAKING);
  return await collection.findOne({ playerId, status: 'waiting' });
}

export async function insertMatchmakingEntry(entry: MatchmakingEntry): Promise<void> {
  const collection = await getCollection<MatchmakingEntry>(Collections.MATCHMAKING);
  await collection.insertOne(entry);
}

export async function updateMatchmakingEntry(
  playerId: string,
  update: Partial<MatchmakingEntry>
): Promise<void> {
  const collection = await getCollection<MatchmakingEntry>(Collections.MATCHMAKING);
  await collection.updateOne({ playerId, status: 'waiting' }, { $set: update });
}

export async function deleteMatchmakingEntry(playerId: string): Promise<void> {
  const collection = await getCollection<MatchmakingEntry>(Collections.MATCHMAKING);
  await collection.deleteOne({ playerId });
}

// ==================== COLLECTION HELPERS ====================

export async function getElementalJablixesCollection() {
  return await getCollection<ElementalJablixData>(Collections.ELEMENTAL_JABLIXES);
}

export async function getSpecialJablixesCollection() {
  return await getCollection<SpecialJablixData>(Collections.SPECIAL_JABLIXES);
}

export async function getMarketplaceCollection() {
  return await getCollection<MarketplaceListing>(Collections.MARKETPLACE);
}

export async function getUsersCollection() {
  return await getCollection<User>(Collections.USERS);
}

export async function getBattlesCollection() {
  return await getCollection<Battle>(Collections.BATTLES);
}

export async function getMatchmakingCollection() {
  return await getCollection<MatchmakingEntry>(Collections.MATCHMAKING);
}
