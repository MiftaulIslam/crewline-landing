// Small pieces several home sections share
import type { ReactNode } from 'react'
import type { Img } from '@/content/types'
import type { PageLink, SizedImg, TabScreen } from '@/content/home.types'
import { pageHref } from '@/content'
import { MoreLink } from '@/components/ui/Buttons'

/** An underlined "read more" link to a feature page */
export function PageMore({ link }: { link: PageLink }) {
  return <MoreLink href={pageHref(link.slug)}>{link.label}</MoreLink>
}

/** An image that reserves its space before it loads */
export function SizedImage({ image, className }: { image: SizedImg; className?: string }) {
  return <img className={className} src={image.src} width={image.width} height={image.height} alt={image.alt} loading="lazy" />
}

/** Screenshots stacked on one another; the rotation (lib/site.js) shows one at a time, the first at load */
export function SlideStack({ images }: { images: Img[] }) {
  return images.map((image, i) => (
    <img key={image.src} data-slide="" className={i ? 'win' : 'win is-on'} src={image.src} alt={image.alt} loading="lazy" />
  ))
}

/** A tab of a rotating section (data-rotate); the first starts on */
export function Tab({ on, children }: { on: boolean; children: ReactNode }) {
  return (
    <button role="tab" data-tab="" className={on ? 'is-on' : undefined}>
      {children}
    </button>
  )
}

/** The images of a set of tabbed screens */
export const screenImages = (screens: TabScreen[]) => screens.map((s) => s.image)
