'use client';

import { useCurrentAccount, useSuiClient } from '@mysten/dapp-kit';
import { useEffect, useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { OBJECT_TYPES } from '@/config/suiConfig';
import { JABLIX_TEMPLATES } from '@/data/jablixDatabase';
import { Loader2, ArrowRight, Search, Copy, CheckCircle2, ExternalLink } from 'lucide-react';
import { getAddressExplorerLink, formatJxcBalance } from '@/config/suiConfig';
import { useJxcBalance } from '@/hooks/useSuiData';
import TransferManager from '@/components/TransferManager';

interface ScannedJablix {
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
  element1: string;
  element2: string | null;
  imageUrl: string;
  cards: Array<{
    name: string;
    element: string;
    type: string;
    energy_cost: number;
    effect: string;
    damage: number;
  }>;
}

// Simple cache key generator
const getCacheKey = (address: string): string => `jablix_cache_${address}`;

// Cache duration: 2 minutes
const CACHE_DURATION = 120000;

export default function WalletPage() {
  const router = useRouter();
  const account = useCurrentAccount();
  const client = useSuiClient();
  const jxcBalanceQuery = useJxcBalance();
  
  const [jablixList, setJablixList] = useState<ScannedJablix[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'elemental' | 'special'>('all');
  const [copied, setCopied] = useState(false);
  
  const lastFetchTime = useRef<number>(0);

  // Scan Jablixes from blockchain with optimization
  const fetchJablix = useCallback(async (forceRefresh: boolean = false) => {
    if (!account?.address) {
      setJablixList([]);
      return;
    }

    // Check cache first (unless force refresh)
    if (!forceRefresh) {
      const now = Date.now();
      const cacheKey = getCacheKey(account.address);
      
      // Throttle: don't fetch if fetched less than 10 seconds ago
      if (now - lastFetchTime.current < 10000) {
        console.log('⏸️ Throttled: Using existing data');
        return;
      }

      try {
        const cached = sessionStorage.getItem(cacheKey);
        if (cached) {
          const { data, timestamp } = JSON.parse(cached);
          if (now - timestamp < CACHE_DURATION) {
            console.log('✅ Using cached Jablixes');
            setJablixList(data);
            return;
          }
        }
      } catch (err) {
        console.warn('⚠️ Cache read error, fetching fresh data');
      }
    }

    setLoading(true);
    setError(null);
    lastFetchTime.current = Date.now();

    try {
      console.log('🔍 Scanning Jablixes for:', account.address);
      console.log('📋 Expected types:');
      console.log('  → Elemental:', OBJECT_TYPES.JABLIX_ELEMENTAL);
      console.log('  → Special:', OBJECT_TYPES.JABLIX_SPECIAL);

      // Create timeout promise
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('Query timeout after 15 seconds')), 15000);
      });

      // Query both types in parallel with filters (faster than getting ALL objects)
      console.log('🌐 Fetching Jablixes in parallel with filters...');
      const [elementalObjects, specialObjects] = await Promise.race([
        Promise.all([
          client.getOwnedObjects({
            owner: account.address,
            filter: {
              StructType: OBJECT_TYPES.JABLIX_ELEMENTAL,
            },
            options: { showContent: true, showType: true },
            limit: 50, // Limit to prevent timeout
          }),
          client.getOwnedObjects({
            owner: account.address,
            filter: {
              StructType: OBJECT_TYPES.JABLIX_SPECIAL,
            },
            options: { showContent: true, showType: true },
            limit: 50, // Limit to prevent timeout
          }),
        ]),
        timeoutPromise,
      ]);

      console.log(`📦 Found ${elementalObjects.data.length} elemental + ${specialObjects.data.length} special Jablixes`);

      const allJablix = [...elementalObjects.data, ...specialObjects.data];
      console.log(`🎯 Total Jablixes: ${allJablix.length}`);

      // Parse the data
      const parsed = allJablix.map((obj): ScannedJablix | null => {
        const content = obj.data?.content;
        if (!content || content.dataType !== 'moveObject') {
          return null;
        }

        const fields = content.fields as any;
        const isElemental = content.type.includes('JablixElemental');

        const type_id = parseInt(fields.type_id || '0');
        const name = fields.name || 'Unknown';
        const objectId = obj.data?.objectId || '';

        // Get image from blockchain or fallback to local template
        let imageUrl = fields.image || '';
        if (!imageUrl || imageUrl.trim() === '' || !imageUrl.startsWith('http')) {
          const template = JABLIX_TEMPLATES.find((t) => t.id === type_id);
          if (template && template.imageUrl) {
            imageUrl = template.imageUrl;
          } else {
            imageUrl = 'https://via.placeholder.com/300?text=Jablix';
          }
        }

        // Parse cards
        const cards = (fields.cards || []).map((card: any) => ({
          name: card.fields?.name || card.name || 'Unknown Card',
          element: card.fields?.element || card.element || 'Unknown',
          type: card.fields?.type_ || card.fields?.type || card.type || 'Unknown',
          energy_cost: parseInt(card.fields?.energy_cost || card.energy_cost || '0'),
          effect: card.fields?.effect || card.effect || 'No effect',
          damage: parseInt(card.fields?.damage || card.damage || '0'),
        }));

        return {
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
          element1: fields.element1 || fields.elements?.[0] || 'Unknown',
          element2: fields.element2 || fields.elements?.[1] || null,
          imageUrl: imageUrl,
          cards: cards,
        };
      }).filter((j): j is ScannedJablix => j !== null);

      console.log('✅ Successfully parsed', parsed.length, 'Jablixes');
      setJablixList(parsed);

      // Save to cache
      try {
        const cacheKey = getCacheKey(account.address);
        sessionStorage.setItem(
          cacheKey,
          JSON.stringify({ data: parsed, timestamp: Date.now() })
        );
      } catch (err) {
        console.warn('⚠️ Failed to cache data');
      }
    } catch (err) {
      console.error('❌ Error fetching Jablixes:', err);
      setError('Error scanning your Jablixes from the blockchain');
    } finally {
      setLoading(false);
    }
  }, [account?.address, client]);

  // Initial fetch on mount
  useEffect(() => {
    fetchJablix(false);
  }, [fetchJablix]);

  // Filter jabs based on search and type
  const filteredJabs = jablixList.filter(jab => {
    const matchesSearch = jab.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         jab.element1.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || jab.type === filterType;
    return matchesSearch && matchesType;
  });

  // Handle view details navigation
  const handleViewJab = (typeId: number, objectId: string) => {
    console.log('🚀 Navigating to jab details:');
    console.log('  → typeId:', typeId);
    console.log('  → objectId:', objectId);
    console.log('  → Full URL:', `/jab/jablix_${typeId}?objectId=${objectId}`);
    
    router.push(`/jab/jablix_${typeId}?objectId=${objectId}`);
  };

  // Copy address to clipboard
  const handleCopyAddress = async () => {
    if (account?.address) {
      await navigator.clipboard.writeText(account.address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Format address for display
  const shortAddress = account?.address 
    ? `${account.address.slice(0, 6)}...${account.address.slice(-4)}`
    : '';

  // JXC Balance
  const jxcBalance = jxcBalanceQuery.data?.totalBalance || 0n;
  const jxcFormatted = formatJxcBalance(jxcBalance);

  if (!account) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-800 to-orange-700 p-4 md:p-8 flex items-center justify-center">
        <div className="max-w-md bg-gradient-to-br from-purple-900/80 to-pink-900/80 border-4 border-pink-500/50 rounded-3xl p-8 text-center">
          <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-300 to-orange-300 mb-4">
            🔒 Wallet Locked
          </h2>
          <p className="text-pink-200 mb-6">
            Please connect your wallet to view your inventory and balance.
          </p>
          <button
            onClick={() => router.push('/')}
            className="bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 text-white font-bold py-3 px-6 rounded-xl transition-all transform hover:scale-105"
          >
            ← Back to Main
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-800 to-orange-700 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Banner */}
        <div className="mb-6 relative">
          <img
            src="https://usdozf7pplhxfvrl.public.blob.vercel-storage.com/6a31ada0-0910-47a2-b8a7-fb2de97048b4-jG3gX9tWmrrESJpHzXgRARh8djhnBz"
            alt="Wallet Banner"
            className="w-full h-56 md:h-72 lg:h-96 object-cover rounded-3xl border-4 border-pink-500/50 shadow-2xl"
          />
          <button
            onClick={() => router.push('/')}
            className="absolute top-4 right-4 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-bold py-2 px-4 md:py-3 md:px-6 rounded-xl transition-all transform hover:scale-105"
          >
            ← Back
          </button>
        </div>

        {/* Wallet Address Card */}
        <div className="mb-6 bg-gradient-to-br from-purple-900/80 to-pink-900/80 border-4 border-pink-500/50 rounded-3xl p-6 shadow-2xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-pink-300 mb-1">Connected Wallet</p>
              <button
                onClick={handleCopyAddress}
                className="flex items-center gap-2 text-xl font-mono text-white hover:text-pink-200 transition-colors group"
              >
                {shortAddress}
                {copied ? (
                  <CheckCircle2 className="w-5 h-5 text-green-400" />
                ) : (
                  <Copy className="w-5 h-5 opacity-50 group-hover:opacity-100 transition-opacity" />
                )}
              </button>
              {copied && (
                <p className="text-xs text-green-400 mt-1">Address copied!</p>
              )}
            </div>
            <a
              href={getAddressExplorerLink(account.address)}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white font-bold py-2 px-4 rounded-xl transition-all flex items-center gap-2"
            >
              <ExternalLink className="w-4 h-4" />
              View on Explorer
            </a>
          </div>
        </div>

        {/* Balance and Collection Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* JXC Balance */}
          <div className="bg-gradient-to-br from-purple-900/80 to-pink-900/80 border-4 border-pink-500/50 rounded-3xl p-8 shadow-2xl">
            <p className="text-sm text-pink-300 mb-1">JXC Balance</p>
            <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-300 to-orange-300">
              {jxcFormatted}
            </h2>
            <p className="text-xs text-pink-300 mt-4">
              JablixCoin - The official currency of Jablix Arena
            </p>
          </div>

          {/* Collection Stats */}
          <div className="bg-gradient-to-br from-purple-900/80 to-pink-900/80 border-4 border-pink-500/50 rounded-3xl p-8 shadow-2xl">
            <p className="text-sm text-pink-300 mb-1">Jabs Collection</p>
            <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-300 to-orange-300">
              {jablixList.length} Jabs
            </h2>
            <div className="flex gap-4 mt-4">
              <div>
                <p className="text-2xl font-bold text-blue-200">
                  {jablixList.filter(j => j.type === 'elemental').length}
                </p>
                <p className="text-xs text-blue-300">Elementals</p>
              </div>
              <div className="border-l border-pink-500/30 pl-4">
                <p className="text-2xl font-bold text-purple-200">
                  {jablixList.filter(j => j.type === 'special').length}
                </p>
                <p className="text-xs text-purple-300">Specials</p>
              </div>
            </div>
          </div>
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

        {/* Transfer Manager */}
        <div className="mb-6">
          <TransferManager 
            jablixList={jablixList} 
            onTransferComplete={() => {
              fetchJablix(true);
            }}
          />
        </div>

        {/* Jabs Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-12 h-12 text-pink-400 animate-spin mb-4" />
            <p className="text-xl text-pink-200">Scanning your Jablixes from the blockchain...</p>
          </div>
        ) : error ? (
          <div className="bg-gradient-to-br from-red-900/80 to-pink-900/80 border-4 border-red-500/50 rounded-3xl p-12 text-center">
            <p className="text-2xl text-red-200 mb-4">⚠️ Error</p>
            <p className="text-lg text-red-300">{error}</p>
            <button
              onClick={() => fetchJablix(true)}
              className="mt-6 bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 text-white font-bold py-3 px-6 rounded-xl transition-all"
            >
              Retry
            </button>
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
              <JablixCard
                key={jab.objectId}
                jab={jab}
                onViewDetails={handleViewJab}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Separate component with lazy loading for images
function JablixCard({ 
  jab, 
  onViewDetails 
}: { 
  jab: ScannedJablix; 
  onViewDetails: (typeId: number, objectId: string) => void;
}) {
  const imgRef = useRef<HTMLImageElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.disconnect();
          }
        });
      },
      { rootMargin: '50px' }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div className="bg-gradient-to-br from-purple-900/60 to-pink-900/60 border-2 border-pink-500/50 rounded-2xl p-4 hover:border-pink-400 hover:scale-105 transition-all group">
      <div className="aspect-square bg-black/30 rounded-xl mb-3 overflow-hidden">
        <img
          ref={imgRef}
          src={isVisible ? jab.imageUrl : 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'}
          alt={jab.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform"
          loading="lazy"
          onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
            console.error('❌ Image load failed for', jab.name);
            e.currentTarget.src = 'https://via.placeholder.com/300?text=Jablix';
          }}
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
          <span className="text-xs text-gray-400">Phase {jab.phase}</span>
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
            onViewDetails(jab.type_id, jab.objectId);
          }}
          className="w-full bg-gradient-to-r from-pink-600 to-orange-600 hover:from-pink-700 hover:to-orange-700 text-white font-bold py-2 px-4 rounded-xl transition-all flex items-center justify-center gap-2 group-hover:shadow-lg cursor-pointer"
        >
          View Details
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
