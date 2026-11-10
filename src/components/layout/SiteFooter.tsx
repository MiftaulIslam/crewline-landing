import Link from 'next/link'
import type { FooterColumn, PageEntry, SiteContent } from '@/content/types'
import { pageHref } from '@/content'
import { Button } from '@/components/ui/Buttons'

interface SiteFooterProps {
  site: SiteContent
  pages: PageEntry[]
}

function Column({ column, pages }: { column: FooterColumn; pages: PageEntry[] }) {
  return (
    <div>
      <h3>{column.title}</h3>
      <ul>
        {column.slugs.map((slug) => (
          <li key={slug}>
            <Link href={pageHref(slug)}>{pages.find((p) => p.slug === slug)?.nav}</Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function SiteFooter({ site, pages }: SiteFooterProps) {
  const { footer } = site
  return (
    <footer className="footer">
      <div className="footer__top">
        <div className="footer__brand">
          <strong>{site.name}</strong>
          <p>
            {site.tagline}. {site.sampleNote}
          </p>
          <p>
            <Button variant="small" href="/#download">
              {footer.download}
            </Button>
          </p>
        </div>
        {footer.columns.map((c) => (
          <Column key={c.title} column={c} pages={pages} />
        ))}
      </div>
      <div className="footer__end">
        <p>{footer.credits}</p>
        <p>
          <a href="/CREDITS.md">{footer.creditsLabel}</a>
        </p>
      </div>
    </footer>
  )
}
