import type { Metadata, Viewport } from 'next'
import { BackToTop } from '@/components/layout/BackToTop'
import { Cord } from '@/components/layout/Cord'
import { SiteFooter } from '@/components/layout/SiteFooter'
import { SiteHeader } from '@/components/layout/SiteHeader'
import { pages, site } from '@/content'
import { rootMetadata, rootViewport } from '@/lib/seo/metadata'
import '@/styles/site.css'
import '@/styles/alive.css'
import '@/styles/motion.css'
import '@/styles/home-media.css'
import '@/styles/interactive.css'

export const metadata: Metadata = rootMetadata

export const viewport: Viewport = rootViewport

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // The inline script below adds .js before paint, so React would otherwise flag the class
    <html lang="en" data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
        <link rel="preload" href="/fonts/archivo-latin.woff2" as="font" type="font/woff2" crossOrigin="" />
      </head>
      <body>
        <Cord />
        <SiteHeader site={site} pages={pages} />
        <main>{children}</main>
        <SiteFooter site={site} pages={pages} />
        <BackToTop label={site.backToTop} />
      </body>
    </html>
  )
}
