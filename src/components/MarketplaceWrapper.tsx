'use client';

import { useState, useEffect } from 'react';
import { useSignAndExecuteTransaction, useCurrentAccount } from '@mysten/dapp-kit';
import { toast } from 'sonner';
import { useSuiData, extractJablixData } from '@/hooks/useSuiData';
import { 
  createListElementalTransaction, 
  createListSpecialTransaction,
  createBuyElementalTransaction,
  createBuySpecialTransaction,
  createDelistTransaction,
  calculateTotalCost,
  formatMarketplaceTxResult 
} from '@/utils/marketplaceTransactions';

interface JablixNFT {
  id: string;
  name: string;
  type: 'elemental' | 'special';
  element: string;
  level: number;
  phase: number;
  hp: number;
  attack: number;
  defense: number;
  speed: number;
  imageUrl: string;
  price?: number;
  seller?: string;
  isListed: boolean;
}

interface MarketplaceWrapperProps {
  onBackToMain: () => void;
}

export default function MarketplaceWrapper({ onBackToMain }: MarketplaceWrapperProps) {
  const account = useCurrentAccount();
  const { jxcBalance, jxcCoinId, jablixes, refetch } = useSuiData();
  const { mutateAsync: signAndExecuteTransaction } = useSignAndExecuteTransaction();
  
  const [selectedTab, setSelectedTab] = useState<'my_nfts' | 'marketplace'>('my_nfts');
  const [myNFTs, setMyNFTs] = useState<JablixNFT[]>([]);
  const [marketplaceNFTs, setMarketplaceNFTs] = useState<JablixNFT[]>([]);
  const [selectedNFT, setSelectedNFT] = useState<JablixNFT | null>(null);
  const [listingPrice, setListingPrice] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showListModal, setShowListModal] = useState(false);

  // Load user's NFTs
  useEffect(() => {
    if (jablixes && jablixes.length > 0) {
      const nfts: JablixNFT[] = [];
      
      for (const jablix of jablixes) {
        const data = extractJablixData(jablix);
        if (data) {
          nfts.push({
            id: data.id,
            name: data.name,
            type: data.type,
            element: data.element,
            level: data.level,
            phase: data.phase,
            hp: data.hp,
            attack: data.attack,
            defense: data.defense,
            speed: data.speed,
            imageUrl: data.imageUrl,
            isListed: false,
          });
        }
      }
      
      setMyNFTs(nfts);
    }
  }, [jablixes]);

  // Mock marketplace listings (in production, fetch from on-chain events or API)
  useEffect(() => {
    // This would be replaced with actual marketplace data fetching
    // For now, we'll show empty marketplace
    setMarketplaceNFTs([]);
  }, []);

  const handleListNFT = async () => {
    if (!account?.address) {
      toast.error('Please connect your wallet first');
      return;
    }

    if (!selectedNFT) {
      toast.error('Please select an NFT to list');
      return;
    }

    const price = parseFloat(listingPrice);
    if (isNaN(price) || price <= 0) {
      toast.error('Please enter a valid price');
      return;
    }

    setIsProcessing(true);

    try {
      const tx = selectedNFT.type === 'elemental'
        ? createListElementalTransaction(selectedNFT.id, price)
        : createListSpecialTransaction(selectedNFT.id, price);

      const result = await signAndExecuteTransaction({
        transaction: tx,
      });

      if (result.digest) {
        const formattedResult = formatMarketplaceTxResult(
          result.digest,
          'list',
          selectedNFT.name
        );

        toast.success(formattedResult.message, {
          description: `Listed for ${price} JXC`,
          action: {
            label: 'View',
            onClick: () => window.open(formattedResult.explorerUrl, '_blank'),
          },
        });

        await refetch();
        setShowListModal(false);
        setSelectedNFT(null);
        setListingPrice('');
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

  const handleBuyNFT = async (nft: JablixNFT) => {
    if (!account?.address) {
      toast.error('Please connect your wallet first');
      return;
    }

    if (!jxcCoinId) {
      toast.error('No JXC coins found');
      return;
    }

    if (!nft.price || !nft.seller) {
      toast.error('Invalid listing data');
      return;
    }

    const { total } = calculateTotalCost(nft.price);

    if (jxcBalance < total) {
      toast.error(`Insufficient JXC balance. Need ${total.toFixed(2)} JXC`);
      return;
    }

    setIsProcessing(true);

    try {
      // Note: kioskId would come from the listing data in production
      const kioskId = nft.seller; // Placeholder
      
      const tx = nft.type === 'elemental'
        ? createBuyElementalTransaction(jxcCoinId, kioskId, nft.id, nft.price)
        : createBuySpecialTransaction(jxcCoinId, kioskId, nft.id, nft.price);

      const result = await signAndExecuteTransaction({
        transaction: tx,
      });

      if (result.digest) {
        const formattedResult = formatMarketplaceTxResult(
          result.digest,
          'buy',
          nft.name
        );

        toast.success(formattedResult.message, {
          description: `Purchased for ${nft.price} JXC`,
          action: {
            label: 'View',
            onClick: () => window.open(formattedResult.explorerUrl, '_blank'),
          },
        });

        await refetch();
      }
    } catch (error: unknown) {
      console.error('Purchase failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Transaction failed';
      toast.error('Purchase failed', {
        description: errorMessage,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDelistNFT = async (nft: JablixNFT) => {
    if (!account?.address) {
      toast.error('Please connect your wallet first');
      return;
    }

    setIsProcessing(true);

    try {
      // Note: kioskId would come from user's kiosk in production
      const kioskId = account.address; // Placeholder
      
      const tx = createDelistTransaction(
        kioskId,
        nft.id,
        nft.type === 'special'
      );

      const result = await signAndExecuteTransaction({
        transaction: tx,
      });

      if (result.digest) {
        const formattedResult = formatMarketplaceTxResult(
          result.digest,
          'delist',
          nft.name
        );

        toast.success(formattedResult.message, {
          action: {
            label: 'View',
            onClick: () => window.open(formattedResult.explorerUrl, '_blank'),
          },
        });

        await refetch();
      }
    } catch (error: unknown) {
      console.error('Delisting failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Transaction failed';
      toast.error('Delisting failed', {
        description: errorMessage,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-800 to-orange-700 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Banner */}
        <div className="mb-6 relative">
          <img
            src="https://usdozf7pplhxfvrl.public.blob.vercel-storage.com/55e7c081-455c-4f8c-9746-bdadda14c161-3zkarve5VHFJjLwPgIfdW49uSXUuvt"
            alt="Jablix Marketplace Banner"
            className="w-full h-56 md:h-72 lg:h-96 object-cover rounded-3xl border-4 border-pink-500/50 shadow-2xl"
          />
          <button
            onClick={onBackToMain}
            className="absolute top-4 right-4 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-bold py-2 px-4 md:py-3 md:px-6 rounded-xl transition-all transform hover:scale-105"
          >
            ← Back
          </button>
        </div>

        {/* Header */}
        <div className="bg-gradient-to-br from-purple-900/80 to-pink-900/80 border-4 border-pink-500/50 rounded-3xl p-6 md:p-8 mb-6 shadow-2xl">
          <div className="mb-4">
            <h1 className="text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-300 to-orange-300">
              🛒 MARKETPLACE 💰
            </h1>
          </div>

          <p className="text-lg md:text-xl text-yellow-200 mb-4">
            Buy, sell, and trade Jablix NFTs with other players!
          </p>

          {/* Wallet Info */}
          <div className="bg-black/30 rounded-2xl p-4 border-2 border-yellow-500/30">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <p className="text-sm text-gray-400">Wallet Connected</p>
                <p className="text-white font-mono text-sm">
                  {account?.address ? `${account.address.slice(0, 6)}...${account.address.slice(-4)}` : 'Not connected'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-400">JXC Balance</p>
                <p className="text-2xl font-black text-yellow-400">
                  {jxcBalance.toLocaleString()} JXC
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-400">My NFTs</p>
                <p className="text-2xl font-black text-green-400">
                  {myNFTs.length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Selector */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setSelectedTab('my_nfts')}
            className={`flex-1 py-4 px-6 rounded-2xl font-black text-xl transition-all transform hover:scale-105 ${
              selectedTab === 'my_nfts'
                ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-2xl'
                : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700/50'
            }`}
          >
            🎒 MY NFTs ({myNFTs.length})
          </button>
          <button
            onClick={() => setSelectedTab('marketplace')}
            className={`flex-1 py-4 px-6 rounded-2xl font-black text-xl transition-all transform hover:scale-105 ${
              selectedTab === 'marketplace'
                ? 'bg-gradient-to-r from-yellow-600 to-amber-600 text-white shadow-2xl'
                : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700/50'
            }`}
          >
            🏪 MARKETPLACE ({marketplaceNFTs.length})
          </button>
        </div>

        {/* My NFTs Tab */}
        {selectedTab === 'my_nfts' && (
          <div>
            {myNFTs.length === 0 ? (
              <div className="bg-gradient-to-br from-purple-900/80 to-pink-900/80 border-4 border-pink-500/50 rounded-3xl p-12 text-center">
                <p className="text-2xl text-pink-200 mb-4">
                  You don&apos;t have any Jabs yet! 😢
                </p>
                <p className="text-lg text-orange-300">
                  Head to Jablix Genesis to mint your first NFT!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {myNFTs.map((nft: JablixNFT) => (
                  <div
                    key={nft.id}
                    className="bg-gradient-to-br from-purple-900/60 to-pink-900/60 border-2 border-pink-500/50 rounded-2xl p-4 hover:border-white/50 transition-all"
                  >
                    <div className="aspect-square bg-black/30 rounded-xl mb-3 overflow-hidden">
                      <img
                        src={nft.imageUrl}
                        alt={nft.name}
                        className="w-full h-full object-cover"
                        onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                          e.currentTarget.src = 'https://via.placeholder.com/150?text=Jablix';
                        }}
                      />
                    </div>
                    <h3 className="text-white font-bold text-sm mb-1">{nft.name}</h3>
                    <p className="text-xs text-gray-300 mb-2">Lvl {nft.level} • Phase {nft.phase}</p>
                    
                    <div className="space-y-1 mb-3">
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-400">HP:</span>
                        <span className="text-red-400 font-bold">{nft.hp}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-400">ATK:</span>
                        <span className="text-orange-400 font-bold">{nft.attack}</span>
                      </div>
                    </div>

                    {nft.isListed ? (
                      <button
                        onClick={() => handleDelistNFT(nft)}
                        disabled={isProcessing}
                        className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-xl transition-all disabled:opacity-50"
                      >
                        Delist
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          setSelectedNFT(nft);
                          setShowListModal(true);
                        }}
                        disabled={isProcessing}
                        className="w-full bg-gradient-to-r from-pink-600 to-orange-600 hover:from-pink-700 hover:to-orange-700 text-white font-bold py-2 px-4 rounded-xl transition-all disabled:opacity-50"
                      >
                        List for Sale
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Marketplace Tab */}
        {selectedTab === 'marketplace' && (
          <div>
            {marketplaceNFTs.length === 0 ? (
              <div className="bg-gradient-to-br from-purple-900/80 to-pink-900/80 border-4 border-pink-500/50 rounded-3xl p-12 text-center">
                <p className="text-2xl text-pink-200 mb-4">
                  No listings available yet! 📦
                </p>
                <p className="text-lg text-orange-300">
                  Be the first to list your Jabs for sale!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {marketplaceNFTs.map((nft: JablixNFT) => (
                  <div
                    key={nft.id}
                    className="bg-gradient-to-br from-purple-900/60 to-pink-900/60 border-2 border-pink-500/50 rounded-2xl p-4 hover:border-white/50 transition-all"
                  >
                    <div className="aspect-square bg-black/30 rounded-xl mb-3 overflow-hidden">
                      <img
                        src={nft.imageUrl}
                        alt={nft.name}
                        className="w-full h-full object-cover"
                        onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                          e.currentTarget.src = 'https://via.placeholder.com/150?text=Jablix';
                        }}
                      />
                    </div>
                    <h3 className="text-white font-bold text-sm mb-1">{nft.name}</h3>
                    <p className="text-xs text-gray-300 mb-2">Lvl {nft.level} • Phase {nft.phase}</p>
                    
                    <div className="bg-yellow-500/20 rounded-lg p-2 mb-2 border border-yellow-500/50">
                      <p className="text-xs text-gray-400">Price</p>
                      <p className="text-lg font-black text-yellow-400">{nft.price} JXC</p>
                    </div>

                    <button
                      onClick={() => handleBuyNFT(nft)}
                      disabled={isProcessing}
                      className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-2 px-4 rounded-xl transition-all disabled:opacity-50"
                    >
                      Buy Now
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* List Modal */}
        {showListModal && selectedNFT && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
            <div className="bg-gradient-to-br from-purple-900/95 to-pink-900/95 border-4 border-pink-500/50 rounded-3xl p-6 md:p-8 max-w-md w-full">
              <h2 className="text-2xl font-black text-pink-300 mb-4">
                List {selectedNFT.name} for Sale
              </h2>
              
              <div className="bg-black/30 rounded-xl p-4 mb-4">
                <img
                  src={selectedNFT.imageUrl}
                  alt={selectedNFT.name}
                  className="w-full h-48 object-cover rounded-lg mb-3"
                  onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                    e.currentTarget.src = 'https://via.placeholder.com/300?text=Jablix';
                  }}
                />
                <p className="text-sm text-gray-300">
                  {selectedNFT.name} • Level {selectedNFT.level} • Phase {selectedNFT.phase}
                </p>
              </div>

              <div className="mb-4">
                <label className="text-sm text-pink-200 mb-2 block">
                  Listing Price (JXC)
                </label>
                <input
                  type="number"
                  value={listingPrice}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setListingPrice(e.target.value)}
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
                    setSelectedNFT(null);
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
