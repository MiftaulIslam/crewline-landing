import type { Metadata } from 'next'
import Link from 'next/link'
import { PageBehaviour } from '@/components/layout/PageBehaviour'
import { Jack } from '@/components/ui/Jack'

// Next adds noindex to not-found responses itself
export const metadata: Metadata = {
  title: 'Page not found'
}

export default function NotFound() {
  return (
    <>
      <section className="night hero2" id="top">
        <Jack y={30} />
        <div className="wrap">
          <h1 className="h1">Nobody's on this line</h1>
          <p className="lede">There's no page at this address. It may have moved, or the link has a typo.</p>
          <p className="hero__actions">
            <Link className="btn" href="/">
              Back to the home page
            </Link>
          </p>
        </div>
      </section>
      <PageBehaviour />
    </>
  )
}
