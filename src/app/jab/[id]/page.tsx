'use client';

import { use, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCurrentAccount, useSignAndExecuteTransaction, useSuiClient } from '@mysten/dapp-kit';
import { ArrowLeft, Calendar, Hash, Zap, Heart, Shield, Gauge, Sparkles, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import { JABLIX_TEMPLATES } from '@/data/jablixDatabase';
import type { Card } from '@/types/game.types';
import { createListElementalTransaction, createListSpecialTransaction, formatMarketplaceTxResult } from '@/utils/marketplaceTransactions';

interface PageProps {
  params: Promise<{ id: string }>;
}

interface BlockchainJablix {
  id: string;
  objectId: string;
  type: 'elemental' | 'special';
  type_id: number;
  name: string;
  phase: number;
  hp: number;
  energy: number;
  speed: number;
  attack: number;
  defense: number;
  elements: string[];
  imageUrl: string;
  cards: Array<{
    name: string;
    element: string;
    type: string;
    energy_cost: number;
    effect: string;
    damage: number;
  }>;
  mintDate?: string;
}

export default function JabDetailPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const searchParams = useSearchParams();
  const router = useRouter();
  const account = useCurrentAccount();
  const client = useSuiClient();
  const { mutateAsync: signAndExecuteTransaction } = useSignAndExecuteTransaction();
  
  const [jab, setJab] = useState<BlockchainJablix | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showListModal, setShowListModal] = useState(false);
  const [listingPrice, setListingPrice] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Get objectId from query params
  const objectId = searchParams.get('objectId');

  useEffect(() => {
    const fetchJablixFromBlockchain = async () => {
      if (!objectId) {
        setError('No Jablix ID provided');
        setLoading(false);
        return;
      }

      console.log('🔍 Fetching Jablix from blockchain with objectId:', objectId);

      try {
        // Fetch the object directly from blockchain
        const result = await client.getObject({
          id: objectId,
          options: {
            showContent: true,
            showType: true,
            showOwner: true,
          },
        });

        console.log('📦 Blockchain response:', result);

        if (!result.data) {
          throw new Error('Jablix not found on blockchain');
        }

        const content = result.data.content;
        if (!content || content.dataType !== 'moveObject') {
          throw new Error('Invalid Jablix data');
        }

        const fields = content.fields as any;
        const isElemental = content.type.includes('JablixElemental');

        console.log('📋 Parsed fields:', fields);

        const type_id = parseInt(fields.type_id || '0');
        const name = fields.name || 'Unknown Jablix';

        // Get image from blockchain or fallback to local template
        let imageUrl = fields.image || '';
        if (!imageUrl || imageUrl.trim() === '' || !imageUrl.startsWith('http')) {
          const template = JABLIX_TEMPLATES.find((t) => t.id === type_id);
          if (template && template.imageUrl) {
            imageUrl = template.imageUrl;
          } else {
            imageUrl = 'https://via.placeholder.com/500?text=Jablix';
          }
        }

        // Parse ALL cards from blockchain
        const cards = (fields.cards || []).map((card: any) => {
          const cardFields = card.fields || card;
          console.log('🃏 Parsing card:', cardFields);
          
          return {
            name: cardFields.name || 'Unknown Card',
            element: cardFields.element || 'Unknown',
            type: cardFields.type_ || cardFields.type || 'Unknown',
            energy_cost: parseInt(cardFields.energy_cost || '0'),
            effect: cardFields.effect || 'No effect',
            damage: parseInt(cardFields.damage || '0'),
          };
        });

        console.log(`✅ Found ${cards.length} cards:`, cards);

        // Parse elements
        const elements: string[] = [];
        if (fields.element1) elements.push(fields.element1);
        if (fields.element2) elements.push(fields.element2);
        if (fields.elements && Array.isArray(fields.elements)) {
          fields.elements.forEach((el: any) => {
            const element = typeof el === 'string' ? el : el.fields?.element || el.element;
            if (element && !elements.includes(element)) {
              elements.push(element);
            }
          });
        }

        const blockchainJablix: BlockchainJablix = {
          id: `jablix_${type_id}`,
          objectId: objectId,
          type: isElemental ? 'elemental' : 'special',
          type_id: type_id,
          name: name,
          phase: parseInt(fields.phase || '1'),
          hp: parseInt(fields.hp || '0'),
          energy: parseInt(fields.energy || '0'),
          speed: parseInt(fields.speed || '0'),
          attack: parseInt(fields.attack || '0'),
          defense: parseInt(fields.defense || '0'),
          elements: elements.length > 0 ? elements : ['Unknown'],
          imageUrl: imageUrl,
          cards: cards,
          mintDate: new Date().toISOString(), // In production, parse from blockchain
        };

        console.log('✅ Successfully parsed Jablix:', blockchainJablix);
        setJab(blockchainJablix);
      } catch (err) {
        console.error('❌ Error fetching Jablix:', err);
        setError(err instanceof Error ? err.message : 'Failed to load Jablix from blockchain');
      } finally {
        setLoading(false);
      }
    };

    fetchJablixFromBlockchain();
  }, [objectId, client]);

  const handleListNFT = async () => {
    if (!account?.address) {
      toast.error('Please connect your wallet first');
      return;
    }

    if (!jab) {
      toast.error('Jablix data not loaded');
      return;
    }

    const price = parseFloat(listingPrice);
    if (isNaN(price) || price <= 0) {
      toast.error('Please enter a valid price');
      return;
    }

    setIsProcessing(true);

    try {
      const tx = jab.type === 'elemental'
        ? createListElementalTransaction(jab.objectId, price)
        : createListSpecialTransaction(jab.objectId, price);

      const result = await signAndExecuteTransaction({
        transaction: tx,
      });

      if (result.digest) {
        const formattedResult = formatMarketplaceTxResult(
          result.digest,
          'list',
          jab.name
        );

        toast.success(formattedResult.message, {
          description: `Listed for ${price} JXC`,
          action: {
            label: 'View',
            onClick: () => window.open(formattedResult.explorerUrl, '_blank'),
          },
        });

        setShowListModal(false);
        setListingPrice('');
        
        // Navigate back after successful listing
        setTimeout(() => router.back(), 2000);
      }
    } catch (error: unknown) {
      console.error('Listing failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Transaction failed';
      toast.error('Listing failed', {
        description: errorMessage,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-800 to-orange-700 p-4 md:p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce">🔍</div>
          <p className="text-2xl font-bold text-pink-200 mb-4">Loading Jablix from blockchain...</p>
        </div>
      </div>
    );
  }

  if (error || !jab) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-800 to-orange-700 p-4 md:p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <p className="text-2xl font-bold text-pink-200 mb-4">Jablix not found</p>
          <p className="text-lg text-pink-300 mb-6">{error || 'Could not load Jablix data'}</p>
          <button
            onClick={() => router.back()}
            className="bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 text-white font-bold py-3 px-6 rounded-xl transition-all"
          >
            ← Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-800 to-orange-700 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header with Back Button */}
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={() => {
              console.log('⬅️ Back button clicked - navigating to previous page');
              router.back();
            }}
            className="flex items-center gap-2 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-bold py-3 px-6 rounded-xl transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>
          
          {account && (
            <button
              onClick={() => setShowListModal(true)}
              className="bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 text-white font-bold py-3 px-6 rounded-xl transition-all"
            >
              📦 List on Marketplace
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Image and Basic Info */}
          <div className="space-y-6">
            {/* Image Card */}
            <div className="bg-gradient-to-br from-purple-900/80 to-pink-900/80 border-4 border-pink-500/50 rounded-3xl p-6 shadow-2xl">
              <div className="aspect-square bg-black/30 rounded-2xl overflow-hidden mb-4">
                <img
                  src={jab.imageUrl}
                  alt={jab.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = 'https://via.placeholder.com/500?text=Jablix';
                  }}
                />
              </div>
              
              <div className="space-y-3">
                <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-300 to-orange-300">
                  {jab.name}
                </h1>
                
                <div className="flex flex-wrap gap-2">
                  {jab.elements.map((element, idx) => (
                    <span
                      key={idx}
                      className="bg-gradient-to-r from-pink-500/20 to-orange-500/20 border-2 border-pink-400/50 text-pink-200 px-4 py-1 rounded-full text-sm font-bold"
                    >
                      {element}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* NFT Metadata Card */}
            <div className="bg-gradient-to-br from-purple-900/80 to-pink-900/80 border-4 border-pink-500/50 rounded-3xl p-6 shadow-2xl">
              <h2 className="text-2xl font-black text-pink-300 mb-4">📋 NFT Information</h2>
              
              <div className="space-y-3">
                <div className="flex items-center gap-3 bg-black/30 rounded-xl p-3">
                  <Hash className="w-5 h-5 text-orange-400" />
                  <div className="flex-1">
                    <p className="text-xs text-pink-300">Object ID</p>
                    <p className="text-sm text-white font-mono break-all">
                      {jab.objectId.slice(0, 10)}...{jab.objectId.slice(-8)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-black/30 rounded-xl p-3">
                  <Calendar className="w-5 h-5 text-orange-400" />
                  <div className="flex-1">
                    <p className="text-xs text-pink-300">Mint Date</p>
                    <p className="text-sm text-white">
                      {jab.mintDate ? new Date(jab.mintDate).toLocaleDateString() : 'Unknown'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-black/30 rounded-xl p-3">
                  <Sparkles className="w-5 h-5 text-orange-400" />
                  <div className="flex-1">
                    <p className="text-xs text-pink-300">Type</p>
                    <p className="text-sm text-white capitalize font-bold">
                      {jab.type}
                    </p>
                  </div>
                </div>

                <a
                  href={`https://suiscan.xyz/testnet/object/${jab.objectId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white font-bold py-2 px-4 rounded-xl transition-all"
                >
                  <ExternalLink className="w-4 h-4" />
                  View on Explorer
                </a>
              </div>
            </div>
          </div>

          {/* Right Column - Stats and Cards */}
          <div className="space-y-6">
            {/* Stats Card */}
            <div className="bg-gradient-to-br from-purple-900/80 to-pink-900/80 border-4 border-pink-500/50 rounded-3xl p-6 shadow-2xl">
              <h2 className="text-2xl font-black text-pink-300 mb-4">⚡ Stats</h2>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-black/30 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Heart className="w-5 h-5 text-red-400" />
                    <p className="text-sm text-pink-300">HP</p>
                  </div>
                  <p className="text-3xl font-black text-red-400">{jab.hp}</p>
                </div>

                <div className="bg-black/30 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="w-5 h-5 text-orange-400" />
                    <p className="text-sm text-pink-300">Attack</p>
                  </div>
                  <p className="text-3xl font-black text-orange-400">{jab.attack}</p>
                </div>

                <div className="bg-black/30 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="w-5 h-5 text-blue-400" />
                    <p className="text-sm text-pink-300">Defense</p>
                  </div>
                  <p className="text-3xl font-black text-blue-400">{jab.defense}</p>
                </div>

                <div className="bg-black/30 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Gauge className="w-5 h-5 text-green-400" />
                    <p className="text-sm text-pink-300">Speed</p>
                  </div>
                  <p className="text-3xl font-black text-green-400">{jab.speed}</p>
                </div>
              </div>

              <div className="mt-4 bg-black/30 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-5 h-5 text-yellow-400" />
                  <p className="text-sm text-pink-300">Energy</p>
                </div>
                <p className="text-3xl font-black text-yellow-400">{jab.energy}</p>
              </div>
            </div>

            {/* Cards - ALL FROM BLOCKCHAIN */}
            <div className="bg-gradient-to-br from-purple-900/80 to-pink-900/80 border-4 border-pink-500/50 rounded-3xl p-6 shadow-2xl">
              <h2 className="text-2xl font-black text-pink-300 mb-4">🃏 Cards ({jab.cards.length})</h2>
              
              {jab.cards.length === 0 ? (
                <p className="text-pink-300 text-center py-4">No cards found</p>
              ) : (
                <div className="space-y-3">
                  {jab.cards.map((card, idx: number) => (
                    <div
                      key={idx}
                      className="bg-gradient-to-r from-purple-800/40 to-pink-800/40 border-2 border-pink-500/30 rounded-xl p-4 hover:border-pink-400/50 transition-all"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="text-lg font-bold text-pink-200">{card.name}</h3>
                          <p className="text-xs text-pink-400">{card.element} • {card.type}</p>
                        </div>
                        <div className="bg-yellow-500/20 border border-yellow-500/50 rounded-lg px-3 py-1">
                          <p className="text-xs text-yellow-300">Cost</p>
                          <p className="text-lg font-black text-yellow-400">{card.energy_cost}</p>
                        </div>
                      </div>

                      <p className="text-sm text-pink-300 mb-3">{card.effect}</p>

                      <div className="flex gap-4">
                        {card.damage > 0 && (
                          <div className="flex items-center gap-1">
                            <Zap className="w-4 h-4 text-orange-400" />
                            <span className="text-sm font-bold text-orange-400">{card.damage} dmg</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* List Modal */}
        {showListModal && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
            <div className="bg-gradient-to-br from-purple-900/95 to-pink-900/95 border-4 border-pink-500/50 rounded-3xl p-6 md:p-8 max-w-md w-full">
              <h2 className="text-2xl font-black text-pink-300 mb-4">
                List {jab.name} for Sale
              </h2>
              
              <div className="bg-black/30 rounded-xl p-4 mb-4">
                <img
                  src={jab.imageUrl}
                  alt={jab.name}
                  className="w-full h-48 object-cover rounded-lg mb-3"
                  onError={(e) => {
                    e.currentTarget.src = 'https://via.placeholder.com/300?text=Jablix';
                  }}
                />
                <p className="text-sm text-gray-300">
                  {jab.name} • {jab.elements.join(', ')}
                </p>
              </div>

              <div className="mb-4">
                <label className="text-sm text-pink-200 mb-2 block">
                  Listing Price (JXC)
                </label>
                <input
                  type="number"
                  value={listingPrice}
                  onChange={(e) => setListingPrice(e.target.value)}
                  placeholder="Enter price in JXC"
                  className="w-full bg-black/30 border-2 border-pink-500/50 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-pink-400 focus:outline-none"
                />
              </div>

              {listingPrice && parseFloat(listingPrice) > 0 && (
                <div className="bg-pink-500/20 rounded-xl p-3 mb-4 border border-pink-500/50">
                  <p className="text-xs text-gray-400 mb-1">Platform Fee (2.5%)</p>
                  <p className="text-sm text-pink-300">
                    {(parseFloat(listingPrice) * 0.025).toFixed(2)} JXC
                  </p>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowListModal(false);
                    setListingPrice('');
                  }}
                  className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-4 rounded-xl transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleListNFT}
                  disabled={isProcessing || !listingPrice || parseFloat(listingPrice) <= 0}
                  className="flex-1 bg-gradient-to-r from-pink-600 to-orange-600 hover:from-pink-700 hover:to-orange-700 text-white font-bold py-3 px-4 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? 'Listing...' : 'List NFT'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
