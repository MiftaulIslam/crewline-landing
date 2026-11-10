// The live vignettes, one named component each. Pages pass each its content from
// content/vignettes (or transcripts/faq); the animation itself is in lib/alive.js.
//
// Each component also renders a visually hidden text version of the same content before the
// animation, for search engines, AI crawlers and screen readers. It sits beside the <Alive> host,
// never inside it, because mounting a vignette replaces the host's children. It uses p, ul and dl
// only, so it adds no headings to the page's outline.
import { Fragment, type ReactNode } from 'react'
import { site } from '@/content'
import type { Question, Transcript } from '@/content/types'
import type {
  ApproveContent, CallContent, CiteContent, DeskContent, FlowRunContent, HoursContent, ImportContent, IngestContent,
  PrivateContent, RoutingContent, RoutingNode, RuleContent, ScanContent, TiersContent, TranslateContent,
} from '@/content/vignettes.types'
import { Alive } from './Alive'

interface VignetteProps<T> {
  content: T
  className?: string
}

/** The visually hidden text version that precedes a vignette */
const Sr = ({ children }: { children: ReactNode }) => <div className="sr">{children}</div>

const money = (n: number) => '$' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
/** Hours from midnight as HH:MM */
const clockTime = (h: number) => {
  const m = Math.round(h * 60)
  return `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`
}
/** Text with **highlighted** parts, as <mark> */
const Marked = ({ text }: { text: string }) => (
  <>{text.split('**').map((part, i) => (i % 2 ? <mark key={i}>{part}</mark> : <Fragment key={i}>{part}</Fragment>))}</>
)

/** Three real conversations arriving, being worked and answered (home and Conversations hero) */
export const DeskReplay = ({ content, className }: VignetteProps<DeskContent>) => (
  <>
    <Sr>
      <ul>
        {content.scenes.map((c) => (
          <li key={c.name}>
            <p>{c.name}, {c.channel}: {c.said}</p>
            <p>{c.agent}, {c.time}:</p>
            <ul>{c.steps.map((t) => <li key={t}>{t}</li>)}</ul>
            <p>{c.outcome}: {c.reply}</p>
          </li>
        ))}
      </ul>
    </Sr>
    <Alive name="desk" data={content} className={className} />
  </>
)

/** A message travelling from its channel through the agents (Agents, home) */
export const RoutingMap = ({ content, className }: VignetteProps<RoutingContent>) => (
  <>
    <Sr>
      <p>{content.label}</p>
      <dl>
        {content.routes.map((r) => (
          <Fragment key={r.message}>
            <dt>{r.message}</dt>
            <dd>{r.path.map((k) => content.nodes[k as RoutingNode] ?? k).join(', ')}</dd>
            <dd>{r.outcome}</dd>
          </Fragment>
        ))}
      </dl>
    </Sr>
    <Alive name="routing" data={content} className={className} />
  </>
)

/** The approval limit as a slider over four real orders (Flows, Approvals) */
export const RuleLimit = ({ content, className }: VignetteProps<RuleContent>) => (
  <>
    <Sr>
      <p>{content.label} {'$' + content.limit.start.toLocaleString('en-US')}</p>
      <ul>
        {content.orders.map((o) => (
          <li key={o.name}>
            {o.name}, {o.what}, {money(o.total)}: {o.total <= content.limit.start ? content.auto : content.wait}
          </li>
        ))}
      </ul>
    </Sr>
    <Alive name="rule" data={content} className={className} />
  </>
)

/** A flow test run, step by step with timings (Flows) */
export const FlowRun = ({ content, className }: VignetteProps<FlowRunContent>) => (
  <>
    <Sr>
      <p>{content.said}</p>
      <ol>
        {content.steps.map((st, i) => (
          <li key={i}>{content.agents[st.agent]} {st.text} ({st.time})</li>
        ))}
      </ol>
      <p>{content.done}</p>
    </Sr>
    <Alive name="flowrun" data={content} className={className} />
  </>
)

/** The vision model reading a damage photo (Damage photos, home) */
export const PhotoScan = ({ content, className }: VignetteProps<ScanContent>) => (
  <>
    <Sr>
      <p>{content.image.alt}</p>
      <ul>{content.boxes.map((b) => <li key={b.label}>{b.label}</li>)}</ul>
      <p>{content.read.agent}, {content.read.time}: {content.read.text}</p>
      <p>{content.reply.agent}, {content.reply.time}: {content.reply.text}</p>
    </Sr>
    <Alive name="scan" data={content} className={className} />
  </>
)

/** A refund over the limit, approved with one click (Approvals, home) */
export const ApprovalCard = ({ content, className }: VignetteProps<ApproveContent>) => (
  <>
    <Sr>
      <p>{content.waiting}</p>
      <p>{content.agent} {content.asks}</p>
      <dl>
        {content.details.map((d) => (
          <Fragment key={d.term}>
            <dt>{d.term}</dt>
            <dd>{d.detail}</dd>
          </Fragment>
        ))}
      </dl>
      <p>{content.rule}</p>
      <p>{content.approved}. {content.after}</p>
    </Sr>
    <Alive name="approve" data={content} className={className} />
  </>
)

/** Passages scored against the 0.50 bar (Knowledge, home) */
export const SourceScores = ({ content, className }: VignetteProps<CiteContent>) => (
  <>
    <Sr>
      <p>{content.question}</p>
      <ul>
        {content.passages.map((p) => (
          <li key={p.title}>{p.title}, {p.score.toFixed(2)}: {p.text}</li>
        ))}
      </ul>
      <p>{content.bar}</p>
    </Sr>
    <Alive name="cite" data={content} className={className} />
  </>
)

/** Documents becoming passages (Knowledge, home) */
export const DocumentIngest = ({ content, className }: VignetteProps<IngestContent>) => {
  const count = (n: number) => `${n} ${n === 1 ? content.unit.one : content.unit.other}`
  return (
    <>
      <Sr>
        <ul>{content.documents.map((d) => <li key={d.name}>{d.name}: {count(d.passages)}</li>)}</ul>
        <p>{content.documents.reduce((n, d) => n + d.passages, 0)} {content.total}</p>
      </Sr>
      <Alive name="ingest" data={content} className={className} />
    </>
  )
}

/** Shopify CSV files counting in (Store data) */
export const StoreImport = ({ content, className }: VignetteProps<ImportContent>) => (
  <>
    <Sr>
      <ul>
        {content.files.map((f) => (
          <li key={f.file}>{f.title}, {f.file}: {content.done.replace('{n}', String(f.count))}</li>
        ))}
      </ul>
    </Sr>
    <Alive name="import" data={content} className={className} />
  </>
)

/** A phone call with live captions (Calls and voice) */
export const LiveCall = ({ content, className }: VignetteProps<CallContent>) => (
  <>
    <Sr>
      <p>{content.title}</p>
      <ul>
        {content.lines.map((l, i) => (
          <li key={i}>{l.caption ? `${l.status}: ${l.caption}` : l.status}</li>
        ))}
      </ul>
    </Sr>
    <Alive name="call" data={content} className={className} />
  </>
)

/** A flow message filled in from the order, then translated (Languages) */
export const TranslationPath = ({ content, className }: VignetteProps<TranslateContent>) => (
  <>
    <Sr>
      <p>{content.message}</p>
      <dl>
        {content.stages.map((st) => (
          <Fragment key={st.label}>
            <dt>{st.label}</dt>
            <dd><Marked text={st.text} /></dd>
          </Fragment>
        ))}
      </dl>
      <p>{content.note}</p>
    </Sr>
    <Alive name="translate" data={content} className={className} />
  </>
)

/** A day on a 24-hour dial (After hours, home) */
export const HoursDial = ({ content, className }: VignetteProps<HoursContent>) => (
  <>
    <Sr>
      <p>{content.label}</p>
      <ul>
        {content.calls.map((h) => (
          <li key={h}>{clockTime(h)}: {h >= content.open && h < content.close ? content.during : content.after}</li>
        ))}
      </ul>
    </Sr>
    <Alive name="hours" data={content} className={className} />
  </>
)

/** Everything inside one machine, with the cable out (Privacy) */
export const PrivateMachine = ({ content, className }: VignetteProps<PrivateContent>) => (
  <>
    <Sr>
      <p>{content.label}</p>
      <p>{content.computer}:</p>
      <ul>{Object.values(content.modules).map((m) => <li key={m}>{m}</li>)}</ul>
      <p>{content.unplugged}. {content.sent} 0</p>
    </Sr>
    <Alive name="private" data={content} className={className} />
  </>
)

/** The three hardware tiers and their models (Models) */
export const TierPicker = ({ content, className }: VignetteProps<TiersContent>) => (
  <>
    <Sr>
      <ul>
        {content.tiers.map((t) => (
          <li key={t.name}>
            <p>{t.name}: {t.need}. {t.used}.</p>
            <dl>
              {t.models.map((m) => (
                <Fragment key={m.job}>
                  <dt>{m.job}</dt>
                  <dd>{m.model}, {m.runs}</dd>
                </Fragment>
              ))}
            </dl>
          </li>
        ))}
      </ul>
    </Sr>
    <Alive name="tiers" data={content} className={className} />
  </>
)

/** Real exchanges from the test day, typed out one after another */
export const ChatReplay = ({ transcripts, className }: { transcripts: Transcript[]; className?: string }) => (
  <>
    <Sr>
      <ul>
        {transcripts.map((t) => (
          <li key={t.who}>
            <p>{t.who}, {t.tag}</p>
            <dl>
              {t.lines.map((l, i) => (
                <Fragment key={i}>
                  <dt>{l.from === 'customer' ? t.who : site.name}</dt>
                  <dd>{l.text}</dd>
                </Fragment>
              ))}
            </dl>
          </li>
        ))}
      </ul>
    </Sr>
    <Alive name="chat" data={transcripts} className={className} />
  </>
)

/** The FAQ on a rotary dial */
export const FaqDial = ({ items }: { items: Question[] }) => (
  <>
    <Sr>
      <dl>
        {items.map((q) => (
          <Fragment key={q.question}>
            <dt>{q.question}</dt>
            <dd>{q.answer}</dd>
          </Fragment>
        ))}
      </dl>
    </Sr>
    <Alive name="dial" data={items} />
  </>
)
