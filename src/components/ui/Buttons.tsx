import Link from 'next/link'
import type { ReactNode } from 'react'
import { DOWNLOAD_URL } from '@/lib/config'

/** The amber Download button. It is the one primary action on every page. */
export function DownloadButton({ children }: { children: ReactNode }) {
  return (
    <a className="btn" href={DOWNLOAD_URL}>
      {children}
    </a>
  )
}

/** An underlined "read more" link to another page */
export function MoreLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link className="more" href={href}>
      {children}
    </Link>
  )
}
