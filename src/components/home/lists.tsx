// The home page's hover lists: rows that show a photo or swap a picture when pointed at.
// lib/site.js drives the floating photo (data-float); CSS swaps the crew and hardware pictures.
import Link from 'next/link'
import type { HoverListContent, TitledText } from '@/content/types'
import type { CrewContent, HardwareContent, ShopsContent } from '@/content/home.types'
import { pageHref } from '@/content'
import { Jack } from '@/components/ui/Jack'
import { Lede } from '@/components/ui/Lede'
import { AppWindow, Photo } from '@/components/ui/Media'
import { RISE, vars } from '@/lib/style'
import { PageMore } from './parts'

/** Each agent's colour, in the order the crew is listed */
const AGENT_ACCENTS = ['#2a78d6', '#eb6834', '#0f9e9e', '#d6589a', '#6250d6', '#172033']

/** The five common questions; a photo follows the pointer over each row (on touch screens, inline thumbnails) */
export function FiveQuestions({ content }: { content: HoverListContent }) {
  return (
    <section className="panel asks" id="questions">
      <Jack y={16} />
      <Jack y={97} />
      <div className="wrap">
        <h2 className="h2 asks__title">{content.title}</h2>
        <Lede text={content.lede} className="lede asks__lede" />
        <ol className="asks__list">
          {content.items.map((item, i) => (
            <li key={item.title} tabIndex={0} data-float={i}><span className="lamp"></span><strong>{item.title}</strong><em>{item.text}</em><img className="asks__thumb" src={item.image} alt="" loading="lazy" /></li>
          ))}
        </ol>
      </div>
      <div className="float" aria-hidden="true">
        {content.items.map((item) => (
          <img key={item.title} src={item.image} alt="" />
        ))}
      </div>
    </section>
  )
}

/** Kinds of shop, each a photo that swaps to a second one on hover and links to a feature page */
export function Shops({ content }: { content: ShopsContent }) {
  return (
    <section className="label" id="shops">
      <Jack y={12} />
      <Jack y={96} />
      <div className="wrap">
        <div className="block__head" {...RISE}>
          <h2 className="h2">{content.title}</h2>
          <Lede text={content.lede} />
        </div>
        <div className="shops">
          {content.items.map((shop) => (
            <Link key={shop.title} className="shop" href={pageHref(shop.slug)} {...RISE}><img src={shop.image} alt="" loading="lazy" /><img src={shop.hover} alt="" loading="lazy" /><div className="shop__cap"><b>{shop.title}</b><span>{shop.text}</span></div></Link>
          ))}
        </div>
      </div>
    </section>
  )
}

interface SwapListProps {
  className: string
  items: TitledText[]
  /** A colour per row, set as --a */
  accents?: string[]
}

/** Focusable rows; pointing at or focusing the nth row shows the nth picture beside the list */
function SwapList({ className, items, accents }: SwapListProps) {
  return (
    <ul className={className}>
      {items.map((item, i) => {
        const accent = accents?.[i]
        return (
          <li key={item.title} tabIndex={0} style={accent ? vars({ '--a': accent }) : undefined}><strong>{item.title}</strong><span>{item.text}</span></li>
        )
      })}
    </ul>
  )
}

/** The six agents, each row showing that agent's screen */
export function CrewSection({ content }: { content: CrewContent }) {
  return (
    <section className="panel crew" id="crew">
      <Jack y={12} />
      <div className="wrap crew__grid">
        <div>
          <h2 className="h2">{content.title}</h2>
          <SwapList className="crew__list" items={content.items} accents={AGENT_ACCENTS} />
          <PageMore link={content.more} />
        </div>
        <div className="crew__frame">
          {content.images.map((image) => (
            <AppWindow key={image.src} image={image} />
          ))}
        </div>
      </div>
    </section>
  )
}

/** The three hardware tiers, each row showing a photo, and a ticker of the models it runs */
export function HardwareSection({ content }: { content: HardwareContent }) {
  const { models } = content
  return (
    <section className="night kit" id="hardware">
      <Jack y={10} />
      <div className="wrap kit__grid">
        <div>
          <h2 className="h2">{content.title}</h2>
          <SwapList className="kit__list" items={content.items} />
          <PageMore link={content.more} />
        </div>
        <div className="kit__frame">
          {content.images.map((image) => (
            <Photo key={image.src} image={image} />
          ))}
        </div>
      </div>
      <div className="ticker" aria-label={`${models.label}: ${models.names.join(', ')}`}>
        <div className="ticker__track" aria-hidden="true">
          {/* Twice over, so the strip loops without a gap */}
          {[...models.names, ...models.names].map((name, i) => (
            <span key={i}>{name}</span>
          ))}
        </div>
      </div>
    </section>
  )
}
