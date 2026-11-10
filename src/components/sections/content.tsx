import type { ReactNode } from 'react'
import type {
  HoverListContent, ListSectionContent, Question, ScreenStepperContent, ShowcaseContent,
  SplitContent, StatementContent, TableContent
} from '@/content/types'
import { RichText } from '@/components/ui/RichText'
import { Jack } from '@/components/ui/Jack'
import { Lede } from '@/components/ui/Lede'
import { RevealText } from '@/components/ui/RevealText'
import { Section } from '@/components/ui/Section'
import { SectionHead } from '@/components/ui/SectionHead'
import { Alive } from '@/components/vignettes/Alive'
import { RISE, vars, type Ground } from '@/lib/style'
import { Icon, type IconName } from '@/components/icons/Icon'

const GAP = { marginTop: 'clamp(40px,5vw,72px)' }

interface Grounded {
  ground?: Ground
}

/** Numbered steps, each rising into view */
export function StepsSection({ content, ground }: { content: ListSectionContent } & Grounded) {
  return (
    <Section ground={ground}>
      <SectionHead title={content.title} lede={content.lede} />
      <ol className="steps">
        {content.items.map((s) => (
          <li key={s.title} {...RISE}>
            <h3>{s.title}</h3>
            <p>{s.text}</p>
          </li>
        ))}
      </ol>
    </Section>
  )
}

/** Short facts in three columns */
export function FactsSection({ content, ground }: { content: ListSectionContent } & Grounded) {
  return (
    <Section ground={ground}>
      <SectionHead title={content.title} lede={content.lede} />
      <ul className="facts">
        {content.items.map((f) => (
          <li key={f.title} {...RISE}>
            <h3>{f.title}</h3>
            <p>{f.text}</p>
          </li>
        ))}
      </ul>
    </Section>
  )
}

interface SplitProps extends Grounded {
  content: SplitContent
  /** Put the visual first on wide screens */
  flip?: boolean
  /** The visual beside the words: a vignette, chat replay or app window */
  children: ReactNode
}

/** Words on one side, a visual on the other */
export function SplitSection({ content, ground, flip, children }: SplitProps) {
  return (
    <Section ground={ground}>
      <div className={flip ? 'split split--flip' : 'split'}>
        <div {...RISE}>
          <RevealText className="h2" text={content.title} />
          <Lede text={content.lede} />
        </div>
        <div {...RISE}>{children}</div>
      </div>
    </Section>
  )
}

/** A heading, then one wide visual under it */
export function ShowcaseSection({ content, ground, children }: { content: ShowcaseContent; children: ReactNode } & Grounded) {
  return (
    <Section ground={ground}>
      <SectionHead title={content.title} lede={content.lede} />
      <div style={GAP} {...RISE}>
        {children}
      </div>
    </Section>
  )
}

/** One large sentence with a highlighted figure, and a line under it */
export function Statement({ content, ground }: { content: StatementContent } & Grounded) {
  return (
    <Section ground={ground}>
      <p className="bigline" {...RISE}>
        <RichText text={content.line} />
      </p>
      {content.after && (
        <p className="bigline__after" {...RISE}>
          {content.after}
        </p>
      )}
    </Section>
  )
}

interface ScreenStepperProps extends Grounded {
  content: ScreenStepperContent
  /** How long each step stays before the next, in milliseconds */
  interval?: number
}

/** Steps that advance by themselves, each with its screenshot; a click holds one */
export function ScreenStepper({ content, ground, interval = 6000 }: ScreenStepperProps) {
  return (
    <Section ground={ground}>
      <SectionHead title={content.title} lede={content.lede} />
      <Alive name="stepper" className="stepper" data={{ ms: interval }}>
        <ol role="tablist">
          {content.steps.map((s) => (
            <li key={s.title}>
              <button type="button" role="tab" data-st="">
                <i></i>
                <b>{s.title}</b>
                <span>{s.text}</span>
              </button>
            </li>
          ))}
        </ol>
        <div className="stepper__stage">
          {content.steps.map((s) => (
            <img key={s.title} className="win" data-sv="" src={s.image.src} alt={s.image.alt} loading="lazy" />
          ))}
        </div>
      </Alive>
    </Section>
  )
}

/** A list where a photo follows the pointer over each row (on touch screens, inline thumbnails) */
interface HoverListProps extends Grounded {
  content: HoverListContent
  /** An icon per row, in order, shown on a tile in place of the lamp */
  icons?: IconName[]
  /** The tile colour per row, in order; without it the tiles are quiet ink */
  accents?: string[]
}

export function HoverList({ content, ground = 'panel', icons, accents }: HoverListProps) {
  return (
    <section className={`${ground} asks`}>
      <Jack y={14} />
      <div className="wrap">
        <SectionHead title={content.title} lede={content.lede} />
        <ol className={icons ? 'asks__list asks__list--icons' : 'asks__list'}>
          {content.items.map((item, i) => (
            <li key={item.title} tabIndex={0} data-float={i} style={accents ? vars({ '--a': accents[i] }) : undefined}>
              {icons ? (
                <span className="asks__icon">
                  <Icon name={icons[i]} />
                </span>
              ) : (
                <span className="lamp"></span>
              )}
              <strong>{item.title}</strong>
              <em>{item.text}</em>
              <img className="asks__thumb" src={item.image} alt="" loading="lazy" />
            </li>
          ))}
        </ol>
      </div>
      <div className="float" aria-hidden="true">
        {content.items.map((item) => (
          <img key={item.title} src={item.image} alt="" />
        ))}
      </div>
    </section>
  )
}

/** A table that scrolls sideways on narrow screens */
export function DataTable({ content, ground }: { content: TableContent } & Grounded) {
  return (
    <Section ground={ground}>
      <SectionHead title={content.title} lede={content.lede} />
      <div className="rows" tabIndex={0} role="region" aria-label={content.title}>
        <table>
          <thead>
            <tr>
              {content.columns.map((c) => (
                <th key={c}>{c}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {content.rows.map(([first, ...rest]) => (
              <tr key={first}>
                <th>{first}</th>
                {rest.map((c, i) => (
                  <td key={i} data-label={content.columns[i + 1]}>
                    {c}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Section>
  )
}

export function Questions({ items, openFirst }: { items: Question[]; openFirst?: boolean }) {
  return items.map((q, i) => (
    <details key={q.question} open={openFirst && i === 0}>
      <summary>{q.question}</summary>
      <p>{q.answer}</p>
    </details>
  ))
}

/** Every question in a closed list */
export function QuestionList({ title, items, ground }: { title: string; items: Question[] } & Grounded) {
  return (
    <Section ground={ground}>
      <RevealText className="h2" text={title} />
      <div className="limits2" {...RISE}>
        <Questions items={items} />
      </div>
    </Section>
  )
}

/** A section heading with a visual placed below it at the usual gap, without the rise-in (the FAQ dial) */
export function DialSection({ title, ground, children }: { title: string; children: ReactNode } & Grounded) {
  return (
    <Section ground={ground}>
      <SectionHead title={title} />
      <div style={GAP}>{children}</div>
    </Section>
  )
}

