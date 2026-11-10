import { PageBehaviour } from '@/components/layout/PageBehaviour'
import { PhotoBand } from '@/components/sections/bands'
import { FeatureHero } from '@/components/sections/heroes'
import { HoverList, SplitSection } from '@/components/sections/content'
import { DownloadSection, KeepReading } from '@/components/sections/PageEnd'
import { PageSchema } from '@/components/seo/PageSchema'
import { AppWindow } from '@/components/ui/Media'
import { ApprovalCard, RuleLimit } from '@/components/vignettes'
import { nextPage, relatedPages, site } from '@/content'
import content from '@/content/pages/approvals.json'
import { vignettes } from '@/content/vignettes'
import { pageMetadata } from '@/lib/seo/metadata'

export const metadata = pageMetadata('approvals')

export default function ApprovalsPage() {
  return (
    <>
      <FeatureHero content={content.hero} next={nextPage('approvals')} nextLabel={site.nextLabel} downloadLabel={site.download.button}>
        <ApprovalCard content={vignettes.approve} />
      </FeatureHero>
      <HoverList content={content.cameToPerson} ground="panel" />
      <SplitSection content={content.decide} ground="night" flip>
        <AppWindow image={content.decide.image} />
      </SplitSection>
      <PhotoBand content={content.owners} />
      <SplitSection content={content.setLimit} ground="label">
        <RuleLimit content={vignettes.rule} />
      </SplitSection>
      <KeepReading title={site.keepReading} pages={relatedPages('approvals')} />
      <DownloadSection content={site.download} />
      <PageSchema slug="approvals" />
      <PageBehaviour />
    </>
  )
}
