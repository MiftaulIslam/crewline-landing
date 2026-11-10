import Link from 'next/link'
import type { ReactNode } from 'react'
import { DOWNLOAD_URL } from '@/lib/config'

export type ButtonVariant = 'primary' | 'line' | 'small'

interface ButtonProps {
  /** primary: the amber action. line: outlined, for a second action. small: the compact header and footer button */
  variant?: ButtonVariant
  /** A page path ("/flows"), an in-page hash ("#live") or a full URL. Without it the button is a <button>. */
  href?: string
  id?: string
  children: ReactNode
}

const CLASS: Record<ButtonVariant, string> = { primary: 'btn', line: 'btn btn--line', small: 'btn btn--small' }

/**
 * The one button used across the site. On hover a second colour rises from the bottom and the
 * label lifts with it (styles/motion.css). Site paths use next/link; hashes and full URLs a plain <a>.
 */
export function Button({ variant = 'primary', href, id, children }: ButtonProps) {
  const label = <span className="btn__label">{children}</span>
  if (href === undefined)
    return (
      <button type="button" className={CLASS[variant]} id={id}>
        {label}
      </button>
    )
  if (href.startsWith('/') && !href.startsWith('//'))
    return (
      <Link className={CLASS[variant]} href={href} id={id}>
        {label}
      </Link>
    )
  return (
    <a className={CLASS[variant]} href={href} id={id}>
      {label}
    </a>
  )
}

/** The Download button: the one primary action on every page */
export function DownloadButton({ children, variant = 'primary' }: { children: ReactNode; variant?: ButtonVariant }) {
  return (
    <Button variant={variant} href={DOWNLOAD_URL}>
      {children}
    </Button>
  )
}

/**
 * A link to another page with an arrow: on hover the underline redraws from the left and the arrow
 * moves on. Used for every "See how it works" style link.
 */
export function ArrowLink({ href, children, className }: { href: string; children: ReactNode; className?: string }) {
  return (
    <Link className={className ? `more ${className}` : 'more'} href={href}>
      <span className="more__text">{children}</span>
      <svg className="more__arrow" viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
        <path d="M2 8h11M9 4l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </Link>
  )
}

/** Kept for existing callers: the same as ArrowLink */
export const MoreLink = ArrowLink
