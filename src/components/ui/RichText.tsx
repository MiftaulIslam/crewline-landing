import { Fragment } from 'react'
import type { Rich } from '@/content/types'

/** Renders content text, turning **marked** words into <b> highlights */
export function RichText({ text }: { text: Rich }) {
  return text.split(/\*\*(.+?)\*\*/g).map((part, i) => (i % 2 ? <b key={i}>{part}</b> : <Fragment key={i}>{part}</Fragment>))
}

/** The same text with the markers removed, for metadata and structured data */
export const plain = (text: Rich) => text.replace(/\*\*(.+?)\*\*/g, '$1')
