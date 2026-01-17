'use client';

import { useState } from 'react';
import { useCurrentAccount, useSignAndExecuteTransaction, useSuiClient } from '@mysten/dapp-kit';
import { useAdminDashboard, formatTreasuryData } from '@/hooks/useTreasuryData';
import {
  createAdminMintTransaction,
  createBurnTransaction,
  createPauseTreasuryTransaction,
  createUnpauseTreasuryTransaction,
  createTransferAdminCapTransaction,
  validateMintAmount,
  validateBurnAmount,
} from '@/utils/adminTransactions';
import { SHARED_OBJECTS, jxcToSmallestUnit, jxcFromSmallestUnit, JABLIXCOIN_CONSTANTS, WALLETS } from '@/config/suiConfig';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface AdminPanelProps {
  onBackToMain: () => void;
}

export default function AdminPanel({ onBackToMain }: AdminPanelProps) {
  const account = useCurrentAccount();
  const client = useSuiClient();
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();
  
  const {
    treasury,
    treasuryLoading,
    adminCapId,
    isAdmin,
    adminCapLoading,
    jxcCoins,
    refetchTreasury,
  } = useAdminDashboard();

  const [mintAmount, setMintAmount] = useState<string>('');
  const [burnCoinId, setBurnCoinId] = useState<string>('');
  const [transferAddress, setTransferAddress] = useState<string>('');
  const [status, setStatus] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Handle mint tokens
  const handleMint = async (): Promise<void> => {
    if (!adminCapId || !treasury || !account) {
      setStatus('❌ Admin access required');
      return;
    }

    const amount = parseFloat(mintAmount);
    if (isNaN(amount) || amount <= 0) {
      setStatus('❌ Invalid amount');
      return;
    }

    const amountInSmallestUnit = jxcToSmallestUnit(amount);
    
    if (!validateMintAmount(amountInSmallestUnit)) {
      const maxMintFormatted = jxcFromSmallestUnit(JABLIXCOIN_CONSTANTS.MAX_MINT_PER_TX);
      setStatus(`❌ Amount exceeds max mint per tx: ${maxMintFormatted.toLocaleString()} JXC`);
      return;
    }

    if (amountInSmallestUnit > treasury.remaining) {
      setStatus('❌ Amount exceeds remaining supply');
      return;
    }

    setIsLoading(true);
    setStatus('⏳ Minting tokens...');

    try {
      // Mint tokens to the current admin wallet
      const tx = createAdminMintTransaction(
        amountInSmallestUnit,
        account.address, // recipient: current admin wallet
        adminCapId,
        SHARED_OBJECTS.JXC_TREASURY
      );

      signAndExecute(
        { transaction: tx },
        {
          onSuccess: (result) => {
            setStatus(`✅ Minted ${amount.toLocaleString()} JXC successfully!`);
            setMintAmount('');
            refetchTreasury();
            setTimeout(() => setIsLoading(false), 1000);
          },
          onError: (error) => {
            setStatus(`❌ Mint failed: ${error.message}`);
            setIsLoading(false);
          },
        }
      );
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setStatus(`❌ Error: ${errorMessage}`);
      setIsLoading(false);
    }
  };

  // Handle burn tokens
  const handleBurn = async (): Promise<void> => {
    if (!burnCoinId || !treasury) {
      setStatus('❌ Please select a coin to burn');
      return;
    }

    setIsLoading(true);
    setStatus('⏳ Burning tokens...');

    try {
      const tx = createBurnTransaction(burnCoinId, SHARED_OBJECTS.JXC_TREASURY);

      signAndExecute(
        { transaction: tx },
        {
          onSuccess: (result) => {
            setStatus('✅ Tokens burned successfully!');
            setBurnCoinId('');
            refetchTreasury();
            setTimeout(() => setIsLoading(false), 1000);
          },
          onError: (error) => {
            setStatus(`❌ Burn failed: ${error.message}`);
            setIsLoading(false);
          },
        }
      );
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setStatus(`❌ Error: ${errorMessage}`);
      setIsLoading(false);
    }
  };

  // Handle pause/unpause treasury
  const handleTogglePause = async (): Promise<void> => {
    if (!adminCapId || !treasury) {
      setStatus('❌ Admin access required');
      return;
    }

    setIsLoading(true);
    setStatus(treasury.paused ? '⏳ Unpausing treasury...' : '⏳ Pausing treasury...');

    try {
      const tx = treasury.paused
        ? createUnpauseTreasuryTransaction(adminCapId, SHARED_OBJECTS.JXC_TREASURY)
        : createPauseTreasuryTransaction(adminCapId, SHARED_OBJECTS.JXC_TREASURY);

      signAndExecute(
        { transaction: tx },
        {
          onSuccess: (result) => {
            setStatus(`✅ Treasury ${treasury.paused ? 'unpaused' : 'paused'} successfully!`);
            refetchTreasury();
            setTimeout(() => setIsLoading(false), 1000);
          },
          onError: (error) => {
            setStatus(`❌ Operation failed: ${error.message}`);
            setIsLoading(false);
          },
        }
      );
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setStatus(`❌ Error: ${errorMessage}`);
      setIsLoading(false);
    }
  };

  // Handle transfer admin cap
  const handleTransferAdminCap = async (): Promise<void> => {
    if (!adminCapId) {
      setStatus('❌ Admin access required');
      return;
    }

    if (!transferAddress || transferAddress.length !== 66 || !transferAddress.startsWith('0x')) {
      setStatus('❌ Invalid address format');
      return;
    }

    setIsLoading(true);
    setStatus('⏳ Transferring AdminCap...');

    try {
      const tx = createTransferAdminCapTransaction(adminCapId, transferAddress);

      signAndExecute(
        { transaction: tx },
        {
          onSuccess: (result) => {
            setStatus('✅ AdminCap transferred successfully! You no longer have admin access.');
            setTransferAddress('');
            setTimeout(() => setIsLoading(false), 1000);
          },
          onError: (error) => {
            setStatus(`❌ Transfer failed: ${error.message}`);
            setIsLoading(false);
          },
        }
      );
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setStatus(`❌ Error: ${errorMessage}`);
      setIsLoading(false);
    }
  };

  if (!account) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 p-8">
        <Card className="max-w-2xl mx-auto bg-black/70 border-red-500">
          <CardHeader>
            <CardTitle className="text-white">🔒 Connect Wallet</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-300">Please connect your wallet to access the Admin Panel.</p>
            <Button onClick={onBackToMain} className="mt-4">
              Back to Main Menu
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (adminCapLoading || treasuryLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-500 mx-auto mb-4" />
          <p className="text-white text-xl">Loading Admin Panel...</p>
        </div>
      </div>
    );
  }

  // CRITICAL: Only allow access to the two admin wallets from the contract
  const ADMIN_WALLET_1 = '0x554a2392980b0c3e4111c9a0e8897e632d41847d04cbd41f9e081e49ba2eb04a';
  const ADMIN_WALLET_2 = '0x9e7aaf5f56ae094eadf9ca7f2856f533bcbf12fcc9bb9578e43ca770599a5dce';
  const isAdminWallet = account?.address === ADMIN_WALLET_1 || account?.address === ADMIN_WALLET_2;

  if (!isAdmin || !isAdminWallet) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 p-8">
        <Card className="max-w-2xl mx-auto bg-black/70 border-red-500">
          <CardHeader>
            <CardTitle className="text-white">⛔ Access Denied</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-300">You do not have admin privileges. Only the authorized admin wallets can access this panel.</p>
            <Button onClick={onBackToMain} className="mt-4">
              Back to Main Menu
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const formattedData = treasury ? formatTreasuryData(treasury) : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-black text-white mb-2">🔧 ADMIN PANEL</h1>
            <p className="text-purple-300">JABLIXCOIN Treasury Management</p>
          </div>
          <Button 
            onClick={onBackToMain}
            className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
          >
            ← Back to Main
          </Button>
        </div>

        {/* Status Alert */}
        {status && (
          <Alert className="mb-6 bg-black/70 border-purple-500">
            <AlertDescription className="text-white">{status}</AlertDescription>
          </Alert>
        )}

        {/* Treasury Analytics */}
        {treasury && formattedData && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="bg-gradient-to-br from-green-600/20 to-emerald-600/20 border-green-500">
              <CardHeader>
                <CardTitle className="text-white text-lg">Circulating Supply</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-green-300">{formattedData.circulatingSupplyFormatted}</p>
                <p className="text-sm text-green-200 mt-1">JXC Tokens</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-600/20 to-cyan-600/20 border-blue-500">
              <CardHeader>
                <CardTitle className="text-white text-lg">Remaining Supply</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-blue-300">{formattedData.remainingFormatted}</p>
                <p className="text-sm text-blue-200 mt-1">Available to Mint</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 border-purple-500">
              <CardHeader>
                <CardTitle className="text-white text-lg">Max Supply</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-purple-300">{formattedData.maxSupplyFormatted}</p>
                <p className="text-sm text-purple-200 mt-1">Total Cap</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-yellow-600/20 to-orange-600/20 border-yellow-500">
              <CardHeader>
                <CardTitle className="text-white text-lg">Minted %</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-yellow-300">{formattedData.percentMinted}%</p>
                <Badge className={treasury.paused ? 'bg-red-600' : 'bg-green-600'}>
                  {treasury.paused ? '⏸️ Paused' : '▶️ Active'}
                </Badge>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Admin Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Mint Tokens */}
          <Card className="bg-black/70 border-green-500">
            <CardHeader>
              <CardTitle className="text-white">💰 Mint Tokens</CardTitle>
              <CardDescription className="text-gray-400">
                Create new JXC tokens (Max: {jxcFromSmallestUnit(JABLIXCOIN_CONSTANTS.MAX_MINT_PER_TX).toLocaleString()} per tx)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                type="number"
                placeholder="Amount to mint (JXC)"
                value={mintAmount}
                onChange={(e) => setMintAmount(e.target.value)}
                className="bg-black/50 border-green-400 text-white"
                disabled={isLoading || treasury?.paused}
              />
              <Button
                onClick={handleMint}
                disabled={isLoading || treasury?.paused || !mintAmount}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                {isLoading ? '⏳ Minting...' : '💰 Mint Tokens'}
              </Button>
            </CardContent>
          </Card>

          {/* Burn Tokens */}
          <Card className="bg-black/70 border-red-500">
            <CardHeader>
              <CardTitle className="text-white">🔥 Burn Tokens</CardTitle>
              <CardDescription className="text-gray-400">
                Permanently destroy JXC tokens
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <select
                value={burnCoinId}
                onChange={(e) => setBurnCoinId(e.target.value)}
                className="w-full bg-black/50 border border-red-400 text-white rounded-lg p-2"
                disabled={isLoading || treasury?.paused}
              >
                <option value="">Select coin to burn</option>
                {jxcCoins.map((coin) => (
                  <option key={coin.objectId} value={coin.objectId}>
                    {jxcFromSmallestUnit(coin.balance).toFixed(2)} JXC - {coin.objectId.slice(0, 8)}...
                  </option>
                ))}
              </select>
              <Button
                onClick={handleBurn}
                disabled={isLoading || treasury?.paused || !burnCoinId}
                className="w-full bg-red-600 hover:bg-red-700"
              >
                {isLoading ? '⏳ Burning...' : '🔥 Burn Tokens'}
              </Button>
            </CardContent>
          </Card>

          {/* Pause/Unpause Treasury */}
          <Card className="bg-black/70 border-yellow-500">
            <CardHeader>
              <CardTitle className="text-white">⏸️ Treasury Control</CardTitle>
              <CardDescription className="text-gray-400">
                Pause or resume minting/burning operations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={handleTogglePause}
                disabled={isLoading}
                className={`w-full ${
                  treasury?.paused
                    ? 'bg-green-600 hover:bg-green-700'
                    : 'bg-yellow-600 hover:bg-yellow-700'
                }`}
              >
                {isLoading
                  ? '⏳ Processing...'
                  : treasury?.paused
                  ? '▶️ Unpause Treasury'
                  : '⏸️ Pause Treasury'}
              </Button>
            </CardContent>
          </Card>

          {/* Transfer AdminCap */}
          <Card className="bg-black/70 border-purple-500">
            <CardHeader>
              <CardTitle className="text-white">🔑 Transfer Admin Rights</CardTitle>
              <CardDescription className="text-red-400">
                ⚠️ WARNING: This permanently transfers admin access
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                type="text"
                placeholder="Recipient address (0x...)"
                value={transferAddress}
                onChange={(e) => setTransferAddress(e.target.value)}
                className="bg-black/50 border-purple-400 text-white"
                disabled={isLoading}
              />
              <Button
                onClick={handleTransferAdminCap}
                disabled={isLoading || !transferAddress}
                className="w-full bg-purple-600 hover:bg-purple-700"
              >
                {isLoading ? '⏳ Transferring...' : '🔑 Transfer AdminCap'}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
