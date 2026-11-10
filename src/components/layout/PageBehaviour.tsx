'use client'

import { useEffect } from 'react'
import { initSite } from '@/lib/site'

/**
 * Rendered once at the end of every page. Wires that page's cord, menus, rise-in, hover photos,
 * rotating screens, films and slider (lib/site.js), and unwires them when the page is left.
 */
export function PageBehaviour() {
  useEffect(() => initSite(), [])
  return null
}
