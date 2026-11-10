/** The Crewline mark: a C drawn as one cord with three crew on it, the live line in amber */
export function BrandMark() {
  return (
    <svg viewBox="0 0 20 20" width="24" height="24" aria-hidden="true">
      <path d="M15.65 5.05A7 7 0 0 0 3.7 10" fill="none" stroke="currentColor" strokeWidth="1.9" opacity=".7" />
      <path d="M3.7 10A7 7 0 0 0 15.65 14.95" fill="none" stroke="#f5b53c" strokeWidth="2" />
      <circle cx="15.65" cy="5.05" r="2.3" fill="currentColor" />
      <circle cx="3.7" cy="10" r="2.3" fill="currentColor" />
      <circle cx="15.65" cy="14.95" r="2.9" fill="#f5b53c" />
    </svg>
  )
}
