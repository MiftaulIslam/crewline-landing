// The home sections that rotate by themselves (data-rotate, in milliseconds, driven by
// lib/site.js): each tab or phrase shows in turn, and a click holds one
import type { ApproveRotateContent, FlowsRotateContent, HomeLanguagesContent, ToolsContent } from '@/content/home.types'
import { Jack } from '@/components/ui/Jack'
import { Lede } from '@/components/ui/Lede'
import { RichText } from '@/components/ui/RichText'
import { RevealText } from '@/components/ui/RevealText'
import { SwapStack } from '@/components/media/SwapStack'
import { TabRail } from '@/components/media/TabRail'
import { PageMore, SlideStack, Tab, screenImages } from './parts'

/** Waiting, then approved */
const APPROVAL_LAMPS = ['lamp--attn', 'lamp--live']

/** The approval rule in large type, and the flow screens in turn */
export function FlowsRotate({ content }: { content: FlowsRotateContent }) {
  return (
    <section className="night flows" id="flows" data-rotate="4500">
      <Jack y={10} />
      <div className="wrap">
        <RevealText as="h2" className="flows__title" text={content.title} />
        <p className="flows__rule"><RichText text={content.rule} /></p>
        <p className="flows__after">{content.after}</p>
        <div className="flows__foot">
          <div>
            <Lede text={content.lede} />
            <code>{content.code}</code>
            <p><PageMore link={content.more} /></p>
          </div>
          <div className="tabs" role="tablist" aria-label={content.tabsLabel}>
            {content.screens.map((s, i) => (
              <Tab key={s.tab} on={i === 0}>{s.tab}</Tab>
            ))}
          </div>
        </div>
      </div>
      <div className="stack flows__stack">
        <SlideStack images={screenImages(content.screens)} />
      </div>
    </section>
  )
}

/** A refund waiting for approval, then approved */
export function ApproveRotate({ content }: { content: ApproveRotateContent }) {
  return (
    <section className="night approve" id="approve" data-rotate="4000">
      <Jack y={8} />
      <div className="wrap approve__grid">
        <div className="stack">
          <SlideStack images={screenImages(content.screens)} />
        </div>
        <div>
          <RevealText as="h2" className="h2" text={content.title} />
          <Lede text={content.lede} />
          <PageMore link={content.more} />
          <div className="tabs" role="tablist" aria-label={content.tabsLabel}>
            {content.screens.map((s, i) => (
              <Tab key={s.tab} on={i === 0}><span className={`lamp ${APPROVAL_LAMPS[i]}`}></span>{s.tab}</Tab>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

/** The page's one red section: the same question in several languages in turn */
export function LanguagesRotate({ content }: { content: HomeLanguagesContent }) {
  return (
    <section className="cordred tongues" id="languages" data-rotate="2200">
      <Jack y={88} x={90} />
      <div className="wrap">
        <p className="tongues__stage" aria-hidden="true">
          {content.phrases.map((p, i) => (
            <span key={p.text} data-slide="" className={i ? undefined : 'is-on'} lang={p.lang}>{p.text}</span>
          ))}
        </p>
        <h2 className="sr">{content.title}</h2>
        <p className="lede tongues__lede">{content.lede}</p>
        <PageMore link={content.more} />
      </div>
    </section>
  )
}

/** The four tools, each tab showing its screen: a rail slides to the tab, the screen rises in from below */
export function ToolsRotate({ content }: { content: ToolsContent }) {
  return (
    <section className="night tools" id="tools" data-rotate="5000">
      <Jack y={10} />
      <div className="wrap tools__grid">
        <div>
          <RevealText as="h2" className="h2" text={content.title} />
          <div className="tools__list" role="tablist" aria-label={content.tabsLabel}>
            {content.items.map((tool, i) => (
              <Tab key={tool.title} on={i === 0}><strong>{tool.title}</strong><span>{tool.text}</span></Tab>
            ))}
            <TabRail />
          </div>
        </div>
        <SwapStack className="stack" itemClassName="win" slide images={content.items.map((tool) => tool.image)} />
      </div>
    </section>
  )
}
