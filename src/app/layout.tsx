import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ResponseLogger } from "@/components/response-logger";
import { cookies } from "next/headers";
import { ReadyNotifier } from "@/components/ready-notifier";
import { Providers } from "./providers";
import FarcasterWrapper from "@/components/FarcasterWrapper";
import NetworkBadge from "@/components/NetworkBadge";

const inter = Inter({ subsets: ["latin"] });

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const requestId = cookieStore.get("x-request-id")?.value;

  return (
    <html lang="en">
      <head>
        {requestId && <meta name="x-request-id" content={requestId} />}
      </head>
      <body
        className={`${inter.className} antialiased`}
      >
        {/* Do not remove this component, we use it to notify the parent that the mini-app is ready */}
        <ReadyNotifier />
        <Providers>
          <FarcasterWrapper>
            {/* Network Badge - Fixed position */}
            <div className="fixed top-4 left-4 z-50">
              <NetworkBadge size="small" />
            </div>
            {children}
          </FarcasterWrapper>
        </Providers>
        <ResponseLogger />
      </body>
    </html>
  );
}

export const metadata: Metadata = {
  title: "Jablix Arena",
  description: "Battle, Breed, and Trade Jablix NFTs on the Blockchain - A Web3 card battle game on Sui",
  other: {
    "fc:frame": JSON.stringify({ "version": "next", "imageUrl": "https://usdozf7pplhxfvrl.public.blob.vercel-storage.com/thumbnail_bee995f1-fe83-45c6-abaf-4affaca7db63-ZbvE4HeZd57sH46VYhKTkDCu9sdYbJ", "button": { "title": "Open with Ohara", "action": { "type": "launch_frame", "name": "Jablix Arena", "url": "https://box-line-693.app.ohara.ai", "splashImageUrl": "https://usdozf7pplhxfvrl.public.blob.vercel-storage.com/farcaster/splash_images/splash_image1.svg", "splashBackgroundColor": "#ffffff" } } }
    )
  }
};
