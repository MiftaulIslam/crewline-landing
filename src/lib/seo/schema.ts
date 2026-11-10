// schema.org structured data, built as one connected @graph per page. Site-wide nodes
// (WebSite, Organization, SoftwareApplication) carry stable @ids so each page's WebPage,
// BreadcrumbList, FAQPage, HowTo and VideoObject point at them instead of repeating them.
//
// Left out on purpose, because the site states no such facts: offers/price, aggregateRating
// and review on the SoftwareApplication, and any address, contact point, founder or sameAs
// (social profiles) on the Organization.
import { faq, getPage, site } from '@/content'
import type { PageSlug, Question, StoryFilmContent } from '@/content/types'
import { SITE_URL } from '@/lib/config'
import { heroImage, setupContent, storyContent } from './content'
import {
  absoluteDownloadUrl,
  absoluteUrl,
  featurePages,
  latestUpdate,
  pageDescription,
  pageTitle,
  pageUrl,
  type SeoKey
} from './site'

export type JsonLdNode = Record<string, unknown>

const LANGUAGE = 'en'

export const ids = {
  website: `${SITE_URL}/#website`,
  organization: `${SITE_URL}/#organization`,
  software: `${SITE_URL}/#software`,
  logo: `${SITE_URL}/#logo`
}

const ref = (id: string) => ({ '@id': id })
const pageId = (key: SeoKey) => `${pageUrl(key)}#webpage`

// ------------------------------------------------------------------ site-wide

export function websiteNode(): JsonLdNode {
  return {
    '@type': 'WebSite',
    '@id': ids.website,
    url: `${SITE_URL}/`,
    name: site.name,
    description: pageDescription('home'),
    inLanguage: LANGUAGE,
    publisher: ref(ids.organization)
  }
}

export function organizationNode(): JsonLdNode {
  return {
    '@type': 'Organization',
    '@id': ids.organization,
    name: site.name,
    url: `${SITE_URL}/`,
    logo: {
      '@type': 'ImageObject',
      '@id': ids.logo,
      url: absoluteUrl('/apple-icon'),
      contentUrl: absoluteUrl('/apple-icon'),
      width: 180,
      height: 180,
      caption: site.name
    }
  }
}

export function softwareNode(): JsonLdNode {
  const features = featurePages()
  const downloadUrl = absoluteDownloadUrl()
  return {
    '@type': 'SoftwareApplication',
    '@id': ids.software,
    name: site.name,
    description: pageDescription('home'),
    url: `${SITE_URL}/`,
    applicationCategory: 'BusinessApplication',
    applicationSubCategory: 'Customer support',
    operatingSystem: site.download.os,
    softwareVersion: site.download.version,
    fileSize: site.download.size,
    ...(downloadUrl ? { downloadUrl, installUrl: downloadUrl } : {}),
    featureList: features.map((p) => p.title),
    screenshot: [...new Set(features.map((p) => absoluteUrl(p.shot)))],
    image: absoluteUrl(getPage('conversations').shot),
    inLanguage: LANGUAGE,
    publisher: ref(ids.organization)
  }
}

// ------------------------------------------------------------------ per page

/** Home > Page. The home page itself has no trail. */
function breadcrumbNode(slug: PageSlug): JsonLdNode {
  return {
    '@type': 'BreadcrumbList',
    '@id': `${pageUrl(slug)}#breadcrumb`,
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: site.name, item: pageUrl('home') },
      { '@type': 'ListItem', position: 2, name: getPage(slug).nav, item: pageUrl(slug) }
    ]
  }
}

function primaryImage(key: SeoKey): JsonLdNode {
  const hero = key === 'home' ? undefined : heroImage(key)
  const src = hero?.src ?? (key === 'home' ? getPage('conversations').shot : getPage(key).shot)
  return {
    '@type': 'ImageObject',
    '@id': `${pageUrl(key)}#primaryimage`,
    url: absoluteUrl(src),
    contentUrl: absoluteUrl(src),
    ...(hero?.alt ? { caption: hero.alt } : {})
  }
}

function webPageNode(key: SeoKey, type: string, extra: JsonLdNode = {}): JsonLdNode {
  return {
    '@type': type,
    '@id': pageId(key),
    url: pageUrl(key),
    name: pageTitle(key),
    description: pageDescription(key),
    inLanguage: LANGUAGE,
    dateModified: key === 'home' ? latestUpdate() : getPage(key).updated,
    isPartOf: ref(ids.website),
    about: ref(ids.software),
    primaryImageOfPage: primaryImage(key),
    ...(key === 'home' ? {} : { breadcrumb: ref(`${pageUrl(key)}#breadcrumb`) }),
    ...extra
  }
}

function questionNodes(items: Question[]): JsonLdNode[] {
  return items.map((q) => ({
    '@type': 'Question',
    name: q.question,
    acceptedAnswer: { '@type': 'Answer', text: q.answer }
  }))
}

function howToNode(): JsonLdNode {
  const url = pageUrl('setup')
  const { hero, guide, needs } = setupContent
  return {
    '@type': 'HowTo',
    '@id': `${url}#howto`,
    name: hero.title,
    description: hero.lede,
    inLanguage: LANGUAGE,
    image: absoluteUrl(hero.image.src),
    supply: needs.items.map((item) => ({ '@type': 'HowToSupply', name: item.title, description: item.text })),
    step: guide.steps.map((s, i) => ({
      '@type': 'HowToStep',
      position: i + 1,
      name: s.title,
      text: s.text,
      image: { '@type': 'ImageObject', url: absoluteUrl(s.image.src), caption: s.image.alt }
    })),
    about: ref(ids.software)
  }
}

function videoNode(): JsonLdNode {
  const film: StoryFilmContent = storyContent.film
  const lede = Array.isArray(film.lede) ? film.lede.join(' ') : film.lede
  return {
    '@type': 'VideoObject',
    '@id': `${pageUrl('story')}#film`,
    name: film.title,
    description: lede,
    thumbnailUrl: [absoluteUrl(film.film.poster)],
    uploadDate: film.uploaded,
    duration: film.duration,
    contentUrl: absoluteUrl(film.film.src),
    inLanguage: LANGUAGE,
    publisher: ref(ids.organization),
    about: ref(ids.software)
  }
}

/** The whole graph for one page */
export function pageGraph(key: SeoKey): JsonLdNode {
  const nodes: JsonLdNode[] = [websiteNode(), organizationNode(), softwareNode()]

  if (key === 'faq') {
    nodes.push(webPageNode(key, 'FAQPage', { mainEntity: questionNodes(faq) }))
  } else if (key === 'setup') {
    nodes.push(webPageNode(key, 'WebPage', { mainEntity: ref(`${pageUrl(key)}#howto`) }), howToNode())
  } else if (key === 'story') {
    nodes.push(webPageNode(key, 'WebPage', { video: ref(`${pageUrl(key)}#film`) }), videoNode())
  } else {
    nodes.push(webPageNode(key, 'WebPage'))
  }

  if (key !== 'home') nodes.push(breadcrumbNode(key))
  return { '@context': 'https://schema.org', '@graph': nodes }
}
