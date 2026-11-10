import { PageBehaviour } from '@/components/layout/PageBehaviour'
import { PhotoHero } from '@/components/sections/heroes'
import { HoverList, ShowcaseSection, SplitSection, Statement } from '@/components/sections/content'
import { DownloadSection, KeepReading } from '@/components/sections/PageEnd'
import { PageSchema } from '@/components/seo/PageSchema'
import { AppWindow } from '@/components/ui/Media'
import { RoutingMap } from '@/components/vignettes'
import { relatedPages, site } from '@/content'
import content from '@/content/pages/agents.json'
import { vignettes } from '@/content/vignettes'
import { pageMetadata } from '@/lib/seo/metadata'

export const metadata = pageMetadata('agents')

export default function AgentsPage() {
  return (
    <>
      <PhotoHero content={content.hero} />
      <ShowcaseSection content={content.routes} ground="night">
        <RoutingMap content={vignettes.routing} />
      </ShowcaseSection>
      <HoverList content={content.crew} ground="panel" />
      <SplitSection content={content.houseRules} ground="night">
        <AppWindow image={content.houseRules.image} />
      </SplitSection>
      <Statement content={content.reviewer} ground="label" />
      <KeepReading title={site.keepReading} pages={relatedPages('agents')} />
      <DownloadSection content={site.download} />
      <PageSchema slug="agents" />
      <PageBehaviour />
    </>
  )
}
