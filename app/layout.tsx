import type { Metadata } from 'next'
import { Geist, Geist_Mono, Orbitron } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'
import { Toaster } from 'sonner'
import { LiveLeaderboardUpdates } from '@/components/leaderboard/LiveLeaderboardUpdates'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

const orbitron = Orbitron({
  variable: '--font-orbitron',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
})

export const metadata: Metadata = {
  title: 'Layer3 Leaderboard',
  description: 'Track top performers in the Layer3 ecosystem',
  icons: {
    icon: '/favicon.ico',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://cryptologos.cc" />
        <link rel="preconnect" href="https://icons.llamao.fi" />
        <link rel="dns-prefetch" href="https://ipfs.io" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${orbitron.variable} antialiased`}
      >
        <Providers>
          {children}
          <LiveLeaderboardUpdates />
        </Providers>
        <Toaster richColors position="top-right" />
      </body>
    </html>
  )
}
