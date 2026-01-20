'use client'
import Image from 'next/image';
import Link from 'next/link';

import { useEffect } from "react";
import { sdk } from "@farcaster/miniapp-sdk";
import { useAddMiniApp } from "@/hooks/useAddMiniApp";
import { useQuickAuth } from "@/hooks/useQuickAuth";
import { useIsInFarcaster } from "@/hooks/useIsInFarcaster";

export default function DrariuxNetworkHome() {
  const { addMiniApp } = useAddMiniApp();
  const isInFarcaster = useIsInFarcaster()
  useQuickAuth(isInFarcaster)
  useEffect(() => {
    const tryAddMiniApp = async () => {
      try {
        await addMiniApp()
      } catch (error) {
        console.error('Failed to add mini app:', error)
      }

    }



    tryAddMiniApp()
  }, [addMiniApp])
  useEffect(() => {
    const initializeFarcaster = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 100))

        if (document.readyState !== 'complete') {
          await new Promise<void>(resolve => {
            if (document.readyState === 'complete') {
              resolve()
            } else {
              window.addEventListener('load', () => resolve(), { once: true })
            }

          })
        }



        await sdk.actions.ready()
        console.log('Farcaster SDK initialized successfully - app fully loaded')
      } catch (error) {
        console.error('Failed to initialize Farcaster SDK:', error)

        setTimeout(async () => {
          try {
            await sdk.actions.ready()
            console.log('Farcaster SDK initialized on retry')
          } catch (retryError) {
            console.error('Farcaster SDK retry failed:', retryError)
          }

        }, 1000)
      }

    }



    initializeFarcaster()
  }, [])
  return (
    <div className="min-h-screen bg-[#010101] text-foreground font-sans relative overflow-hidden">


      {/* Main Content Area */}
      <div className="container mx-auto px-6 py-12 relative z-20">
        <div className="text-center mb-16 space-y-4">
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-white uppercase font-outfit">
            DRARIUX <span className="text-primary italic">NETWORK</span>
          </h1>
          <div className="flex items-center justify-center gap-4">
            <div className="h-[1px] w-12 bg-primary/50" />
            <p className="text-primary font-bold tracking-[0.3em] uppercase text-sm">
              Ecosystem of Decentralized Apps
            </p>
            <div className="h-[1px] w-12 bg-primary/50" />
          </div>
        </div>

        {/* Navigation Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Drariux Game - Primary Focus */}
          <Link href="/game" className="md:col-span-2 group">
            <div className="relative overflow-hidden bg-[#0A0A0A] border border-white/5 rounded-2xl p-8 hover:border-primary/50 transition-all duration-500 shadow-2xl">
              {/* Corner Accents */}
              <div className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-primary/0 group-hover:border-primary/100 transition-all duration-500" />
              <div className="absolute bottom-0 left-0 w-16 h-16 border-b-2 border-l-2 border-primary/0 group-hover:border-primary/100 transition-all duration-500" />

              <div className="flex flex-col md:flex-row items-center gap-8 py-4">
                <div className="relative w-32 h-32 md:w-48 md:h-48 drop-shadow-[0_0_20px_rgba(255,107,0,0.3)]">
                  <Image
                    src="https://usdozf7pplhxfvrl.public.blob.vercel-storage.com/4392146c-f0fa-4932-9abf-bfcbfb609568-VY2oSL3iz14RQnVB3ePISBdBFGhaYF"
                    alt="Drariux Game"
                    fill
                    className="object-contain group-hover:rotate-6 transition-transform duration-500"
                  />
                </div>
                <div className="text-center md:text-left flex-1">
                  <div className="inline-block px-3 py-1 bg-primary/20 border border-primary/50 text-primary text-[10px] font-bold rounded-full mb-3 tracking-widest uppercase">
                    FEATURED APP
                  </div>
                  <h2 className="text-4xl md:text-6xl font-black text-white mb-2 font-outfit">JABLIX ARENA</h2>
                  <p className="text-gray-400 text-lg">Battle, Breed & Trade. The definitive Web3 card game on Sui.</p>
                  <div className="mt-8 flex items-center gap-2 text-primary font-bold group-hover:translate-x-2 transition-transform">
                    ENTER THE ARENA <span className="text-xl">→</span>
                  </div>
                </div>
              </div>
            </div>
          </Link>

          {/* Secondary Apps */}
          <Link href="/exchange" className="group">
            <div className="h-full bg-[#0A0A0A] border border-white/5 rounded-2xl p-6 hover:border-primary/30 transition-all">
              <div className="flex items-center gap-6">
                <div className="relative w-16 h-16 flex-shrink-0">
                  <Image
                    src="https://usdozf7pplhxfvrl.public.blob.vercel-storage.com/02f00258-4d54-4bfd-b02c-447b74625458-L7eLPdqI2YlxkX2VJkthoHIvrgr8fj"
                    alt="Exchange"
                    fill
                    className="object-contain"
                  />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white group-hover:text-primary transition-colors">EXCHANGE</h3>
                  <p className="text-sm text-gray-400">Decentralized Asset Trading</p>
                </div>
              </div>
            </div>
          </Link>

          <Link href="/wallet-app" className="group">
            <div className="h-full bg-[#0A0A0A] border border-white/5 rounded-2xl p-6 hover:border-primary/30 transition-all">
              <div className="flex items-center gap-6">
                <div className="relative w-16 h-16 flex-shrink-0">
                  <Image
                    src="https://usdozf7pplhxfvrl.public.blob.vercel-storage.com/3fcc4c1a-7ae9-4de3-b6c4-c518ba695a0e-yjUVo7D2dAA9v5Y9TMiTEMUbBHB0zZ"
                    alt="Wallet"
                    fill
                    className="object-contain"
                  />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white group-hover:text-primary transition-colors">WALLET</h3>
                  <p className="text-sm text-gray-400">Secure Asset Management</p>
                </div>
              </div>
            </div>
          </Link>

          <Link href="/team" className="group md:col-span-2">
            <div className="bg-[#0A0A0A] border border-white/5 rounded-2xl p-6 hover:border-primary/30 transition-all text-center">
              <span className="text-gray-400 text-sm">Join the Drariux Community & Meet the Team</span>
            </div>
          </Link>
        </div>

        {/* Footer Info */}
        <div className="mt-24 text-center">
          <p className="text-gray-600 text-[10px] tracking-widest uppercase mb-4">DRARIUX NETWORK © 2026 • BUILT ON SUI</p>
          <div className="h-1 w-24 bg-primary/20 mx-auto rounded-full" />
        </div>
      </div>
    </div>
  );
}
