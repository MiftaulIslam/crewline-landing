/** The red cord the page draws down the left edge as you scroll. lib/site.js lays it out. */
export function Cord() {
  return (
    <svg id="cord" aria-hidden="true">
      <defs>
        <clipPath id="cord-clip">
          <rect id="cord-clip-rect" x="0" y="0" width="100%" height="0" />
        </clipPath>
      </defs>
      <g clipPath="url(#cord-clip)">
        <path id="cord-base" fill="none" />
        <path id="cord-weave" fill="none" />
      </g>
      <g id="cord-plug">
        <rect x="-5" y="-30" width="10" height="20" rx="2" fill="#17110c" />
        <rect x="-3.5" y="-10" width="7" height="12" fill="#c9a24b" />
        <rect x="-2" y="2" width="4" height="10" rx="2" fill="#e3c67c" />
      </g>
    </svg>
  )
}
