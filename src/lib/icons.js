// The site's own line icons, drawn on a 24-unit grid for a round 1.6px stroke in currentColor.
// Plain markup strings so both React (components/icons/Icon.tsx) and the vignettes (lib/alive.js)
// can draw them. No icon library: these are ours.
export const ICONS = {
  // Channels
  phone: '<path d="M6.5 3.5h2.8l1.5 4.2-2.2 1.6a12 12 0 0 0 6.1 6.1l1.6-2.2 4.2 1.5v2.8a2 2 0 0 1-2.2 2A16.5 16.5 0 0 1 4.5 5.7a2 2 0 0 1 2-2.2z"/>',
  web: '<rect x="3" y="4.5" width="18" height="15" rx="2.5"/><path d="M3 9h18M6.5 6.8h.01M9 6.8h.01M7.5 13h6.5M7.5 16h4"/>',
  mail: '<rect x="3" y="5.5" width="18" height="13" rx="2"/><path d="M3.8 7.2 12 13l8.2-5.8"/>',
  // The crew
  desk: '<path d="M4.5 14v-2a7.5 7.5 0 0 1 15 0v2"/><rect x="3" y="13" width="4" height="6" rx="1.6"/><rect x="17" y="13" width="4" height="6" rx="1.6"/><path d="M19 19v.5a2.5 2.5 0 0 1-2.5 2.5H13"/>',
  orders: '<path d="M3.5 7.5 12 3l8.5 4.5v9L12 21l-8.5-4.5z"/><path d="M3.5 7.5 12 12l8.5-4.5M12 12v9M7.7 5.2l8.5 4.6"/>',
  tech: '<path d="M14.8 4.2a4.6 4.6 0 0 0-4.4 6l-6.2 6.2a2.1 2.1 0 0 0 3 3l6.2-6.2a4.6 4.6 0 0 0 6-4.4l-2.9 2.9-2.7-.7-.7-2.7z"/>',
  billing: '<rect x="3" y="5.5" width="18" height="13" rx="2"/><path d="M3 10h18M7 14.5h4"/>',
  review: '<path d="M12 3l7.5 3v5.4c0 4.6-3.2 8.1-7.5 9.6-4.3-1.5-7.5-5-7.5-9.6V6z"/><path d="M8.6 12l2.4 2.4 4.4-4.8"/>',
  research: '<circle cx="10.5" cy="10.5" r="6.2"/><path d="M15.2 15.2 20 20M8 10.5h5M10.5 8v5"/>',
  // Where a message ends up
  out: '<path d="M20.5 3.5 3.5 10.6l6.8 3.1 3.1 6.8z"/><path d="M10.3 13.7 20.5 3.5"/>',
  team: '<circle cx="9" cy="8.5" r="3.4"/><path d="M2.8 19.5a6.2 6.2 0 0 1 12.4 0"/><circle cx="17" cy="9.4" r="2.5"/><path d="M16.2 14.2a4.8 4.8 0 0 1 5 4.8"/>',
  // The four tools
  chat: '<path d="M4 5h16v11h-9.5L6 19.5V16H4z"/><path d="M8 9.5h8M8 12.5h5"/>',
  tts: '<path d="M4 9.5v5h3.5L12 18V6L7.5 9.5z"/><path d="M15.5 9.5a3.5 3.5 0 0 1 0 5M18 7a7 7 0 0 1 0 10"/>',
  stt: '<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21M9 21h6"/>',
  scan: '<path d="M6 3h8l4 4v14H6z"/><path d="M14 3v4h4M9 11h6M9 14.5h6M9 18h3.5"/>'
}

/** An icon as an SVG string, for markup built in JavaScript */
export function iconSvg(name, { size = 20, x, y, className = '', stroke = 1.6 } = {}) {
  const pos = x === undefined ? '' : ` x="${x}" y="${y}"`
  const sw = ((stroke * 24) / size).toFixed(2)
  return `<svg class="${className}"${pos} width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[name] ?? ''}</svg>`
}
