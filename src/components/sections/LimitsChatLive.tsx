'use client'

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import type { Question, SiteContent } from '@/content/types'
import { BrandMark } from '@/components/layout/BrandMark'

export type ChatLabels = SiteContent['chat']

type Phase = 'idle' | 'asked' | 'thinking' | 'typing' | 'done'

interface View {
  /** The question on screen */
  at: number
  phase: Phase
  /** How much of the answer has been typed */
  typed: number
  /** While the answer waits before the next question: how long, in ms. 0 otherwise. */
  dwell: number
  /** The visitor picked this question themselves */
  user: boolean
  /** Counts every ask, so the messages mount (and rise in) again */
  run: number
}

/** Thrown into a running sequence when a new question replaces it or the section unmounts */
const STOP = Symbol('stop')

const ASK_MS = 450
const THINK_MS = 1100
/** Characters typed per step, and the step */
const TYPE_CHARS = 3
const TYPE_MS = 28
const MAX_DWELL = 9000
const dwellFor = (answer: string) => Math.min(MAX_DWELL, 3200 + answer.length * 22)

/**
 * The questions on the left and Crewline's chat on the right. A question goes in as the
 * visitor's bubble, Crewline thinks for a second and types its answer. While the section is on
 * screen it works through the questions by itself, holding while the pointer or keyboard focus
 * is inside; once the visitor picks a question it stops and leaves them in charge. Under reduced
 * motion nothing moves on its own and a pick shows its answer at once.
 */
export function LimitsChatLive({ items, chat }: { items: Question[]; chat: ChatLabels }) {
  const rootRef = useRef<HTMLDivElement>(null)
  const stripRef = useRef<HTMLOListElement>(null)
  const askRef = useRef<((i: number) => void) | null>(null)
  const [view, setView] = useState<View>({ at: 0, phase: 'done', typed: items[0]?.answer.length ?? 0, dwell: 0, user: false, run: 0 })

  useEffect(() => {
    const root = rootRef.current
    const n = items.length
    if (!root || !n) return
    const calm = matchMedia('(prefers-reduced-motion: reduce)').matches
    const off = new AbortController()
    const on = { signal: off.signal }
    let auto = !calm && n > 1
    let visible = false
    let hover = false
    let focus = false
    let started = false
    let first = true
    let run = 0
    let ctl: AbortController | null = null
    const wakers = new Set<() => void>()
    const held = () => hover || focus || !visible
    const sync = () => {
      root.toggleAttribute('data-auto', auto)
      root.toggleAttribute('data-hold', held())
      for (const w of [...wakers]) w()
    }

    /** A plain timeout that rejects with STOP if the sequence is replaced */
    const tick = (ms: number, signal: AbortSignal) => new Promise<void>((done, fail) => {
      if (signal.aborted) return fail(STOP)
      const stop = () => { clearTimeout(t); fail(STOP) }
      const t = setTimeout(() => { signal.removeEventListener('abort', stop); done() }, ms)
      signal.addEventListener('abort', stop, { once: true })
    })
    /** Resolves once ok() holds, re-checked whenever visibility, hover or focus change */
    const until = (ok: () => boolean, signal: AbortSignal) => new Promise<void>((done, fail) => {
      if (signal.aborted) return fail(STOP)
      if (ok()) return done()
      const w = () => { if (ok()) { end(); done() } }
      const stop = () => { end(); fail(STOP) }
      const end = () => { wakers.delete(w); signal.removeEventListener('abort', stop) }
      wakers.add(w)
      signal.addEventListener('abort', stop, { once: true })
    })
    /** Waits ms, then until the section is on screen */
    const sleep = async (ms: number, signal: AbortSignal) => {
      await tick(ms, signal)
      await until(() => visible, signal)
    }
    /** Waits ms of on-screen, unheld time: the pause before the next question */
    const linger = async (ms: number, signal: AbortSignal) => {
      for (let left = ms; left > 0; ) {
        await tick(100, signal)
        if (!held()) left -= 100
      }
    }

    const play = async (i: number, user: boolean, signal: AbortSignal) => {
      const text = items[i].answer
      await tick(0, signal)
      setView({ at: i, phase: 'asked', typed: 0, dwell: 0, user, run: ++run })
      await sleep(ASK_MS, signal)
      setView((v) => ({ ...v, phase: 'thinking' }))
      await sleep(THINK_MS, signal)
      for (let k = TYPE_CHARS; k < text.length; k += TYPE_CHARS) {
        setView((v) => ({ ...v, phase: 'typing', typed: k }))
        await sleep(TYPE_MS, signal)
      }
      setView((v) => ({ ...v, phase: 'done', typed: text.length }))
    }
    const sequence = async (from: number, user: boolean, skipFirst: boolean, signal: AbortSignal) => {
      let i = from
      if (!skipFirst) await play(i, user, signal)
      while (auto) {
        const ms = dwellFor(items[i].answer)
        setView((v) => ({ ...v, dwell: ms }))
        await linger(ms, signal)
        i = (i + 1) % n
        await play(i, false, signal)
      }
    }
    const ask = (i: number, user: boolean, skipFirst = false) => {
      started = true
      ctl?.abort()
      ctl = null
      if (user) auto = false
      sync()
      if (calm) {
        setView({ at: i, phase: 'done', typed: items[i].answer.length, dwell: 0, user, run: ++run })
        return
      }
      ctl = new AbortController()
      sequence(i, user, skipFirst, ctl.signal).catch((e) => { if (e !== STOP) console.error(e) })
    }
    askRef.current = (i) => ask(i, true)

    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting
      sync()
      if (first) {
        first = false
        if (calm || started) return
        // Already on screen: keep the first answer and carry on from it. Otherwise clear the
        // chat so the first question is asked as the section arrives.
        if (visible) ask(0, false, true)
        else setView({ at: 0, phase: 'idle', typed: 0, dwell: 0, user: false, run: 0 })
        return
      }
      if (visible && !started) ask(0, false)
    }, { threshold: 0.35 })
    io.observe(root)

    root.addEventListener('pointerenter', () => { hover = true; sync() }, on)
    root.addEventListener('pointerleave', () => { hover = false; sync() }, on)
    root.addEventListener('focusin', () => { focus = true; sync() }, on)
    root.addEventListener('focusout', (e) => { focus = root.contains(e.relatedTarget as Node | null); sync() }, on)

    return () => {
      askRef.current = null
      off.abort()
      ctl?.abort()
      io.disconnect()
      wakers.clear()
      root.removeAttribute('data-auto')
      root.removeAttribute('data-hold')
    }
  }, [items])

  // On phones the questions are a sideways strip: bring the current one into view, moving
  // only the strip, never the page
  useEffect(() => {
    const strip = stripRef.current
    const chip = strip?.children[view.at] as HTMLElement | undefined
    if (!strip || !chip || strip.scrollWidth <= strip.clientWidth) return
    const left = chip.offsetLeft - (strip.clientWidth - chip.offsetWidth) / 2
    strip.scrollTo({ left, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' })
  }, [view.at])

  const q = items[view.at]
  if (!q) return null
  const typing = view.phase === 'typing'
  const answered = typing || view.phase === 'done'
  const longest = items.reduce((a, b) => (b.question.length + b.answer.length > a.question.length + a.answer.length ? b : a))

  return (
    <div className="lchat" ref={rootRef}>
      <ol className="lchat__qs" ref={stripRef}>
        {items.map((item, i) => {
          const on = i === view.at && view.phase !== 'idle'
          return (
            <li key={item.question}>
              <button
                type="button"
                className={on ? 'lchat__q is-on' : 'lchat__q'}
                aria-current={on ? 'true' : undefined}
                onClick={() => askRef.current?.(i)}
              >
                <span className="lchat__lamp" aria-hidden="true" />
                <span className="sr">{chat.ask}: </span>
                {item.question}
                <i
                  aria-hidden="true"
                  className={on && view.dwell && !view.user ? 'is-run' : undefined}
                  style={on && view.dwell ? ({ '--dwell': `${view.dwell}ms` } as CSSProperties) : undefined}
                />
              </button>
            </li>
          )
        })}
      </ol>

      {/* The chat is a picture of the answer: the same words are in the section's hidden list,
          and a visitor's own pick is read out below once it has been answered */}
      <div className="al-chat lchat__win" aria-hidden="true">
        <header>
          <span className={view.phase === 'thinking' ? 'lchat__brand is-thinking' : 'lchat__brand'}><BrandMark /></span>
          <b>{chat.agent}</b>
          <span className={view.phase === 'thinking' ? 'al-lamp is-attn' : 'al-lamp is-live'} />
          <small>
            {view.at + 1} / {items.length}
          </small>
        </header>
        <div className="al-chat__body lchat__body">
          <div className="lchat__layer lchat__layer--size">
            <Message who={chat.you} me>{longest.question}</Message>
            <Message who={chat.agent}>{longest.answer}</Message>
          </div>
          {view.phase !== 'idle' && (
            <div className="lchat__layer" key={view.run}>
              <Message who={chat.you} me>{q.question}</Message>
              {view.phase === 'thinking' && (
                <Message who={chat.agent} thinking>
                  <span className="lchat__think">
                    <span className="lchat__dots"><i /><i /><i /></span>
                    {chat.thinking}
                  </span>
                </Message>
              )}
              {answered && (
                <Message who={chat.agent}>
                  {q.answer.slice(0, view.typed)}
                  {typing && <span className="lchat__caret" />}
                </Message>
              )}
            </div>
          )}
        </div>
      </div>
      <p className="sr" aria-live="polite">{view.user && view.phase === 'done' ? q.answer : ''}</p>
    </div>
  )
}

function Message({ who, me, thinking, children }: { who: string; me?: boolean; thinking?: boolean; children: ReactNode }) {
  if (me)
    return (
      <div className="lchat__msg lchat__msg--me">
        <small>{who}</small>
        <p className="al-bub al-bub--me">{children}</p>
      </div>
    )
  // Crewline's messages carry its mark: it turns while thinking and settles when it answers
  return (
    <div className="lchat__msg lchat__msg--agent">
      <span className={thinking ? 'lchat__avatar is-thinking' : 'lchat__avatar'}>
        <BrandMark />
      </span>
      <div className="lchat__said">
        <small>{who}</small>
        <p className="al-bub">{children}</p>
      </div>
    </div>
  )
}
