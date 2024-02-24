import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ClerkProvider } from '@clerk/nextjs'
import Providers from '@/components/providers'
import {Toaster} from 'react-hot-toast'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'PaperPal',
  description: "Revolutionize the way you analyze and discuss complex scientific papers and challenging texts. Seamlessly communicate, summarize, and ask. elevating your team's efficiency and understanding to new heights.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <Providers>
        <html lang="en">
          <body className={inter.className}>{children}</body>
          <Toaster />
        </html>
      </Providers>
    </ClerkProvider>
  )
}
