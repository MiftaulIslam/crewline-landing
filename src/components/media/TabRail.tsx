'use client'

import { useEffect, useRef } from 'react'

/**
 * A bar that slides along a tablist to whichever tab lib/site.js has marked .is-on. Place it
 * inside the tablist (which must be position: relative). Once it is placed, the list gets
 * .has-rail so its CSS can drop the static per-tab marker; without script the list keeps that marker.
 */
export function TabRail() {
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const rail = ref.current
    const list = rail?.parentElement
    if (!rail || !list) return
    const place = () => {
      const tab = list.querySelector<HTMLElement>('[data-tab].is-on')
      if (tab) rail.style.transform = `translateY(${tab.offsetTop}px) scaleY(${tab.offsetHeight})`
    }
    place()
    list.classList.add('has-rail')
    // Turn the transition on only after the first placement, so it doesn't slide in at load
    const frame = requestAnimationFrame(() => rail.classList.add('is-ready'))
    const tabs = new MutationObserver(place)
    tabs.observe(list, { subtree: true, attributes: true, attributeFilter: ['class'] })
    const size = new ResizeObserver(place)
    size.observe(list)
    return () => {
      cancelAnimationFrame(frame)
      tabs.disconnect()
      size.disconnect()
      list.classList.remove('has-rail')
    }
  }, [])

  return <span ref={ref} className="tabrail" aria-hidden="true" />
}
