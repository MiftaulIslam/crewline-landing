// The home page's full-screen sections: films and the photograph, from the hero to the download
import { Fragment, type ReactNode } from 'react'
import type { SiteContent, VideoBandContent } from '@/content/types'
import type { HomeDownloadContent, HomeHeroContent, HoursFilmContent, PrivateContent } from '@/content/home.types'
import { DownloadButton } from '@/components/ui/Buttons'
import { Jack } from '@/components/ui/Jack'
import { Lede } from '@/components/ui/Lede'
import { PageMore } from './parts'

interface HomeHeroProps {
  content: HomeHeroContent
  /** The live desk replay over the film */
  children: ReactNode
}

/** The opening: a full-screen film, the headline and the two buttons */
export function HomeHero({ content, children }: HomeHeroProps) {
  const { film } = content
  return (
    <section className="film film--hero" id="top">
      <video className="film__media" autoPlay muted loop playsInline preload="auto" poster={film.poster}><source src={film.src} type="video/mp4" /></video>
      <div className="film__shade"></div>
      <Jack y={62} />
      {children}
      <div className="wrap film__body">
        <h1 className="hero__title">
          {content.title.map((line, i) => (
            <Fragment key={line}>
              {i > 0 && ' '}
              <span>{line}</span>
            </Fragment>
          ))}
        </h1>
        <p className="hero__lede">{content.lede}</p>
        <p className="hero__actions">
          <a className="btn" href="#download">{content.download}</a>
          <a className="btn btn--line" href="#live">{content.demo}</a>
        </p>
      </div>
      <p className="film__credit">{content.credit}</p>
    </section>
  )
}

interface FilmBandProps {
  id: string
  content: VideoBandContent
  shade: string
  jack: { y: number; x: number }
  children?: ReactNode
}

/** A full-screen looping film with a headline; it plays only while on screen */
function FilmBand({ id, content, shade, jack, children }: FilmBandProps) {
  return (
    <section className="film" id={id}>
      <video className="film__media" data-lazy-video="" muted loop playsInline preload="none" poster={content.film.poster}><source src={content.film.src} type="video/mp4" /></video>
      <div className={shade}></div>
      <Jack y={jack.y} x={jack.x} />
      <div className="wrap film__body">
        <h2 className="h1">{content.title}</h2>
        <Lede text={content.lede} />
        {children}
      </div>
    </section>
  )
}

/** Why it exists, over the thank-you card film */
export function WhyFilm({ content }: { content: VideoBandContent }) {
  return <FilmBand id="why" content={content} shade="film__shade film__shade--low" jack={{ y: 34, x: 84 }} />
}

/** After hours, over the packing-room film, with the notice customers see */
export function HoursFilm({ content }: { content: HoursFilmContent }) {
  return (
    <FilmBand id="hours" content={content} shade="film__shade" jack={{ y: 24, x: 70 }}>
      <p className="hours__widget"><span className="lamp lamp--live"></span>{content.widget}</p>
    </FilmBand>
  )
}

/** Privacy over the switchboard photograph, its words on the right */
export function PrivatePhoto({ content }: { content: PrivateContent }) {
  const { image } = content
  return (
    <section className="film film--still" id="private">
      <img className="film__media" src={image.src} alt={image.alt} loading="lazy" />
      <div className="film__shade"></div>
      <Jack y={30} x={18} />
      <div className="wrap film__body film__body--right">
        <h2 className="h1">{content.title}</h2>
        <Lede text={content.lede} />
        <PageMore link={content.more} />
      </div>
      <p className="film__credit">{content.credit}</p>
    </section>
  )
}

interface HomeDownloadProps {
  content: HomeDownloadContent
  /** The site-wide title, button, spec and film */
  download: SiteContent['download']
}

/** The closing download over the relay film, where the cord ends in the last jack */
export function HomeDownload({ content, download }: HomeDownloadProps) {
  return (
    <section className="film film--end" id="download">
      <video className="film__media" data-lazy-video="" muted loop playsInline preload="none" poster={download.film.poster}><source src={download.film.src} type="video/mp4" /></video>
      <div className="film__shade film__shade--heavy"></div>
      <div className="wrap film__body">
        <h2 className="h1">{download.title}</h2>
        <Lede text={content.lede} />
        <p className="hero__actions end__actions">
          <span className="jack jack--end" data-jack="" data-jack-end="" />
          <DownloadButton>{download.button}</DownloadButton>
          <span className="end__spec">{download.spec}</span>
        </p>
      </div>
      <p className="film__credit">{content.credit}</p>
    </section>
  )
}
