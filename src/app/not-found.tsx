import type { Metadata } from 'next'
import { Button } from '@/components/ui/Buttons'
import { RevealText } from '@/components/ui/RevealText'
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
          <RevealText as="h1" className="h1" text="Nobody's on this line" />
          <p className="lede">There's no page at this address. It may have moved, or the link has a typo.</p>
          <p className="hero__actions">
            <Button href="/">Back to the home page</Button>
          </p>
        </div>
      </section>
      <PageBehaviour />
    </>
  )
}
