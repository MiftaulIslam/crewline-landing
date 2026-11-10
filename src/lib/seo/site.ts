// Shared facts for metadata, structured data, the sitemap and llms.txt: absolute URLs,
// descriptions (seo.json overrides pages.json) and the Open Graph image for each page.
import { getPage, pageHref, pages, site } from '@/content'
import seo from '@/content/seo.json'
import type { PageEntry, PageSlug } from '@/content/types'
import { DOWNLOAD_URL, SITE_URL } from '@/lib/config'

/** The home page plus the 16 feature pages */
export type SeoKey = 'home' | PageSlug

export const OG_SIZE = { width: 1200, height: 630 } as const

/** Brand colours, from the design tokens in styles/site.css */
export const INK = '#0e1728'
export const LABEL = '#f4f1e8'
export const LAMP = '#f5b53c'
export const CORD = '#c23a25'

/** An absolute URL on this site */
export function absoluteUrl(path = '/'): string {
  if (/^https?:\/\//.test(path)) return path
  return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`
}

export function pagePath(key: SeoKey): string {
  return key === 'home' ? '/' : pageHref(key)
}

/** The canonical URL. The home page keeps its trailing slash, as browsers request it. */
export function pageUrl(key: SeoKey): string {
  return key === 'home' ? `${SITE_URL}/` : absoluteUrl(pageHref(key))
}

const overrides = seo.pages as Partial<Record<PageSlug, { description?: string }>>

export function pageDescription(key: SeoKey): string {
  if (key === 'home') return seo.home.description || site.description
  return overrides[key]?.description || getPage(key).description
}

export function pageTitle(key: SeoKey): string {
  return key === 'home' ? site.title : getPage(key).title
}

/** The generated 1200x630 card for a page, served by app/og/[image]/route.tsx */
export function ogImagePath(key: SeoKey): string {
  return `/og/${key}.png`
}

export function ogImageAlt(key: SeoKey): string {
  return key === 'home' ? `${site.name}: ${site.tagline}` : `${getPage(key).title}. ${site.name}`
}

/** The newest `updated` date across all pages: the home page's last change */
export function latestUpdate(): string {
  return pages.map((p) => p.updated).sort().at(-1) ?? new Date(0).toISOString().slice(0, 10)
}

/** Feature pages: what the product does, as opposed to setup, compare, the film and questions */
const NOT_FEATURES: PageSlug[] = ['setup', 'compare', 'story', 'faq']
export function featurePages(): PageEntry[] {
  return pages.filter((p) => !NOT_FEATURES.includes(p.slug))
}

/** The installer URL, only when it's a real absolute link rather than the /#download fallback */
export function absoluteDownloadUrl(): string | undefined {
  return /^https?:\/\//.test(DOWNLOAD_URL) ? DOWNLOAD_URL : undefined
}
