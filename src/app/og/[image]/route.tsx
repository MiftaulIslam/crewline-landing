// Open Graph and Twitter cards: /og/home.png and /og/<slug>.png, prerendered at build time.
// Under Cache Components a route handler is prerendered when it reads no request data, and
// Next caches the ImageResponse render during the prerender, so all 17 are static PNGs.
import { ImageResponse } from 'next/og'
import { pages } from '@/content'
import { OG_SIZE, type SeoKey } from '@/lib/seo/site'
import { OgCard, ogFonts } from '../card'

const KEYS: SeoKey[] = ['home', ...pages.map((p) => p.slug)]

export function generateStaticParams() {
  return KEYS.map((key) => ({ image: `${key}.png` }))
}

export async function GET(_request: Request, { params }: { params: Promise<{ image: string }> }) {
  const { image } = await params
  const key = KEYS.find((k) => `${k}.png` === image)
  if (!key) return new Response('Not found', { status: 404 })

  return new ImageResponse(<OgCard pageKey={key} />, {
    ...OG_SIZE,
    fonts: ogFonts
  })
}
