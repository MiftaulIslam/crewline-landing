import Link from 'next/link'
import type { ReactNode } from 'react'
import type { FeatureHeroContent, LanguageHeroContent, PageEntry, PhotoHeroContent, StoryFilmContent } from '@/content/types'
import { pageHref } from '@/content'
import { DownloadButton } from '@/components/ui/Buttons'
import { Jack } from '@/components/ui/Jack'
import { Lede } from '@/components/ui/Lede'

interface FeatureHeroProps {
  content: FeatureHeroContent
  /** The page the secondary button leads to */
  next: PageEntry
  nextLabel: string
  downloadLabel: string
  /** The live vignette beside the headline */
  children: ReactNode
}

/** A feature page's opening: headline, lead, Download and Next, and a live vignette */
export function FeatureHero({ content, next, nextLabel, downloadLabel, children }: FeatureHeroProps) {
  return (
    <section className="night hero2" id="top">
      <Jack y={30} />
      <div className="wrap hero2__grid">
        <div>
          <h1 className="hero2__title">{content.title}</h1>
          <Lede text={content.lede} />
          <p className="hero__actions">
            <DownloadButton>{downloadLabel}</DownloadButton>
            <Link className="btn btn--line" href={pageHref(next.slug)}>
              {nextLabel} {next.nav.toLowerCase()}
            </Link>
          </p>
        </div>
        <div>{children}</div>
      </div>
    </section>
  )
}

/** A feature page's opening as a full-screen photograph */
export function PhotoHero({ content }: { content: PhotoHeroContent }) {
  const { image } = content
  return (
    <section className="film film--still" id="top">
      <img className="film__media" src={image.src} alt={image.alt} style={{ objectPosition: image.focus ?? '50% 50%' }} />
      <div className="film__shade"></div>
      <Jack y={56} />
      <div className="wrap film__body">
        <h1 className="h1">{content.title}</h1>
        <Lede text={content.lede} />
      </div>
    </section>
  )
}

/** The red opening of the Languages page: the same question in turn in several languages */
export function LanguageHero({ content }: { content: LanguageHeroContent }) {
  return (
    <section className="cordred tongues" id="top" data-rotate="2200">
      <Jack y={82} x={90} />
      <div className="wrap">
        <p className="tongues__stage" aria-hidden="true">
          {content.phrases.map((p, i) => (
            <span key={p.text} data-slide="" className={i ? undefined : 'is-on'} lang={p.lang}>
              {p.text}
            </span>
          ))}
        </p>
        <h1 className="sr">{content.title}</h1>
        <p className="lede tongues__lede">{content.lede}</p>
      </div>
    </section>
  )
}

interface StoryFilmProps {
  content: StoryFilmContent
  /** h1 when the film opens its page, h2 on the home page */
  as?: 'h1' | 'h2'
  /** Home places the cord jack at the same height */
  jack?: number
}

/** The story film, full screen, with a button that plays it with sound */
export function StoryFilm({ content, as: Heading = 'h1', jack = 40 }: StoryFilmProps) {
  return (
    <section className="film film--story" id="story">
      <video className="film__media" id="story-film" playsInline preload="none" poster={content.film.poster}>
        <source src={content.film.src} type="video/mp4" />
      </video>
      <div className="film__shade" id="story-shade"></div>
      <Jack y={jack} />
      <div className="wrap film__body" id="story-body">
        <Heading className="h1">{content.title}</Heading>
        <Lede text={content.lede} />
        <p className="hero__actions">
          <button className="btn" id="story-play">
            {content.play}
          </button>
        </p>
      </div>
    </section>
  )
}
