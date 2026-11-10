// Values that depend on where the site is deployed, read from the environment at build time.

/** The public origin, used for canonical URLs, the sitemap, Open Graph, structured data and llms.txt */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://crewline.miftaul.com').replace(/\/$/, '')

/** Where the Download buttons point. Set NEXT_PUBLIC_DOWNLOAD_URL to the hosted installer. */
export const DOWNLOAD_URL = process.env.NEXT_PUBLIC_DOWNLOAD_URL || '/#download'
