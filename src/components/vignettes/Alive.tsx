'use client'

import { useEffect, useRef, type ReactNode } from 'react'
import { mountAlive } from '@/lib/alive'

export type AliveName =
  | 'desk' | 'routing' | 'rule' | 'flowrun' | 'scan' | 'approve' | 'cite' | 'ingest' | 'import'
  | 'call' | 'translate' | 'hours' | 'private' | 'tiers' | 'chat' | 'stepper' | 'dial'

interface AliveProps {
  name: AliveName
  className?: string
  /** The content the vignette replays */
  data?: unknown
  /** Markup the vignette drives without replacing it (the stepper) */
  children?: ReactNode
}

/**
 * The client host for one live vignette. lib/alive.js builds the vignette's markup inside this
 * element on mount and removes it, with its timers, on unmount. Use the named components in
 * components/vignettes rather than this one directly.
 */
export function Alive({ name, className, data, children }: AliveProps) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => mountAlive(name, ref.current, data), [name, data])
  return (
    <div ref={ref} className={className} data-alive={name}>
      {children}
    </div>
  )
}
