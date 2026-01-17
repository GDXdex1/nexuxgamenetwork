'use client';

import { useState, useEffect } from 'react';
import { useCurrentAccount } from '@mysten/dapp-kit';
import { useBattleSocket } from '@/hooks/useBattleSocket';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Zap, Sword, MessageSquare, Timer, User, Check, WifiOff, X, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import type { BattleAction } from '@/types/battle.types';

interface BattleArenaProps {
    matchId: string;
    playerTeam: string[];
    mode: 'ai' | 'random' | 'gym';
    onBackToMain: () => void;
}

export default function BattleArena({ matchId, playerTeam, mode, onBackToMain }: BattleArenaProps) {
    const account = useCurrentAccount();
    const {
        battleState,
        currentTurn,
        timeRemaining,
        sendAction,
        isConnected,
        error
    } = useBattleSocket();

    const [selectedJablixIdx, setSelectedJablixIdx] = useState<number>(0);
    const [selectedMoves, setSelectedMoves] = useState<BattleAction[]>([]);
    const [hasSubmitted, setHasSubmitted] = useState<boolean>(false);
    const [battleLogs, setBattleLogs] = useState<string[]>(['Battle started! Choose your moves.']);

    // Reset submission state when turn changes
    useEffect(() => {
        setHasSubmitted(false);
        setSelectedMoves([]);
    }, [currentTurn]);

    // Handle battle state updates
    useEffect(() => {
        if (battleState?.winner) {
            const isWinner = battleState.winner === account?.address;
            setBattleLogs(prev => [...prev, `🏆 Battle ended! ${isWinner ? 'YOU WIN!' : 'Opponent wins.'}`]);
            toast(isWinner ? 'Victory!' : 'Defeat!', {
                description: isWinner ? 'You won the battle and earned rewards.' : 'Better luck next time.',
            });
        }
    }, [battleState?.winner, account?.address]);

    const player1 = battleState?.player1;
    const player2 = battleState?.player2;
    const isPlayer1 = player1?.address === account?.address;

    const myTeam = isPlayer1 ? player1?.team : player2?.team;
    const enemyTeam = isPlayer1 ? player2?.team : player1?.team;

    const handleSelectCard = (jablixIdx: number, cardIdx: number) => {
        if (hasSubmitted) return;
        const existingActionIdx = selectedMoves.findIndex(m => m.jablix_idx === jablixIdx);
        if (existingActionIdx !== -1) {
            const newMoves = [...selectedMoves];
            newMoves[existingActionIdx] = { sessionId: matchId, jablix_idx: jablixIdx, card_idx: cardIdx };
            setSelectedMoves(newMoves);
        } else {
            setSelectedMoves([...selectedMoves, { sessionId: matchId, jablix_idx: jablixIdx, card_idx: cardIdx }]);
        }
    };

    const handleSubmitTurn = async () => {
        if (hasSubmitted || selectedMoves.length === 0) return;
        try {
            setHasSubmitted(true);
            for (const move of selectedMoves) {
                await sendAction(move);
            }
            toast.success('Moves submitted! Waiting for opponent...');
        } catch (err) {
            setHasSubmitted(false);
            toast.error('Failed to submit moves');
        }
    };

    if (!battleState) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 text-white space-y-4">
                <p className="text-xl font-bold">Initializing Battle Arena...</p>
                {error && <p className="text-red-400 mt-4">{error}</p>}
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950 text-white p-4 flex flex-col">
            {/* Header */}
            <div className="flex justify-between items-center mb-6 border-b border-slate-800 pb-4">
                <div>
                    <h2 className="text-2xl font-bold text-white">JABLIX ARENA</h2>
                    <div className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary">Turn {currentTurn}</Badge>
                        <Badge variant="outline">{mode.toUpperCase()}</Badge>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="text-xl font-mono text-yellow-500 font-bold">
                        {timeRemaining}s
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onBackToMain}
                        className="rounded-full hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </Button>
                </div>
            </div>

            <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Battle Log */}
                <div className="lg:col-span-1 order-2 lg:order-1">
                    <Card className="bg-slate-900 border-slate-800 h-full">
                        <CardContent className="p-4 h-full flex flex-col">
                            <h3 className="text-sm font-bold text-slate-400 mb-3 flex items-center gap-2">
                                <MessageSquare className="w-4 h-4" /> BATTLE LOG
                            </h3>
                            <ScrollArea className="flex-1 pr-4 max-h-[300px]">
                                <div className="space-y-2 text-xs">
                                    {battleLogs.map((log, i) => (
                                        <p key={i} className="text-slate-300 border-l-2 border-slate-600 pl-2 py-1">
                                            {log}
                                        </p>
                                    ))}
                                </div>
                            </ScrollArea>
                        </CardContent>
                    </Card>

                    <Card className="bg-slate-900 border-slate-800 mt-4">
                        <CardContent className="p-4">
                            <h3 className="text-sm font-bold text-slate-400 mb-3 flex items-center gap-2">
                                <Sword className="w-4 h-4" /> VERSUS
                            </h3>
                            <div className="flex items-center justify-between">
                                <div className="text-center">
                                    <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center border border-blue-500/50 mb-1">
                                        <User className="w-6 h-6 text-blue-400" />
                                    </div>
                                    <p className="text-[10px] font-bold text-blue-300 truncate w-20">
                                        {account?.address?.slice(0, 8)}...
                                    </p>
                                </div>
                                <div className="text-2xl font-black text-slate-600">VS</div>
                                <div className="text-center">
                                    <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center border border-red-500/50 mb-1">
                                        <Zap className="w-6 h-6 text-red-400" />
                                    </div>
                                    <p className="text-[10px] font-bold text-red-300 truncate w-20">
                                        {mode === 'ai' ? 'BATTLE AI' : 'OPPONENT'}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Battlefield */}
                <div className="lg:col-span-2 order-1 lg:order-2 flex flex-col justify-between gap-8 h-full min-h-[400px]">
                    {/* Enemy Team */}
                    <div className="flex justify-center gap-8">
                        {enemyTeam?.map((jablix, idx) => (
                            <div key={idx} className="relative flex flex-col items-center">
                                <div className={`w-24 h-24 relative p-2 ${!jablix.is_alive ? 'opacity-30 grayscale' : ''}`}>
                                    <img
                                        src={`https://api.dicebear.com/7.x/identicon/svg?seed=${jablix.jablixId}`}
                                        alt={jablix.name}
                                        className="w-full h-full object-contain"
                                    />
                                </div>
                                {/* Simple Health Bar */}
                                <div className="w-24 mt-2 bg-slate-800 h-2 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-red-500 transition-all duration-300"
                                        style={{ width: `${(jablix.hp / jablix.maxHp) * 100}%` }}
                                    />
                                </div>
                                <span className="text-xs mt-1 text-red-300 font-bold">{jablix.hp} HP</span>
                            </div>
                        ))}
                    </div>

                    {/* My Team */}
                    <div className="flex justify-center gap-8">
                        {myTeam?.map((jablix, idx) => (
                            <div
                                key={idx}
                                onClick={() => setSelectedJablixIdx(idx)}
                                className={`relative flex flex-col items-center cursor-pointer transition-all ${selectedJablixIdx === idx ? 'scale-110 brightness-110' : 'opacity-80'
                                    }`}
                            >
                                <div className={`w-28 h-28 relative p-2 ${!jablix.is_alive ? 'opacity-30 grayscale' : ''}`}>
                                    <img
                                        src={`https://api.dicebear.com/7.x/identicon/svg?seed=${jablix.jablixId}`}
                                        alt={jablix.name}
                                        className="w-full h-full object-contain"
                                    />
                                    {selectedJablixIdx === idx && (
                                        <div className="absolute top-0 right-0 bg-blue-500 rounded-full p-1">
                                            <Check className="w-3 h-3 text-white" />
                                        </div>
                                    )}
                                </div>
                                {/* Simple Health Bar */}
                                <div className="w-24 mt-2 bg-slate-800 h-2 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-blue-500 transition-all duration-300"
                                        style={{ width: `${(jablix.hp / jablix.maxHp) * 100}%` }}
                                    />
                                </div>
                                <span className="text-xs mt-1 text-blue-300 font-bold">{jablix.hp} HP</span>

                                {/* Energy Display */}
                                <div className="mt-1 flex items-center gap-1 bg-slate-900/50 px-2 py-0.5 rounded-full border border-yellow-500/20">
                                    <Zap className="w-3 h-3 text-yellow-500" />
                                    <span className="text-[10px] font-bold text-yellow-400">{jablix.energy}/{jablix.max_energy || 100}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Controls */}
                <div className="lg:col-span-1 order-3 h-full">
                    <Card className="bg-slate-900 border-slate-800 h-full">
                        <CardContent className="p-4 flex flex-col h-full">
                            <h3 className="text-sm font-bold text-slate-400 mb-4 flex items-center gap-2">
                                <Zap className="w-4 h-4 text-yellow-500" /> ACTIONS
                            </h3>

                            <div className="flex-1 space-y-2 overflow-y-auto">
                                {myTeam && myTeam[selectedJablixIdx] ? (
                                    <>
                                        <div className="flex justify-between items-center mb-2">
                                            <p className="text-xs text-slate-400 font-bold">
                                                {myTeam[selectedJablixIdx].name.toUpperCase()}
                                            </p>
                                            <Badge variant="outline" className="text-[10px] bg-yellow-500/10 text-yellow-500 border-yellow-500/20">
                                                {myTeam[selectedJablixIdx].energy} E
                                            </Badge>
                                        </div>
                                        {myTeam[selectedJablixIdx].cards?.map((card: any, cardIdx: number) => {
                                            const isSelected = selectedMoves.some(m => m.jablix_idx === selectedJablixIdx && m.card_idx === cardIdx);
                                            const cost = card.energy_cost || card.energyCost || 0;
                                            const isAffordable = myTeam[selectedJablixIdx].energy >= cost;

                                            return (
                                                <div
                                                    key={cardIdx}
                                                    onClick={() => isAffordable && !hasSubmitted && handleSelectCard(selectedJablixIdx, cardIdx)}
                                                    className={`p-3 rounded border cursor-pointer flex items-center gap-3 transition-colors ${isSelected
                                                        ? 'bg-blue-900/40 border-blue-500 ring-1 ring-blue-500/50'
                                                        : isAffordable && !hasSubmitted
                                                            ? 'bg-slate-800 border-slate-700 hover:bg-slate-700'
                                                            : 'opacity-50 cursor-not-allowed border-slate-800 bg-slate-900'
                                                        }`}
                                                >
                                                    <div className={`w-8 h-8 rounded flex items-center justify-center font-bold text-xs ${isAffordable ? 'bg-yellow-500/20 text-yellow-500' : 'bg-slate-800 text-slate-500'}`}>
                                                        {cost}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="font-bold text-[11px] text-white truncate">{card.name}</p>
                                                        <p className="text-[9px] text-slate-500 truncate leading-tight">{card.effect_text || card.description || 'Deals damage'}</p>
                                                    </div>
                                                    {isSelected && <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />}
                                                </div>
                                            );
                                        })}
                                        {(!myTeam[selectedJablixIdx].cards || myTeam[selectedJablixIdx].cards.length === 0) && (
                                            <p className="text-xs text-slate-500 text-center py-4">No cards available</p>
                                        )}
                                    </>
                                ) : (
                                    <p className="text-xs text-slate-500 text-center py-4">Select a Jablix</p>
                                )}
                            </div>

                            <Button
                                disabled={hasSubmitted || selectedMoves.length === 0}
                                onClick={handleSubmitTurn}
                                className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-6"
                            >
                                {hasSubmitted ? 'WAITING...' : 'END TURN'}
                            </Button>
                            {!isConnected && (
                                <p className="text-[10px] text-center text-red-400 mt-2 font-bold flex items-center justify-center gap-1">
                                    <WifiOff className="w-3 h-3" /> SERVER DISCONNECTED - RECONNECTING...
                                </p>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
