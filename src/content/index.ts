// Typed access to the site-wide content. Page content lives in content/pages/<slug>.json and is
// imported by that page's route file. Assigning each JSON file to its interface here means a
// missing or misspelt field fails the build instead of rendering an empty section.
import compareJson from './compare.json'
import faqJson from './faq.json'
import pagesJson from './pages.json'
import siteJson from './site.json'
import transcriptsJson from './transcripts.json'
import type { CompareContent, PageEntry, PageSlug, Question, SiteContent, Transcript } from './types'

export const site: SiteContent = siteJson as SiteContent
export const pages: PageEntry[] = pagesJson as PageEntry[]
export const faq: Question[] = faqJson
export const compare: CompareContent = compareJson
export const transcripts: Record<keyof typeof transcriptsJson, Transcript> = transcriptsJson as Record<keyof typeof transcriptsJson, Transcript>

export function getPage(slug: PageSlug): PageEntry {
  const page = pages.find((p) => p.slug === slug)
  if (!page) throw new Error(`No page entry for "${slug}" in content/pages.json`)
  return page
}

/** The page after this one in menu order, wrapping round: the hero's "Next" link */
export function nextPage(slug: PageSlug): PageEntry {
  return relatedPages(slug, 1)[0]
}

/** The pages that follow this one in menu order, for "Keep reading" */
export function relatedPages(slug: PageSlug, count = 3): PageEntry[] {
  const at = pages.findIndex((p) => p.slug === slug)
  return Array.from({ length: count }, (_, k) => pages[(at + k + 1) % pages.length])
}

export const pageHref = (slug: PageSlug) => `/${slug}`

/** The transcripts named in content, in that order. An unknown key fails the build (pages are prerendered). */
export function pickTranscripts(keys: string[]): Transcript[] {
  return keys.map((key) => {
    if (!(key in transcripts)) throw new Error(`No transcript "${key}" in content/transcripts.json`)
    return transcripts[key as keyof typeof transcripts]
  })
}
