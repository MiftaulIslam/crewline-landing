import type { Paragraphs } from '@/content/types'

/** One or more lead paragraphs */
export function Lede({ text, className = 'lede' }: { text?: Paragraphs; className?: string }) {
  const list = Array.isArray(text) ? text : text ? [text] : []
  return list.map((p) => (
    <p className={className} key={p}>
      {p}
    </p>
  ))
}
