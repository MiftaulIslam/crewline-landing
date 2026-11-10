import { Fragment } from 'react'
import { site } from '@/content'
import type { LimitsContent } from '@/content/types'
import { RevealText } from '@/components/ui/RevealText'
import { RISE } from '@/lib/style'
import { LimitsChatLive } from './LimitsChatLive'

/**
 * What it doesn't do yet, as a chat: the heading, then the questions beside Crewline's chat
 * window (components/sections/LimitsChatLive). Every question and answer is also in the server
 * HTML as a visually hidden list, for crawlers, the FAQ and screen readers. The rise-in sits on
 * a wrapper React never re-renders, so lib/site.js's .in class stays put.
 */
export function LimitsChat({ content }: { content: LimitsContent }) {
  return (
    <>
      <RevealText as="h2" className="h2" text={content.title} />
      <dl className="sr">
        {content.items.map((q) => (
          <Fragment key={q.question}>
            <dt>{q.question}</dt>
            <dd>{q.answer}</dd>
          </Fragment>
        ))}
      </dl>
      <div {...RISE}>
        <LimitsChatLive items={content.items} chat={site.chat} />
      </div>
    </>
  )
}
