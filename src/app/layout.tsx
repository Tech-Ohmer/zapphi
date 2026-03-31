import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Zapphi — Your Smart Learning Buddy! 🌟',
  description: 'AI-powered learning app for Zapphira, Grade 3 Philippines (DepEd K-12 Curriculum)',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Zapphi',
  },
}

export const viewport: Viewport = {
  themeColor: '#a855f7',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <head>
        <link rel="apple-touch-icon" href="/icon-192.png" />
      </head>
      <body className="min-h-full bg-gradient-to-br from-purple-50 via-pink-50 to-yellow-50 antialiased">
        {children}
      </body>
    </html>
  )
}
