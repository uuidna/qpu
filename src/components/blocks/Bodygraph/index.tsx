import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { BlockWrapper } from '@/components/BlockWrapper'
import type { SearchParams } from '@/components/RenderBlocks'
import { CENTERS, CENTER_GATES, CHANNELS, chartOf, centerOf } from '@uuidna/qpu/families/hd/index.js'
import { qpuHexUuidOf } from '@uuidna/qpu'
import type { BodygraphBlock } from '@/payload-types'

const J2000 = 2451545
// the nine centers on the bodygraph, head to root, as a column with the three lateral ones beside it
const AT: Record<(typeof CENTERS)[number], [number, number]> = { Head: [150, 30], Ajna: [150, 90], Throat: [150, 160], G: [150, 240], Heart: [230, 270], Sacral: [150, 340], SolarPlexus: [250, 380], Spleen: [50, 380], Root: [150, 440] }

/** The structure drawn: every center, every channel faint, the defined ones strong, the activations named. */
export function Bodygraph({ heading, intro, anchor, jd, searchParams }: BodygraphBlock & { searchParams: SearchParams }) {
  const birth = Number(searchParams.jd ?? jd ?? J2000)
  const chart = chartOf(Number.isFinite(birth) && birth > 0 ? birth : J2000)
  const defined = new Set(chart.defined.map(([a, b]) => `${a}-${b}`))
  const definedCenters = new Set(chart.centers)
  const hex = (name: string, params: number[]) => { try { return qpuHexUuidOf({ family: 'hd', program: [name], params }) } catch { return '' } }
  return (
    <BlockWrapper heading={heading ?? 'Bodygraph'} intro={intro ?? 'The structure only: the gates the Sun and Earth occupy at birth and at the design day, the channels they define among the nine centers, and the definition. No type, profile or authority is stated, by the author’s own finding that profiling by it carries no signal.'} anchor={anchor}>
      <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
        <svg viewBox="0 0 300 480" className="w-full max-w-xs" role="img" aria-label="bodygraph">
          {CHANNELS.map(([a, b]) => {
            const [x1, y1] = AT[CENTERS[centerOf(a) - 1]!], [x2, y2] = AT[CENTERS[centerOf(b) - 1]!]
            const on = defined.has(`${a}-${b}`)
            return <line key={`${a}-${b}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke="currentColor" strokeOpacity={on ? 0.9 : 0.12} strokeWidth={on ? 3 : 1} />
          })}
          {CENTERS.map((c) => {
            const [x, y] = AT[c]
            const on = definedCenters.has(centerOf(CENTER_GATES[c][0]!))
            return (
              <g key={c}>
                <rect x={x - 28} y={y - 18} width={56} height={36} rx={8} fill={on ? 'currentColor' : 'none'} fillOpacity={on ? 0.85 : 1} stroke="currentColor" strokeOpacity={0.6} />
                <text x={x} y={y + 4} textAnchor="middle" fontSize="10" fill={on ? 'var(--background)' : 'currentColor'}>{c}</text>
              </g>
            )
          })}
        </svg>
        <div className="space-y-4 text-sm">
          <form method="get" className="flex flex-wrap items-end gap-2">
            <label className="grid gap-1 text-xs text-muted-foreground">birth Julian day<input name="jd" defaultValue={chart.birthJd} className="h-9 w-40 rounded-md border bg-background px-2 font-mono text-sm text-foreground" /></label>
            <button type="submit" className="h-9 rounded-md border px-3">Compute</button>
          </form>
          <p className="font-mono text-xs text-muted-foreground">design jd {chart.designJd.toFixed(3)} · {chart.daysBeforeBirth.toFixed(1)} days before birth · <Link href={`/${hex('design', [Math.floor(chart.birthJd)])}`} className="underline">hd.design</Link></p>
          <table className="w-full text-xs">
            <tbody>
              {chart.activations.map((a) => (
                <tr key={`${a.layer}-${a.body}`} className="border-t">
                  <td className="py-1 text-muted-foreground">{a.layer}</td>
                  <td className="py-1">{a.body}</td>
                  <td className="py-1 font-mono">{a.longitude.toFixed(2)}°</td>
                  <td className="py-1 font-mono"><Link href={`/${hex('gate', [Math.floor(a.longitude * 10)])}`} className="underline">gate {a.gate}.{a.line}</Link></td>
                  <td className="py-1">{CENTERS[a.index !== undefined ? centerOf(a.gate) - 1 : 0]}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary">definition: {chart.definition}</Badge>
            {chart.defined.map(([a, b]) => <Badge key={`${a}-${b}`} variant="outline" className="font-mono">{a}-{b}</Badge>)}
            {chart.defined.length === 0 ? <span className="text-xs text-muted-foreground">no channel defined by Sun and Earth alone</span> : null}
          </div>
        </div>
      </div>
    </BlockWrapper>
  )
}
