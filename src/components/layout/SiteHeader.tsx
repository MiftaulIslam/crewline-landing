import Link from 'next/link'
import type { PageEntry, SiteContent } from '@/content/types'
import { pageHref } from '@/content'
import { BrandMark } from './BrandMark'
import { MobileNav } from './MobileNav'
import { Button } from '@/components/ui/Buttons'

interface SiteHeaderProps {
  site: SiteContent
  pages: PageEntry[]
}

/** The Product menu: every feature page, with its screenshot shown on hover */
function MegaMenu({ pages }: { pages: PageEntry[] }) {
  return (
    <div className="mega" id="mega">
      <ul className="mega__list">
        {pages.map((p) => (
          <li key={p.slug}>
            <Link href={pageHref(p.slug)} data-img={p.shot}>
              <b>{p.nav}</b>
              <span>{p.blurb}</span>
            </Link>
          </li>
        ))}
      </ul>
      <figure className="mega__pic">
        <img src={pages[0].shot} alt="" loading="lazy" />
      </figure>
    </div>
  )
}

/** The fixed top bar. Opening the menus is wired by lib/site.js. */
export function SiteHeader({ site, pages }: SiteHeaderProps) {
  const { header } = site
  return (
    <header className="bar">
      <Link className="bar__brand" href="/" aria-label={header.homeLabel}>
        <BrandMark /> {site.name}
      </Link>
      <nav className="bar__nav" aria-label="Main">
        <div className="bar__item">
          <button type="button" aria-expanded="false" aria-controls="mega">
            {header.productLabel}
          </button>
          <MegaMenu pages={pages} />
        </div>
        {header.links.map((l) => (
          <Link key={l.slug} href={pageHref(l.slug)}>
            {l.label}
          </Link>
        ))}
      </nav>
      <Button variant="small" href="/#download">
        {header.download}
      </Button>
      <MobileNav site={site} pages={pages} />
    </header>
  )
}
