import type { Paragraphs } from '@/content/types'
import { RISE } from '@/lib/style'
import { Lede } from './Lede'

/** A section's heading and lead, rising into view together */
export function SectionHead({ title, lede }: { title: string; lede?: Paragraphs }) {
  return (
    <div className="block__head" {...RISE}>
      <h2 className="h2">{title}</h2>
      <Lede text={lede} />
    </div>
  )
}
