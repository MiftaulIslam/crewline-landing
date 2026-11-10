import Link from 'next/link'
import type { PageEntry, SiteContent } from '@/content/types'
import { pageHref } from '@/content'
import { DownloadButton } from '@/components/ui/Buttons'
import { Jack } from '@/components/ui/Jack'
import { RISE } from '@/lib/style'

/** Three more pages, each a photo that turns into its screenshot on hover */
export function KeepReading({ title, pages }: { title: string; pages: PageEntry[] }) {
  return (
    <section className="night">
      <Jack y={14} />
      <div className="wrap">
        <h2 className="h2" {...RISE}>
          {title}
        </h2>
        <div className="next">
          {pages.map((p) => (
            <Link key={p.slug} href={pageHref(p.slug)} {...RISE}>
              <figure>
                <img src={p.photo} alt="" loading="lazy" />
                <img src={p.shot} alt="" loading="lazy" />
              </figure>
              <div>
                <b>{p.nav}</b>
                <span>{p.blurb}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

/** The closing download over the relay film, where the cord plugs in */
export function DownloadSection({ content }: { content: SiteContent['download'] }) {
  return (
    <section className="film end2" id="download">
      <video className="film__media" data-lazy-video="" muted loop playsInline preload="none" poster={content.film.poster}>
        <source src={content.film.src} type="video/mp4" />
      </video>
      <div className="film__shade film__shade--heavy"></div>
      <div className="wrap film__body">
        <h2 className="h1">{content.title}</h2>
        <p className="hero__actions end__actions">
          <Jack end />
          <DownloadButton>{content.button}</DownloadButton>
          <span className="end__spec">{content.spec}</span>
        </p>
      </div>
    </section>
  )
}
