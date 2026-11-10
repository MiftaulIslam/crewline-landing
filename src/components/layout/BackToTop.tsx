/** The lamp in the corner: a ring that fills as you scroll, and a link back to the top */
export function BackToTop({ label }: { label: string }) {
  return (
    <a className="ring" href="#top" aria-label={label}>
      <svg viewBox="0 0 48 48" aria-hidden="true">
        <circle className="ring__track" cx="24" cy="24" r="21" />
        <circle className="ring__fill" cx="24" cy="24" r="21" pathLength="1" />
      </svg>
      <i />
    </a>
  )
}
