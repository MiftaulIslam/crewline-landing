import { HomeDownload, HomeHero, HoursFilm, PrivatePhoto, WhyFilm } from '@/components/home/films'
import { CrewSection, FiveQuestions, HardwareSection, Shops } from '@/components/home/lists'
import { BoardReveal, LiveTiles, PhotoSeen, Receipts, ScreenDrift, SetupGuide } from '@/components/home/product'
import { FaqSection, HomeCompare, HomeLimits, NumbersSection, SaidSection } from '@/components/home/proof'
import { ApproveRotate, FlowsRotate, LanguagesRotate, ToolsRotate } from '@/components/home/rotating'
import { PageBehaviour } from '@/components/layout/PageBehaviour'
import { CompareTable } from '@/components/sections/CompareTable'
import { StoryFilm } from '@/components/sections/heroes'
import { HomeSchema } from '@/components/seo/PageSchema'
import { ChatReplay, DeskReplay, FaqDial } from '@/components/vignettes'
import { compare, faq, pickTranscripts, site } from '@/content'
import type { HomeContent, HomeJson } from '@/content/home.types'
import homeJson from '@/content/pages/home.json'
import { vignettes } from '@/content/vignettes'
import { homeMetadata } from '@/lib/seo/metadata'

export const metadata = homeMetadata()

// Checked against the content shape, then read with its page slugs typed
const json: HomeJson = homeJson
const content = json as HomeContent

export default function Home() {
  return (
    <>
      <HomeHero content={content.hero}>
        <DeskReplay content={vignettes.desk} className="hero-desk" />
      </HomeHero>
      <FiveQuestions content={content.questions} />
      <Shops content={content.shops} />
      <WhyFilm content={content.why} />
      <BoardReveal content={content.board} />
      <ScreenDrift content={content.drift} />
      <LiveTiles content={content.live} vignettes={vignettes} />
      <CrewSection content={content.crew} />
      <PrivatePhoto content={content.private} />
      <SetupGuide content={content.setup} />
      <FlowsRotate content={content.flows} />
      <PhotoSeen content={content.photo} />
      <ApproveRotate content={content.approve} />
      <LanguagesRotate content={content.languages} />
      <Receipts content={content.receipts} />
      <HoursFilm content={content.hours} />
      <ToolsRotate content={content.tools} />
      <StoryFilm content={content.story} as="h2" />
      <NumbersSection content={content.numbers} />
      <SaidSection content={content.said}>
        <ChatReplay transcripts={pickTranscripts(content.said.transcripts)} />
      </SaidSection>
      <HomeCompare content={content.compare}>
        <CompareTable content={compare} />
      </HomeCompare>
      <HardwareSection content={content.hardware} />
      <HomeLimits content={content.limits} />
      <FaqSection title={content.faq.title}>
        <FaqDial items={faq} />
      </FaqSection>
      <HomeDownload content={content.download} download={site.download} />
      <HomeSchema />
      <PageBehaviour />
    </>
  )
}
