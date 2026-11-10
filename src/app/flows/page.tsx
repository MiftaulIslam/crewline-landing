import { PageBehaviour } from '@/components/layout/PageBehaviour'
import { FeatureHero } from '@/components/sections/heroes'
import { HoverList, ScreenStepper, SplitSection } from '@/components/sections/content'
import { LimitsSection } from '@/components/sections/limits'
import { DownloadSection, KeepReading } from '@/components/sections/PageEnd'
import { PageSchema } from '@/components/seo/PageSchema'
import { FlowRun, RuleLimit } from '@/components/vignettes'
import { nextPage, relatedPages, site } from '@/content'
import content from '@/content/pages/flows.json'
import { vignettes } from '@/content/vignettes'
import { pageMetadata } from '@/lib/seo/metadata'

export const metadata = pageMetadata('flows')

export default function FlowsPage() {
  return (
    <>
      <FeatureHero content={content.hero} next={nextPage('flows')} nextLabel={site.nextLabel} downloadLabel={site.download.button}>
        <RuleLimit content={vignettes.rule} />
      </FeatureHero>
      <SplitSection content={content.testRun} ground="panel" flip>
        <FlowRun content={vignettes.flowrun} />
      </SplitSection>
      <HoverList content={content.flowList} ground="night" />
      <ScreenStepper content={content.building} ground="label" />
      <LimitsSection content={content.limits} ground="panel" />
      <KeepReading title={site.keepReading} pages={relatedPages('flows')} />
      <DownloadSection content={site.download} />
      <PageSchema slug="flows" />
      <PageBehaviour />
    </>
  )
}
