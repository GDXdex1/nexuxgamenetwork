'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, ArrowLeftRight, TrendingUp, Lock } from 'lucide-react';

export default function DrariuxExchangePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-black to-indigo-900">
      {/* Banner Superior */}
      <div className="relative w-full h-48 md:h-64">
        <Image
          src="https://usdozf7pplhxfvrl.public.blob.vercel-storage.com/a117474b-6e19-4d9a-ab23-ddabaf953655-e24ADEHnIhGTFXT5p6Y8QG0oYFxkSt"
          alt="Drariux Exchange"
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

      {/* Contenido Central */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto text-center">
          {/* Icono Principal */}
          <div className="flex justify-center mb-8">
            <div className="p-8 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-3xl shadow-2xl">
              <ArrowLeftRight className="w-24 h-24 text-white" />
            </div>
          </div>

          {/* Título */}
          <h1 className="text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
            Drariux Exchange
          </h1>

          {/* Descripción */}
          <p className="text-2xl text-gray-300 mb-8">
            Decentralized Trading Platform
          </p>

          {/* Coming Soon Badge */}
          <div className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600/20 to-indigo-600/20 backdrop-blur-lg border border-blue-500/30 rounded-2xl mb-12">
            <Lock className="w-6 h-6 text-blue-400" />
            <span className="text-3xl font-bold text-blue-400">COMING SOON</span>
          </div>

          {/* Características */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
            <div className="p-6 bg-gradient-to-br from-blue-600/10 to-indigo-600/10 backdrop-blur-lg border border-blue-500/20 rounded-xl">
              <TrendingUp className="w-12 h-12 text-blue-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">DEX Trading</h3>
              <p className="text-gray-400">Decentralized token swaps</p>
            </div>

            <div className="p-6 bg-gradient-to-br from-blue-600/10 to-indigo-600/10 backdrop-blur-lg border border-blue-500/20 rounded-xl">
              <ArrowLeftRight className="w-12 h-12 text-indigo-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Low Fees</h3>
              <p className="text-gray-400">Minimal transaction costs</p>
            </div>

            <div className="p-6 bg-gradient-to-br from-blue-600/10 to-indigo-600/10 backdrop-blur-lg border border-blue-500/20 rounded-xl">
              <Lock className="w-12 h-12 text-purple-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Secure</h3>
              <p className="text-gray-400">Non-custodial & safe</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
