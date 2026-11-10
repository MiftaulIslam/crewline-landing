import { vars } from '@/lib/style'

interface JackProps {
  /** Height in the section, as a percentage */
  y?: number
  /** Distance from the left, as a percentage; the gutter when left out */
  x?: number
  /** The last jack, sitting inline beside the Download button */
  end?: boolean
}

/** A brass jack the cord plugs into. lib/site.js threads the cord through every jack on the page. */
export function Jack({ y = 10, x, end }: JackProps) {
  if (end) return <span className="jack jack--end" data-jack="" />
  return <span className="jack" data-jack="" style={vars(x === undefined ? { '--y': `${y}%` } : { '--y': `${y}%`, '--x': `${x}%` })} />
}
