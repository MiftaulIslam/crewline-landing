import type { PhotoBandContent, VideoBandContent } from '@/content/types'
import { Jack } from '@/components/ui/Jack'
import { Lede } from '@/components/ui/Lede'
import { RevealText } from '@/components/ui/RevealText'

/** A full-screen photograph with a headline over it */
export function PhotoBand({ content }: { content: PhotoBandContent }) {
  const { image } = content
  return (
    <section className="film film--still band">
      <img className="film__media" src={image.src} alt={image.alt} loading="lazy" style={{ objectPosition: image.focus ?? '50% 50%' }} />
      <div className="film__shade"></div>
      <Jack y={30} />
      <div className="wrap film__body">
        <RevealText className="h1" text={content.title} />
        <Lede text={content.lede} />
      </div>
    </section>
  )
}

/** A full-screen looping film with a headline over it; it plays only while on screen */
export function VideoBand({ content }: { content: VideoBandContent }) {
  return (
    <section className="film band">
      <video className="film__media" data-lazy-video="" muted loop playsInline preload="none" poster={content.film.poster}>
        <source src={content.film.src} type="video/mp4" />
      </video>
      <div className="film__shade"></div>
      <Jack y={30} />
      <div className="wrap film__body">
        <RevealText className="h1" text={content.title} />
        <Lede text={content.lede} />
      </div>
    </section>
  )
}
