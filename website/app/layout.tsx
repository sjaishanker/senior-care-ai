import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'ElderCare AI - Revolutionizing Senior Care in India with AI',
  description: 'Advanced AI-powered senior care management platform providing 24/7 monitoring, predictive health analytics, and comprehensive care coordination for elderly residents in India.',
  keywords: 'senior care, elderly care, AI healthcare, India, predictive analytics, health monitoring, care facilities',
  openGraph: {
    title: 'ElderCare AI - Revolutionizing Senior Care in India',
    description: 'Transform elderly care with AI-powered monitoring and predictive analytics',
    images: ['/og-image.png'],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navbar />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}