// /llms-full.txt: every page as Markdown. It reads only the bundled content JSON, so Cache
// Components prerenders it at build time.
import { llmsFullTxt } from '@/lib/seo/llms'

export function GET() {
  return new Response(llmsFullTxt(), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } })
}
