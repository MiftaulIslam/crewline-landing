import type { ReactNode } from 'react'

interface GlyphProps {
  /** Rendered size in px; the stroke stays 1.6px at any size */
  size?: number
  className?: string
  children: ReactNode
}

/** The site's line icon: a 24-unit grid, a 1.6px round stroke in currentColor, hidden from screen readers */
export function Glyph({ size = 24, className, children }: GlyphProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={(1.6 * 24) / size}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {children}
    </svg>
  )
}
