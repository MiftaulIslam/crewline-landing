// The home sections that back the claims: test-day numbers, real replies, the comparison,
// the honest limits and the questions dial
import type { ReactNode } from 'react'
import type { LimitsContent } from '@/content/types'
import type { HomeCompareContent, NumbersContent, SaidContent } from '@/content/home.types'
import { Jack } from '@/components/ui/Jack'
import { Lede } from '@/components/ui/Lede'
import { SectionHead } from '@/components/ui/SectionHead'
import { RISE } from '@/lib/style'
import { PageMore } from './parts'

/** What the test day measured, under a band of film */
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
          {content.figures.map((f) => (
            <div key={f.label}><dt>{f.label}</dt><dd>{f.value}{f.unit && <small>{f.unit}</small>}</dd></div>
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

/** What it doesn't do yet: questions that open, the first one open */
export function HomeLimits({ content }: { content: LimitsContent }) {
  return (
    <section className="panel limits" id="limits">
      <Jack y={8} />
      <div className="wrap limits__grid">
        <h2 className="h2">{content.title}</h2>
        <div className="limits__list">
          {content.items.map((q, i) => (
            <details key={q.question} open={i === 0}><summary>{q.question}</summary><p>{q.answer}</p></details>
          ))}
        </div>
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
