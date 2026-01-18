'use client';

import Link from 'next/link';
import { AlertTriangle, Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
    return (
        <div className="min-h-screen bg-[#010101] flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background Grid */}
            <div className="absolute inset-0 tech-bg-grid opacity-20 pointer-events-none" />
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 blur-[100px] rounded-full pointer-events-none" />

            <div className="relative z-10 max-w-md w-full text-center">
                {/* Slanted HUD Container */}
                <div className="bg-white/5 border border-white/10 backdrop-blur-md p-8 relative overflow-hidden group">
                    {/* Decorative Corners */}
                    <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-primary" />
                    <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-primary" />
                    <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-primary" />
                    <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-primary" />

                    {/* Glitch Effect 404 */}
                    <div className="mb-6 relative">
                        <h1 className="text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-600 animate-pulse tracking-tighter">
                            404
                        </h1>
                        <p className="text-xs font-mono text-primary/60 tracking-[0.5em] mt-2 uppercase">
                            Signal_Lost
                        </p>
                    </div>

                    <div className="flex items-center justify-center gap-2 mb-6">
                        <AlertTriangle className="w-5 h-5 text-red-500 animate-bounce" />
                        <span className="text-red-400 font-mono text-sm uppercase font-bold">
                            Sector_Not_Found
                        </span>
                    </div>

                    <p className="text-white/60 mb-8 text-sm font-light leading-relaxed">
                        The coordinates you are trying to access do not exist in the current Jablix Arena database.
                        Please return to the main lobby.
                    </p>

                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 px-8 py-3 bg-primary hover:bg-primary/90 text-black font-black uppercase text-sm tracking-widest transition-all duration-300 transform hover:scale-105 hover:shadow-[0_0_20px_rgba(255,107,0,0.4)] clip-path-slant"
                    >
                        <Home className="w-4 h-4" />
                        Return_Base
                    </Link>
                </div>

                {/* System Footer */}
                <div className="mt-4 flex justify-between items-center text-[8px] font-mono text-white/20 uppercase">
                    <span>Err_Code: 0x404_VOID</span>
                    <span>Sys_Status: ONLINE</span>
                </div>
            </div>
        </div>
    );
}
