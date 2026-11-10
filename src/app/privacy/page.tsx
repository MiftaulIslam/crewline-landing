import { PageBehaviour } from '@/components/layout/PageBehaviour'
import { PhotoBand } from '@/components/sections/bands'
import { FeatureHero } from '@/components/sections/heroes'
import { FactsSection } from '@/components/sections/content'
import { LimitsSection } from '@/components/sections/limits'
import { DownloadSection, KeepReading } from '@/components/sections/PageEnd'
import { PageSchema } from '@/components/seo/PageSchema'
import { PrivateMachine } from '@/components/vignettes'
import { nextPage, relatedPages, site } from '@/content'
import content from '@/content/pages/privacy.json'
import { vignettes } from '@/content/vignettes'
import { pageMetadata } from '@/lib/seo/metadata'

export const metadata = pageMetadata('privacy')

export default function PrivacyPage() {
  return (
    <>
      <FeatureHero content={content.hero} next={nextPage('privacy')} nextLabel={site.nextLabel} downloadLabel={site.download.button}>
        <PrivateMachine content={vignettes.private} />
      </FeatureHero>
      <FactsSection content={content.staysLocal} ground="panel" />
      <PhotoBand content={content.cable} />
      <LimitsSection content={content.limits} ground="label" />
      <KeepReading title={site.keepReading} pages={relatedPages('privacy')} />
      <DownloadSection content={site.download} />
      <PageSchema slug="privacy" />
      <PageBehaviour />
    </>
  )
}
