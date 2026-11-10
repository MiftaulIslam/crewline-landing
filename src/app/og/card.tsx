// The 1200x630 social card, drawn for ImageResponse (Satori: flexbox and
// inline styles only). Fonts are static instances of the site's Archivo (SIL OFL 1.1, see
// fonts/OFL.txt), cut from public/fonts because Satori can't read woff2.
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { getPage, site } from '@/content'
import { CORD, INK, LABEL, LAMP, type SeoKey } from '@/lib/seo/site'
import { Mark } from './mark'

const LABEL_2 = '#c5c9c6'
const BRASS = '#c9a24b'

async function loadFont(file: string): Promise<ArrayBuffer | null> {
  try {
    const buffer = await readFile(join(process.cwd(), 'src/app/og/fonts', file))
    return buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength) as ArrayBuffer
  } catch {
    return null // fall back to ImageResponse's default font
  }
}

const [expanded, regular] = await Promise.all([loadFont('archivo-expanded-500.ttf'), loadFont('archivo-400.ttf')])

export const ogFonts = [
  ...(expanded ? [{ name: 'Archivo Expanded', data: expanded, weight: 500 as const, style: 'normal' as const }] : []),
  ...(regular ? [{ name: 'Archivo', data: regular, weight: 400 as const, style: 'normal' as const }] : [])
]

/** Splits "Flows: support rules you can read out loud" into a small label and the headline */
function cardText(key: SeoKey): { eyebrow?: string; headline: string; footer: string } {
  if (key === 'home') return { headline: capitalise(site.tagline), footer: site.download.spec }
  const page = getPage(key)
  const at = page.title.indexOf(': ')
  if (at === -1) return { eyebrow: page.nav, headline: page.title, footer: site.tagline }
  return { eyebrow: page.title.slice(0, at), headline: capitalise(page.title.slice(at + 2)), footer: site.tagline }
}

const capitalise = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)

export function OgCard({ pageKey }: { pageKey: SeoKey }) {
  const { eyebrow, headline, footer } = cardText(pageKey)
  const size = headline.length > 40 ? 66 : 80
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        background: INK,
        color: LABEL,
        fontFamily: 'Archivo',
        padding: '60px 80px 56px 128px'
      }}
    >
      {/* The red cord down the left edge, plugged into a brass jack beside the headline */}
      <div style={{ position: 'absolute', left: 62, top: 0, width: 6, height: 404, background: CORD, borderRadius: 3 }} />
      <div style={{ position: 'absolute', left: 54, top: 396, width: 22, height: 22, borderRadius: 11, background: BRASS }} />

      <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
        <Mark size={52} />
        <div style={{ fontFamily: 'Archivo Expanded', fontSize: 34, letterSpacing: -0.3 }}>{site.name}</div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1, justifyContent: 'center', maxWidth: 980 }}>
        {eyebrow ? <div style={{ fontSize: 32, color: LAMP, marginBottom: 20 }}>{eyebrow}</div> : null}
        <div style={{ fontFamily: 'Archivo Expanded', fontSize: size, lineHeight: 1.04, letterSpacing: size * -0.025 }}>
          {headline}
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontSize: 26, color: LABEL_2 }}>
        <div style={{ width: 14, height: 14, borderRadius: 7, background: LAMP }} />
        <div>{footer}</div>
      </div>
    </div>
  )
}
