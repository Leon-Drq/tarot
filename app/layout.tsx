import type React from "react"
import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono, Cinzel, Playfair_Display } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { AuthProvider } from "@/contexts/auth-context"
import { LanguageProvider } from "@/contexts/language-context"
import { AudioProvider } from "@/contexts/audio-context"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })
const _cinzel = Cinzel({ subsets: ["latin"], weight: ["400", "500", "600", "700"] })
const _playfair = Playfair_Display({ subsets: ["latin"], weight: ["400", "500", "600", "700"] })

export const metadata: Metadata = {
  title: "POPTarot",
  description: "探索命运的奥秘，体验专业的塔罗牌占卜",
  icons: {
    icon: "/icon_tarot.jpg",
    apple: "/icon_tarot.jpg",
    shortcut: "/icon_tarot.jpg",
  },
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="zh">
      <body className={`font-sans antialiased`}>
        <LanguageProvider>
        <AudioProvider>
        <AuthProvider>
        {children}
        </AuthProvider>
        </AudioProvider>
        </LanguageProvider>
        <Analytics />
      </body>
    </html>
  )
}
