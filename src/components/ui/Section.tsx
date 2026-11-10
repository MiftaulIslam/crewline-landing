import type { ReactNode } from 'react'
import type { Ground } from '@/lib/style'
import { Jack } from './Jack'

interface SectionProps {
  /** Background: enamel panel (default), night ink or label cream */
  ground?: Ground
  /** Jack height in the section, as a percentage */
  jack?: number
  children: ReactNode
}

/** The usual section: a ground, a jack for the cord and the page's wrap */
export function Section({ ground = 'panel', jack = 10, children }: SectionProps) {
  return (
    <section className={ground}>
      <Jack y={jack} />
      <div className="wrap">{children}</div>
    </section>
  )
}
