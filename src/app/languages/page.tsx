import { PageBehaviour } from '@/components/layout/PageBehaviour'
import { LanguageHero } from '@/components/sections/heroes'
import { SplitSection, StepsSection } from '@/components/sections/content'
import { LimitsSection } from '@/components/sections/limits'
import { DownloadSection, KeepReading } from '@/components/sections/PageEnd'
import { PageSchema } from '@/components/seo/PageSchema'
import { AppWindow } from '@/components/ui/Media'
import { TranslationPath } from '@/components/vignettes'
import { relatedPages, site } from '@/content'
import content from '@/content/pages/languages.json'
import { vignettes } from '@/content/vignettes'
import { pageMetadata } from '@/lib/seo/metadata'

export const metadata = pageMetadata('languages')

export default function LanguagesPage() {
  return (
    <>
      <LanguageHero content={content.hero} />
      <SplitSection content={content.exactNumbers} ground="night">
        <TranslationPath content={vignettes.translate} />
      </SplitSection>
      <StepsSection content={content.setup} ground="panel" />
      <SplitSection content={content.tomas} ground="label" flip>
        <AppWindow image={content.tomas.image} />
      </SplitSection>
      <LimitsSection content={content.limits} ground="panel" />
      <KeepReading title={site.keepReading} pages={relatedPages('languages')} />
      <DownloadSection content={site.download} />
      <PageSchema slug="languages" />
      <PageBehaviour />
    </>
  )
}
