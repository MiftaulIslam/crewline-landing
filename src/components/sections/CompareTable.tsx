import type { CompareContent } from '@/content/types'

/** The comparison table and the cost slider, shared by the home and Compare pages. lib/site.js drives the slider. */
export function CompareTable({ content }: { content: CompareContent }) {
  const { meter } = content
  const money = (n: number) => '$' + Math.round(n).toLocaleString('en-US')
  return (
    <>
      <div className="compare__scroll" tabIndex={0} role="region" aria-label={content.label}>
        <table>
          <thead>
            <tr>
              <th></th>
              {content.columns.map((c) => (
                <th key={c}>{c}</th>
              ))}
              <th className="us">{content.ours}</th>
            </tr>
          </thead>
          <tbody>
            {content.rows.map((r) => (
              <tr key={r.label}>
                <th>{r.label}</th>
                {r.values.map((v, i) => (
                  <td key={i} data-label={content.columns[i]}>
                    {v}
                  </td>
                ))}
                <td className="us" data-label={content.ours}>
                  {r.ours}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="meter" data-rate={meter.rate}>
        <label htmlFor="volume">
          {meter.label} <output id="volume-out">{meter.start.toLocaleString('en-US')}</output>
        </label>
        <input id="volume" type="range" min={meter.min} max={meter.max} step={meter.step} defaultValue={meter.start} />
        <p className="meter__row">
          <span>{meter.rateLabel}</span>
          <b id="cost-out">{money(meter.start * meter.rate)}</b>
          <span>{meter.perMonth}</span>
        </p>
        <p className="meter__row meter__row--us">
          <span>{meter.oursLabel}</span>
          <b>{meter.oursValue}</b>
          <span>{meter.oursNote}</span>
        </p>
        <p className="meter__note">{meter.note}</p>
      </div>
    </>
  )
}
