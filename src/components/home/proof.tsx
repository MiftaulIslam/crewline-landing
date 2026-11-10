// The home sections that back the claims: test-day numbers, real replies, the comparison,
// the honest limits and the questions dial
import type { ReactNode } from 'react'
import type { LimitsContent } from '@/content/types'
import type { Figure, HomeCompareContent, NumbersContent, SaidContent } from '@/content/home.types'
import { LimitsChat } from '@/components/sections/LimitsChat'
import { CountUp } from '@/components/stats/CountUp'
import { Jack } from '@/components/ui/Jack'
import { Lede } from '@/components/ui/Lede'
import { SectionHead } from '@/components/ui/SectionHead'
import { RISE } from '@/lib/style'
import { PageMore } from './parts'

/** Line icons for the test-day figures, drawn on a 24 grid at the site's 1.6 stroke */
const FIGURE_ICON: Record<Figure['id'], ReactNode> = {
  // Finished without a person: a tick in a lamp
  solved: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M8.2 12.3l2.6 2.6 5-5.4" />
    </>
  ),
  // Median first reply: a stopwatch
  speed: (
    <>
      <circle cx="12" cy="13.5" r="7.5" />
      <path d="M12 13.5V9.6M10 2.8h4M12 2.8V6M17.6 7.4l1.4-1.4" />
    </>
  ),
  // Cited a document: a page with lines of text
  cited: (
    <>
      <path d="M6.5 3h7.5l4 4v14h-11.5z" />
      <path d="M13.8 3v4.2H18M9.5 11.5h5.5M9.5 14.5h5.5M9.5 17.5h3.5" />
    </>
  ),
  // Sent to a cloud: none, a cloud struck through
  cloud: (
    <>
      <path d="M7.5 18h9.5a4 4 0 0 0 .6-7.95A5.5 5.5 0 0 0 7 9.2 4.4 4.4 0 0 0 7.5 18z" />
      <path d="M4 4l16 16" />
    </>
  ),
}

/** What the test day measured, under a band of film. Each figure counts up as it arrives. */
export function NumbersSection({ content }: { content: NumbersContent }) {
  return (
    <section className="panel numbers" id="numbers">
      <div className="numbers__band">
        <video data-lazy-video="" muted loop playsInline preload="none" poster={content.film.poster}><source src={content.film.src} type="video/mp4" /></video>
      </div>
      <Jack y={44} />
      <div className="wrap">
        <h2 className="h2">{content.title}</h2>
        <dl className="numbers__grid">
          {content.figures.map((f, i) => (
            <div key={f.label} className="numbers__fig">
              <dt>{f.label}</dt>
              <dd>
                <span className="numbers__icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                    {FIGURE_ICON[f.id]}
                  </svg>
                </span>
                <CountUp value={f.value} delay={i * 140} />
                {f.unit && <small>{f.unit}</small>}
              </dd>
            </div>
          ))}
        </dl>
        <p className="numbers__note">{content.note}</p>
      </div>
    </section>
  )
}

/** Real replies from the test day, beside the chat replay */
export function SaidSection({ content, children }: { content: SaidContent; children: ReactNode }) {
  return (
    <section className="night" id="said">
      <Jack y={12} />
      <div className="wrap said">
        <div {...RISE}>
          <h2 className="h2">{content.title}</h2>
          <Lede text={content.lede} />
          <PageMore link={content.more} />
        </div>
        <div {...RISE}>{children}</div>
      </div>
    </section>
  )
}

/** The comparison table and cost slider, with a heading and a link to the Compare page */
export function HomeCompare({ content, children }: { content: HomeCompareContent; children: ReactNode }) {
  return (
    <section className="label compare" id="compare">
      <Jack y={6} />
      <div className="wrap">
        <h2 className="h2">{content.title}</h2>
        <Lede text={content.lede} />
        {children}
        <PageMore link={content.more} />
      </div>
    </section>
  )
}

/** What it doesn't do yet: the questions, answered in Crewline's chat */
export function HomeLimits({ content }: { content: LimitsContent }) {
  return (
    <section className="panel limits" id="limits">
      <Jack y={8} />
      <div className="wrap">
        <LimitsChat content={content} />
      </div>
    </section>
  )
}

/** The questions on a rotary dial */
export function FaqSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="night" id="faq">
      <Jack y={10} />
      <div className="wrap">
        <SectionHead title={title} />
        <div style={{ marginTop: 'clamp(40px,5vw,72px)' }}>{children}</div>
      </div>
    </section>
  )
}
