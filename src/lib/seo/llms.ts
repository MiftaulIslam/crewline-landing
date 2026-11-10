// /llms.txt (llmstxt.org) and /llms-full.txt, written from the content JSON so they say
// exactly what the pages say. Nothing here adds a claim of its own.
import { compare, faq, pages, site, transcripts } from '@/content'
import type { PageEntry, PageSlug, Question } from '@/content/types'
import { pageContent, storyContent } from './content'
import { absoluteUrl, pageDescription, pageTitle, pageUrl } from './site'

type Json = unknown
type Obj = Record<string, Json>

const isObj = (v: Json): v is Obj => !!v && typeof v === 'object' && !Array.isArray(v)
const str = (v: Json): v is string => typeof v === 'string'
const oneLine = (s: string) => s.replace(/\s+/g, ' ').trim()
const paragraphs = (v: Json): string[] => (Array.isArray(v) ? v.filter(str) : str(v) ? [v] : []).map(oneLine)
const isQuestion = (v: Json): v is Question => isObj(v) && str(v.question) && str(v.answer)
const cell = (s: string) => s.replace(/\|/g, '\\|')

function table(columns: string[], rows: string[][]): string[] {
  return [
    `| ${columns.map(cell).join(' | ')} |`,
    `| ${columns.map(() => '---').join(' | ')} |`,
    ...rows.map((r) => `| ${r.map(cell).join(' | ')} |`)
  ]
}

function questions(items: Question[]): string[] {
  return items.flatMap((q) => [`### ${oneLine(q.question)}`, '', oneLine(q.answer), ''])
}

function chat(keys: Json): string[] {
  const list = (Array.isArray(keys) ? keys : [keys]).filter(str)
  return list.flatMap((key) => {
    const t = (transcripts as Record<string, (typeof transcripts)[keyof typeof transcripts]>)[key]
    if (!t) return []
    return [
      `Conversation with ${t.who} (${t.tag}):`,
      '',
      ...t.lines.map((l) => `- **${l.from === 'customer' ? 'Customer' : 'Agent'}:** ${oneLine(l.text)}`),
      ''
    ]
  })
}

/** One named section of a page's JSON, as Markdown */
function section(name: string, value: Json, slug: PageSlug): string[] {
  const out: string[] = []

  // A bare string is a section title the page fills from shared content. The FAQ page shows
  // the same questions twice (a dial, then a list), so only the list is written out.
  if (str(value)) {
    if (slug === 'faq' && name === 'dialTitle') return out
    out.push(`## ${oneLine(value)}`, '')
    if (slug === 'faq' && name === 'listTitle') out.push(...questions(faq))
    return out
  }
  if (!isObj(value)) return out

  if (str(value.title)) out.push(`## ${oneLine(value.title)}`, '')
  if (isObj(value.film) && str(value.duration)) out.push(`Film, ${value.duration.replace(/^PT/, '').toLowerCase()}: ${absoluteUrl(String(value.film.src))}`, '')

  // A statement: one highlighted line and what follows it
  if (str(value.line)) out.push(oneLine(value.line), '')
  if (str(value.after)) out.push(oneLine(value.after), '')

  if (Array.isArray(value.phrases)) {
    out.push(...value.phrases.filter(isObj).map((p) => `- ${String(p.text)}${str(p.lang) ? ` (${p.lang})` : ''}`), '')
  }
  for (const p of paragraphs(value.lede)) out.push(p, '')

  if (Array.isArray(value.items)) {
    const items = value.items
    if (items.every(isQuestion)) out.push(...questions(items))
    else {
      out.push(...items.filter(isObj).map((i) => `- **${oneLine(String(i.title))}:** ${oneLine(String(i.text ?? ''))}`), '')
    }
  }
  if (Array.isArray(value.steps)) {
    out.push(...value.steps.filter(isObj).map((s, i) => `${i + 1}. **${oneLine(String(s.title))}:** ${oneLine(String(s.text ?? ''))}`), '')
  }
  if (Array.isArray(value.columns) && Array.isArray(value.rows)) {
    out.push(...table(value.columns.filter(str), value.rows.filter(Array.isArray).map((r) => r.map(String))), '')
  }
  if (value.chat !== undefined) out.push(...chat(value.chat))

  // The comparison table lives in compare.json and is drawn under this heading
  if (slug === 'compare' && name === 'sideBySide') {
    out.push(...table(['', compare.ours, ...compare.columns], compare.rows.map((r) => [r.label, r.ours, ...r.values])), '')
    out.push(oneLine(compare.meter.note), '')
  }
  return out
}

function pageMarkdown(page: PageEntry): string[] {
  const content = pageContent[page.slug]
  return [
    `# ${page.title}`,
    '',
    `URL: ${pageUrl(page.slug)}`,
    `Updated: ${page.updated}`,
    '',
    `> ${pageDescription(page.slug)}`,
    '',
    ...Object.entries(content).flatMap(([name, value]) => section(name, value, page.slug))
  ]
}

function homeMarkdown(): string[] {
  return [
    `# ${site.title}`,
    '',
    `URL: ${pageUrl('home')}`,
    '',
    `> ${pageDescription('home')}`,
    '',
    site.description,
    '',
    site.sampleNote,
    '',
    `## ${site.download.title}`,
    '',
    `${site.download.button}: ${site.download.spec}`,
    '',
    '## Questions',
    '',
    ...questions(faq)
  ]
}

const finish = (lines: string[]) => lines.join('\n').replace(/\n{3,}/g, '\n\n').trim() + '\n'

/** The headline facts: every highlighted statement, the record of the test day, the installer */
function facts(): string[] {
  const statements = pages.flatMap((p) =>
    Object.values(pageContent[p.slug])
      .filter(isObj)
      .filter((s) => str(s.line))
      .map((s) => `- ${oneLine(String(s.line))}${str(s.after) ? `. ${oneLine(s.after)}` : ''} ([${p.nav}](${pageUrl(p.slug)}))`)
  )
  const { record } = storyContent
  return [
    `- ${site.sampleNote} ${oneLine(record.lede)} ([${getNav('story')}](${pageUrl('story')}))`,
    ...statements,
    `- Installer: ${site.download.spec} Version ${site.download.version}.`
  ]
}

/** What it doesn't do yet: every "limits" answer on the feature pages, and when to pick something else */
function limits(): string[] {
  // The same answer can appear on several pages: write it once and link each page
  const seen = new Map<string, PageEntry[]>()
  for (const p of pages) {
    for (const s of Object.values(pageContent[p.slug]).filter(isObj)) {
      if (!Array.isArray(s.items) || !s.items.every(isQuestion)) continue
      for (const q of s.items as Question[]) {
        const line = `${oneLine(q.question)} ${oneLine(q.answer)}`
        seen.set(line, [...(seen.get(line) ?? []), p])
      }
    }
  }
  const fromPages = [...seen].map(([line, on]) => `- ${line} (${on.map((p) => `[${p.nav}](${pageUrl(p.slug)})`).join(', ')})`)
  const elsewhere = pageContent.compare.elsewhere as { items?: { title: string; text: string }[] } | undefined
  const fromCompare = (elsewhere?.items ?? []).map((i) => `- ${oneLine(i.title)}: ${oneLine(i.text)} ([${getNav('compare')}](${pageUrl('compare')}))`)
  return [...fromPages, ...fromCompare]
}

const getNav = (slug: PageSlug) => pages.find((p) => p.slug === slug)?.nav ?? slug

export function llmsTxt(): string {
  const bySlug = new Map(pages.map((p) => [p.slug, p]))
  const columns = site.footer.columns.map((col) => [
    `## ${col.title}`,
    '',
    ...col.slugs.flatMap((slug) => {
      const page = bySlug.get(slug)
      return page ? [`- [${pageTitle(slug)}](${pageUrl(slug)}): ${pageDescription(slug)}`] : []
    }),
    ''
  ])
  return finish([
    `# ${site.name}`,
    '',
    `> ${pageDescription('home')}`,
    '',
    `${site.tagline}. A desktop app for ${site.download.os}: ${site.download.spec} ${site.sampleNote}`,
    '',
    ...columns.flat(),
    '## Facts',
    '',
    ...facts(),
    '',
    '## Limits',
    '',
    ...limits(),
    '',
    '## Optional',
    '',
    `- [Full text of every page](${absoluteUrl('/llms-full.txt')}): all pages as Markdown`,
    `- [Sitemap](${absoluteUrl('/sitemap.xml')})`
  ])
}

export function llmsFullTxt(): string {
  return finish([
    `# ${site.name}: full text`,
    '',
    `> ${site.description} ${site.sampleNote}`,
    '',
    ...homeMarkdown(),
    '',
    ...pages.flatMap((p) => ['', '---', '', ...pageMarkdown(p)])
  ])
}
