import { PageBehaviour } from '@/components/layout/PageBehaviour'
import { PhotoBand } from '@/components/sections/bands'
import { FeatureHero } from '@/components/sections/heroes'
import { LimitsSection, ScreenStepper, SplitSection } from '@/components/sections/content'
import { DownloadSection, KeepReading } from '@/components/sections/PageEnd'
import { PageSchema } from '@/components/seo/PageSchema'
import { AppWindow } from '@/components/ui/Media'
import { LiveCall } from '@/components/vignettes'
import { nextPage, relatedPages, site } from '@/content'
import content from '@/content/pages/calls.json'
import { vignettes } from '@/content/vignettes'
import { pageMetadata } from '@/lib/seo/metadata'

export const metadata = pageMetadata('calls')

export default function CallsPage() {
  return (
    <>
      <FeatureHero content={content.hero} next={nextPage('calls')} nextLabel={site.nextLabel} downloadLabel={site.download.button}>
        <LiveCall content={vignettes.call} />
      </FeatureHero>
      <SplitSection content={content.callScreen} ground="panel">
        <AppWindow image={content.callScreen.image} />
      </SplitSection>
      <ScreenStepper content={content.voiceTools} ground="night" />
      <PhotoBand content={content.hardCalls} />
      <LimitsSection content={content.limits} ground="label" />
      <KeepReading title={site.keepReading} pages={relatedPages('calls')} />
      <DownloadSection content={site.download} />
      <PageSchema slug="calls" />
      <PageBehaviour />
    </>
  )
}
