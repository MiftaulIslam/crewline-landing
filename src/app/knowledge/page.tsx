import { PageBehaviour } from '@/components/layout/PageBehaviour'
import { PhotoHero } from '@/components/sections/heroes'
import { ScreenStepper, SplitSection, Statement, StepsSection } from '@/components/sections/content'
import { DownloadSection, KeepReading } from '@/components/sections/PageEnd'
import { PageSchema } from '@/components/seo/PageSchema'
import { DocumentIngest, SourceScores } from '@/components/vignettes'
import { relatedPages, site } from '@/content'
import content from '@/content/pages/knowledge.json'
import { vignettes } from '@/content/vignettes'
import { pageMetadata } from '@/lib/seo/metadata'

export const metadata = pageMetadata('knowledge')

export default function KnowledgePage() {
  return (
    <>
      <PhotoHero content={content.hero} />
      <SplitSection content={content.ingest} ground="panel">
        <DocumentIngest content={vignettes.ingest} />
      </SplitSection>
      <SplitSection content={content.scores} ground="night" flip>
        <SourceScores content={vignettes.cite} />
      </SplitSection>
      <Statement content={content.threshold} ground="label" />
      <StepsSection content={content.unanswered} ground="panel" />
      <ScreenStepper content={content.whereToLook} ground="night" />
      <KeepReading title={site.keepReading} pages={relatedPages('knowledge')} />
      <DownloadSection content={site.download} />
      <PageSchema slug="knowledge" />
      <PageBehaviour />
    </>
  )
}
