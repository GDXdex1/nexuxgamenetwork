'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCurrentAccount } from '@mysten/dapp-kit';
import { useJablixScanner } from './JablixScanner';
import { Loader2, ArrowRight, Search } from 'lucide-react';

interface JabNFT {
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
  type_id: number;
  objectId: string;
}

interface WalletJabsListProps {
  onBackToWallet: () => void;
}

export default function WalletJabsList({ onBackToWallet }: WalletJabsListProps) {
  const router = useRouter();
  const account = useCurrentAccount();
  const { jablixList, loading } = useJablixScanner();
  
  const [jabs, setJabs] = useState<JabNFT[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'elemental' | 'special'>('all');

  useEffect(() => {
    console.log('📊 Jablixes scanned:', jablixList.length);
    if (jablixList && jablixList.length > 0) {
      const nfts: JabNFT[] = jablixList.map((jablix) => {
        console.log('🎴 Processing Jablix:', jablix.name, 'type_id:', jablix.type_id, 'objectId:', jablix.objectId);
        return {
          id: jablix.id,
          name: jablix.name,
          type: jablix.type,
          element: jablix.element1,
          level: jablix.type_id,
          phase: jablix.phase,
          hp: jablix.hp,
          attack: jablix.attack,
          defense: jablix.defense,
          speed: jablix.speed,
          imageUrl: jablix.imageUrl,
          type_id: jablix.type_id,
          objectId: jablix.objectId,
        };
      });
      
      console.log('✅ NFTs prepared:', nfts.length);
      setJabs(nfts);
    } else {
      setJabs([]);
    }
  }, [jablixList]);

  // Filter jabs based on search and type
  const filteredJabs = jabs.filter(jab => {
    const matchesSearch = jab.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         jab.element.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || jab.type === filterType;
    return matchesSearch && matchesType;
  });

  const handleViewJab = (typeId: number, objectId: string) => {
    console.log('🚀 Navigating to jab details');
    console.log('  → typeId:', typeId);
    console.log('  → objectId:', objectId);
    console.log('  → Full URL:', `/jab/jablix_${typeId}?objectId=${objectId}`);
    
    // Use type_id for template lookup, store objectId in query param for NFT details
    router.push(`/jab/jablix_${typeId}?objectId=${objectId}`);
  };

  if (!account) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-800 to-orange-700 p-4 md:p-8 flex items-center justify-center">
        <div className="max-w-md bg-gradient-to-br from-purple-900/80 to-pink-900/80 border-4 border-pink-500/50 rounded-3xl p-8 text-center">
          <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-300 to-orange-300 mb-4">
            🔒 Wallet Locked
          </h2>
          <p className="text-pink-200 mb-6">
            Please connect your wallet to view your Jabs collection.
          </p>
          <button
            onClick={onBackToWallet}
            className="bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 text-white font-bold py-3 px-6 rounded-xl transition-all transform hover:scale-105"
          >
            ← Back to Wallet
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-800 to-orange-700 p-4 md:p-8 relative">
      {/* Fixed Back Button - Always visible */}
      <button
        onClick={onBackToWallet}
        className="fixed top-4 left-4 z-50 transition-transform hover:scale-110"
      >
        <img 
          src="https://usdozf7pplhxfvrl.public.blob.vercel-storage.com/56fa9ed2-8a4e-42ba-8746-d03370944e7d-k39OOt1uF85tIpdfal9oa1yj57AqgR"
          alt="Back"
          className="w-16 h-16 object-contain drop-shadow-2xl"
        />
      </button>
      
      <div className="max-w-7xl mx-auto pt-20">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={onBackToWallet}
            className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-bold py-3 px-6 rounded-xl transition-all"
          >
            ← Back to Wallet
          </button>
        </div>

        {/* Title Card */}
        <div className="bg-gradient-to-br from-purple-900/80 to-pink-900/80 border-4 border-pink-500/50 rounded-3xl p-6 md:p-8 mb-6 shadow-2xl">
          <h1 className="text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-300 to-orange-300 mb-4">
            🎴 My Jabs Collection
          </h1>
          <p className="text-lg text-pink-200">
            Total: {jabs.length} Jabs • {jabs.filter(j => j.type === 'elemental').length} Elementals • {jabs.filter(j => j.type === 'special').length} Specials
          </p>
        </div>

        {/* Search and Filter */}
        <div className="bg-gradient-to-br from-purple-900/80 to-pink-900/80 border-4 border-pink-500/50 rounded-3xl p-6 mb-6 shadow-2xl">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-pink-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name or element..."
                className="w-full bg-black/30 border-2 border-pink-500/50 rounded-xl pl-12 pr-4 py-3 text-white placeholder-gray-400 focus:border-pink-400 focus:outline-none"
              />
            </div>

            {/* Filter Buttons */}
            <div className="flex gap-2">
              <button
                onClick={() => setFilterType('all')}
                className={`px-6 py-3 rounded-xl font-bold transition-all ${
                  filterType === 'all'
                    ? 'bg-gradient-to-r from-pink-500 to-orange-500 text-white'
                    : 'bg-black/30 text-pink-300 hover:bg-black/50'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilterType('elemental')}
                className={`px-6 py-3 rounded-xl font-bold transition-all ${
                  filterType === 'elemental'
                    ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white'
                    : 'bg-black/30 text-blue-300 hover:bg-black/50'
                }`}
              >
                Elemental
              </button>
              <button
                onClick={() => setFilterType('special')}
                className={`px-6 py-3 rounded-xl font-bold transition-all ${
                  filterType === 'special'
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                    : 'bg-black/30 text-purple-300 hover:bg-black/50'
                }`}
              >
                Special
              </button>
            </div>
          </div>
        </div>

        {/* Jabs Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-12 h-12 text-pink-400 animate-spin mb-4" />
            <p className="text-xl text-pink-200">Loading your Jabs collection...</p>
          </div>
        ) : filteredJabs.length === 0 ? (
          <div className="bg-gradient-to-br from-purple-900/80 to-pink-900/80 border-4 border-pink-500/50 rounded-3xl p-12 text-center">
            <p className="text-5xl mb-4">😢</p>
            <p className="text-2xl text-pink-200 mb-4">
              {searchTerm || filterType !== 'all' ? 'No Jabs match your filters' : "You don't have any Jabs yet!"}
            </p>
            <p className="text-lg text-orange-300">
              {searchTerm || filterType !== 'all' ? 'Try adjusting your search or filters' : 'Head to Jablix Genesis to mint your first NFT!'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredJabs.map((jab) => (
              <div
                key={jab.id}
                className="bg-gradient-to-br from-purple-900/60 to-pink-900/60 border-2 border-pink-500/50 rounded-2xl p-4 hover:border-pink-400 hover:scale-105 transition-all group"
              >
                <div className="aspect-square bg-black/30 rounded-xl mb-3 overflow-hidden">
                  <img
                    src={jab.imageUrl}
                    alt={jab.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                    onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                      e.currentTarget.src = 'https://via.placeholder.com/150?text=Jab';
                    }}
                    style={{ backgroundColor: 'transparent' }}
                  />
                </div>

                <div className="space-y-2">
                  <h3 className="text-white font-bold text-sm truncate">{jab.name}</h3>
                  
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      jab.type === 'elemental' 
                        ? 'bg-blue-500/20 text-blue-300 border border-blue-500/50'
                        : 'bg-purple-500/20 text-purple-300 border border-purple-500/50'
                    }`}>
                      {jab.type}
                    </span>
                    <span className="text-xs text-gray-400">Lvl {jab.level}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-black/30 rounded-lg p-2">
                      <p className="text-gray-400">HP</p>
                      <p className="text-red-400 font-bold">{jab.hp}</p>
                    </div>
                    <div className="bg-black/30 rounded-lg p-2">
                      <p className="text-gray-400">ATK</p>
                      <p className="text-orange-400 font-bold">{jab.attack}</p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                      e.preventDefault();
                      e.stopPropagation();
                      console.log('Button clicked for jab:', jab.id, 'type_id:', jab.type_id, 'objectId:', jab.objectId);
                      handleViewJab(jab.type_id, jab.objectId);
                    }}
                    className="w-full bg-gradient-to-r from-pink-600 to-orange-600 hover:from-pink-700 hover:to-orange-700 text-white font-bold py-2 px-4 rounded-xl transition-all flex items-center justify-center gap-2 group-hover:shadow-lg cursor-pointer"
                  >
                    View Details
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
