import { PageBehaviour } from '@/components/layout/PageBehaviour'
import { CompareTable } from '@/components/sections/CompareTable'
import { PhotoHero } from '@/components/sections/heroes'
import { FactsSection } from '@/components/sections/content'
import { DownloadSection, KeepReading } from '@/components/sections/PageEnd'
import { PageSchema } from '@/components/seo/PageSchema'
import { Section } from '@/components/ui/Section'
import { SectionHead } from '@/components/ui/SectionHead'
import { compare, relatedPages, site } from '@/content'
import content from '@/content/pages/compare.json'
import { pageMetadata } from '@/lib/seo/metadata'

export const metadata = pageMetadata('compare')

export default function ComparePage() {
  return (
    <>
      <PhotoHero content={content.hero} />
      <Section ground="label">
        <SectionHead title={content.sideBySide.title} />
        <CompareTable content={compare} />
      </Section>
      <FactsSection content={content.elsewhere} ground="panel" />
      <KeepReading title={site.keepReading} pages={relatedPages('compare')} />
      <DownloadSection content={site.download} />
      <PageSchema slug="compare" />
      <PageBehaviour />
    </>
  )
}
