import type { CSSProperties } from 'react'

/** Inline CSS custom properties (--y, --a, ...), which React's style type doesn't list */
export const vars = (v: Record<string, string | number>) => v as CSSProperties

/** Marks an element that fades up the first time it scrolls into view (see lib/site.js) */
export const RISE = { 'data-rise': '' } as const

/** The cord's background grounds, from site.css */
export type Ground = 'panel' | 'night' | 'label'
