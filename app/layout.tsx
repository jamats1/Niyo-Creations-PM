import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Niyo Creations PM - Project Management & CRM',
  description: 'Comprehensive project management and CRM system for interior design, construction, and IT projects.',
  keywords: 'project management, CRM, interior design, construction, IT projects, task management',
  authors: [{ name: 'Niyo Creations' }],
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-50`}>
        {children}
      </body>
    </html>
  )
} 