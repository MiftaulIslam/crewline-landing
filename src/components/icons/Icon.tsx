import { ICONS } from '@/lib/icons'
import { Glyph } from './Glyph'

export type IconName = keyof typeof ICONS

/** One of the site's own line icons (lib/icons.js), the same set the vignettes draw */
export function Icon({ name, size = 22, className }: { name: IconName; size?: number; className?: string }) {
  return (
    <Glyph size={size} className={className}>
      {/* The markup is the site's own constant icon set, never content */}
      <g dangerouslySetInnerHTML={{ __html: ICONS[name] }} />
    </Glyph>
  )
}
