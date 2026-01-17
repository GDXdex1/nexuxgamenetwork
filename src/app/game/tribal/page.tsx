'use client'
import { useRouter } from 'next/navigation';

export default function AltriuxTribal() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-gradient-to-br from-emerald-900 via-green-900 to-teal-900 relative overflow-hidden flex items-center justify-center pt-16">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-[600px] h-[600px] bg-emerald-500/30 rounded-full blur-3xl animate-pulse top-20 -left-40" />
        <div className="absolute w-[600px] h-[600px] bg-green-500/30 rounded-full blur-3xl animate-pulse bottom-20 -right-40" style={{ animationDelay: '2s' }} />
        <div className="absolute w-[500px] h-[500px] bg-teal-500/20 rounded-full blur-3xl animate-pulse top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" style={{ animationDelay: '4s' }} />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center p-8 text-center">
        {/* Logo/Icon */}
        <div className="mb-8 bg-gradient-to-br from-emerald-500 to-green-600 p-12 rounded-full shadow-2xl border-4 border-emerald-400">
          <span className="text-9xl">🌿</span>
        </div>

        {/* Title */}
        <h1 className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-green-300 to-teal-300 drop-shadow-2xl mb-8"
          style={{
            textShadow: '0 0 80px rgba(16, 185, 129, 0.8), 0 0 120px rgba(16, 185, 129, 0.4)',
            letterSpacing: '0.05em'
          }}>
          ALTRIUX TRIBAL
        </h1>

        {/* Coming Soon */}
        <div className="mb-12 p-8 bg-emerald-900/50 backdrop-blur-lg rounded-3xl border-2 border-emerald-400/30 shadow-2xl">
          <p className="text-4xl md:text-5xl font-black text-emerald-100 mb-4">
            COMING SOON
          </p>
          <p className="text-xl md:text-2xl text-emerald-200 font-semibold max-w-2xl">
            An epic tribal adventure awaits you in the Drariux ecosystem
          </p>
        </div>

        {/* Back Button */}
        <button
          onClick={() => router.push('/game')}
          className="group relative bg-gradient-to-r from-emerald-600 via-green-600 to-emerald-600 hover:from-emerald-500 hover:via-green-500 hover:to-emerald-500
                   text-white font-black py-6 px-12 rounded-2xl text-xl
                   transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-emerald-500/60
                   border-4 border-emerald-400 overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
          
          <span className="flex items-center justify-center gap-3 relative z-10">
            <span className="text-2xl">←</span>
            <span>BACK TO DRARIUX GAME</span>
          </span>
        </button>
      </div>
    </main>
  );
}
