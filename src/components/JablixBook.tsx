'use client'

import { useState } from 'react';
import { ELEMENTAL_JABLIX_DATABASE, type ElementalJablixData } from '@/data/elementalJablixDatabase';
import { SPECIAL_JABLIX_DATABASE, type SpecialJablixData } from '@/data/specialJablixDatabase';
import { Element } from '@/types/game.types';
import {
  Book,
  ArrowLeft,
  Zap,
  Shield,
  Sword,
  Target,
  Search,
  Filter,
  Sparkles,
  Dna,
  Activity,
  Layers,
  ChevronRight,
  Info,
  Flame,
  Waves,
  Leaf as Plant,
  Snowflake as Ice,
  Zap as Electric,
  Mountain as Earth,
  Wind,
  Ghost as Dark,
  Milestone as Cosmic,
  Star as Exrix
} from 'lucide-react';

interface JablixBookProps {
  onBackToMain: () => void;
}

type BookSection = 'elementals' | 'specials' | 'cards';

const ELEMENT_ICONS: Record<string, any> = {
  [Element.FIRE]: Flame,
  [Element.WATER]: Waves,
  [Element.PLANT]: Plant,
  [Element.ICE]: Ice,
  [Element.ELECTRIC]: Electric,
  [Element.EARTH]: Earth,
  [Element.WIND]: Wind,
  [Element.DRAGON]: Sparkles,
  [Element.DARK]: Dark,
  [Element.COSMIC]: Cosmic,
  [Element.EXRIX]: Exrix
};

const ELEMENT_NAMES: Record<Element, string> = {
  [Element.FIRE]: 'Fire',
  [Element.WATER]: 'Water',
  [Element.PLANT]: 'Plant',
  [Element.ICE]: 'Ice',
  [Element.ELECTRIC]: 'Electric',
  [Element.EARTH]: 'Earth',
  [Element.WIND]: 'Wind',
  [Element.DRAGON]: 'Dragon',
  [Element.DARK]: 'Dark',
  [Element.COSMIC]: 'Cosmic',
  [Element.EXRIX]: 'Exrix'
};

export default function JablixBook({ onBackToMain }: JablixBookProps) {
  const [section, setSection] = useState<BookSection>('elementals');
  const [selectedElement, setSelectedElement] = useState<Element | null>(null);

  // Get all elementals grouped by phase
  const elementalsByPhase = Object.values(ELEMENTAL_JABLIX_DATABASE).reduce((acc: Record<number, ElementalJablixData[]>, jablix: ElementalJablixData) => {
    if (!acc[jablix.phase]) {
      acc[jablix.phase] = [];
    }
    acc[jablix.phase].push(jablix);
    return acc;
  }, {});

  // Get all specials grouped by tier
  const specialsByTier = Object.values(SPECIAL_JABLIX_DATABASE).reduce((acc: Record<string, SpecialJablixData[]>, jablix: SpecialJablixData) => {
    if (!acc[jablix.tier]) {
      acc[jablix.tier] = [];
    }
    acc[jablix.tier].push(jablix);
    return acc;
  }, {});

  // Filter elementals by selected element
  const filteredElementals = selectedElement
    ? Object.values(ELEMENTAL_JABLIX_DATABASE).filter((j: ElementalJablixData) => j.elements.includes(selectedElement))
    : Object.values(ELEMENTAL_JABLIX_DATABASE);

  // Get unique elements from elementals
  const allElements = Array.from(
    new Set(
      Object.values(ELEMENTAL_JABLIX_DATABASE).flatMap((j: ElementalJablixData) => j.elements)
    )
  ).filter((e: Element) => e !== Element.DRAGON && e !== Element.COSMIC && e !== Element.EXRIX);

  return (
    <div className="min-h-screen bg-[#010101] text-white p-4 md:p-8 relative overflow-hidden font-sans">
      {/* Tech Grid Background */}
      <div className="absolute inset-0 tech-bg-grid opacity-20 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-primary/5 pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">

        {/* Navigation HUD */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6 border-b border-primary/20 pb-8">
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
                <span className="text-[10px] font-black tracking-[0.3em] text-primary/60 uppercase">Unit_Encyclopedia</span>
              </div>
              <h1 className="text-3xl md:text-5xl font-black italic tracking-tighter uppercase font-heading">
                JABLIX <span className="text-primary neon-text-orange">BOOK</span>
              </h1>
            </div>
          </div>

          {/* Tactical Search */}
          <div className="relative w-full lg:w-96 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-primary transition-colors" />
            <input
              type="text"
              placeholder="SCAN_DATA_STREAM..."
              className="w-full bg-black border border-white/10 px-12 py-3 rounded text-xs font-mono uppercase tracking-widest focus:outline-none focus:border-primary transition-all placeholder:text-white/10"
            />
          </div>
        </div>

        {/* Section HUD Selector */}
        <div className="flex flex-wrap gap-4 mb-12 justify-center lg:justify-start">
          {[
            { id: 'elementals', label: 'Core_Units', icon: Zap },
            { id: 'specials', label: 'Elite_Protocols', icon: Dna },
            { id: 'cards', label: 'Tactical_Manual', icon: Layers }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSection(tab.id as BookSection)}
              className={`px-8 py-4 font-black uppercase text-[11px] tracking-widest transition-all rounded flex items-center gap-3 ${section === tab.id
                ? 'bg-primary text-black shadow-[0_0_30px_rgba(255,107,0,0.3)]'
                : 'bg-white/5 text-white/40 border border-white/10 hover:border-primary/50'
                }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* ELEMENTALS SECTION HUD */}
        {section === 'elementals' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Element Grid Filter */}
            <div className="mb-12">
              <div className="flex items-center gap-2 mb-6">
                <Filter className="w-4 h-4 text-primary" />
                <h3 className="text-xs font-black text-white/40 uppercase tracking-widest">Spectral_Filter</h3>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3">
                <button
                  onClick={() => setSelectedElement(null)}
                  className={`px-4 py-3 rounded border font-black uppercase text-[9px] tracking-widest transition-all ${selectedElement === null
                    ? 'bg-primary border-primary text-black'
                    : 'bg-white/5 border-white/10 text-white/40 hover:border-primary/40'
                    }`}
                >
                  All_Signals
                </button>
                {allElements.map((element: Element) => {
                  const Icon = ELEMENT_ICONS[element] || Zap;
                  return (
                    <button
                      key={element}
                      onClick={() => setSelectedElement(element)}
                      className={`px-4 py-2 rounded border font-black uppercase text-[9px] tracking-widest transition-all flex items-center justify-center gap-2 ${selectedElement === element
                        ? 'bg-primary border-primary text-black'
                        : 'bg-white/5 border-white/10 text-white/40 hover:border-primary/40'
                        }`}
                    >
                      <Icon className="w-3 h-3" />
                      {ELEMENT_NAMES[element]}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Units Display Grid */}
            {[1, 2, 3].map((phase: number) => {
              const jablixes = filteredElementals.filter((j: ElementalJablixData) => j.phase === phase);
              if (jablixes.length === 0) return null;

              return (
                <div key={phase} className="mb-16">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-8 h-[2px] bg-primary/20" />
                    <h2 className="text-2xl font-black italic tracking-tighter text-white uppercase font-heading">
                      PHASE <span className="text-primary">0{phase}</span> <span className="text-xs opacity-20 ml-2">[{jablixes.length}_UNITS]</span>
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
                    {jablixes.map((jablix: ElementalJablixData) => (
                      <div
                        key={jablix.id}
                        className="group relative bg-black border border-white/10 rounded-tr-3xl overflow-hidden hover:border-primary transition-all duration-300 shadow-2xl"
                      >
                        {/* Mintable HUD Badge */}
                        {jablix.mintable && (
                          <div className="absolute top-3 left-3 z-10">
                            <span className="bg-primary/20 border border-primary/40 px-2 py-0.5 rounded text-[8px] font-black text-primary uppercase tracking-[0.2em] animate-pulse">
                              MINTABLE
                            </span>
                          </div>
                        )}

                        <div className="aspect-video relative bg-white/5 overflow-hidden">
                          <img
                            src={jablix.imageUrl}
                            alt={jablix.name}
                            className="w-full h-full object-contain p-4 group-hover:scale-110 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
                        </div>

                        <div className="p-6">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h3 className="text-sm font-black text-white uppercase group-hover:text-primary transition-colors">{jablix.name}</h3>
                              <p className="text-[10px] font-mono text-white/30 truncate max-w-[120px]">UNIT_0X{String(jablix.id).slice(0, 6)}</p>
                            </div>
                            <div className="flex gap-1">
                              {jablix.elements.map((element: Element, idx: number) => {
                                const Icon = ELEMENT_ICONS[element] || Zap;
                                return <Icon key={idx} className="w-3 h-3 text-primary/60" />;
                              })}
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-3">
                              <div className="flex justify-between text-[10px] uppercase font-black">
                                <span className="text-white/20">HP</span>
                                <span className="text-white/60">{jablix.hp}</span>
                              </div>
                              <div className="flex justify-between text-[10px] uppercase font-black">
                                <span className="text-white/20">ATK</span>
                                <span className="text-white/60">{jablix.attack}</span>
                              </div>
                            </div>
                            <div className="space-y-3">
                              <div className="flex justify-between text-[10px] uppercase font-black">
                                <span className="text-white/20">DEF</span>
                                <span className="text-white/60">{jablix.defense}</span>
                              </div>
                              <div className="flex justify-between text-[10px] uppercase font-black">
                                <span className="text-white/20">SPD</span>
                                <span className="text-white/60">{jablix.speed}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/20 to-transparent group-hover:via-primary transition-all" />
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* SPECIALS SECTION HUD */}
        {section === 'specials' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {Object.entries(specialsByTier).map(([tier, jablixes]) => {
              const tierTitles: Record<string, string> = {
                exrix: 'EXRIX_PROTOCOL',
                dragon: 'ANCIENT_DRAGONS',
                minidragon: 'TACTICAL_DRAKES',
                cosmic: 'VOID_SIGNATURES'
              };

              return (
                <div key={tier} className="mb-16">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-8 h-[2px] bg-primary/20" />
                    <h2 className="text-2xl font-black italic tracking-tighter text-white uppercase font-heading">
                      {tierTitles[tier] || tier.toUpperCase()} <span className="text-xs opacity-20 ml-2">[{jablixes.length}_UNITS]</span>
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
                    {jablixes.map((jablix: SpecialJablixData) => (
                      <div
                        key={jablix.id}
                        className="group relative bg-black border border-white/10 rounded-tr-3xl overflow-hidden hover:border-primary transition-all duration-300 shadow-2xl"
                      >
                        <div className="aspect-video relative bg-white/5 overflow-hidden">
                          <img
                            src={jablix.imageUrl}
                            alt={jablix.name}
                            className="w-full h-full object-contain p-4 group-hover:scale-110 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
                        </div>

                        <div className="p-6">
                          <h3 className="text-sm font-black text-white uppercase group-hover:text-primary transition-colors text-center">{jablix.name}</h3>
                          <div className="flex justify-center gap-4 mt-6">
                            <div className="text-center">
                              <p className="text-[8px] font-black text-white/20 uppercase mb-1">Combat</p>
                              <Sword className="w-4 h-4 text-orange-500 mx-auto" />
                            </div>
                            <div className="text-center">
                              <p className="text-[8px] font-black text-white/20 uppercase mb-1">Defense</p>
                              <Shield className="w-4 h-4 text-blue-500 mx-auto" />
                            </div>
                            <div className="text-center">
                              <p className="text-[8px] font-black text-white/20 uppercase mb-1">Tactical</p>
                              <Target className="w-4 h-4 text-green-500 mx-auto" />
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* CARDS SECTION HUD */}
        {section === 'cards' && (
          <div className="flex flex-col items-center justify-center min-h-[500px] animate-in zoom-in duration-500">
            <div className="bg-black/40 border border-white/10 p-12 lg:p-20 rounded-tr-[5rem] text-center backdrop-blur-3xl shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 -translate-y-32 translate-x-32 rounded-full blur-[80px] pointer-events-none" />

              <div className="w-24 h-24 bg-primary/10 border border-primary/20 rounded-full flex items-center justify-center mx-auto mb-8 animate-pulse">
                <Layers className="w-12 h-12 text-primary" />
              </div>

              <h2 className="text-5xl lg:text-7xl font-black italic tracking-tighter text-white uppercase font-heading mb-4">
                FILE_NOT_<span className="text-primary neon-text-orange">FOUND</span>
              </h2>
              <p className="text-xs lg:text-sm text-white/40 uppercase tracking-[0.4em] mb-12 max-w-[400px] mx-auto leading-loose">
                "Card synchronization protocol currently offline. Data transmission scheduled for next system update."
              </p>

              <div className="flex items-center justify-center gap-4">
                <div className="w-12 h-[1px] bg-white/10" />
                <Info className="w-4 h-4 text-primary/40" />
                <div className="w-12 h-[1px] bg-white/10" />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
