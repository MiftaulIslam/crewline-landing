// The home sections that show the product itself: the board, the moving screens, the live tiles,
// the setup guide, the photo the model read and the answer with its sources
import type { ReactNode } from 'react'
import type { VignetteContent } from '@/content/vignettes.types'
import type { Img } from '@/content/types'
import type {
  BoardContent, DriftContent, LiveContent, PhotoSeenContent, ReceiptsContent, SetupGuideContent, TileContent
} from '@/content/home.types'
import { pageHref } from '@/content'
import { Jack } from '@/components/ui/Jack'
import { Lede } from '@/components/ui/Lede'
import { RevealText } from '@/components/ui/RevealText'
import { ArrowLink } from '@/components/ui/Buttons'
import { SwapStack } from '@/components/media/SwapStack'
import { ApprovalCard, DocumentIngest, HoursDial, PhotoScan, RoutingMap, SourceScores } from '@/components/vignettes'
import { RISE } from '@/lib/style'
import { PageMore, SizedImage } from './parts'

/** The Conversations screen, with a legend for its lamps */
export function BoardReveal({ content }: { content: BoardContent }) {
  const { legend } = content
  return (
    <section className="night reveal" id="board">
      <Jack y={12} x={58} />
      <div className="wrap reveal__top">
        <RevealText as="h2" className="h2" text={content.title} />
        <div className="reveal__legend">
          <p>{legend.board}</p>
          <p><span className="lamp lamp--live"></span>{legend.live}</p>
          <p><span className="lamp lamp--attn"></span>{legend.waiting}</p>
          <p>{legend.clear}</p>
        </div>
      </div>
      <div className="reveal__frame">
        <SizedImage className="win" image={content.image} />
      </div>
    </section>
  )
}

/** One row of the drifting strip: the screens, then the same again unlabelled so it loops */
function DriftRow({ images, className }: { images: Img[]; className: string }) {
  return (
    <div className={className}>
      <div className="drift__track">
        {images.map((image) => (
          <img key={image.src} src={image.src} alt={image.alt} loading="lazy" />
        ))}
        {images.map((image) => (
          <img key={`again-${image.src}`} src={image.src} alt="" loading="lazy" />
        ))}
      </div>
    </div>
  )
}

/** Two rows of screenshots drifting in opposite directions */
export function ScreenDrift({ content }: { content: DriftContent }) {
  return (
    <section className="night drift" aria-label={content.label}>
      <DriftRow images={content.front} className="drift__row" />
      <p className="drift__line">{content.line}</p>
      <DriftRow images={content.back} className="drift__row drift__row--back" />
    </section>
  )
}

interface TileProps {
  content: TileContent
  /** Columns the tile spans on wide screens; the default when left out */
  span?: 5 | 7 | 12
  children: ReactNode
}

function Tile({ content, span, children }: TileProps) {
  return (
    <div className={span ? `tile tile--${span}` : 'tile'} {...RISE}><h3>{content.title}</h3>{children}<ArrowLink href={pageHref(content.link.slug)}>{content.link.label}</ArrowLink></div>
  )
}

interface LiveTilesProps {
  content: LiveContent
  vignettes: VignetteContent
}

/** A wall of live vignettes, each linking to its feature page */
export function LiveTiles({ content, vignettes }: LiveTilesProps) {
  const { tiles } = content
  return (
    <section className="night" id="live">
      <Jack y={6} />
      <div className="wrap">
        <div className="block__head" {...RISE}>
          <RevealText as="h2" className="h2" text={content.title} />
          <Lede text={content.lede} />
        </div>
        <div className="tilewall">
          <Tile content={tiles.routing} span={12}><RoutingMap content={vignettes.routing} /></Tile>
          <Tile content={tiles.approve} span={5}><ApprovalCard content={vignettes.approve} /></Tile>
          <Tile content={tiles.scan} span={7}><PhotoScan content={vignettes.scan} /></Tile>
          <Tile content={tiles.cite}><SourceScores content={vignettes.cite} /></Tile>
          <Tile content={tiles.hours}><HoursDial content={vignettes.hours} /></Tile>
          <Tile content={tiles.ingest}><DocumentIngest content={vignettes.ingest} /></Tile>
        </div>
      </div>
    </section>
  )
}

/** Setup in nine steps; the screenshot beside them follows the step in view (data-step), rising in from below */
export function SetupGuide({ content }: { content: SetupGuideContent }) {
  return (
    <section className="label guide" id="setup">
      <Jack y={2} />
      <div className="wrap guide__head">
        <RevealText as="h2" className="h2" text={content.title} />
        <Lede text={content.lede} />
        <p><PageMore link={content.more} /></p>
      </div>
      <div className="wrap guide__grid">
        <ol className="guide__steps">
          {content.steps.map((step, i) => (
            <li key={step.title} data-step={i}><h3>{step.title}</h3><p>{step.text}</p><img className="guide__inline win" src={step.image} alt="" loading="lazy" /></li>
          ))}
        </ol>
        {/* lib/site.js moves .is-on through .guide__stage img as the steps scroll by */}
        <SwapStack className="guide__stage" itemClassName="win" hidden images={content.steps.map((step) => ({ src: step.image, alt: '' }))} />
      </div>
    </section>
  )
}

/** A damage photo with what the vision model saw marked on it (shown on hover), and the reply */
export function PhotoSeen({ content }: { content: PhotoSeenContent }) {
  return (
    <section className="panel seen" id="photo">
      <Jack y={8} />
      <div className="wrap seen__grid">
        <figure className="seen__fig" tabIndex={0}>
          <SizedImage image={content.image} />
          <figcaption className="sr">{content.caption}</figcaption>
          {content.marks.map((mark) => (
            <span key={mark.label} className="mark" style={{ left: `${mark.x}%`, top: `${mark.y}%` }}>{mark.label}</span>
          ))}
        </figure>
        <div className="seen__copy">
          <RevealText as="h2" className="h2" text={content.title} />
          <Lede text={content.lede} />
          <blockquote className="seen__quote">
            <p>{content.quote.text}</p>
            <cite>{content.quote.cite}</cite>
          </blockquote>
          <PageMore link={content.more} />
        </div>
      </div>
    </section>
  )
}

/** An answer with its citation open, full width */
export function Receipts({ content }: { content: ReceiptsContent }) {
  return (
    <section className="panel receipts" id="receipts">
      <Jack y={10} />
      <div className="wrap">
        <RevealText as="h2" className="h2 receipts__title" text={content.title} />
        <Lede text={content.lede} />
        <PageMore link={content.more} />
      </div>
      <div className="receipts__frame">
        <SizedImage className="win" image={content.image} />
      </div>
    </section>
  )
}
