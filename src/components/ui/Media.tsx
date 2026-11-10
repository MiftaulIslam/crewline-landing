import type { Img } from '@/content/types'

/** A screenshot of the app, shown as a window with a shadow */
export function AppWindow({ image, className }: { image: Img; className?: string }) {
  return <img className={className ? `win ${className}` : 'win'} src={image.src} alt={image.alt} loading="lazy" />
}

/** A plain photo */
export function Photo({ image }: { image: Img }) {
  return <img src={image.src} alt={image.alt} loading="lazy" />
}
