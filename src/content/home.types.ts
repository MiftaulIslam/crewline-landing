// The shapes of the home page's editable content (content/pages/home.json). Like types.ts, these
// hold words, images and numbers only: grounds, jacks, ids and section order are set in
// components/home and app/page.tsx.
import type {
  Film, HoverListContent, Img, LanguageHeroContent, LimitsContent, PageSlug, Rich, StoryFilmContent,
  TitledText, VideoBandContent
} from './types'

/** A link to a feature page */
export interface PageLink {
  label: string
  slug: PageSlug
}

/** An image with its intrinsic size, so the browser reserves its space before it loads */
export interface SizedImg extends Img {
  width: number
  height: number
}

/** A tab and the screenshot it shows */
export interface TabScreen {
  tab: string
  image: Img
}

export interface HomeHeroContent {
  /** The headline, one phrase per line on wide screens */
  title: string[]
  lede: string
  download: string
  /** The button that jumps to the live pieces */
  demo: string
  film: Film
  credit: string
}

export interface ShopsContent {
  title: string
  lede: string
  items: {
    title: string
    text: string
    slug: PageSlug
    /** Shown at rest */
    image: string
    /** Shown on hover */
    hover: string
  }[]
}

export interface BoardContent {
  title: string
  legend: {
    board: string
    live: string
    waiting: string
    clear: string
  }
  image: SizedImg
}

export interface DriftContent {
  /** Names the strip for screen readers */
  label: string
  line: string
  front: Img[]
  back: Img[]
}

export interface TileContent {
  title: string
  link: PageLink
}

/** One tile per live vignette, named after it */
export interface LiveContent {
  title: string
  lede: string
  tiles: {
    routing: TileContent
    approve: TileContent
    scan: TileContent
    cite: TileContent
    hours: TileContent
    ingest: TileContent
  }
}

export interface CrewContent {
  title: string
  /** One per agent, in the order of the screenshots */
  items: TitledText[]
  more: PageLink
  images: Img[]
}

export interface PrivateContent {
  title: string
  lede: string
  image: Img
  more: PageLink
  credit: string
}

export interface SetupGuideContent {
  title: string
  lede: string
  more: PageLink
  steps: { title: string; text: string; image: string }[]
}

export interface FlowsRotateContent {
  title: string
  rule: Rich
  after: string
  lede: string
  code: string
  more: PageLink
  tabsLabel: string
  screens: TabScreen[]
}

export interface PhotoSeenContent {
  image: SizedImg
  caption: string
  /** What the model saw, placed at x% and y% of the photo */
  marks: { label: string; x: number; y: number }[]
  title: string
  lede: string
  quote: { text: string; cite: string }
  more: PageLink
}

export interface ApproveRotateContent {
  title: string
  lede: string
  more: PageLink
  tabsLabel: string
  /** Waiting, then approved */
  screens: TabScreen[]
}

export interface HomeLanguagesContent extends LanguageHeroContent {
  more: PageLink
}

export interface ReceiptsContent {
  title: string
  lede: string
  more: PageLink
  image: SizedImg
}

export interface HoursFilmContent extends VideoBandContent {
  /** The after-hours notice shown to customers */
  widget: string
}

export interface ToolsContent {
  title: string
  tabsLabel: string
  items: { title: string; text: string; image: Img }[]
}

/** A measured figure, with an optional unit set smaller after the value */
export interface Figure {
  /** What the figure measures; the section picks its icon from this */
  id: 'solved' | 'speed' | 'cited' | 'cloud'
  label: string
  value: string
  unit?: string
}

export interface NumbersContent {
  film: Film
  title: string
  figures: Figure[]
  note: string
}

export interface SaidContent {
  title: string
  lede: string
  more: PageLink
  /** Keys in content/transcripts.json, in the order they replay */
  transcripts: string[]
}

export interface HomeCompareContent {
  title: string
  lede: string
  more: PageLink
}

/** What a model does in the app; the ticker shows a glyph for it */
export type ModelRole = 'writes' | 'hears' | 'speaks' | 'reads' | 'searches'

export interface HardwareContent {
  title: string
  /** The three tiers; id picks the tier's icon */
  items: (TitledText & { id: 'light' | 'balanced' | 'best' })[]
  more: PageLink
  images: Img[]
  models: { label: string; names: string[]; roles: Record<string, ModelRole>; roleLabels: Record<ModelRole, string> }
}

export interface HomeDownloadContent {
  lede: string
  credit: string
}

export interface HomeContent {
  hero: HomeHeroContent
  questions: HoverListContent
  shops: ShopsContent
  why: VideoBandContent
  board: BoardContent
  drift: DriftContent
  live: LiveContent
  crew: CrewContent
  private: PrivateContent
  setup: SetupGuideContent
  flows: FlowsRotateContent
  photo: PhotoSeenContent
  approve: ApproveRotateContent
  languages: HomeLanguagesContent
  receipts: ReceiptsContent
  hours: HoursFilmContent
  tools: ToolsContent
  story: StoryFilmContent
  numbers: NumbersContent
  said: SaidContent
  compare: HomeCompareContent
  hardware: HardwareContent
  limits: LimitsContent
  faq: { title: string }
  download: HomeDownloadContent
}

/** HomeContent as TypeScript reads it from JSON, where page slugs and other string unions are plain strings */
type FromJson<T> = T extends string ? string : T extends (infer U)[] ? FromJson<U>[] : T extends object ? { [K in keyof T]: FromJson<T[K]> } : T
export type HomeJson = FromJson<HomeContent>
