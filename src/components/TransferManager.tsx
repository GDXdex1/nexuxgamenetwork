'use client';

import { useState } from 'react';
import { useCurrentAccount, useSignAndExecuteTransaction, useSuiClient } from '@mysten/dapp-kit';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Send, CheckCircle2, AlertCircle, Coins, Image as ImageIcon, Building } from 'lucide-react';
import { toast } from 'sonner';
import {
  createTransferJxcTransaction,
  createTransferJablixTransaction,
  createTransferGymTransaction,
  isValidSuiAddress,
  jxcToSmallestUnit,
  jxcFromSmallestUnit,
} from '@/utils/transferTransactions';
import { useJxcBalance } from '@/hooks/useSuiData';
import { useUserGyms } from '@/hooks/useUserGyms';

interface ScannedJablix {
  id: string;
  objectId: string;
  type: 'elemental' | 'special';
  name: string;
  phase: number;
  imageUrl: string;
}

interface TransferManagerProps {
  jablixList: ScannedJablix[];
  onTransferComplete?: () => void;
}

type TransferTab = 'jxc' | 'nft' | 'gym';

export default function TransferManager({ jablixList, onTransferComplete }: TransferManagerProps) {
  const account = useCurrentAccount();
  const client = useSuiClient();
  const jxcBalanceQuery = useJxcBalance();
  const { gyms } = useUserGyms();
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();

  const [activeTab, setActiveTab] = useState<TransferTab>('jxc');
  const [isTransferring, setIsTransferring] = useState<boolean>(false);
  const [txSuccess, setTxSuccess] = useState<string | null>(null);
  const [txError, setTxError] = useState<string | null>(null);

  // JXC Transfer State
  const [jxcRecipient, setJxcRecipient] = useState<string>('');
  const [jxcAmount, setJxcAmount] = useState<string>('');

  // NFT Transfer State
  const [selectedNft, setSelectedNft] = useState<string>('');
  const [nftRecipient, setNftRecipient] = useState<string>('');

  // Gym Transfer State
  const [selectedGym, setSelectedGym] = useState<string>('');
  const [gymRecipient, setGymRecipient] = useState<string>('');

  const jxcBalance = jxcBalanceQuery.data?.totalBalance || 0n;

  // ==================== JXC TRANSFER ====================
  
  const handleTransferJxc = async () => {
    if (!account?.address) {
      toast.error('Please connect your wallet');
      return;
    }

    if (!jxcRecipient.trim() || !isValidSuiAddress(jxcRecipient)) {
      toast.error('Please enter a valid Sui address (0x...)');
      return;
    }

    const amount = parseFloat(jxcAmount);
    if (isNaN(amount) || amount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    const amountSmallest = jxcToSmallestUnit(amount);
    const balanceBigInt = typeof jxcBalance === 'bigint' ? jxcBalance : BigInt(jxcBalance);
    if (amountSmallest > balanceBigInt) {
      toast.error('Insufficient JXC balance');
      return;
    }

    setIsTransferring(true);
    setTxSuccess(null);
    setTxError(null);

    try {
      // Get JXC coins
      const jxcCoins = await client.getCoins({
        owner: account.address,
        coinType: '0x12e854e44a8c1c1056c0a718fe01668f9ed9376edd2412fd532e715c83cad4df::jablixcoin::JABLIXCOIN',
      });

      if (jxcCoins.data.length === 0) {
        throw new Error('No JXC coins found');
      }

      // Use the first coin
      const jxcCoinId = jxcCoins.data[0].coinObjectId;

      // Create transfer transaction
      const tx = createTransferJxcTransaction(jxcCoinId, amountSmallest, jxcRecipient);

      // Sign and execute
      signAndExecute(
        {
          transaction: tx,
        },
        {
          onSuccess: (result) => {
            console.log('✅ JXC Transfer successful:', result);
            setTxSuccess(result.digest);
            toast.success(`Successfully transferred ${amount} JXC!`);
            
            // Reset form
            setJxcRecipient('');
            setJxcAmount('');
            
            // Refresh balance
            jxcBalanceQuery.refetch();
            
            if (onTransferComplete) {
              onTransferComplete();
            }
          },
          onError: (error) => {
            console.error('❌ JXC Transfer failed:', error);
            setTxError(error.message);
            toast.error(`Transfer failed: ${error.message}`);
          },
        }
      );
    } catch (error) {
      console.error('❌ Error preparing transfer:', error);
      const errorMessage = error instanceof Error ? error.message : 'Transfer failed';
      setTxError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsTransferring(false);
    }
  };

  // ==================== NFT TRANSFER ====================
  
  const handleTransferNft = async () => {
    if (!account?.address) {
      toast.error('Please connect your wallet');
      return;
    }

    if (!selectedNft) {
      toast.error('Please select a Jab to transfer');
      return;
    }

    if (!nftRecipient.trim() || !isValidSuiAddress(nftRecipient)) {
      toast.error('Please enter a valid Sui address (0x...)');
      return;
    }

    setIsTransferring(true);
    setTxSuccess(null);
    setTxError(null);

    try {
      const nft = jablixList.find((j) => j.objectId === selectedNft);
      if (!nft) {
        throw new Error('Jab not found');
      }

      // Create transfer transaction using public_transfer
      const tx = createTransferJablixTransaction(selectedNft, nft.type, nftRecipient);

      // Sign and execute
      signAndExecute(
        {
          transaction: tx,
        },
        {
          onSuccess: (result) => {
            console.log('✅ NFT Transfer successful:', result);
            setTxSuccess(result.digest);
            toast.success(`Successfully transferred ${nft.name}!`);
            
            // Reset form
            setSelectedNft('');
            setNftRecipient('');
            
            if (onTransferComplete) {
              onTransferComplete();
            }
          },
          onError: (error) => {
            console.error('❌ NFT Transfer failed:', error);
            setTxError(error.message);
            toast.error(`Transfer failed: ${error.message}`);
          },
        }
      );
    } catch (error) {
      console.error('❌ Error preparing transfer:', error);
      const errorMessage = error instanceof Error ? error.message : 'Transfer failed';
      setTxError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsTransferring(false);
    }
  };

  // ==================== GYM TRANSFER ====================
  
  const handleTransferGym = async () => {
    if (!account?.address) {
      toast.error('Please connect your wallet');
      return;
    }

    if (!selectedGym) {
      toast.error('Please select a gym to transfer');
      return;
    }

    if (!gymRecipient.trim() || !isValidSuiAddress(gymRecipient)) {
      toast.error('Please enter a valid Sui address (0x...)');
      return;
    }

    setIsTransferring(true);
    setTxSuccess(null);
    setTxError(null);

    try {
      const gym = gyms.find((g) => g.id === selectedGym);
      if (!gym) {
        throw new Error('Gym not found');
      }

      // Create transfer transaction for gym
      const tx = createTransferGymTransaction(selectedGym, gymRecipient);

      // Sign and execute
      signAndExecute(
        {
          transaction: tx,
        },
        {
          onSuccess: (result) => {
            console.log('✅ Gym Transfer successful:', result);
            setTxSuccess(result.digest);
            toast.success(`Successfully transferred ${gym.name}!`);
            
            // Reset form
            setSelectedGym('');
            setGymRecipient('');
            
            if (onTransferComplete) {
              onTransferComplete();
            }
          },
          onError: (error) => {
            console.error('❌ Gym Transfer failed:', error);
            setTxError(error.message);
            toast.error(`Transfer failed: ${error.message}`);
          },
        }
      );
    } catch (error) {
      console.error('❌ Error preparing transfer:', error);
      const errorMessage = error instanceof Error ? error.message : 'Transfer failed';
      setTxError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsTransferring(false);
    }
  };

  // ==================== RENDER ====================

  const selectedNftData = jablixList.find((j) => j.objectId === selectedNft);
  const selectedGymData = gyms.find((g) => g.id === selectedGym);

  return (
    <div className="bg-gradient-to-br from-purple-900/90 to-pink-900/90 border-4 border-pink-500/50 rounded-3xl p-4 md:p-8 shadow-2xl backdrop-blur-sm">
      <h2 className="text-2xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-300 to-orange-300 mb-6">
        🔄 Transfer Manager
      </h2>

      {/* Tabs */}
      <div className="flex flex-col sm:flex-row gap-2 mb-6 bg-black/30 p-2 rounded-xl">
        <button
          onClick={() => setActiveTab('jxc')}
          className={`flex-1 py-3 px-4 rounded-lg font-bold transition-all flex items-center justify-center gap-2 ${
            activeTab === 'jxc'
              ? 'bg-gradient-to-r from-pink-600 to-orange-600 text-white shadow-lg'
              : 'text-pink-300 hover:bg-black/50'
          }`}
        >
          <Coins className="w-5 h-5" />
          <span className="hidden sm:inline">JXC Tokens</span>
          <span className="sm:hidden">JXC</span>
        </button>
        <button
          onClick={() => setActiveTab('nft')}
          className={`flex-1 py-3 px-4 rounded-lg font-bold transition-all flex items-center justify-center gap-2 ${
            activeTab === 'nft'
              ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
              : 'text-purple-300 hover:bg-black/50'
          }`}
        >
          <ImageIcon className="w-5 h-5" />
          <span className="hidden sm:inline">Jabs NFTs</span>
          <span className="sm:hidden">Jabs</span>
        </button>
        <button
          onClick={() => setActiveTab('gym')}
          className={`flex-1 py-3 px-4 rounded-lg font-bold transition-all flex items-center justify-center gap-2 ${
            activeTab === 'gym'
              ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg'
              : 'text-blue-300 hover:bg-black/50'
          }`}
        >
          <Building className="w-5 h-5" />
          <span className="hidden sm:inline">Gyms</span>
          <span className="sm:hidden">Gyms</span>
        </button>
      </div>

      {/* Success/Error Messages */}
      {txSuccess && (
        <Alert className="mb-6 bg-green-900/50 border-green-500">
          <CheckCircle2 className="h-5 w-5" />
          <AlertDescription className="text-white">
            Transfer successful!{' '}
            <a
              href={`https://suiscan.xyz/testnet/tx/${txSuccess}`}
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-green-300"
            >
              View on Explorer →
            </a>
          </AlertDescription>
        </Alert>
      )}

      {txError && (
        <Alert className="mb-6 bg-red-900/50 border-red-500">
          <AlertCircle className="h-5 w-5" />
          <AlertDescription className="text-white">{txError}</AlertDescription>
        </Alert>
      )}

      {/* JXC Transfer Tab */}
      {activeTab === 'jxc' && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-pink-200 mb-2">
              Available: {jxcFromSmallestUnit(jxcBalance).toLocaleString()} JXC
            </label>
            <Input
              type="number"
              placeholder="Amount (e.g., 1000)"
              value={jxcAmount}
              onChange={(e) => setJxcAmount(e.target.value)}
              className="bg-black/30 border-2 border-pink-500/50 text-white placeholder-gray-400 focus:border-pink-400 text-base"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-pink-200 mb-2">Recipient Address</label>
            <Input
              type="text"
              placeholder="0x..."
              value={jxcRecipient}
              onChange={(e) => setJxcRecipient(e.target.value)}
              className="bg-black/30 border-2 border-pink-500/50 text-white placeholder-gray-400 focus:border-pink-400 text-base font-mono"
            />
          </div>

          <Button
            onClick={handleTransferJxc}
            disabled={isTransferring || !jxcAmount || !jxcRecipient}
            className="w-full bg-gradient-to-r from-pink-600 to-orange-600 hover:from-pink-700 hover:to-orange-700 text-white font-bold py-6 text-lg"
          >
            {isTransferring ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Transferring...
              </>
            ) : (
              <>
                <Send className="w-5 h-5 mr-2" />
                Transfer JXC
              </>
            )}
          </Button>
        </div>
      )}

      {/* NFT Transfer Tab */}
      {activeTab === 'nft' && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-purple-200 mb-2">
              Select Jab ({jablixList.length} available)
            </label>
            {jablixList.length === 0 ? (
              <div className="bg-black/30 border-2 border-purple-500/30 rounded-xl p-6 text-center">
                <p className="text-purple-300">No Jabs available to transfer</p>
              </div>
            ) : (
              <select
                value={selectedNft}
                onChange={(e) => setSelectedNft(e.target.value)}
                className="w-full bg-black/30 border-2 border-purple-500/50 rounded-xl px-4 py-3 text-white focus:border-purple-400 focus:outline-none text-base"
              >
                <option value="">Select a Jab...</option>
                {jablixList.map((jab) => (
                  <option key={jab.objectId} value={jab.objectId}>
                    {jab.name} (Phase {jab.phase})
                  </option>
                ))}
              </select>
            )}
          </div>

          {selectedNftData && (
            <div className="bg-black/30 border-2 border-purple-500/30 rounded-xl p-4">
              <div className="flex items-center gap-4">
                <img
                  src={selectedNftData.imageUrl}
                  alt={selectedNftData.name}
                  className="w-16 h-16 md:w-20 md:h-20 rounded-lg object-cover flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-white font-bold truncate">{selectedNftData.name}</p>
                  <p className="text-sm text-gray-400">Phase {selectedNftData.phase}</p>
                  <p className="text-xs text-gray-500 font-mono truncate">
                    {selectedNftData.objectId.slice(0, 8)}...{selectedNftData.objectId.slice(-6)}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-bold text-purple-200 mb-2">Recipient Address</label>
            <Input
              type="text"
              placeholder="0x..."
              value={nftRecipient}
              onChange={(e) => setNftRecipient(e.target.value)}
              className="bg-black/30 border-2 border-purple-500/50 text-white placeholder-gray-400 focus:border-purple-400 text-base font-mono"
            />
          </div>

          <Button
            onClick={handleTransferNft}
            disabled={isTransferring || !selectedNft || !nftRecipient}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-6 text-lg"
          >
            {isTransferring ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Transferring...
              </>
            ) : (
              <>
                <Send className="w-5 h-5 mr-2" />
                Transfer Jab NFT
              </>
            )}
          </Button>
        </div>
      )}

      {/* Gym Transfer Tab */}
      {activeTab === 'gym' && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-blue-200 mb-2">
              Select Gym ({gyms.length} available)
            </label>
            {gyms.length === 0 ? (
              <div className="bg-black/30 border-2 border-blue-500/30 rounded-xl p-6 text-center">
                <p className="text-blue-300">No Gyms available to transfer</p>
              </div>
            ) : (
              <select
                value={selectedGym}
                onChange={(e) => setSelectedGym(e.target.value)}
                className="w-full bg-black/30 border-2 border-blue-500/50 rounded-xl px-4 py-3 text-white focus:border-blue-400 focus:outline-none text-base"
              >
                <option value="">Select a Gym...</option>
                {gyms.map((gym) => (
                  <option key={gym.id} value={gym.id}>
                    {gym.name} - {gym.wins}W / {gym.losses}L
                  </option>
                ))}
              </select>
            )}
          </div>

          {selectedGymData && (
            <div className="bg-black/30 border-2 border-blue-500/30 rounded-xl p-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-lg flex items-center justify-center text-3xl md:text-4xl flex-shrink-0">
                  🏟️
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-bold truncate">{selectedGymData.name}</p>
                  <p className="text-sm text-gray-400">
                    Battles: {selectedGymData.battlesPlayed} | W: {selectedGymData.wins} | L: {selectedGymData.losses}
                  </p>
                  <p className="text-xs text-gray-500 font-mono truncate">
                    {selectedGymData.id.slice(0, 8)}...{selectedGymData.id.slice(-6)}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-bold text-blue-200 mb-2">Recipient Address</label>
            <Input
              type="text"
              placeholder="0x..."
              value={gymRecipient}
              onChange={(e) => setGymRecipient(e.target.value)}
              className="bg-black/30 border-2 border-blue-500/50 text-white placeholder-gray-400 focus:border-blue-400 text-base font-mono"
            />
          </div>

          <Button
            onClick={handleTransferGym}
            disabled={isTransferring || !selectedGym || !gymRecipient}
            className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-bold py-6 text-lg"
          >
            {isTransferring ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Transferring...
              </>
            ) : (
              <>
                <Send className="w-5 h-5 mr-2" />
                Transfer Gym
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
