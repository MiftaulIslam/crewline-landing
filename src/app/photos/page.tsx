import { PageBehaviour } from '@/components/layout/PageBehaviour'
import { PhotoHero } from '@/components/sections/heroes'
import { ShowcaseSection, SplitSection, StepsSection } from '@/components/sections/content'
import { LimitsSection } from '@/components/sections/limits'
import { DownloadSection, KeepReading } from '@/components/sections/PageEnd'
import { PageSchema } from '@/components/seo/PageSchema'
import { AppWindow } from '@/components/ui/Media'
import { PhotoScan } from '@/components/vignettes'
import { relatedPages, site } from '@/content'
import content from '@/content/pages/photos.json'
import { vignettes } from '@/content/vignettes'
import { pageMetadata } from '@/lib/seo/metadata'

export const metadata = pageMetadata('photos')

export default function PhotosPage() {
  return (
    <>
      <PhotoHero content={content.hero} />
      <ShowcaseSection content={content.tornBox} ground="night">
        <PhotoScan content={vignettes.scan} />
      </ShowcaseSection>
      <StepsSection content={content.whatHappened} ground="panel" />
      <SplitSection content={content.customerView} ground="label" flip>
        <AppWindow image={content.customerView.image} />
      </SplitSection>
      <LimitsSection content={content.limits} ground="panel" />
      <KeepReading title={site.keepReading} pages={relatedPages('photos')} />
      <DownloadSection content={site.download} />
      <PageSchema slug="photos" />
      <PageBehaviour />
    </>
  )
}
