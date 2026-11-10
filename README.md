# Crewline landing site

The marketing site for Crewline, a Windows app that runs six AI support agents on your own PC.
Next.js 16 (App Router), React 19, TypeScript. Every page is prerendered as static HTML.

Production domain: https://crewline.miftaul.com

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # static pages, Open Graph images, sitemap, robots.txt and llms.txt
npm start
```

## How it is put together

Components own layout, styling, responsive behaviour and interactions. JSON files own the
words, images and numbers. A page's route file decides which sections appear and in what order,
and sets layout props such as the background ground or a flipped split. Nothing in the content
files chooses a component or describes layout.

```
src/
  app/                    one folder per page: page.tsx composes its sections explicitly
    page.tsx              home
    flows/page.tsx        ...and 15 more feature pages
    og/[image]/           Open Graph images (1200x630 PNG), built at build time
    sitemap.ts robots.ts manifest.ts llms.txt/ llms-full.txt/ not-found.tsx apple-icon.tsx
  components/
    layout/               SiteHeader, SiteFooter, Cord, BackToTop, PageBehaviour
    sections/             shared sections: heroes, steps, splits, bands, stepper, tables, page end
    home/                 sections that only the home page uses
    vignettes/            the live product animations, each with a server-rendered text version
    ui/                   small parts: Section, SectionHead, Lede, RichText, Jack, buttons
    seo/                  JSON-LD for each page
  content/
    site.json             name, header and footer labels, download block
    pages.json            the feature page registry: menu labels, titles, descriptions, dates
    pages/<slug>.json     each page's copy, keyed by section
    faq.json transcripts.json compare.json vignettes.json seo.json
    types.ts ...          TypeScript interfaces the JSON is checked against
  lib/
    site.js alive.js      page behaviour and the vignette animations, started and stopped per page
    seo/                  metadata, structured data, llms.txt builders
    config.ts             environment values
  styles/                 site.css and alive.css
```

To change copy, edit the JSON. `**double asterisks**` mark a highlight in the few places that
show one. To add a feature page, add an entry to `content/pages.json`, write
`content/pages/<slug>.json`, and compose `app/<slug>/page.tsx` from the section components;
the menu, footer, sitemap, Open Graph image and llms.txt pick it up from the registry.

## SEO and GEO

- Every page: a unique title and description, a canonical URL, Open Graph and Twitter cards with
  a generated image, and robots directives allowing large image previews.
- JSON-LD on every page: WebSite, Organization, SoftwareApplication, WebPage and BreadcrumbList,
  plus FAQPage on /faq, HowTo on /setup and VideoObject on /story.
- `sitemap.xml` with images and the film, `robots.txt` that names the main search and AI crawlers,
  `llms.txt` and `llms-full.txt` for answer engines, a web manifest and a noindex 404.
- The live animations run in the browser, so each one also renders the same facts as visually
  hidden text in the server HTML, for crawlers and screen readers.

## Environment

| Variable | Default | What it does |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | `https://crewline.miftaul.com` | The origin used in every absolute URL |
| `NEXT_PUBLIC_DOWNLOAD_URL` | `/#download` | Where the Download buttons point; set it to the hosted installer |

The installer (228 MB) is too large for this repository. Photo and film credits are in
`public/CREDITS.md`.
