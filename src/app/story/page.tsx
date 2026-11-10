import { PageBehaviour } from '@/components/layout/PageBehaviour'
import { StoryFilm } from '@/components/sections/heroes'
import { DataTable, Statement } from '@/components/sections/content'
import { DownloadSection, KeepReading } from '@/components/sections/PageEnd'
import { PageSchema } from '@/components/seo/PageSchema'
import { relatedPages, site } from '@/content'
import content from '@/content/pages/story.json'
import { pageMetadata } from '@/lib/seo/metadata'

export const metadata = pageMetadata('story')

export default function StoryPage() {
  return (
    <>
      <StoryFilm content={content.film} />
      <DataTable content={content.record} ground="panel" />
      <Statement content={content.outcome} ground="label" />
      <KeepReading title={site.keepReading} pages={relatedPages('story')} />
      <DownloadSection content={site.download} />
      <PageSchema slug="story" />
      <PageBehaviour />
    </>
  )
}
