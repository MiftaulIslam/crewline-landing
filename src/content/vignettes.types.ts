// The shapes of the live vignettes' content in content/vignettes.json. The JSON holds every word,
// number and timing a vignette shows; lib/alive.js keeps the layout (SVG geometry, node positions,
// colours, pacing). Fields that name a node, module or agent use the keys listed in their comment:
// they stay plain strings so the raw JSON import still type-checks against these interfaces.

/** The hero's front desk: conversations arriving, being worked and answered, one after another */
export interface DeskContent {
  scenes: {
    /** The customer */
    name: string
    /** Where the message came in, e.g. "Chat" */
    channel: string
    /** What the customer wrote, typed out */
    said: string
    /** The agent that works it, by its display name */
    agent: string
    /** How long the agent took, e.g. "0.3 s" */
    time: string
    /** What the agent did, one line each */
    steps: string[]
    /** The heading over the reply card */
    outcome: string
    /** The reply card's lamp: "live" (green) or "attn" (waiting on a person) */
    lamp: string
    reply: string
  }[]
}

/** Node keys on the routing map. Their positions are in lib/alive.js */
export type RoutingNode = 'phone' | 'web' | 'mail' | 'desk' | 'orders' | 'tech' | 'billing' | 'review' | 'research' | 'out' | 'team'

/** A message travelling across the map of channels and agents */
export interface RoutingContent {
  /** What the map shows, for screen readers */
  label: string
  /** The label on each node */
  nodes: Record<RoutingNode, string>
  /** Shown above the map on screens too narrow for all of it */
  swipe: string
  routes: {
    /** The customer's message, as shown under the map */
    message: string
    /** What happened, shown once the dot arrives */
    outcome: string
    /** The nodes the dot passes, in order (RoutingNode keys) */
    path: string[]
    /** True when the route ends with your team, waiting for a person */
    attn?: boolean
  }[]
}

/** The approval limit as a slider over real orders */
export interface RuleContent {
  /** The sentence before the amount: "... at most $300" */
  label: string
  /** The rule as code, before the amount */
  code: string
  /** The slider, in dollars; start is the limit the shop set */
  limit: { min: number; max: number; step: number; start: number }
  orders: {
    name: string
    what: string
    /** In dollars */
    total: number
  }[]
  /** Shown on an order at or under the limit */
  auto: string
  /** Shown on an order over it */
  wait: string
}

/** A flow's test run, step by step with its timings */
export interface FlowRunContent {
  /** The customer's message, with its quotation marks */
  said: string
  /** Display names by agent key (desk, orders, tech, billing, research, review) */
  agents: Record<string, string>
  steps: {
    /** An agent key; it picks the tile colour and the name from agents */
    agent: string
    text: string
    time: string
  }[]
  /** The line once every step has run */
  done: string
}

/** The vision model reading a damage photo, then the reply it leads to */
export interface ScanContent {
  image: { src: string; alt: string }
  /** What the model found, as boxes over the photo in percent of its width and height */
  boxes: {
    label: string
    left: number
    top: number
    width: number
    height: number
    /** A weaker finding, drawn fainter */
    low?: boolean
  }[]
  /** The Researcher's description of the photo */
  read: ScanCard
  /** The reply to the customer */
  reply: ScanCard
}

export interface ScanCard {
  agent: string
  time: string
  text: string
}

/** A refund over the limit, waiting for a person and then approved */
export interface ApproveContent {
  /** The heading while it waits */
  waiting: string
  /** Seconds it has waited when the card appears, shown as m:ss and counting on */
  waited: number
  agent: string
  /** Follows the agent's name: "wants to refund Priya." */
  asks: string
  details: { term: string; detail: string }[]
  /** The rule that sent it to a person */
  rule: string
  buttons: { approve: string; change: string; decline: string }
  /** The heading once approved */
  approved: string
  /** The line once approved */
  after: string
}

/** Passages scored for a question, and the bar under which none is used */
export interface CiteContent {
  question: string
  /** Passages scoring below this are not used, and are listed under the bar */
  threshold: number
  /** The bar's label */
  bar: string
  passages: { title: string; text: string; score: number }[]
}

/** Documents becoming passages */
export interface IngestContent {
  documents: { name: string; passages: number }[]
  /** The word after each document's count */
  unit: { one: string; other: string }
  /** Follows the total */
  total: string
}

/** Store CSV files counting in */
export interface ImportContent {
  files: { title: string; count: number; file: string }[]
  /** Shown while a file counts */
  reading: string
  /** Shown once it has; {n} is the count */
  done: string
}

/** A phone call with live captions */
export interface CallContent {
  title: string
  /** Seconds into the call when it appears */
  clock: number
  /** What happens in turn. A line with a caption is speech, and the voice wave moves while it's typed */
  lines: { status: string; caption: string }[]
}

/** A flow message filled in from the order, then translated */
export interface TranslateContent {
  /** The customer's message */
  message: string
  /** Each stage of the reply; **double asterisks** mark the parts taken from the order (shown highlighted) */
  stages: { label: string; text: string }[]
  note: string
}

/** A day on a 24-hour dial */
export interface HoursContent {
  /** What the dial shows, for screen readers */
  label: string
  /** Opening hours, in hours from midnight */
  open: number
  close: number
  /** When each conversation came in, in hours from midnight (7.5 is 07:30). The dial rests on the last */
  calls: number[]
  /** The caption while the hand is inside opening hours */
  during: string
  /** The caption outside them */
  after: string
}

/** Module keys inside the private machine. Their positions are in lib/alive.js */
export type PrivateModule = 'model' | 'search' | 'vision' | 'voice' | 'db'

/** Everything inside one machine, with the cable out */
export interface PrivateContent {
  /** What the drawing shows, for screen readers */
  label: string
  /** The label on the machine */
  computer: string
  modules: Record<PrivateModule, string>
  /** The label by the pulled plug */
  unplugged: string
  /** Before the count of things sent out, which is always 0 */
  sent: string
}

/** The hardware tiers and the models each runs */
export interface TiersContent {
  /** The tier shown first */
  start: string
  tiers: {
    name: string
    /** What the computer needs */
    need: string
    /** How much of the graphics card it uses, as said under the gauge */
    used: string
    /** How full the gauge is, from 0 to 1 */
    fill: number
    models: { job: string; model: string; runs: string }[]
  }[]
}

/** Everything in content/vignettes.json, by vignette */
export interface VignetteContent {
  desk: DeskContent
  routing: RoutingContent
  rule: RuleContent
  flowrun: FlowRunContent
  scan: ScanContent
  approve: ApproveContent
  cite: CiteContent
  ingest: IngestContent
  import: ImportContent
  call: CallContent
  translate: TranslateContent
  hours: HoursContent
  private: PrivateContent
  tiers: TiersContent
}
