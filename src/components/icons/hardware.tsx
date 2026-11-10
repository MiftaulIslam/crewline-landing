// Icons for the hardware section: one per tier of computer, one glyph per thing a model does
import type { ReactNode } from 'react'
import type { HardwareContent, ModelRole } from '@/content/home.types'
import { Glyph } from './Glyph'

export type TierId = HardwareContent['items'][number]['id']

const TIERS: Record<TierId, ReactNode> = {
  // A laptop
  light: (
    <>
      <rect x="4.5" y="5" width="15" height="10" rx="1.2" />
      <path d="M2.5 18.5h19M9.5 18.5l.6-1.2h3.8l.6 1.2" />
    </>
  ),
  // A monitor and a tower beside it
  balanced: (
    <>
      <rect x="2.5" y="4.5" width="13" height="9.5" rx="1.2" />
      <path d="M9 14v3.5M6 17.5h6" />
      <rect x="17.5" y="4.5" width="4" height="13" rx="1" />
      <path d="M19.5 7.5h0M19.5 10h0" />
    </>
  ),
  // A graphics card with two fans
  best: (
    <>
      <rect x="2" y="6" width="20" height="10.5" rx="1.5" />
      <circle cx="8" cy="11.25" r="3" />
      <circle cx="16" cy="11.25" r="3" />
      <path d="M8 9.75v1.5M16 9.75v1.5M5.5 16.5v2.5M9 16.5v2.5M12.5 16.5v2.5" />
    </>
  ),
}

const ROLES: Record<ModelRole, ReactNode> = {
  // A pencil
  writes: <path d="M4.5 19.5l1-4L15.8 5.2a2 2 0 0 1 2.9 0l.1.1a2 2 0 0 1 0 2.9L8.5 18.5zM13.8 7.2l3 3" />,
  // A microphone
  hears: (
    <>
      <rect x="9" y="3" width="6" height="11" rx="3" />
      <path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21" />
    </>
  ),
  // A speaker with sound coming out
  speaks: <path d="M4 9.5v5h3.5L12 18V6L7.5 9.5zM15.5 9.5a3.5 3.5 0 0 1 0 5M18 7a7 7 0 0 1 0 10" />,
  // A scanner's frame with its read line
  reads: <path d="M4 8V5.5A1.5 1.5 0 0 1 5.5 4H8M16 4h2.5A1.5 1.5 0 0 1 20 5.5V8M20 16v2.5a1.5 1.5 0 0 1-1.5 1.5H16M8 20H5.5A1.5 1.5 0 0 1 4 18.5V16M7 12h10" />,
  // A magnifier
  searches: (
    <>
      <circle cx="10.5" cy="10.5" r="6" />
      <path d="M15 15l5 5" />
    </>
  ),
}

/** The picture of a hardware tier: a laptop, a desktop, a graphics card */
export function TierIcon({ id, size = 28, className }: { id: TierId; size?: number; className?: string }) {
  return (
    <Glyph size={size} className={className}>
      {TIERS[id]}
    </Glyph>
  )
}

/** What a model does, as a small glyph */
export function RoleGlyph({ role, size = 16, className }: { role: ModelRole; size?: number; className?: string }) {
  return (
    <Glyph size={size} className={className}>
      {ROLES[role]}
    </Glyph>
  )
}
