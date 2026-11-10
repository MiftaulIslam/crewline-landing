// The home page's hover lists: rows that show a photo or swap a picture when pointed at.
// lib/site.js drives the floating photo (data-float); HoverSwapList swaps the crew and hardware pictures.
import Link from 'next/link'
import type { HoverListContent } from '@/content/types'
import type { CrewContent, HardwareContent, ModelRole, ShopsContent } from '@/content/home.types'
import { pageHref } from '@/content'
import { Jack } from '@/components/ui/Jack'
import { Lede } from '@/components/ui/Lede'
import { RevealText } from '@/components/ui/RevealText'
import { HoverSwapList } from '@/components/media/HoverSwapList'
import { RoleGlyph, TierIcon } from '@/components/icons/hardware'
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
        <RevealText as="h2" className="h2 asks__title" text={content.title} />
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
          <RevealText as="h2" className="h2" text={content.title} />
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

/** The six agents; pointing at a row brings that agent's screen up from below */
export function CrewSection({ content }: { content: CrewContent }) {
  return (
    <section className="panel crew" id="crew">
      <Jack y={12} />
      <HoverSwapList
        className="wrap crew__grid"
        listClassName="crew__list"
        rows={content.items.map((item, i) => ({ ...item, style: vars({ '--a': AGENT_ACCENTS[i] }) }))}
        images={content.images}
        stackClassName="crew__screens"
        imageClassName="win"
        head={<RevealText as="h2" className="h2" text={content.title} />}
        foot={<PageMore link={content.more} />}
      />
    </section>
  )
}

/** Names in the ticker, each followed by what it does */
function TickerItem({ name, role, label }: { name: string; role: ModelRole; label: string }) {
  return (
    <div className="ticker__item">
      <b className="ticker__name">{name}</b>
      <small className="ticker__role"><RoleGlyph role={role} />{label}</small>
    </div>
  )
}

/** The three hardware tiers, each row bringing up a photo, and a ticker of the models it runs */
export function HardwareSection({ content }: { content: HardwareContent }) {
  const { models } = content
  const described = models.names.map((name) => `${name} (${models.roleLabels[models.roles[name]]})`)
  return (
    <section className="night kit" id="hardware">
      <Jack y={10} />
      <HoverSwapList
        className="wrap kit__grid"
        listClassName="kit__list"
        rows={content.items.map((item) => ({ title: item.title, text: item.text, icon: <TierIcon id={item.id} /> }))}
        images={content.images}
        stackClassName="kit__photos"
        initial={2}
        head={<RevealText as="h2" className="h2" text={content.title} />}
        foot={<PageMore link={content.more} />}
      />
      <div className="ticker" aria-label={`${models.label}: ${described.join(', ')}`}>
        <div className="ticker__track" aria-hidden="true">
          {/* Twice over, so the strip loops without a gap */}
          {[...models.names, ...models.names].map((name, i) => (
            <TickerItem key={i} name={name} role={models.roles[name]} label={models.roleLabels[models.roles[name]]} />
          ))}
        </div>
      </div>
    </section>
  )
}
