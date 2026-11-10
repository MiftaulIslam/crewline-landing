// /llms.txt. It reads only the bundled content JSON, so Cache Components prerenders it at build time.
import { llmsTxt } from '@/lib/seo/llms'

export function GET() {
  return new Response(llmsTxt(), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } })
}
