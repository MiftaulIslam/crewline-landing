import { PageBehaviour } from '@/components/layout/PageBehaviour'
import { PhotoHero } from '@/components/sections/heroes'
import { DialSection, QuestionList } from '@/components/sections/content'
import { DownloadSection, KeepReading } from '@/components/sections/PageEnd'
import { PageSchema } from '@/components/seo/PageSchema'
import { FaqDial } from '@/components/vignettes'
import { faq, relatedPages, site } from '@/content'
import content from '@/content/pages/faq.json'
import { pageMetadata } from '@/lib/seo/metadata'

export const metadata = pageMetadata('faq')

export default function FaqPage() {
  return (
    <>
      <PhotoHero content={content.hero} />
      <DialSection title={content.dialTitle} ground="night">
        <FaqDial items={faq} />
      </DialSection>
      <QuestionList title={content.listTitle} items={faq} ground="panel" />
      <KeepReading title={site.keepReading} pages={relatedPages('faq')} />
      <DownloadSection content={site.download} />
      <PageSchema slug="faq" />
      <PageBehaviour />
    </>
  )
}
