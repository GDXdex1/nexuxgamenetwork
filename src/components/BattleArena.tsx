'use client';

import { useState, useEffect } from 'react';
import { useCurrentAccount } from '@mysten/dapp-kit';
import { useBattleSocket } from '@/hooks/useBattleSocket';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Zap, Sword, MessageSquare, Timer, User, Check, WifiOff, X, CheckCircle2, ChevronRight } from 'lucide-react';
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
        <div className="min-h-screen bg-[#010101] text-white p-2 sm:p-4 flex flex-col font-sans relative overflow-hidden">
            {/* Background Tech Decor */}
            <div className="absolute inset-0 tech-bg-grid opacity-20 pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#FF6B00]/5 pointer-events-none" />

            {/* Top HUD - Slanted Header */}
            <div className="relative z-10 flex justify-between items-start mb-4 sm:mb-8">
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-3">
                        <div className="w-1.5 h-6 bg-primary shadow-[0_0_8px_var(--primary)]" />
                        <h2 className="text-xl sm:text-3xl font-black italic tracking-tighter text-white uppercase font-heading">
                            Jablix <span className="text-primary neon-text-orange">Arena</span>
                        </h2>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                        <Badge variant="outline" className="text-[10px] uppercase tracking-widest border-primary/30 text-primary bg-primary/5">
                            Phase {currentTurn}
                        </Badge>
                        <Badge variant="outline" className="text-[10px] uppercase tracking-widest border-white/20 text-white/60 bg-white/5">
                            {mode}
                        </Badge>
                    </div>
                </div>

                <div className="flex flex-col items-end gap-2">
                    <div className="relative group">
                        <div className="absolute -inset-1 bg-primary/20 blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                        <div className="relative px-6 py-2 bg-black border border-primary/30 rounded-full flex items-center gap-3">
                            <Timer className={`w-4 h-4 ${timeRemaining <= 5 ? 'text-red-500 animate-pulse' : 'text-primary'}`} />
                            <span className={`text-xl font-mono font-black ${timeRemaining <= 5 ? 'text-red-500' : 'text-white'}`}>
                                {timeRemaining.toString().padStart(2, '0')}s
                            </span>
                        </div>
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onBackToMain}
                        className="text-[10px] uppercase tracking-widest text-white/40 hover:text-red-400 transition-colors"
                    >
                        [ ABORT_MISSION ]
                    </Button>
                </div>
            </div>

            {/* Main Stage */}
            <div className="flex-1 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">

                {/* Side Info (Desktop Only) */}
                <div className="hidden lg:flex lg:col-span-3 flex-col gap-4 self-stretch">
                    <Card className="flex-1 bg-black/40 border-primary/20 backdrop-blur-md overflow-hidden flex flex-col">
                        <div className="p-3 border-b border-primary/20 bg-primary/5 flex items-center justify-between">
                            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/80">Comm_Link_Logs</h3>
                            <MessageSquare className="w-3 h-3 text-primary/60" />
                        </div>
                        <ScrollArea className="flex-1 p-3">
                            <div className="space-y-3">
                                {battleLogs.map((log, i) => (
                                    <div key={i} className="text-[10px] font-mono leading-relaxed group">
                                        <span className="text-primary/40 mr-2">[{i.toString().padStart(2, '0')}]</span>
                                        <span className="text-white/70 group-last:text-primary transition-colors">{log}</span>
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>
                    </Card>

                    <Card className="bg-black/40 border-primary/20 p-4 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-3xl -mr-12 -mt-12" />
                        <div className="flex items-center justify-between relative z-10">
                            <div className="text-center">
                                <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center mb-1">
                                    <User className="w-5 h-5 text-primary" />
                                </div>
                                <p className="text-[8px] font-black text-primary/60 uppercase">Commander</p>
                            </div>
                            <div className="flex flex-col items-center">
                                <span className="text-xl font-black italic text-white/20">VS</span>
                            </div>
                            <div className="text-center">
                                <div className="w-10 h-10 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-1">
                                    <Zap className="w-5 h-5 text-red-500" />
                                </div>
                                <p className="text-[8px] font-black text-red-500/60 uppercase">{mode === 'ai' ? 'CORE_AI' : 'ENEMY'}</p>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Battlefield Canvas */}
                <div className="lg:col-span-6 flex flex-col justify-around h-full min-h-[450px] relative">

                    {/* Enemy Frontline */}
                    <div className="flex justify-center gap-4 sm:gap-12 relative">
                        {enemyTeam?.map((jablix, idx) => (
                            <div key={idx} className={`relative flex flex-col items-center group ${!jablix.is_alive ? 'opacity-20 grayscale' : ''}`}>
                                {/* Nameplate */}
                                <div className="absolute -top-12 px-3 py-1 bg-red-500/10 border border-red-500/30 rounded skew-x-[-12deg] flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                    <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                                    <span className="text-[10px] font-black text-white italic uppercase">{jablix.name}</span>
                                </div>

                                {/* Avatar Frame */}
                                <div className="w-24 h-24 sm:w-32 sm:h-32 relative">
                                    <div className="absolute inset-0 bg-red-500/5 rounded-full blur-2xl animate-pulse-glow" />
                                    <img
                                        src={`https://api.dicebear.com/7.x/identicon/svg?seed=${jablix.jablixId}`}
                                        alt={jablix.name}
                                        className="w-full h-full object-contain relative z-10 jablix-idle"
                                        style={{ animationDelay: `${idx * 0.5}s` }}
                                    />
                                </div>

                                {/* Vital Gauges */}
                                <div className="w-20 sm:w-28 mt-4 space-y-1">
                                    <div className="h-1.5 w-full bg-red-950/50 rounded-full border border-red-500/20 overflow-hidden relative">
                                        <div
                                            className="h-full bg-gradient-to-r from-red-600 to-red-400 hp-bar-transition"
                                            style={{ width: `${(jablix.hp / (jablix.max_hp || jablix.maxHp || 100)) * 100}%` }}
                                        />
                                    </div>
                                    <div className="flex justify-between items-center text-[9px] font-mono font-black text-red-500/80">
                                        <span>HP_SYNC</span>
                                        <span>{jablix.hp}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Central Arena FX (Optional placeholder) */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/20 to-transparent flex items-center justify-center opacity-40">
                        <div className="w-16 h-16 border-2 border-primary/20 rounded-full animate-ping" />
                    </div>

                    {/* Ally Frontline */}
                    <div className="flex justify-center gap-4 sm:gap-12 relative">
                        {myTeam?.map((jablix, idx) => (
                            <div
                                key={idx}
                                onClick={() => setSelectedJablixIdx(idx)}
                                className={`relative flex flex-col items-center group cursor-pointer transition-all duration-300 ${selectedJablixIdx === idx ? 'scale-110 drop-shadow-[0_0_25px_rgba(255,107,0,0.3)]' : 'opacity-70 grayscale-[0.5]'
                                    } ${!jablix.is_alive ? 'opacity-20 pointer-events-none' : ''}`}
                            >
                                {/* Selection Indicator */}
                                {selectedJablixIdx === idx && (
                                    <div className="absolute -inset-4 border-2 border-primary/50 border-t-transparent border-b-transparent rounded-full animate-spin [animation-duration:4s]" />
                                )}

                                {/* Nameplate */}
                                <div className={`absolute -top-12 px-3 py-1 bg-primary/10 border border-primary/30 rounded skew-x-[-12deg] flex items-center gap-2 transition-all ${selectedJablixIdx === idx ? 'opacity-100 -translate-y-1' : 'opacity-0'
                                    } whitespace-nowrap`}>
                                    <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                                    <span className="text-[10px] font-black text-white italic uppercase">{jablix.name}</span>
                                </div>

                                {/* Avatar Frame */}
                                <div className="w-24 h-24 sm:w-32 sm:h-32 relative">
                                    <div className={`absolute inset-0 bg-primary/5 rounded-full blur-2xl ${selectedJablixIdx === idx ? 'animate-pulse-glow opacity-100' : 'opacity-0'}`} />
                                    <img
                                        src={`https://api.dicebear.com/7.x/identicon/svg?seed=${jablix.jablixId}`}
                                        alt={jablix.name}
                                        className={`w-full h-full object-contain relative z-10 jablix-idle`}
                                        style={{ animationDelay: `${idx * 0.3}s` }}
                                    />
                                    {selectedJablixIdx === idx && (
                                        <div className="absolute -bottom-2 right-1/2 translate-x-1/2 bg-primary text-black font-black text-[9px] px-2 rounded tracking-tighter shadow-lg z-20">
                                            ACTIVE
                                        </div>
                                    )}
                                </div>

                                {/* Vital Gauges */}
                                <div className="w-20 sm:w-28 mt-4 space-y-1.5">
                                    {/* HP Bar */}
                                    <div className="h-2 w-full bg-slate-900 rounded-sm border border-white/5 overflow-hidden relative">
                                        <div
                                            className="h-full bg-gradient-to-r from-[#FF6B00] to-[#FF8C00] hp-bar-transition shadow-[0_0_10px_rgba(255,107,0,0.5)]"
                                            style={{ width: `${(jablix.hp / (jablix.max_hp || jablix.maxHp || 100)) * 100}%` }}
                                        />
                                    </div>
                                    {/* Energy Bar */}
                                    <div className="h-1 w-full bg-slate-900 rounded-sm overflow-hidden relative">
                                        <div
                                            className="h-full bg-blue-500 transition-all duration-300"
                                            style={{ width: `${(jablix.energy / (jablix.max_energy || 100)) * 100}%` }}
                                        />
                                    </div>
                                    <div className="flex justify-between items-center text-[8px] font-mono font-black">
                                        <span className="text-primary/70">{jablix.hp} HP</span>
                                        <span className="text-blue-400">{jablix.energy} E</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Action Interface (Desktop: Side / Mobile: Bottom) */}
                <div className="lg:col-span-3 flex flex-col h-full lg:self-stretch">
                    <Card className="flex-1 bg-black/40 border-primary/20 backdrop-blur-md overflow-hidden flex flex-col relative">
                        {/* Mobile HUD Tab - Visual Only */}
                        <div className="lg:hidden w-12 h-1 bg-primary/20 rounded-full mx-auto mt-2" />

                        <div className="p-3 border-b border-primary/20 bg-primary/5 flex items-center justify-between">
                            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/80 flex items-center gap-2">
                                <Zap className="w-3 h-3" /> Execute_Subroutine
                            </h3>
                            {myTeam && myTeam[selectedJablixIdx] && (
                                <div className="text-[10px] font-mono text-primary font-bold px-2 py-0.5 bg-primary/10 rounded border border-primary/20">
                                    {myTeam[selectedJablixIdx].energy} E_PWR
                                </div>
                            )}
                        </div>

                        <ScrollArea className="flex-1 p-3">
                            <div className="space-y-3 pb-4">
                                {myTeam && myTeam[selectedJablixIdx] ? (
                                    <>
                                        <p className="text-[8px] font-black text-white/30 uppercase mb-2 tracking-widest pl-1">
                                            {myTeam[selectedJablixIdx].name} // READY_TO_DEPLOY
                                        </p>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2">
                                            {myTeam[selectedJablixIdx].cards?.map((card: any, cardIdx: number) => {
                                                const isSelected = selectedMoves.some(m => m.jablix_idx === selectedJablixIdx && m.card_idx === cardIdx);
                                                const cost = card.energy_cost || card.energyCost || 0;
                                                const isAffordable = myTeam[selectedJablixIdx].energy >= cost;

                                                return (
                                                    <div
                                                        key={cardIdx}
                                                        onClick={() => isAffordable && !hasSubmitted && handleSelectCard(selectedJablixIdx, cardIdx)}
                                                        className={`relative p-3 rounded-tr-xl border group cursor-pointer transition-all duration-200 ${isSelected
                                                            ? 'bg-primary/20 border-primary ring-1 ring-primary/50 translate-x-1'
                                                            : isAffordable && !hasSubmitted
                                                                ? 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-primary/50'
                                                                : 'opacity-40 grayscale cursor-not-allowed border-white/5 bg-transparent'
                                                            }`}
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            <div className={`w-10 h-10 rounded border flex flex-col items-center justify-center transition-colors ${isSelected ? 'bg-primary border-primary text-black' : 'bg-black/40 border-primary/30 text-primary'
                                                                }`}>
                                                                <span className="text-[10px] font-black leading-none">{cost}</span>
                                                                <span className="text-[6px] font-black opacity-60 uppercase">E</span>
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <p className="text-[11px] font-black text-white uppercase tracking-tight truncate">
                                                                    {card.name}
                                                                </p>
                                                                <p className="text-[9px] text-white/50 leading-tight line-clamp-2">
                                                                    {card.effect_text || card.description || 'System Directive'}
                                                                </p>
                                                            </div>
                                                            {isSelected && <div className="w-1.5 h-1.5 bg-primary rounded-full animate-ping" />}
                                                        </div>
                                                        {/* Slanted Accent */}
                                                        <div className="absolute top-0 right-0 w-2 h-2 bg-primary/20 rounded-bl-sm opacity-0 group-hover:opacity-100 transition-opacity" />
                                                    </div>
                                                );
                                            })}
                                        </div>
                                        {(!myTeam[selectedJablixIdx].cards || myTeam[selectedJablixIdx].cards.length === 0) && (
                                            <div className="flex flex-col items-center justify-center py-8 opacity-20">
                                                <WifiOff className="w-8 h-8 mb-2" />
                                                <p className="text-[10px] font-black uppercase">No_Directives_Found</p>
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <div className="flex flex-col items-center justify-center py-12 border border-dashed border-white/10 rounded-lg">
                                        <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] animate-pulse">
                                            Await_Unit_Selection
                                        </p>
                                    </div>
                                )}
                            </div>
                        </ScrollArea>

                        {/* End Turn Section */}
                        <div className="p-3 border-t border-primary/20 bg-primary/2">
                            <Button
                                disabled={hasSubmitted || selectedMoves.length === 0}
                                onClick={handleSubmitTurn}
                                className={`w-full py-6 font-black uppercase tracking-[0.3em] text-xs transition-all duration-300 relative overflow-hidden group/btn ${hasSubmitted
                                    ? 'bg-white/10 text-white/40 cursor-wait'
                                    : 'bg-primary hover:bg-white text-black hover:text-primary shadow-[0_0_20px_rgba(255,107,0,0.3)]'
                                    }`}
                            >
                                <span className="relative z-10 flex items-center justify-center gap-2">
                                    {hasSubmitted ? 'Syncing_Actions...' : 'Finalize_Directives'}
                                    {!hasSubmitted && <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />}
                                </span>
                                {/* Tech scanner animation for button */}
                                <div className="absolute inset-0 tech-scan bg-white/20 opacity-0 group-hover/btn:opacity-100" />
                            </Button>

                            {!isConnected && (
                                <div className="mt-3 flex items-center justify-center gap-2 text-[8px] font-black text-red-500 uppercase tracking-widest animate-pulse">
                                    <WifiOff className="w-3 h-3" /> Critical_Network_Instability
                                </div>
                            )}
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
