'use client'

import Link from 'next/link'
import { useEffect, useRef, useState, useSyncExternalStore } from 'react'
import { createPortal } from 'react-dom'
import type { PageEntry, SiteContent } from '@/content/types'
import { Button } from '@/components/ui/Buttons'
import { BrandMark } from './BrandMark'

interface MobileNavProps {
  site: SiteContent
  pages: PageEntry[]
}

const FOCUSABLE = 'a[href], button:not([disabled])'
const never = () => () => {}

/**
 * The menu on phones and tablets: a button in the header that opens a drawer from the right
 * with every page, grouped as in the footer. While it's open the page behind doesn't scroll,
 * focus stays inside, and Escape, the close button, the backdrop or picking a page closes it.
 * Above 960px it isn't shown; the header's own links and Product menu take over.
 *
 * The drawer is portalled to <body>: the header is transformed and frosted, and either one makes
 * it the box that position: fixed children are placed in, so inside it the drawer would be
 * header-sized.
 */
export function MobileNav({ site, pages }: MobileNavProps) {
  const [open, setOpen] = useState(false)
  // false on the server and while hydrating, true after: only then is there a <body> to portal to
  const mounted = useSyncExternalStore(never, () => true, () => false)
  const button = useRef<HTMLButtonElement>(null)
  const panel = useRef<HTMLDivElement>(null)
  const close = () => setOpen(false)

  useEffect(() => {
    if (!open) return
    const root = document.documentElement
    const before = root.style.overflow
    root.style.overflow = 'hidden'
    panel.current?.querySelector<HTMLElement>('.drawer__close')?.focus()

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') return setOpen(false)
      if (e.key !== 'Tab' || !panel.current) return
      // Keep Tab inside the drawer
      const items = [...panel.current.querySelectorAll<HTMLElement>(FOCUSABLE)]
      const first = items[0]
      const last = items[items.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }
    // Close if the window grows past the drawer's range, e.g. a tablet turned sideways
    const wide = matchMedia('(min-width: 961px)')
    const onWide = () => wide.matches && setOpen(false)

    addEventListener('keydown', onKey)
    wide.addEventListener('change', onWide)
    const trigger = button.current
    return () => {
      root.style.overflow = before
      removeEventListener('keydown', onKey)
      wide.removeEventListener('change', onWide)
      trigger?.focus({ preventScroll: true })
    }
  }, [open])

  const byslug = (slug: string) => pages.find((p) => p.slug === slug)
  let index = 0

  return (
    <>
      <button
        ref={button}
        className="bar__menu"
        type="button"
        aria-expanded={open}
        aria-controls="drawer"
        aria-label={site.header.menuLabel}
        onClick={() => setOpen(true)}
      >
        <span className="bar__burger" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
      </button>

      {mounted && createPortal(
      <div className={open ? 'drawer is-open' : 'drawer'} id="drawer" inert={!open}>
        <div className="drawer__scrim" onClick={close} />
        <div className="drawer__panel" ref={panel} role="dialog" aria-modal="true" aria-label={site.header.menuLabel}>
          <div className="drawer__head">
            <Link className="drawer__brand" href="/" onClick={close}>
              <BrandMark /> {site.name}
            </Link>
            <button className="drawer__close" type="button" aria-label={site.header.closeLabel} onClick={close}>
              <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
                <path d="M6 6l12 12M18 6 6 18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          <nav className="drawer__nav" aria-label="All pages">
            {site.footer.columns.map((column) => (
              <section key={column.title}>
                <h2>{column.title}</h2>
                <ul>
                  {column.slugs.map((slug) => {
                    const page = byslug(slug)
                    if (!page) return null
                    const i = index++
                    return (
                      <li key={slug} style={{ transitionDelay: open ? `${80 + i * 22}ms` : '0ms' }}>
                        <Link href={`/${slug}`} onClick={close}>
                          <b>{page.nav}</b>
                          <span>{page.blurb}</span>
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              </section>
            ))}
          </nav>

          <div className="drawer__foot" onClick={close}>
            <Button href="/#download">{site.download.button}</Button>
            <p>{site.download.spec}</p>
          </div>
        </div>
      </div>,
      document.body)}
    </>
  )
}
