'use client'

import { useEffect, useRef } from 'react'

interface CountUpProps {
  /** The figure as written in the content: "95%", "0.5", "0". Digits count up; anything around them stays. */
  value: string
  /** Wait before counting, in ms, to stagger a row of figures */
  delay?: number
}

const DURATION = 1400
const easeOut = (k: number) => 1 - (1 - k) ** 3

/**
 * A number that counts up from 0 to its value the first time it scrolls into view. The server
 * HTML holds the real value (crawlers and screen readers read that copy); the counting copy is
 * aria-hidden. Under reduced motion the value simply stays as it is.
 */
export function CountUp({ value, delay = 0 }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const el = ref.current
    const m = /^(\D*)(\d+(?:\.\d+)?)(.*)$/.exec(value)
    if (!el || !m || matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const [, before, digits, after] = m
    const target = Number(digits)
    const places = digits.includes('.') ? digits.split('.')[1].length : 0
    const show = (n: number) => (el.textContent = before + n.toFixed(places) + after)
    if (target === 0) return
    let frame = 0
    let wait = 0
    show(0)
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return
      io.disconnect()
      wait = window.setTimeout(() => {
        const t0 = performance.now()
        const tick = (t: number) => {
          const k = Math.min(1, (t - t0) / DURATION)
          show(target * easeOut(k))
          if (k < 1) frame = requestAnimationFrame(tick)
        }
        frame = requestAnimationFrame(tick)
      }, delay)
    }, { threshold: 0.6 })
    io.observe(el)
    return () => {
      io.disconnect()
      clearTimeout(wait)
      cancelAnimationFrame(frame)
      el.textContent = value
    }
  }, [value, delay])

  return (
    <>
      <span className="sr">{value}</span>
      <span ref={ref} aria-hidden="true">{value}</span>
    </>
  )
}
