import { PageBehaviour } from '@/components/layout/PageBehaviour'
import { PhotoBand } from '@/components/sections/bands'
import { FeatureHero } from '@/components/sections/heroes'
import { ScreenStepper, SplitSection, StepsSection } from '@/components/sections/content'
import { LimitsSection } from '@/components/sections/limits'
import { DownloadSection, KeepReading } from '@/components/sections/PageEnd'
import { PageSchema } from '@/components/seo/PageSchema'
import { ChatReplay, DeskReplay } from '@/components/vignettes'
import { nextPage, pickTranscripts, relatedPages, site } from '@/content'
import content from '@/content/pages/conversations.json'
import { vignettes } from '@/content/vignettes'
import { pageMetadata } from '@/lib/seo/metadata'

export const metadata = pageMetadata('conversations')

export default function ConversationsPage() {
  return (
    <>
      <FeatureHero content={content.hero} next={nextPage('conversations')} nextLabel={site.nextLabel} downloadLabel={site.download.button}>
        <DeskReplay content={vignettes.desk} />
      </FeatureHero>
      <StepsSection content={content.afterWriting} ground="panel" />
      <PhotoBand content={content.stepIn} />
      <ScreenStepper content={content.oneScreen} ground="night" />
      <SplitSection content={content.testDay} ground="label" flip>
        <ChatReplay transcripts={pickTranscripts(content.testDay.chat)} />
      </SplitSection>
      <LimitsSection content={content.limits} ground="panel" />
      <KeepReading title={site.keepReading} pages={relatedPages('conversations')} />
      <DownloadSection content={site.download} />
      <PageSchema slug="conversations" />
      <PageBehaviour />
    </>
  )
}
