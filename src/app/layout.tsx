import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Header from '@/components/Header'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'WOODY SOFTWARE DEVELOPMENT SERVICES - Portfolio',
  description: 'AI-powered developer portfolio showcasing projects and technical expertise',
  keywords: ['software development', 'web development', 'mobile apps', 'AI', 'portfolio'],
  authors: [{ name: 'WOODY SOFTWARE DEVELOPMENT SERVICES' }],
  openGraph: {
    title: 'WOODY SOFTWARE DEVELOPMENT SERVICES - Portfolio',
    description: 'AI-powered developer portfolio showcasing projects and technical expertise',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.className} antialiased`}>
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-1">
            {children}
          </main>
          <footer className="bg-gray-900 text-white py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center">
                <div className="flex items-center justify-center space-x-2 mb-4">
                  <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">WS</span>
                  </div>
                  <span className="text-xl font-bold">WOODY SOFTWARE</span>
                </div>
                <p className="text-gray-400 mb-4">
                  Professional software development services
                </p>
                <p className="text-sm text-gray-500">
                  © 2025 WOODY SOFTWARE DEVELOPMENT SERVICES. All rights reserved.
                </p>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  )
}
