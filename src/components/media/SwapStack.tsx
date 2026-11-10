import type { Img } from '@/content/types'

interface SwapStackProps {
  images: Img[]
  /** The picture shown (it carries .is-on); the others wait, hidden */
  active?: number
  /** Classes for the stack itself, e.g. "stack" or "guide__stage" */
  className?: string
  /** Classes for every picture, e.g. "win" for app screenshots */
  itemClassName?: string
  /** Mark each picture data-slide, so a data-rotate section (lib/site.js) turns them */
  slide?: boolean
  /** Hide the whole stack from screen readers when the same pictures appear elsewhere */
  hidden?: boolean
}

/**
 * Pictures stacked on one another, one shown at a time. Whatever moves .is-on (React state, or
 * lib/site.js for rotating tabs and the setup guide), the new picture rises in from below while
 * the old one lifts away and fades (styles/home-media.css, .swap).
 */
export function SwapStack({ images, active = 0, className, itemClassName, slide, hidden }: SwapStackProps) {
  return (
    <div className={className ? `swap ${className}` : 'swap'} aria-hidden={hidden || undefined}>
      {images.map((image, i) => (
        <img
          key={image.src}
          className={[itemClassName, 'swap__item', i === active ? 'is-on' : ''].filter(Boolean).join(' ')}
          data-slide={slide ? '' : undefined}
          src={image.src}
          alt={image.alt}
          loading="lazy"
        />
      ))}
    </div>
  )
}
