import { PageBehaviour } from '@/components/layout/PageBehaviour'
import { VideoBand } from '@/components/sections/bands'
import { PhotoHero } from '@/components/sections/heroes'
import { SplitSection, StepsSection } from '@/components/sections/content'
import { DownloadSection, KeepReading } from '@/components/sections/PageEnd'
import { PageSchema } from '@/components/seo/PageSchema'
import { ChatReplay, HoursDial } from '@/components/vignettes'
import { pickTranscripts, relatedPages, site } from '@/content'
import content from '@/content/pages/after-hours.json'
import { vignettes } from '@/content/vignettes'
import { pageMetadata } from '@/lib/seo/metadata'

export const metadata = pageMetadata('after-hours')

export default function AfterHoursPage() {
  return (
    <>
      <PhotoHero content={content.hero} />
      <SplitSection content={content.dayDial} ground="night">
        <HoursDial content={vignettes.hours} />
      </SplitSection>
      <SplitSection content={content.nightMessage} ground="label" flip>
        <ChatReplay transcripts={pickTranscripts(content.nightMessage.chat)} />
      </SplitSection>
      <StepsSection content={content.decides} ground="panel" />
      <VideoBand content={content.stopAtSix} />
      <KeepReading title={site.keepReading} pages={relatedPages('after-hours')} />
      <DownloadSection content={site.download} />
      <PageSchema slug="after-hours" />
      <PageBehaviour />
    </>
  )
}
