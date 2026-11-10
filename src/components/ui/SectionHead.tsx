import type { Paragraphs } from '@/content/types'
import { RISE } from '@/lib/style'
import { Lede } from './Lede'
import { RevealText } from './RevealText'

/** A section's heading and lead, rising into view together */
export function SectionHead({ title, lede }: { title: string; lede?: Paragraphs }) {
  return (
    <div className="block__head" {...RISE}>
      <RevealText className="h2" text={title} />
      <Lede text={lede} />
    </div>
  )
}
