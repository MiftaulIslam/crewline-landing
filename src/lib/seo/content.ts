// Every page's content JSON in one map, for structured data, the sitemap and llms-full.txt.
// The route files import their own JSON; this only reads it.
import type { PageSlug } from '@/content/types'
import afterHours from '@/content/pages/after-hours.json'
import agents from '@/content/pages/agents.json'
import approvals from '@/content/pages/approvals.json'
import calls from '@/content/pages/calls.json'
import compare from '@/content/pages/compare.json'
import conversations from '@/content/pages/conversations.json'
import faq from '@/content/pages/faq.json'
import flows from '@/content/pages/flows.json'
import knowledge from '@/content/pages/knowledge.json'
import languages from '@/content/pages/languages.json'
import models from '@/content/pages/models.json'
import photos from '@/content/pages/photos.json'
import privacy from '@/content/pages/privacy.json'
import setup from '@/content/pages/setup.json'
import store from '@/content/pages/store.json'
import story from '@/content/pages/story.json'

/** A page's content: named sections in the order the page shows them */
export type PageContent = Record<string, unknown>

export const pageContent: Record<PageSlug, PageContent> = {
  conversations,
  agents,
  flows,
  knowledge,
  photos,
  calls,
  approvals,
  languages,
  'after-hours': afterHours,
  store,
  models,
  privacy,
  setup,
  compare,
  story,
  faq
}

export { setup as setupContent, story as storyContent }

const IMAGE_FILE = /\.(webp|png|jpe?g|gif|avif)$/i

/** Every image path a page's content shows (hero photos, screenshots, step images), in order */
export function contentImages(slug: PageSlug): string[] {
  const found = new Set<string>()
  const walk = (value: unknown) => {
    if (typeof value === 'string') {
      if (value.startsWith('/') && IMAGE_FILE.test(value)) found.add(value)
    } else if (Array.isArray(value)) value.forEach(walk)
    else if (value && typeof value === 'object') Object.values(value).forEach(walk)
  }
  walk(pageContent[slug])
  return [...found]
}

/** The page's opening image (hero.image), if it has one */
export function heroImage(slug: PageSlug): { src: string; alt: string } | undefined {
  const hero = pageContent[slug].hero as { image?: { src?: unknown; alt?: unknown } } | undefined
  const image = hero?.image
  if (image && typeof image.src === 'string') return { src: image.src, alt: typeof image.alt === 'string' ? image.alt : '' }
  return undefined
}
