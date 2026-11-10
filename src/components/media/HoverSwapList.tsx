'use client'

import { useState, type CSSProperties, type ReactNode } from 'react'
import type { Img } from '@/content/types'
import { SwapStack } from './SwapStack'

export interface SwapRow {
  title: string
  text: string
  /** A small picture before the title */
  icon?: ReactNode
  /** Per-row custom properties, e.g. the agent colour --a */
  style?: CSSProperties
}

interface HoverSwapListProps {
  /** The grid that holds the list column and the pictures */
  className: string
  /** The list's own class, which styles its rows */
  listClassName: string
  rows: SwapRow[]
  /** One picture per row, in the same order */
  images: Img[]
  stackClassName?: string
  /** Classes for every picture, e.g. "win" for app screenshots */
  imageClassName?: string
  /** The row (and picture) shown before anything is pointed at */
  initial?: number
  /** Above the list: the heading */
  head?: ReactNode
  /** Below the list: the read-more link */
  foot?: ReactNode
}

/**
 * Focusable rows beside a stack of pictures. Pointing at or focusing a row marks it .is-on and
 * brings its picture up from below (SwapStack). The last row pointed at stays on, so moving the
 * pointer off the list doesn't flick the picture back.
 */
export function HoverSwapList({
  className, listClassName, rows, images, stackClassName, imageClassName, initial = 0, head, foot
}: HoverSwapListProps) {
  const [at, setAt] = useState(initial)
  return (
    <div className={className}>
      <div>
        {head}
        <ul className={listClassName}>
          {rows.map((row, i) => (
            <li
              key={row.title}
              tabIndex={0}
              className={i === at ? 'is-on' : undefined}
              style={row.style}
              onMouseEnter={() => setAt(i)}
              onFocus={() => setAt(i)}
            >
              {row.icon ? <div className="swaplist__icon">{row.icon}</div> : null}
              <strong>{row.title}</strong>
              <span>{row.text}</span>
            </li>
          ))}
        </ul>
        {foot}
      </div>
      <SwapStack images={images} active={at} className={stackClassName} itemClassName={imageClassName} />
    </div>
  )
}
