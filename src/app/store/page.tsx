import { PageBehaviour } from '@/components/layout/PageBehaviour'
import { PhotoHero } from '@/components/sections/heroes'
import { LimitsSection, ShowcaseSection, SplitSection, StepsSection } from '@/components/sections/content'
import { DownloadSection, KeepReading } from '@/components/sections/PageEnd'
import { PageSchema } from '@/components/seo/PageSchema'
import { AppWindow } from '@/components/ui/Media'
import { StoreImport } from '@/components/vignettes'
import { relatedPages, site } from '@/content'
import content from '@/content/pages/store.json'
import { vignettes } from '@/content/vignettes'
import { pageMetadata } from '@/lib/seo/metadata'

export const metadata = pageMetadata('store')

export default function StorePage() {
  return (
    <>
      <PhotoHero content={content.hero} />
      <ShowcaseSection content={content.threeFiles} ground="panel">
        <StoreImport content={vignettes.import} />
      </ShowcaseSection>
      <StepsSection content={content.staysCurrent} ground="night" />
      <SplitSection content={content.startFresh} ground="label" flip>
        <AppWindow image={content.startFresh.image} />
      </SplitSection>
      <LimitsSection content={content.limits} ground="panel" />
      <KeepReading title={site.keepReading} pages={relatedPages('store')} />
      <DownloadSection content={site.download} />
      <PageSchema slug="store" />
      <PageBehaviour />
    </>
  )
}
