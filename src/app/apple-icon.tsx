import { ImageResponse } from 'next/og'
import { INK } from '@/lib/seo/site'
import { Mark } from './og/mark'

export const size = { width: 180, height: 180 }
export const contentType = 'image/png'

/** The brand mark on ink, for iOS home screens. Also the Organization logo in structured data. */
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: INK }}>
        <Mark size={124} />
      </div>
    ),
    size
  )
}
