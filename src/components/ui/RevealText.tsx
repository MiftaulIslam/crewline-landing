import { Fragment, type ElementType } from 'react'

interface RevealTextProps {
  /** The heading or paragraph element to render */
  as?: ElementType
  text: string
  className?: string
  id?: string
}

/**
 * Text that rises into view word by word when it first scrolls into sight. Each word is masked
 * and staggered (styles/motion.css); lib/site.js adds .in when it arrives. The full text stays in
 * the server HTML, and screen readers get it in one piece through aria-label.
 */
export function RevealText({ as: Tag = 'h2', text, className, id }: RevealTextProps) {
  const words = text.split(' ')
  return (
    <Tag className={className ? `${className} rt` : 'rt'} id={id} data-reveal="" aria-label={text}>
      {words.map((word, i) => (
        // The space sits between the masks: inside an inline-block it would be dropped
        <Fragment key={i}>
          <span className="rt__mask" aria-hidden="true">
            <span className="rt__word" style={{ transitionDelay: `${i * 45}ms` }}>
              {word}
            </span>
          </span>
          {i < words.length - 1 ? ' ' : null}
        </Fragment>
      ))}
    </Tag>
  )
}
