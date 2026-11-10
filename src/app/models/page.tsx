import { PageBehaviour } from '@/components/layout/PageBehaviour'
import { PhotoBand } from '@/components/sections/bands'
import { FeatureHero } from '@/components/sections/heroes'
import { DataTable, SplitSection } from '@/components/sections/content'
import { DownloadSection, KeepReading } from '@/components/sections/PageEnd'
import { PageSchema } from '@/components/seo/PageSchema'
import { AppWindow } from '@/components/ui/Media'
import { TierPicker } from '@/components/vignettes'
import { nextPage, relatedPages, site } from '@/content'
import content from '@/content/pages/models.json'
import { vignettes } from '@/content/vignettes'
import { pageMetadata } from '@/lib/seo/metadata'

export const metadata = pageMetadata('models')

export default function ModelsPage() {
  return (
    <>
      <FeatureHero content={content.hero} next={nextPage('models')} nextLabel={site.nextLabel} downloadLabel={site.download.button}>
        <TierPicker content={vignettes.tiers} />
      </FeatureHero>
      <DataTable content={content.jobs} ground="panel" />
      <PhotoBand content={content.oneCard} />
      <SplitSection content={content.youChoose} ground="label" flip>
        <AppWindow image={content.youChoose.image} />
      </SplitSection>
      <KeepReading title={site.keepReading} pages={relatedPages('models')} />
      <DownloadSection content={site.download} />
      <PageSchema slug="models" />
      <PageBehaviour />
    </>
  )
}
