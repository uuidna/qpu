import Link from 'next/link'
import { BlockWrapper } from '@/components/BlockWrapper'
import type { SearchParams } from '@/components/RenderBlocks'
import { qpuFacesOf, qpuHexFamiliesOf, qpuHexRunOf, qpuHexUuidOf } from '@uuidna/qpu'
import '@uuidna/qpu/mcp/families.js'
import { DOORS, qpuDiscoverOf } from '@uuidna/qpu/mcp/discovery.js'
import type { AnimationBlock } from '@/payload-types'

type Trace = { family: string; program: string[]; points: { x: number; y: number; hex: string }[] }

/** A formula's result animated: its values over 1..take as a path, a marker tracing it in time (SMIL, no script);
 *  the cross formula is the other family's way to a value this formula reaches, found by the discovery over the same
 *  inputs, traced beside it; where the two meet the marker pulses. Everything drawn is a run at its own address. */
export async function Animation({ heading, intro, anchor, family, formula, take, searchParams }: AnimationBlock & { searchParams: SearchParams }) {
  const names = [...qpuHexFamiliesOf().keys()].filter((f) => !DOORS.has(f)).sort()
  const fam = String(searchParams.family ?? family ?? names[0] ?? '')
  const formulas = qpuHexFamiliesOf().get(fam) ?? []
  const name = String(searchParams.formula ?? formula ?? formulas[0]?.name ?? '')
  const f = formulas.find((x) => x.name === name)
  const n = Math.min(64, Math.max(2, Number(searchParams.take ?? take ?? qpuFacesOf().faces)))
  const inputs = Array.from({ length: n }, (_, i) => i + 1)
  const run = async (family: string, program: string[], params: number[]) => {
    try { const hex = qpuHexUuidOf({ family, program, params }); const r = (await qpuHexRunOf(hex, undefined, undefined, { store: false })) as { value?: unknown; holds?: boolean }; const v = Number(r.value); return r.holds === true && Number.isFinite(v) ? { v, hex } : null } catch { return null }
  }
  const own: Trace = { family: fam, program: f ? [f.name] : [], points: [] }
  if (f) for (const x of inputs) { const r = await run(fam, [f.name], Array.from({ length: Math.max(f.arity, 1) }, () => x)); if (r) own.points.push({ x, y: r.v, hex: r.hex }) }
  // the cross formula: the discovery over the formula's own values finds the other family's way to one of them
  const values = own.points.map((p) => Math.round(p.y)).filter((v) => Number.isSafeInteger(v) && v >= 3)
  const d = values.length ? await qpuDiscoverOf(values.slice(0, 32)) : { relations: [] as { value: string; ways: { family: string; program: string[]; params: number[] }[] }[] }
  const way = d.relations.flatMap((r) => r.ways.filter((w) => w.family !== fam && w.params.length === 1).map((w) => ({ ...w, value: Number(r.value) }))).find((w) => values.includes(w.value))
  const cross: Trace | null = way ? { family: way.family, program: way.program, points: [] } : null
  if (cross) for (const x of inputs) { const r = await run(cross.family, cross.program, [x]); if (r) cross.points.push({ x, y: r.v, hex: r.hex }) }
  const all = [...own.points, ...(cross?.points ?? [])]
  const maxY = Math.max(1, ...all.map((p) => p.y)), W = 640, H = 240, pad = 24
  const sx = (x: number) => pad + ((x - 1) / Math.max(1, n - 1)) * (W - 2 * pad)
  const sy = (y: number) => H - pad - (y / maxY) * (H - 2 * pad)
  const path = (t: Trace) => t.points.map((p, i) => `${i ? 'L' : 'M'}${sx(p.x).toFixed(1)},${sy(p.y).toFixed(1)}`).join(' ')
  const meets = cross ? own.points.filter((p) => cross.points.some((q) => q.x === p.x ? Math.round(q.y) === Math.round(p.y) : false) || cross.points.some((q) => Math.round(q.y) === Math.round(p.y))) : []
  const seconds = Math.max(4, n / 2)
  return (
    <BlockWrapper heading={heading ?? 'Animation'} intro={intro} anchor={anchor}>
      <form method="get" className="mb-4 flex flex-wrap items-end gap-2">
        <label className="grid gap-1 text-xs text-muted-foreground">family<select name="family" defaultValue={fam} className="h-9 rounded-md border bg-background px-2 text-sm text-foreground">{names.map((x) => <option key={x} value={x}>{x}</option>)}</select></label>
        <label className="grid gap-1 text-xs text-muted-foreground">formula<select name="formula" defaultValue={name} className="h-9 rounded-md border bg-background px-2 text-sm text-foreground">{formulas.map((x) => <option key={x.name} value={x.name}>{x.name}</option>)}</select></label>
        <label className="grid gap-1 text-xs text-muted-foreground">take<input name="take" type="number" min={2} max={64} defaultValue={n} className="h-9 w-20 rounded-md border bg-background px-2 text-sm text-foreground" /></label>
        <button type="submit" className="h-9 rounded-md border px-3">Animate</button>
      </form>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-3xl" role="img" aria-label={`${fam}.${name} over 1..${n}${cross ? `, with ${cross.family}.${cross.program.join('∘')}` : ''}`}>
        <line x1={pad} y1={H - pad} x2={W - pad} y2={H - pad} stroke="currentColor" strokeOpacity={0.3} />
        <line x1={pad} y1={pad} x2={pad} y2={H - pad} stroke="currentColor" strokeOpacity={0.3} />
        {own.points.length > 1 ? (
          <>
            <path id="own" d={path(own)} fill="none" stroke="currentColor" strokeWidth={2} />
            <circle r={5} fill="currentColor"><animateMotion dur={`${seconds}s`} repeatCount="indefinite" path={path(own)} /></circle>
          </>
        ) : null}
        {cross && cross.points.length > 1 ? (
          <>
            <path d={path(cross)} fill="none" stroke="currentColor" strokeOpacity={0.5} strokeDasharray="4 3" strokeWidth={2} />
            <circle r={4} fill="none" stroke="currentColor" strokeWidth={2}><animateMotion dur={`${seconds}s`} repeatCount="indefinite" path={path(cross)} /></circle>
          </>
        ) : null}
        {meets.map((p) => (
          <circle key={p.hex} cx={sx(p.x)} cy={sy(p.y)} r={6} fill="none" stroke="currentColor" strokeWidth={1.5}>
            <animate attributeName="r" values="4;10;4" dur="2s" repeatCount="indefinite" />
            <animate attributeName="stroke-opacity" values="1;0.2;1" dur="2s" repeatCount="indefinite" />
          </circle>
        ))}
        {own.points.map((p) => <title key={`${p.hex}-t`}>{`${fam}.${name}(${p.x}) = ${p.y}`}</title>).slice(0, 1)}
      </svg>
      <p className="mt-3 font-mono text-xs text-muted-foreground">
        {own.points.length ? <>{fam}.{name}: {own.points.slice(0, 8).map((p) => <Link key={p.hex} href={`/${p.hex}`} className="underline mr-2">{`(${p.x}) = ${p.y}`}</Link>)}{own.points.length > 8 ? '…' : ''}</> : `${fam}.${name}: no value held on 1..${n}`}
        {cross ? <> · crossed by {cross.family}.{cross.program.join('∘')}, meeting at {meets.length ? meets.map((p) => p.y).filter((v, i, a) => a.indexOf(v) === i).slice(0, 6).join(', ') : 'no shared value in this window'}</> : ' · no other family reaches these values in this window'}
      </p>
    </BlockWrapper>
  )
}
