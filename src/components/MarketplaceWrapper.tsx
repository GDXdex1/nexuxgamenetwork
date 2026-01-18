'use client';

import { useState, useEffect } from 'react';
import { useCurrentAccount, useSignAndExecuteTransaction } from '@mysten/dapp-kit';
import { useSuiData, extractJablixData } from '@/hooks/useSuiData';

import { toast } from 'sonner';
import {
  createListElementalTransaction,
  createListSpecialTransaction,
  createBuyElementalTransaction,
  createBuySpecialTransaction,
  createDelistTransaction,
  formatMarketplaceTxResult,
  calculateTotalCost
} from '@/utils/marketplaceTransactions';
import {
  ShoppingBag,
  ArrowLeft,
  Search,
  Plus,
  Tag as TagIcon,
  Trash2,
  CreditCard,
  Target,
  Shield,
  Sword,
  Zap,
  ChevronRight,
  Filter,
  Package
} from 'lucide-react';

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

  // Mock marketplace listings
  useEffect(() => {
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
      const kioskId = nft.seller;

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
      const kioskId = account.address;

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
    <div className="min-h-screen bg-[#010101] text-white p-4 md:p-8 relative overflow-hidden font-sans">
      {/* Tech Grid Background */}
      <div className="absolute inset-0 tech-bg-grid opacity-20 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-primary/5 pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">

        {/* Navigation HUD */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-6 border-b border-primary/20 pb-8">
          <div className="flex items-center gap-6">
            <button
              onClick={onBackToMain}
              className="group relative p-4 bg-white/5 border border-white/10 hover:border-primary transition-all rounded-tr-xl flex items-center justify-center"
            >
              <ArrowLeft className="w-5 h-5 text-white/40 group-hover:text-primary transition-colors" />
            </button>
            <div className="text-left">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-8 h-[1px] bg-primary/40" />
                <span className="text-[10px] font-black tracking-[0.3em] text-primary/60 uppercase">Asset_Exhange</span>
              </div>
              <h1 className="text-3xl md:text-5xl font-black italic tracking-tighter uppercase font-heading">
                JABLIX <span className="text-primary neon-text-orange">MARKET</span>
              </h1>
            </div>
          </div>

          {/* Global Stats HUD */}
          <div className="flex items-center gap-8 bg-black/40 border border-white/10 px-8 py-4 rounded-bl-3xl backdrop-blur-md">
            <div className="text-center">
              <p className="text-[8px] font-black text-white/30 uppercase tracking-widest">Active_Balance</p>
              <p className="text-xl font-black text-primary">{jxcBalance.toLocaleString()} <span className="text-[10px] opacity-60">JXC</span></p>
            </div>
            <div className="w-[1px] h-8 bg-white/10" />
            <div className="text-center">
              <p className="text-[8px] font-black text-white/30 uppercase tracking-widest">Digital_Storage</p>
              <p className="text-xl font-black text-white">{myNFTs.length} <span className="text-[10px] opacity-60 text-primary">UNITS</span></p>
            </div>
          </div>
        </div>

        {/* Tactical Search & Tabs */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6 mb-8 bg-white/5 p-2 rounded border border-white/10">
          <div className="flex gap-2 w-full lg:w-auto">
            <button
              onClick={() => setSelectedTab('marketplace')}
              className={`flex-1 lg:flex-none px-8 py-3 font-black uppercase text-[11px] tracking-widest transition-all rounded ${selectedTab === 'marketplace'
                ? 'bg-primary text-black shadow-[0_0_20px_rgba(255,107,0,0.3)]'
                : 'text-white/40 hover:text-white hover:bg-white/5'
                }`}
            >
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-4 h-4" />
                Market_Index
              </div>
            </button>
            <button
              onClick={() => setSelectedTab('my_nfts')}
              className={`flex-1 lg:flex-none px-8 py-3 font-black uppercase text-[11px] tracking-widest transition-all rounded ${selectedTab === 'my_nfts'
                ? 'bg-primary text-black shadow-[0_0_20px_rgba(255,107,0,0.3)]'
                : 'text-white/40 hover:text-white hover:bg-white/5'
                }`}
            >
              <div className="flex items-center gap-2">
                <Package className="w-4 h-4" />
                Private_Vault
              </div>
            </button>
          </div>

          <div className="relative w-full lg:w-96 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-primary transition-colors" />
            <input
              type="text"
              placeholder="SCAN_UNIT_ID // TARGET_NAME..."
              className="w-full bg-black border border-white/10 px-12 py-3 rounded text-xs font-mono uppercase tracking-widest focus:outline-none focus:border-primary transition-all placeholder:text-white/10"
            />
          </div>
        </div>

        {/* Content Display */}
        <div className="min-h-[500px]">
          {selectedTab === 'my_nfts' ? (
            myNFTs.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 border border-dashed border-white/10 rounded-2xl bg-white/[0.02]">
                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-6">
                  <Package className="w-8 h-8 text-white/20" />
                </div>
                <p className="text-white/40 font-black uppercase tracking-[0.3em] mb-2">Vault_Empty</p>
                <p className="text-xs text-white/20 italic">"Digital assets not detected in current neural link"</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {myNFTs.map((nft) => (
                  <div key={nft.id} className="group relative bg-black border border-white/10 hover:border-primary transition-all duration-300 rounded-tr-3xl overflow-hidden shadow-2xl">
                    {/* Asset Badge */}
                    <div className="absolute top-2 right-2 z-10 flex gap-1">
                      <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-tighter ${nft.isListed ? 'bg-orange-500 text-black' : 'bg-white/10 text-white/40'}`}>
                        {nft.isListed ? 'ON_MARKET' : 'VAULTED'}
                      </span>
                    </div>

                    <div className="aspect-square relative overflow-hidden bg-white/5">
                      <img
                        src={nft.imageUrl}
                        alt={nft.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 opacity-80 group-hover:opacity-100"
                        onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                          e.currentTarget.src = 'https://via.placeholder.com/150?text=Jablix';
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
                    </div>

                    <div className="p-4 border-t border-white/5 bg-gradient-to-br from-transparent to-white/5">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <p className="text-[10px] font-black text-primary/60 uppercase tracking-widest font-mono">#{nft.id.slice(0, 8)}</p>
                          <h3 className="text-sm font-black text-white hover:text-primary transition-colors cursor-pointer uppercase truncate max-w-[120px]">{nft.name}</h3>
                        </div>
                        <div className="flex flex-col items-end">
                          <span className="text-[9px] font-black text-white/40 uppercase">LV_0{nft.level}</span>
                          <span className="text-[9px] font-black text-primary uppercase italic">PH_0{nft.phase}</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 mb-4">
                        <div className="flex items-center gap-2 px-2 py-1 bg-white/5 border border-white/5 rounded">
                          <Sword className="w-2.5 h-2.5 text-orange-500" />
                          <span className="text-[10px] font-black text-white/60">{nft.attack}</span>
                        </div>
                        <div className="flex items-center gap-2 px-2 py-1 bg-white/5 border border-white/5 rounded">
                          <Shield className="w-2.5 h-2.5 text-blue-500" />
                          <span className="text-[10px] font-black text-white/60">{nft.defense}</span>
                        </div>
                      </div>

                      {nft.isListed ? (
                        <button
                          onClick={() => handleDelistNFT(nft)}
                          className="w-full py-3 bg-red-500/10 border border-red-500/30 text-red-500 font-black uppercase text-[10px] tracking-widest hover:bg-red-500 hover:text-white transition-all rounded"
                        >
                          Abort_Listing
                        </button>
                      ) : (
                        <button
                          onClick={() => { setSelectedNFT(nft); setShowListModal(true); }}
                          className="w-full py-3 bg-primary text-black font-black uppercase text-[10px] tracking-widest hover:bg-white transition-all rounded flex items-center justify-center gap-2 group-hover:translate-y-[-2px] shadow-lg shadow-primary/20"
                        >
                          <TagIcon className="w-3 h-3" />
                          Initiate_Listing
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )
          ) : (
            marketplaceNFTs.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 border border-dashed border-white/10 rounded-2xl bg-white/[0.02]">
                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-6">
                  <ShoppingBag className="w-8 h-8 text-white/20" />
                </div>
                <p className="text-white/40 font-black uppercase tracking-[0.3em] mb-2">Market_Offline</p>
                <p className="text-xs text-white/20 italic">"Global trade synchronization in progress..."</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {marketplaceNFTs.map((nft) => (
                  <div key={nft.id} className="group relative bg-black border border-white/10 hover:border-primary transition-all duration-300 rounded-tr-3xl overflow-hidden shadow-2xl">
                    <div className="aspect-square relative overflow-hidden bg-white/5">
                      <img
                        src={nft.imageUrl}
                        alt={nft.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute top-2 left-2 px-2 py-1 bg-black/60 backdrop-blur-md border border-white/10 rounded text-[9px] font-black text-primary">
                        {nft.price} JXC
                      </div>
                    </div>
                    <div className="p-4 border-t border-white/5">
                      {/* Similar metadata as My NFTs, but with Buy action */}
                      <button
                        onClick={() => handleBuyNFT(nft)}
                        className="w-full py-3 bg-green-500 text-black font-black uppercase text-[10px] tracking-widest hover:bg-white transition-all rounded flex items-center justify-center gap-2"
                      >
                        Confirm_Aquisition
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )
          )}
        </div>

        {/* List Modal HUD */}
        {showListModal && selectedNFT && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-[#010101]/95 backdrop-blur-md" onClick={() => setShowListModal(false)} />
            <div className="relative w-full max-w-lg bg-black border border-primary/50 p-8 rounded-tr-[3rem] shadow-[0_0_100px_rgba(255,107,0,0.1)] animate-in fade-in zoom-in duration-300">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-primary/20 border border-primary/40 flex items-center justify-center rounded-tr-xl">
                  <TagIcon className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-primary/60 uppercase tracking-widest font-mono">Terminal_Protocol_0x42</p>
                  <h2 className="text-3xl font-black italic text-white uppercase font-heading">LIST_ASSET</h2>
                </div>
              </div>

              <div className="flex gap-6 mb-8 p-4 bg-white/5 border border-white/10 rounded-xl relative overflow-hidden">
                <div className="w-24 h-24 shrink-0 rounded border border-white/10 overflow-hidden bg-black">
                  <img src={selectedNFT.imageUrl} alt="" className="w-full h-full object-cover p-1" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-black text-white uppercase mb-1">{selectedNFT.name}</h3>
                  <div className="flex gap-4">
                    <div className="text-[9px] font-black text-white/40 uppercase">LV_0{selectedNFT.level}</div>
                    <div className="text-[9px] font-black text-primary uppercase italic">PH_0{selectedNFT.phase}</div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div className="flex items-center gap-2 text-[10px] font-black text-white/60">
                      <Target className="w-3 h-3 text-green-500" />
                      SPD: {selectedNFT.speed}
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-black text-white/60">
                      <Zap className="w-3 h-3 text-yellow-500" />
                      ENG: {selectedNFT.hp}
                    </div>
                  </div>
                </div>
                <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-primary/5 rounded-full blur-2xl" />
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] ml-1">Desired_Value_Protocol (JXC)</label>
                  <div className="relative">
                    <Plus className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
                    <input
                      type="number"
                      value={listingPrice}
                      onChange={(e) => setListingPrice(e.target.value)}
                      placeholder="0.00"
                      className="w-full bg-black border border-white/10 hover:border-primary/50 focus:border-primary px-12 py-4 rounded text-xl font-black text-white transition-all outline-none"
                    />
                  </div>
                </div>

                <div className="p-4 bg-primary/5 border border-primary/20 rounded">
                  <div className="flex justify-between items-center text-[10px] font-black uppercase text-white/60 mb-1">
                    <span>Platform_Fee</span>
                    <span>2.5%</span>
                  </div>
                  <div className="flex justify-between items-center text-[10px] font-bold text-primary italic">
                    <span>Taxation_Amount:</span>
                    <span>{(parseFloat(listingPrice || '0') * 0.025).toFixed(2)} JXC</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => { setShowListModal(false); setListingPrice(''); }}
                    className="py-4 bg-white/5 hover:bg-white/10 text-white/40 font-black uppercase text-[11px] tracking-widest transition-all rounded"
                  >
                    Cancel_Op
                  </button>
                  <button
                    onClick={handleListNFT}
                    disabled={isProcessing || !listingPrice || parseFloat(listingPrice) <= 0}
                    className={`py-4 font-black uppercase text-[11px] tracking-widest transition-all rounded shadow-lg ${isProcessing || !listingPrice || parseFloat(listingPrice) <= 0
                      ? 'bg-white/5 text-white/20 cursor-not-allowed'
                      : 'bg-primary text-black hover:bg-white shadow-primary/20'
                      }`}
                  >
                    {isProcessing ? 'Fabricating...' : 'Execute_Listing'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
