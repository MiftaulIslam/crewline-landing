import type { MetadataRoute } from 'next'
import { absoluteUrl } from '@/lib/seo/site'

/** Search and AI crawlers named explicitly, so the welcome is clear even to bots that only
 *  read their own group. OpenAI, Anthropic and Perplexity tokens checked against their docs
 *  in November 2026. */
const CRAWLERS = [
  // Search engines
  'Googlebot',
  'Bingbot',
  'Applebot',
  'DuckDuckBot',
  // OpenAI
  'GPTBot',
  'OAI-SearchBot',
  'ChatGPT-User',
  // Anthropic
  'ClaudeBot',
  'Claude-User',
  'Claude-SearchBot',
  // Perplexity
  'PerplexityBot',
  'Perplexity-User',
  // Google and Apple AI training controls
  'Google-Extended',
  'Applebot-Extended',
  // Others
  'CCBot',
  'DuckAssistBot',
  'Amazonbot',
  'Meta-ExternalAgent',
  'Meta-ExternalFetcher',
  'MistralAI-User',
  'cohere-ai'
]

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/' },
      { userAgent: CRAWLERS, allow: '/' }
    ],
    sitemap: absoluteUrl('/sitemap.xml')
  }
}
