import type { MetadataRoute } from 'next'
import { pages } from '@/content'
import { contentImages, storyContent } from '@/lib/seo/content'
import { absoluteUrl, latestUpdate, pageDescription, pageUrl } from '@/lib/seo/site'

/** "PT1M26S" -> 86 */
function seconds(iso: string): number | undefined {
  const m = /^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/.exec(iso)
  if (!m) return undefined
  return Number(m[1] ?? 0) * 3600 + Number(m[2] ?? 0) * 60 + Number(m[3] ?? 0)
}

export default function sitemap(): MetadataRoute.Sitemap {
  const { film } = storyContent
  const lede = Array.isArray(film.lede) ? film.lede.join(' ') : film.lede

  return [
    { url: pageUrl('home'), lastModified: latestUpdate(), changeFrequency: 'monthly', priority: 1 },
    ...pages.map((page) => ({
      url: pageUrl(page.slug),
      lastModified: page.updated,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
      images: [...new Set([...contentImages(page.slug), page.shot])].map(absoluteUrl),
      ...(page.slug === 'story'
        ? {
            videos: [
              {
                title: film.title,
                description: lede || pageDescription('story'),
                thumbnail_loc: absoluteUrl(film.film.poster),
                content_loc: absoluteUrl(film.film.src),
                duration: seconds(film.duration),
                publication_date: film.uploaded
              }
            ]
          }
        : {})
    }))
  ]
}
