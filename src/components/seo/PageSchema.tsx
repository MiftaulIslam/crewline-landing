// Structured data for each page: every feature page renders <PageSchema slug="..." /> and the
// home page <HomeSchema />. The graphs are built in lib/seo/schema.ts.
import type { PageSlug } from '@/content/types'
import { pageGraph } from '@/lib/seo/schema'
import { JsonLd } from './JsonLd'

export function PageSchema({ slug }: { slug: PageSlug }) {
  return <JsonLd data={pageGraph(slug)} />
}

export function HomeSchema() {
  return <JsonLd data={pageGraph('home')} />
}
