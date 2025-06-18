import './globals.css'
import { Inter } from 'next/font/google'
import type { Metadata } from 'next'
import { Providers } from './providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'WJ Car Sales',
  description: 'Find your next car',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen flex flex-col bg-gray-50`}>
          <Providers>{children}</Providers>
      </body>
    </html>
  )
}
