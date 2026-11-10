import { PageBehaviour } from '@/components/layout/PageBehaviour'
import { PhotoHero } from '@/components/sections/heroes'
import { FactsSection, ScreenStepper } from '@/components/sections/content'
import { DownloadSection, KeepReading } from '@/components/sections/PageEnd'
import { PageSchema } from '@/components/seo/PageSchema'
import { relatedPages, site } from '@/content'
import content from '@/content/pages/setup.json'
import { pageMetadata } from '@/lib/seo/metadata'

export const metadata = pageMetadata('setup')

export default function SetupPage() {
  return (
    <>
      <PhotoHero content={content.hero} />
      <ScreenStepper content={content.guide} ground="night" interval={5000} />
      <FactsSection content={content.needs} ground="panel" />
      <KeepReading title={site.keepReading} pages={relatedPages('setup')} />
      <DownloadSection content={site.download} />
      <PageSchema slug="setup" />
      <PageBehaviour />
    </>
  )
}
