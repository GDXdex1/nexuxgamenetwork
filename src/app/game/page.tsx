'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Sword, Leaf } from 'lucide-react';

export default function DrariuxGamePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-pink-900">
      {/* Banner Superior */}
      <div className="relative w-full h-48 md:h-64">
        <Image
          src="https://usdozf7pplhxfvrl.public.blob.vercel-storage.com/db2f131b-9008-42b6-b4f8-c7e29f023952-Z1tGz2EWcWHY4suyESSuo6nAgtAy6q"
          alt="Drariux Game"
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Botón de Regreso - Top Right */}
      <div className="absolute top-4 right-4 z-10">
        <Link href="/">
          <button className="flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl hover:bg-white/20 transition-all duration-300 text-white">
            <ArrowLeft className="w-5 h-5" />
            Back to Drariux Network
          </button>
        </Link>
      </div>

      {/* Menú Central */}
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-5xl md:text-6xl font-bold text-center mb-4 bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent">
          Drariux Game
        </h1>
        <p className="text-center text-gray-300 text-lg mb-12">
          Choose Your Adventure
        </p>

        {/* Grid de Juegos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Jablix Arena */}
          <Link href="/game/jablix">
            <div className="group relative bg-gradient-to-br from-orange-600/20 to-pink-600/20 backdrop-blur-lg border border-orange-500/30 rounded-2xl p-12 hover:scale-105 transition-all duration-300 cursor-pointer shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-600/0 to-pink-600/0 group-hover:from-orange-600/10 group-hover:to-pink-600/10 rounded-2xl transition-all duration-300" />
              <div className="relative flex flex-col items-center gap-6">
                <div className="p-6 bg-gradient-to-br from-orange-500 to-pink-500 rounded-2xl">
                  <Sword className="w-16 h-16 text-white" />
                </div>
                <h2 className="text-4xl font-bold text-white">JABLIX ARENA</h2>
                <p className="text-gray-300 text-center text-lg">
                  Battle Card Game on Sui Blockchain
                </p>
                <div className="mt-4 px-6 py-2 bg-green-500/20 border border-green-500/50 rounded-full">
                  <span className="text-green-400 font-semibold">✓ Available Now</span>
                </div>
              </div>
            </div>
          </Link>

          {/* Altriux Tribal */}
          <Link href="/game/tribal">
            <div className="group relative bg-gradient-to-br from-green-600/20 to-emerald-600/20 backdrop-blur-lg border border-green-500/30 rounded-2xl p-12 hover:scale-105 transition-all duration-300 cursor-pointer shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-br from-green-600/0 to-emerald-600/0 group-hover:from-green-600/10 group-hover:to-emerald-600/10 rounded-2xl transition-all duration-300" />
              <div className="relative flex flex-col items-center gap-6">
                <div className="p-6 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl">
                  <Leaf className="w-16 h-16 text-white" />
                </div>
                <h2 className="text-4xl font-bold text-white">ALTRIUX TRIBAL</h2>
                <p className="text-gray-300 text-center text-lg">
                  Tribal Strategy Game
                </p>
                <div className="mt-4 px-6 py-2 bg-yellow-500/20 border border-yellow-500/50 rounded-full">
                  <span className="text-yellow-400 font-semibold">⏳ Coming Soon</span>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
