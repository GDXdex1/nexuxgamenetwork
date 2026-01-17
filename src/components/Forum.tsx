'use client';

interface ForumProps {
  onBackToMain: () => void;
}

export default function Forum({ onBackToMain }: ForumProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-blue-900 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Banner */}
        <div className="mb-6 relative">
          <img
            src="https://usdozf7pplhxfvrl.public.blob.vercel-storage.com/b015f15a-0290-46ff-823f-d6fca356a326-bzbNiJV5sdNAxbHiq08ztQgPW2bfT9"
            alt="Forum Banner"
            className="w-full h-56 md:h-72 lg:h-96 object-cover rounded-3xl border-4 border-indigo-500/50 shadow-2xl"
          />
          <button
            onClick={onBackToMain}
            className="absolute top-4 right-4 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-bold py-2 px-4 md:py-3 md:px-6 rounded-xl transition-all transform hover:scale-105"
          >
            ← Back
          </button>
        </div>

        <div className="max-w-4xl mx-auto bg-gradient-to-br from-indigo-900/80 to-blue-900/80 border-4 border-indigo-500/50 rounded-3xl p-12 shadow-2xl text-center">
          <h1 className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-blue-300 mb-6">
            💬 COMMUNITY FORUM 🌐
          </h1>
        <p className="text-2xl text-indigo-200 mb-8">
          Coming Soon! 🗣️
        </p>
        <p className="text-xl text-indigo-300 mb-12">
          Connect with other players, share strategies, discuss team compositions, and stay updated with the latest Jablix Arena news and events!
        </p>
        
        <div className="grid grid-cols-3 gap-4 mb-12">
          <div className="bg-black/30 rounded-2xl p-4 border-2 border-indigo-500/30">
            <p className="text-3xl mb-2">💡</p>
            <p className="text-sm font-bold text-indigo-200">Strategy Guides</p>
          </div>
          <div className="bg-black/30 rounded-2xl p-4 border-2 border-blue-500/30">
            <p className="text-3xl mb-2">🎮</p>
            <p className="text-sm font-bold text-blue-200">Gameplay Tips</p>
          </div>
          <div className="bg-black/30 rounded-2xl p-4 border-2 border-purple-500/30">
            <p className="text-3xl mb-2">🏆</p>
            <p className="text-sm font-bold text-purple-200">Tournaments</p>
          </div>
        </div>

        </div>
      </div>
    </div>
  );
}
