import { LABEL, LAMP } from '@/lib/seo/site'

/** The Crewline mark from components/layout/BrandMark.tsx, with currentColor set to cream */
export function Mark({ size }: { size: number }) {
  return (
    <svg viewBox="0 0 20 20" width={size} height={size}>
      <path d="M15.65 5.05A7 7 0 0 0 3.7 10" fill="none" stroke={LABEL} strokeWidth="1.9" opacity=".7" />
      <path d="M3.7 10A7 7 0 0 0 15.65 14.95" fill="none" stroke={LAMP} strokeWidth="2" />
      <circle cx="15.65" cy="5.05" r="2.3" fill={LABEL} />
      <circle cx="3.7" cy="10" r="2.3" fill={LABEL} />
      <circle cx="15.65" cy="14.95" r="2.9" fill={LAMP} />
    </svg>
  )
}
