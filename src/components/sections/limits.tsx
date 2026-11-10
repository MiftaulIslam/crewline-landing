import type { LimitsContent } from '@/content/types'
import { Section } from '@/components/ui/Section'
import type { Ground } from '@/lib/style'
import { LimitsChat } from './LimitsChat'

/** What it doesn't do yet: the questions, answered in Crewline's chat */
export function LimitsSection({ content, ground }: { content: LimitsContent; ground?: Ground }) {
  return (
    <Section ground={ground}>
      <LimitsChat content={content} />
    </Section>
  )
}
