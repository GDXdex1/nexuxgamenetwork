'use client'

import { useState } from 'react';
import { ELEMENTAL_JABLIX_DATABASE, type ElementalJablixData } from '@/data/elementalJablixDatabase';
import { SPECIAL_JABLIX_DATABASE, type SpecialJablixData } from '@/data/specialJablixDatabase';
import { Element } from '@/types/game.types';

interface JablixBookProps {
  onBackToMain: () => void;
}

type BookSection = 'elementals' | 'specials' | 'cards';

const ELEMENT_COLORS: Record<Element, string> = {
  [Element.FIRE]: 'from-red-600 to-orange-600',
  [Element.WATER]: 'from-blue-600 to-cyan-600',
  [Element.PLANT]: 'from-green-600 to-emerald-600',
  [Element.ICE]: 'from-cyan-400 to-blue-400',
  [Element.ELECTRIC]: 'from-yellow-500 to-amber-500',
  [Element.EARTH]: 'from-amber-700 to-yellow-800',
  [Element.WIND]: 'from-gray-300 to-slate-400',
  [Element.DRAGON]: 'from-purple-700 to-indigo-700',
  [Element.DARK]: 'from-purple-900 to-black',
  [Element.COSMIC]: 'from-purple-500 via-pink-500 to-indigo-600',
  [Element.EXRIX]: 'from-teal-500 to-cyan-600'
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
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-800 to-orange-700 relative overflow-hidden">
      {/* Banner */}
      <div className="relative z-10 w-full">
        <img 
          src="https://usdozf7pplhxfvrl.public.blob.vercel-storage.com/c9d28bce-7d46-4c68-8539-2aaee62ad5ea-Ow2qSjGfVst6WRdBOwPkLkOriA7SwL" 
          alt="Jablix Book"
          className="w-full h-56 md:h-72 lg:h-96 object-cover border-b-4 border-pink-500 shadow-2xl"
        />
        {/* Back Button */}
        <button
          onClick={onBackToMain}
          className="absolute top-4 right-4 bg-gradient-to-r from-pink-600 to-orange-600 hover:from-pink-500 hover:to-orange-500
                   text-white font-bold py-3 px-8 rounded-xl text-lg
                   transition-all duration-300 transform hover:scale-105 shadow-2xl
                   border-2 border-white/30"
        >
          ← Back
        </button>
      </div>

      {/* Content Container */}
      <div className="relative z-10 p-6 max-w-7xl mx-auto">
        {/* Section Tabs */}
        <div className="flex gap-4 mb-8 justify-center flex-wrap">
          <button
            onClick={() => setSection('elementals')}
            className={`px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 border-2 ${
              section === 'elementals'
                ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white border-white/50 shadow-2xl'
                : 'bg-purple-900/50 text-purple-200 border-purple-500/30 hover:bg-purple-800/50'
            }`}
          >
            ⚡ ELEMENTALS
          </button>
          <button
            onClick={() => setSection('specials')}
            className={`px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 border-2 ${
              section === 'specials'
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white border-white/50 shadow-2xl'
                : 'bg-purple-900/50 text-purple-200 border-purple-500/30 hover:bg-purple-800/50'
            }`}
          >
            🐉 SPECIALS
          </button>
          <button
            onClick={() => setSection('cards')}
            className={`px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 border-2 ${
              section === 'cards'
                ? 'bg-gradient-to-r from-yellow-600 to-orange-600 text-white border-white/50 shadow-2xl'
                : 'bg-purple-900/50 text-purple-200 border-purple-500/30 hover:bg-purple-800/50'
            }`}
          >
            🃏 CARDS
          </button>
        </div>

        {/* ELEMENTALS SECTION */}
        {section === 'elementals' && (
          <div>
            {/* Element Filter */}
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-pink-200 mb-4">Filter by Element:</h3>
              <div className="flex gap-3 flex-wrap">
                <button
                  onClick={() => setSelectedElement(null)}
                  className={`px-6 py-3 rounded-lg font-bold transition-all duration-300 transform hover:scale-105 ${
                    selectedElement === null
                      ? 'bg-gradient-to-r from-pink-500 to-orange-500 text-white shadow-xl'
                      : 'bg-purple-900/60 text-purple-200 hover:bg-purple-800/60'
                  }`}
                >
                  All Elements
                </button>
                {allElements.map((element: Element) => (
                  <button
                    key={element}
                    onClick={() => setSelectedElement(element)}
                    className={`px-6 py-3 rounded-lg font-bold transition-all duration-300 transform hover:scale-105 ${
                      selectedElement === element
                        ? `bg-gradient-to-r ${ELEMENT_COLORS[element]} text-white shadow-xl`
                        : 'bg-purple-900/60 text-purple-200 hover:bg-purple-800/60'
                    }`}
                  >
                    {ELEMENT_NAMES[element]}
                  </button>
                ))}
              </div>
            </div>

            {/* Elementals by Phase */}
            {[1, 2, 3].map((phase: number) => {
              const jablixes = filteredElementals.filter((j: ElementalJablixData) => j.phase === phase);
              if (jablixes.length === 0) return null;

              return (
                <div key={phase} className="mb-12">
                  <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-300 to-orange-300 mb-6">
                    Phase {phase} Elementals ({jablixes.length})
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {jablixes.map((jablix: ElementalJablixData) => (
                      <div
                        key={jablix.id}
                        className="bg-gradient-to-br from-purple-900/80 to-pink-900/80 backdrop-blur-lg rounded-xl p-4 border-2 border-pink-500/30 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
                      >
                        <img
                          src={jablix.imageUrl}
                          alt={jablix.name}
                          className="w-full h-32 object-cover rounded-lg mb-3"
                        />
                        <h3 className="text-lg font-bold text-pink-200 mb-2">{jablix.name}</h3>
                        <div className="flex gap-1 flex-wrap mb-2">
                          {jablix.elements.map((element: Element, idx: number) => (
                            <span
                              key={idx}
                              className={`px-2 py-1 rounded text-xs font-bold text-white bg-gradient-to-r ${ELEMENT_COLORS[element]}`}
                            >
                              {ELEMENT_NAMES[element]}
                            </span>
                          ))}
                        </div>
                        <div className="text-xs text-orange-200 space-y-1">
                          <div className="flex justify-between">
                            <span>HP:</span>
                            <span className="font-bold">{jablix.hp}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>ATK:</span>
                            <span className="font-bold">{jablix.attack}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>DEF:</span>
                            <span className="font-bold">{jablix.defense}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>SPD:</span>
                            <span className="font-bold">{jablix.speed}</span>
                          </div>
                        </div>
                        {jablix.mintable && (
                          <div className="mt-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs font-bold py-1 px-2 rounded text-center">
                            MINTABLE
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* SPECIALS SECTION */}
        {section === 'specials' && (
          <div>
            {/* Exrix */}
            {specialsByTier['exrix'] && (
              <div className="mb-12">
                <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-teal-300 mb-6">
                  🌟 Exrix ({specialsByTier['exrix'].length})
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                  {specialsByTier['exrix'].map((jablix: SpecialJablixData) => (
                    <div
                      key={jablix.id}
                      className="bg-gradient-to-br from-purple-900/80 to-pink-900/80 backdrop-blur-lg rounded-xl p-4 border-2 border-cyan-500/30 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
                    >
                      <img
                        src={jablix.imageUrl}
                        alt={jablix.name}
                        className="w-full h-32 object-cover rounded-lg mb-3"
                      />
                      <h3 className="text-lg font-bold text-cyan-200 mb-2">{jablix.name}</h3>
                      <div className="flex gap-1 flex-wrap mb-2">
                        {jablix.elements.map((element: Element, idx: number) => (
                          <span
                            key={idx}
                            className={`px-2 py-1 rounded text-xs font-bold text-white bg-gradient-to-r ${ELEMENT_COLORS[element]}`}
                          >
                            {ELEMENT_NAMES[element]}
                          </span>
                        ))}
                      </div>
                      <div className="text-xs text-orange-200 space-y-1">
                        <div className="flex justify-between">
                          <span>HP:</span>
                          <span className="font-bold">{jablix.hp}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>ATK:</span>
                          <span className="font-bold">{jablix.attack}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>DEF:</span>
                          <span className="font-bold">{jablix.defense}</span>
                        </div>
                      </div>
                      {jablix.mintable && (
                        <div className="mt-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs font-bold py-1 px-2 rounded text-center">
                          MINTABLE
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Dragons */}
            {specialsByTier['dragon'] && (
              <div className="mb-12">
                <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-indigo-300 mb-6">
                  🐉 Dragons ({specialsByTier['dragon'].length})
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                  {specialsByTier['dragon'].map((jablix: SpecialJablixData) => (
                    <div
                      key={jablix.id}
                      className="bg-gradient-to-br from-purple-900/80 to-pink-900/80 backdrop-blur-lg rounded-xl p-4 border-2 border-purple-500/30 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
                    >
                      <img
                        src={jablix.imageUrl}
                        alt={jablix.name}
                        className="w-full h-32 object-cover rounded-lg mb-3"
                      />
                      <h3 className="text-lg font-bold text-purple-200 mb-2">{jablix.name}</h3>
                      <div className="flex gap-1 flex-wrap mb-2">
                        {jablix.elements.map((element: Element, idx: number) => (
                          <span
                            key={idx}
                            className={`px-2 py-1 rounded text-xs font-bold text-white bg-gradient-to-r ${ELEMENT_COLORS[element]}`}
                          >
                            {ELEMENT_NAMES[element]}
                          </span>
                        ))}
                      </div>
                      <div className="text-xs text-orange-200 space-y-1">
                        <div className="flex justify-between">
                          <span>HP:</span>
                          <span className="font-bold">{jablix.hp}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>ATK:</span>
                          <span className="font-bold">{jablix.attack}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>DEF:</span>
                          <span className="font-bold">{jablix.defense}</span>
                        </div>
                      </div>
                      {jablix.mintable && (
                        <div className="mt-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs font-bold py-1 px-2 rounded text-center">
                          MINTABLE
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Minidragons */}
            {specialsByTier['minidragon'] && (
              <div className="mb-12">
                <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-cyan-300 mb-6">
                  🦎 Minidragons ({specialsByTier['minidragon'].length})
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                  {specialsByTier['minidragon'].map((jablix: SpecialJablixData) => (
                    <div
                      key={jablix.id}
                      className="bg-gradient-to-br from-purple-900/80 to-pink-900/80 backdrop-blur-lg rounded-xl p-4 border-2 border-blue-500/30 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
                    >
                      <img
                        src={jablix.imageUrl}
                        alt={jablix.name}
                        className="w-full h-32 object-cover rounded-lg mb-3"
                      />
                      <h3 className="text-lg font-bold text-blue-200 mb-2">{jablix.name}</h3>
                      <div className="flex gap-1 flex-wrap mb-2">
                        {jablix.elements.map((element: Element, idx: number) => (
                          <span
                            key={idx}
                            className={`px-2 py-1 rounded text-xs font-bold text-white bg-gradient-to-r ${ELEMENT_COLORS[element]}`}
                          >
                            {ELEMENT_NAMES[element]}
                          </span>
                        ))}
                      </div>
                      <div className="text-xs text-orange-200 space-y-1">
                        <div className="flex justify-between">
                          <span>HP:</span>
                          <span className="font-bold">{jablix.hp}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>ATK:</span>
                          <span className="font-bold">{jablix.attack}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>DEF:</span>
                          <span className="font-bold">{jablix.defense}</span>
                        </div>
                      </div>
                      {jablix.mintable && (
                        <div className="mt-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs font-bold py-1 px-2 rounded text-center">
                          MINTABLE
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Cosmic */}
            {specialsByTier['cosmic'] && (
              <div className="mb-12">
                <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-300 mb-6">
                  🌌 Cosmic ({specialsByTier['cosmic'].length})
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                  {specialsByTier['cosmic'].map((jablix: SpecialJablixData) => (
                    <div
                      key={jablix.id}
                      className="bg-gradient-to-br from-purple-900/80 to-pink-900/80 backdrop-blur-lg rounded-xl p-4 border-2 border-pink-500/30 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
                    >
                      <img
                        src={jablix.imageUrl}
                        alt={jablix.name}
                        className="w-full h-32 object-cover rounded-lg mb-3"
                      />
                      <h3 className="text-lg font-bold text-pink-200 mb-2">{jablix.name}</h3>
                      <div className="flex gap-1 flex-wrap mb-2">
                        {jablix.elements.map((element: Element, idx: number) => (
                          <span
                            key={idx}
                            className={`px-2 py-1 rounded text-xs font-bold text-white bg-gradient-to-r ${ELEMENT_COLORS[element]}`}
                          >
                            {ELEMENT_NAMES[element]}
                          </span>
                        ))}
                      </div>
                      <div className="text-xs text-orange-200 space-y-1">
                        <div className="flex justify-between">
                          <span>HP:</span>
                          <span className="font-bold">{jablix.hp}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>ATK:</span>
                          <span className="font-bold">{jablix.attack}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>DEF:</span>
                          <span className="font-bold">{jablix.defense}</span>
                        </div>
                      </div>
                      {jablix.mintable && (
                        <div className="mt-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs font-bold py-1 px-2 rounded text-center">
                          MINTABLE
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* CARDS SECTION */}
        {section === 'cards' && (
          <div className="flex items-center justify-center min-h-[500px]">
            <div className="bg-gradient-to-br from-purple-900/80 to-pink-900/80 backdrop-blur-lg rounded-3xl p-16 border-4 border-yellow-500/50 shadow-2xl text-center">
              <div className="text-9xl mb-8">🃏</div>
              <h2 className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-300 mb-4">
                COMING SOON
              </h2>
              <p className="text-2xl text-pink-200 font-bold">
                Card Database is under construction
              </p>
              <p className="text-lg text-orange-200 mt-4">
                Discover all battle cards, their effects, and strategies
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
