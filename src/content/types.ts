// The shapes of the editable content. JSON files in content/ hold the words, images and
// numbers; components decide layout, order, styling and behaviour. Nothing here describes
// layout: section order lives in each page's route file, and grounds (colours) and flips are
// props set there.

/** A picture with its description. focus is the object-position that keeps the subject in frame. */
export interface Img {
  src: string
  alt: string
  focus?: string
}

/** A looping or playable film: the video file and the still shown before it plays */
export interface Film {
  src: string
  poster: string
}

/** One or more paragraphs */
export type Paragraphs = string | string[]

/** Text that may mark a highlight with **double asterisks** (rendered as <b>) */
export type Rich = string

export interface TitledText {
  title: string
  text: string
}

export interface Question {
  question: string
  answer: string
}

export interface Transcript {
  who: string
  tag: string
  lines: { from: 'customer' | 'agent'; text: string }[]
}

// ------------------------------------------------------------------ site-wide

export type PageSlug =
  | 'conversations' | 'agents' | 'flows' | 'knowledge' | 'photos' | 'calls' | 'approvals' | 'languages'
  | 'after-hours' | 'store' | 'models' | 'privacy' | 'setup' | 'compare' | 'story' | 'faq'

/** One feature page in the menu, footer, sitemap and "Keep reading" */
export interface PageEntry {
  slug: PageSlug
  /** Short name in the menu and footer */
  nav: string
  /** One line under the name in the menu */
  blurb: string
  /** Document title, before " | Crewline" */
  title: string
  /** Meta description and the summary used in llms.txt */
  description: string
  /** App screenshot shown in the menu and on hover in "Keep reading" */
  shot: string
  /** Photo shown in "Keep reading" */
  photo: string
  /** ISO date the page's content last changed */
  updated: string
}

export interface FooterColumn {
  title: string
  slugs: PageSlug[]
}

export interface SiteContent {
  name: string
  tagline: string
  description: string
  /** Default document title for the home page */
  title: string
  locale: string
  /** Fernway is a made-up sample shop; say so wherever it appears */
  sampleNote: string
  header: {
    homeLabel: string
    productLabel: string
    menuLabel: string
    closeLabel: string
    links: { label: string; slug: PageSlug }[]
    download: string
  }
  footer: {
    columns: FooterColumn[]
    download: string
    credits: string
    creditsLabel: string
  }
  backToTop: string
  download: {
    title: string
    button: string
    spec: string
    film: Film
    /** What the installer needs, for structured data */
    os: string
    size: string
    version: string
  }
  keepReading: string
  nextLabel: string
  /** Labels of the chat that answers the "doesn't do yet" questions */
  chat: { agent: string; you: string; thinking: string; ask: string; label: string }
}

// ------------------------------------------------------------------ shared sections

export interface FeatureHeroContent {
  title: string
  lede: Paragraphs
}

export interface PhotoHeroContent {
  title: string
  lede: Paragraphs
  image: Img
}

export interface LanguageHeroContent {
  title: string
  phrases: { text: string; lang?: string }[]
  lede: string
}

export interface StoryFilmContent {
  title: string
  lede: Paragraphs
  play: string
  film: Film
  /** For VideoObject structured data */
  duration: string
  uploaded: string
}

export interface ListSectionContent {
  title: string
  lede?: Paragraphs
  items: TitledText[]
}

export interface SplitContent {
  title: string
  lede: Paragraphs
}

export interface ShowcaseContent {
  title: string
  lede?: Paragraphs
}

export interface PhotoBandContent {
  title: string
  lede: Paragraphs
  image: Img
}

export interface VideoBandContent {
  title: string
  lede: Paragraphs
  film: Film
}

export interface StatementContent {
  line: Rich
  after?: string
}

export interface ScreenStepperContent {
  title: string
  lede?: Paragraphs
  steps: { title: string; text: string; image: Img }[]
}

export interface HoverListContent {
  title: string
  lede?: Paragraphs
  items: { title: string; text: string; image: string }[]
}

export interface TableContent {
  title: string
  lede?: Paragraphs
  columns: string[]
  rows: string[][]
}

export interface LimitsContent {
  title: string
  items: Question[]
}

export interface ShotContent {
  image: Img
}

export interface CompareContent {
  label: string
  columns: string[]
  ours: string
  rows: { label: string; values: string[]; ours: string }[]
  meter: {
    label: string
    rate: number
    rateLabel: string
    perMonth: string
    oursLabel: string
    oursValue: string
    oursNote: string
    note: string
    min: number
    max: number
    step: number
    start: number
  }
}
