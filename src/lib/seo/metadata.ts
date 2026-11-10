// Document metadata: the site-wide defaults the root layout exports, and each page's title,
// description, canonical URL, Open Graph and Twitter cards and robots directives.
// Relative URLs below resolve against metadataBase (NEXT_PUBLIC_SITE_URL).
import type { Metadata, Viewport } from 'next'
import { site } from '@/content'
import type { PageSlug } from '@/content/types'
import { SITE_URL } from '@/lib/config'
import { INK, OG_SIZE, ogImageAlt, ogImagePath, pageDescription, pagePath, pageTitle, type SeoKey } from './site'

const robots: Metadata['robots'] = {
  index: true,
  follow: true,
  'max-image-preview': 'large',
  'max-snippet': -1,
  'max-video-preview': -1,
  googleBot: {
    index: true,
    follow: true,
    'max-image-preview': 'large',
    'max-snippet': -1,
    'max-video-preview': -1
  }
}

/** Icons are listed here rather than left to the file conventions: Next drops a file-based
 *  apple-icon whenever metadata declares `icons`, and the SVG mark lives in public/. */
const icons: Metadata['icons'] = {
  icon: [{ url: '/media/logo.svg', type: 'image/svg+xml' }],
  apple: [{ url: '/apple-icon', type: 'image/png', sizes: '180x180' }]
}

/** Exported by app/layout.tsx: defaults every page inherits */
export const rootMetadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: site.title, template: `%s | ${site.name}` },
  description: pageDescription('home'),
  applicationName: site.name,
  icons,
  robots,
  formatDetection: { telephone: false, address: false, email: false },
  ...social('home')
}

/** Exported by app/layout.tsx */
export const rootViewport: Viewport = {
  themeColor: INK
}

function social(key: SeoKey): Pick<Metadata, 'openGraph' | 'twitter'> {
  const title = key === 'home' ? site.title : `${pageTitle(key)} | ${site.name}`
  const description = pageDescription(key)
  const image = { url: ogImagePath(key), ...OG_SIZE, alt: ogImageAlt(key), type: 'image/png' }
  return {
    openGraph: {
      type: 'website',
      siteName: site.name,
      locale: site.locale,
      url: pagePath(key),
      title,
      description,
      images: [image]
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [{ url: image.url, alt: image.alt, width: image.width, height: image.height }]
    }
  }
}

function metadataFor(key: SeoKey): Metadata {
  return {
    // The home title is absolute; feature titles get " | Crewline" from the layout's template
    title: key === 'home' ? { absolute: site.title } : pageTitle(key),
    description: pageDescription(key),
    alternates: { canonical: pagePath(key) },
    robots,
    ...social(key)
  }
}

export function homeMetadata(): Metadata {
  return metadataFor('home')
}

export function pageMetadata(slug: PageSlug): Metadata {
  return metadataFor(slug)
}
