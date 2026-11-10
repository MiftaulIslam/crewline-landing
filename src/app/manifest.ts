import type { MetadataRoute } from 'next'
import { site } from '@/content'
import { INK } from '@/lib/seo/site'

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: '/',
    name: site.name,
    short_name: site.name,
    description: site.description,
    lang: 'en',
    start_url: '/',
    scope: '/',
    display: 'browser',
    background_color: INK,
    theme_color: INK,
    icons: [
      { src: '/media/logo.svg', sizes: 'any', type: 'image/svg+xml' },
      { src: '/apple-icon', sizes: '180x180', type: 'image/png' }
    ]
  }
}
