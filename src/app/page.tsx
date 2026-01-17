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
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-blue-900">
      {/* Banner Superior */}
      <div className="relative w-full h-48 md:h-64">
        <Image
          src="https://usdozf7pplhxfvrl.public.blob.vercel-storage.com/c57d50df-5ec5-442f-bd81-d02b08d10aa0-VaHNp7c3H2Qpm0zM8iGtJbbPxkG3s5"
          alt="Drariux Network"
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Menú Central */}
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-5xl md:text-6xl font-bold text-center mb-4 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
          Drariux Network
        </h1>
        <p className="text-center text-gray-300 text-lg mb-12">
          Ecosystem of Decentralized Applications
        </p>

        {/* Grid de Enlaces */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {/* Drariux Game */}
          <Link href="/game">
            <div className="group relative bg-gradient-to-br from-purple-600/20 to-pink-600/20 backdrop-blur-lg border border-purple-500/30 rounded-2xl p-8 hover:scale-105 transition-all duration-300 cursor-pointer shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600/0 to-pink-600/0 group-hover:from-purple-600/10 group-hover:to-pink-600/10 rounded-2xl transition-all duration-300" />
              <div className="relative flex flex-col items-center gap-4">
                <div className="relative w-24 h-24">
                  <Image
                    src="https://usdozf7pplhxfvrl.public.blob.vercel-storage.com/4392146c-f0fa-4932-9abf-bfcbfb609568-VY2oSL3iz14RQnVB3ePISBdBFGhaYF"
                    alt="Drariux Game"
                    fill
                    className="object-contain"
                  />
                </div>
                <h2 className="text-3xl font-bold text-white">Drariux Game</h2>
                <p className="text-gray-300 text-center">Play Jablix Arena & Altriux Tribal</p>
              </div>
            </div>
          </Link>

          {/* Drariux Exchange */}
          <Link href="/exchange">
            <div className="group relative bg-gradient-to-br from-blue-600/20 to-indigo-600/20 backdrop-blur-lg border border-blue-500/30 rounded-2xl p-8 hover:scale-105 transition-all duration-300 cursor-pointer shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/0 to-indigo-600/0 group-hover:from-blue-600/10 group-hover:to-indigo-600/10 rounded-2xl transition-all duration-300" />
              <div className="relative flex flex-col items-center gap-4">
                <div className="relative w-24 h-24">
                  <Image
                    src="https://usdozf7pplhxfvrl.public.blob.vercel-storage.com/02f00258-4d54-4bfd-b02c-447b74625458-L7eLPdqI2YlxkX2VJkthoHIvrgr8fj"
                    alt="Drariux Exchange"
                    fill
                    className="object-contain"
                  />
                </div>
                <h2 className="text-3xl font-bold text-white">Drariux Exchange</h2>
                <p className="text-gray-300 text-center">Decentralized Trading Platform</p>
              </div>
            </div>
          </Link>

          {/* Drariux Wallet */}
          <Link href="/wallet-app">
            <div className="group relative bg-gradient-to-br from-cyan-600/20 to-blue-600/20 backdrop-blur-lg border border-cyan-500/30 rounded-2xl p-8 hover:scale-105 transition-all duration-300 cursor-pointer shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-600/0 to-blue-600/0 group-hover:from-cyan-600/10 group-hover:to-blue-600/10 rounded-2xl transition-all duration-300" />
              <div className="relative flex flex-col items-center gap-4">
                <div className="relative w-24 h-24">
                  <Image
                    src="https://usdozf7pplhxfvrl.public.blob.vercel-storage.com/3fcc4c1a-7ae9-4de3-b6c4-c518ba695a0e-yjUVo7D2dAA9v5Y9TMiTEMUbBHB0zZ"
                    alt="Drariux Wallet"
                    fill
                    className="object-contain"
                  />
                </div>
                <h2 className="text-3xl font-bold text-white">Drariux Wallet</h2>
                <p className="text-gray-300 text-center">Secure Multi-Chain Wallet</p>
              </div>
            </div>
          </Link>

          {/* Drariux Team */}
          <Link href="/team">
            <div className="group relative bg-gradient-to-br from-green-600/20 to-emerald-600/20 backdrop-blur-lg border border-green-500/30 rounded-2xl p-8 hover:scale-105 transition-all duration-300 cursor-pointer shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-br from-green-600/0 to-emerald-600/0 group-hover:from-green-600/10 group-hover:to-emerald-600/10 rounded-2xl transition-all duration-300" />
              <div className="relative flex flex-col items-center gap-4">
                <div className="relative w-24 h-24">
                  <Image
                    src="https://usdozf7pplhxfvrl.public.blob.vercel-storage.com/b67e0e7f-2fbb-4009-baf6-170a4d7679de-lR4ZAl7Krj5s0QtLabaDNiXO37B5mb"
                    alt="Drariux Team"
                    fill
                    className="object-contain"
                  />
                </div>
                <h2 className="text-3xl font-bold text-white">Drariux Team</h2>
                <p className="text-gray-300 text-center">Meet Our Team & Community</p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
