'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Users, Heart, Rocket } from 'lucide-react';

export default function DrariuxTeamPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-black to-emerald-900">
      {/* Banner Superior */}
      <div className="relative w-full h-48 md:h-64">
        <Image
          src="https://usdozf7pplhxfvrl.public.blob.vercel-storage.com/4e8ac80a-e3c2-48b5-9db0-493fae89e395-FAfdqWTGbcJrvjB13t5obdXlbvNFDC"
          alt="Drariux Team"
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
            <div className="p-8 bg-gradient-to-br from-green-500 to-emerald-500 rounded-3xl shadow-2xl">
              <Users className="w-24 h-24 text-white" />
            </div>
          </div>

          {/* Título */}
          <h1 className="text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 bg-clip-text text-transparent">
            Drariux Team
          </h1>

          {/* Descripción */}
          <p className="text-2xl text-gray-300 mb-8">
            Meet Our Team & Community
          </p>

          {/* Coming Soon Badge */}
          <div className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-green-600/20 to-emerald-600/20 backdrop-blur-lg border border-green-500/30 rounded-2xl mb-12">
            <Rocket className="w-6 h-6 text-green-400" />
            <span className="text-3xl font-bold text-green-400">COMING SOON</span>
          </div>

          {/* Características */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
            <div className="p-6 bg-gradient-to-br from-green-600/10 to-emerald-600/10 backdrop-blur-lg border border-green-500/20 rounded-xl">
              <Users className="w-12 h-12 text-green-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Core Team</h3>
              <p className="text-gray-400">Meet the builders</p>
            </div>

            <div className="p-6 bg-gradient-to-br from-green-600/10 to-emerald-600/10 backdrop-blur-lg border border-green-500/20 rounded-xl">
              <Heart className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Community</h3>
              <p className="text-gray-400">Join our family</p>
            </div>

            <div className="p-6 bg-gradient-to-br from-green-600/10 to-emerald-600/10 backdrop-blur-lg border border-green-500/20 rounded-xl">
              <Rocket className="w-12 h-12 text-teal-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Vision</h3>
              <p className="text-gray-400">Building the future</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
