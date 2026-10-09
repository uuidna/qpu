import Link from 'next/link'
import { headers } from 'next/headers'
import { Badge } from '@/components/ui/badge'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb'
import { FormulaReadings, listedOf } from '@/components/Readings'
import { AccessPanel, type AccessReading } from '@/components/Public/AccessPanel'
import { payloadLeadsOf } from '@uuidna/qpu/payload/plugins'
import { pluginAxisLengthOf, publicSurfaceOf } from '@uuidna/qpu/payload/plugins'
import { qpuFacesOf } from '@uuidna/qpu'
import type { Page } from '@/payload-types'

const crumbOf = (b: { doc?: unknown; url?: string | null; label?: string | null }) => {
  const slug = b.doc && typeof b.doc === 'object' && 'slug' in b.doc ? String((b.doc as { slug: unknown }).slug) : ''
  return { href: b.url || (slug ? `/${slug}` : ''), label: b.label || slug }
}

/** The home page's public surface: every registered block, the license reading, and the product-variant catalog. */
export async function PublicSurface({ breadcrumbs }: { breadcrumbs?: Page['breadcrumbs'] } = {}) {
  const surface = await publicSurfaceOf()
  const referer = (await headers()).get('referer')
  const { license, variant, doors, navigation: nav, network, access, stats } = surface
  const lattice = qpuFacesOf()
  const trail = (breadcrumbs ?? []).filter((b) => b.label).slice(0, -1).map(crumbOf).filter((b) => b.href)
  const families = new Set(variant.product.map((row) => row.family).concat(variant.variant.map((row) => row.family)))
  const readings = [nav.binomial, nav.slice, nav.cap, nav.waves, nav.agents, nav.saved]
  const registerRows = [
    ...Object.entries(stats.register).map(([k, v]) => [k, v] as const),
    ['zero', stats.zero] as const,
    ['temp', stats.temp] as const,
    ['time', stats.time] as const,
    ['heat', stats.heat] as const,
    ['cold', stats.cold] as const,
    ['coldFusion', stats.coldFusion] as const,
  ]
  return (
    <div className="qpu-machine space-y-16">
      <section id="machine" className="qpu-panel space-y-3 border p-4">
        <p className="font-mono text-xs tracking-[0.2em] text-muted-foreground">QPU · INSIDE OUT</p>
        <h1 className="font-mono text-4xl font-semibold tracking-tight sm:text-5xl">QPU</h1>
        <p className="max-w-2xl text-sm text-muted-foreground">
          The site is the machine: lattice coins={lattice.coins} rays={lattice.rays} faces={lattice.faces}
          — formulas → hex → fused doors → connector → tenant/mode. Clay evidence is seal-wave (
          <code className="font-mono text-xs">{'{ seal: true } / { pass: i }'}</code>
          ), not full discover. Access is Unix chmod (rwx×ugo).
        </p>
        <p className="flex flex-wrap gap-x-3 gap-y-1 font-mono text-xs text-muted-foreground">
          <Link href="#access" className="text-primary hover:underline">#access</Link>
          <Link href="#connector-use" className="text-primary hover:underline">#connector-use</Link>
          <Link href="#observe" className="text-primary hover:underline">#observe</Link>
          <Link href="#seal-wave" className="text-primary hover:underline">#seal-wave</Link>
          <Link href="#native-adapters" className="text-primary hover:underline">#native-adapters</Link>
          <Link href="#print-chips" className="text-primary hover:underline">#print-chips</Link>
          <span>
            bill doors {access.reading.connectBill.doors} · bytes {access.reading.connectBill.bytes}
            {access.reading.connectBill.qpuPrefixed ? ` · qpu_ ${access.reading.connectBill.qpuPrefixed}` : ' · no qpu_'}
          </span>
        </p>
      </section>

      <section id="register-stats" className="space-y-3">
        <h2 className="text-xl font-semibold">Register</h2>
        <p className="font-mono text-xs text-muted-foreground">
          zero / temp / time / heat / coldFusion from heat.identity → reactor.coldfusion
          {stats.heatIdentity ? <> · heat <Link href={`/${stats.heatIdentity}`} className="text-primary hover:underline">{stats.heatIdentity}</Link></> : null}
          {stats.coldFusionHex ? <> · coldFusion <Link href={`/${stats.coldFusionHex}`} className="text-primary hover:underline">{stats.coldFusionHex}</Link></> : null}
          {' · '}holds {String(stats.holds)}
          {' · '}bill units {stats.bill.units} · charged {stats.bill.charged} · billed {stats.bill.billed}
        </p>
        <table className="w-full max-w-md text-sm font-mono">
          <thead>
            <tr className="text-left text-muted-foreground"><th className="py-1 pr-4">Count</th><th className="py-1 text-right">Integer</th></tr>
          </thead>
          <tbody>
            {registerRows.map(([k, v]) => (
              <tr key={k} className="border-t border-border/40">
                <td className="py-1 pr-4">{k}</td>
                <td className="py-1 text-right">{typeof v === 'number' ? v.toLocaleString('en') : String(v)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <AccessPanel
        initial={access.reading as AccessReading}
        doors={doors.doors}
        products={access.products.map((p) => ({ ...p, enums: [...p.enums] }))}
        faces={lattice.faces}
      />

      <section id="navigation" className="space-y-3">
        <h2 className="text-xl font-semibold">Navigation</h2>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              {referer
                ? <BreadcrumbLink href={referer}>{referer}</BreadcrumbLink>
                : <span>lead: {nav.previous.file} has no referer field</span>}
            </BreadcrumbItem>
            {trail.map((b) => (
              <span key={b.href} className="contents">
                <BreadcrumbSeparator />
                <BreadcrumbItem><BreadcrumbLink asChild><Link href={b.href}>{b.label}</Link></BreadcrumbLink></BreadcrumbItem>
              </span>
            ))}
            <BreadcrumbSeparator />
            <BreadcrumbItem><BreadcrumbPage>{nav.page}</BreadcrumbPage></BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild><Link href={nav.next.path}>{nav.next.path}</Link></BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <p className="font-mono text-xs text-muted-foreground">
          next {nav.next.node} face {nav.next.face} via {nav.next.tool} · holds {String(nav.next.holds)}
        </p>
        <ul className="space-y-1 text-sm">
          {readings.map((row) => (
            <li key={row.formula} className="font-mono text-xs">
              {row.hex
                ? <Link href={`/${row.hex}`} className="text-primary hover:underline">{row.formula}({row.params.join(',')}) = {String(row.value)}</Link>
                : <span>{row.formula}({row.params.join(',')}) = {String(row.value)}</span>}
              {row.holds === true ? <Badge className="ml-2">holds</Badge> : <Badge variant="outline" className="ml-2">lead</Badge>}
              <span className="ml-2 text-muted-foreground">hex {String(row.hex)}</span>
            </li>
          ))}
        </ul>
        <ul className="space-y-1 text-sm">
          {nav.pieces.map((row) => (
            <li key={row.piece}>
              <span className="font-mono">{row.piece}</span>
              <span className="text-muted-foreground"> · {row.file}</span>
              {'renders' in row ? <span className="text-muted-foreground"> · renders {row.renders}</span> : null}
              {'referer' in row ? <span className="block text-muted-foreground">previous {String(row.referer)} · next {String(row.next)}</span> : null}
            </li>
          ))}
        </ul>
      </section>

      <section id="license" className="space-y-3">
        <h2 className="text-xl font-semibold">License</h2>
        <p className="text-sm text-muted-foreground">
          {license.spdx} · {license.file} · share {license.share} · commercial request <Link href={license.commercial} className="text-primary hover:underline">{license.commercial}</Link>
        </p>
        <p className="font-mono text-xs">
          <Link href={`/${license.reviewed.hex}`} className="text-primary hover:underline">{license.reviewed.formula}({license.reviewed.params.join(',')}) = {license.reviewed.value}</Link>
          <Badge variant="outline" className="ml-2">lead</Badge>
          <span className="ml-2 text-muted-foreground">holds {String(license.reviewed.holds)} · {license.reviewed.note}</span>
        </p>
        <p className="font-mono text-xs">
          <Link href={`/${license.lawful.hex}`} className="text-primary hover:underline">{license.lawful.formula}({license.lawful.params.join(',')}) = {license.lawful.value}</Link>
          {license.lawful.holds === true ? <Badge className="ml-2">holds</Badge> : <Badge variant="outline" className="ml-2">lead</Badge>}
        </p>
        <p className="font-mono text-xs text-muted-foreground">
          citation holds {String(license.citation.holds)} · lead {String(license.citation.lead)} · ledger {license.bill.units} · charged {license.bill.charged} · billed {license.bill.billed} · margin is a lead
        </p>
        <p className="text-sm">
          Document <Link href={surface.document} className="font-mono text-primary hover:underline">{'{ full: true }'}</Link>
          {' · '}schema <Link href={surface.schema} className="font-mono text-primary hover:underline">{'{ man: true }'}</Link>
        </p>
      </section>

      <section id="variant-lead" className="space-y-3">
        <h2 className="text-xl font-semibold">Product-variant lead</h2>
        <p className="font-mono text-xs">
          hex {String(variant.hex)} · value {String(variant.value)} · holds {String(variant.holds)}
          <Badge variant="outline" className="ml-2">lead</Badge>
        </p>
        <p className="text-sm text-muted-foreground">{variant.absent}</p>
        {variant.mapped ? (
          <p className="text-sm text-muted-foreground">
            sale-surface map (not this hex) · offers {variant.mapped.catalog.offers} · products {variant.mapped.catalog.products} · services {variant.mapped.catalog.services}
            {' · '}
            <Link href="/api/qpu/ecommerce" className="font-mono text-primary hover:underline">{variant.mapped.catalog.call}</Link>
          </p>
        ) : null}
        <p className="font-mono text-xs">
          <Link href={`/${variant.combinatorics.hex}`} className="text-primary hover:underline">
            {variant.combinatorics.formula}({variant.combinatorics.params.join(',')}) = {String(variant.combinatorics.value)}
          </Link>
          {variant.combinatorics.holds === true ? <Badge className="ml-2">holds</Badge> : <Badge variant="outline" className="ml-2">lead</Badge>}
          <span className="ml-2 text-muted-foreground">faces {variant.combinatorics.faces} · variant factor {String(variant.combinatorics.variantFactor)} · run <Link href={`/combinatorics/binomial/${pluginAxisLengthOf()}`} className="text-primary hover:underline">/combinatorics/binomial/{pluginAxisLengthOf()}</Link></span>
        </p>
        <ul className="space-y-1 text-sm">
          {variant.product.map((row) => (
            <li key={`${row.family}.${row.name}`}><Link href={`/${row.family}/${row.name}`} className="font-mono text-primary hover:underline">{row.family}.{row.name}</Link> · arity {row.arity}</li>
          ))}
          {variant.variant.map((row) => (
            <li key={`${row.family}.${row.name}`}><Link href={`/${row.family}/${row.name}`} className="font-mono text-primary hover:underline">{row.family}.{row.name}</Link> · arity {row.arity}</li>
          ))}
        </ul>
        <p className="text-xs text-muted-foreground">Families named here: {[...families].sort().join(', ') || 'none'}.</p>
      </section>

      <section id="doors" className="space-y-3">
        <h2 className="text-xl font-semibold">Doors</h2>
        {doors.absent ? <p className="text-sm text-muted-foreground">{doors.absent}</p> : null}
        <p className="text-sm text-muted-foreground">{doors.doors.length} doors · {doors.formulas} formulas · holds {String(doors.holds)}. A formula is cited at its family page and run at its hex.</p>
        <FormulaReadings />
        <ul className="grid gap-1 sm:grid-cols-2 lg:grid-cols-3 text-sm">
          {listedOf(doors.doors, (row) => row.name).map((row) => (
            <li key={`${row.kind}:${row.name}`} className="font-mono">
              <Link href={`/${encodeURIComponent(row.name)}`} className="text-primary hover:underline">{row.name}</Link>
              <span className="text-muted-foreground"> · {row.kind}</span>
            </li>
          ))}
        </ul>
      </section>

      <section id="network" className="space-y-3">
        <h2 className="text-xl font-semibold">Network</h2>
        <p className="font-mono text-xs">
          {network.file} · {network.catalog}
          <Badge variant="outline" className="ml-2">lead</Badge>
        </p>
        <p className="text-sm text-muted-foreground">{network.absent}</p>
        <p className="font-mono text-xs text-muted-foreground">
          host {network.host} · machine list {network.machineList} · machines hold {String(network.machinesHold)}
        </p>
        <ul className="grid gap-1 sm:grid-cols-2 lg:grid-cols-4 text-sm">
          {network.doors.map((name) => (
            <li key={name} className="font-mono">
              <Link href={`/${encodeURIComponent(name)}`} className="text-primary hover:underline">{name}</Link>
            </li>
          ))}
        </ul>
        {network.pravets ? (
          <p className="font-mono text-xs">
            {network.pravets.name} · when {network.pravets.when} · index {network.index} · word bits {String(network.pravets.wordBits)} · {network.pravets.spec}
            <span className="block text-muted-foreground">
              one-register fidelity {network.pravets.oneRegisterFidelity}{network.pravets.note ? ` · ${network.pravets.note}` : ''} · lead {String(network.pravets.lead)} · register next {network.pravets.registerNext}
            </span>
          </p>
        ) : (
          <p className="text-sm text-muted-foreground">lead: rows[0] is not Pravets 8M when here</p>
        )}
        {network.scale ? (
          <p className="font-mono text-xs">
            {network.scale.hex
              ? <Link href={`/${network.scale.hex}`} className="text-primary hover:underline">{network.scale.formula}({network.scale.params.join(',')}) = {String(network.scale.value)}</Link>
              : <span>{network.scale.formula}({network.scale.params.join(',')}) = {String(network.scale.value)}</span>}
            {network.scale.holds === true ? <Badge className="ml-2">holds</Badge> : <Badge variant="outline" className="ml-2">lead</Badge>}
            <span className="ml-2 text-muted-foreground">hex {String(network.scale.hex)} · {network.scale.condition}</span>
          </p>
        ) : null}
      </section>

      <section id="forms" className="space-y-3">
        <h2 className="text-xl font-semibold">Forms</h2>
        <p className="text-sm text-muted-foreground">The licence is on the <Link href="/#license" className="text-primary hover:underline">home surface</Link>. Field types are the form-builder blocks in src/payload-types.ts.</p>
        <ul className="space-y-1 text-sm">
          {surface.forms.map((row) => (
            <li key={row.blockType}>
              <span className="font-mono">{row.blockType}</span>
              <span className="text-muted-foreground"> · {row.file} · page {row.renders ? 'yes' : 'no'}</span>
              {row.absent ? <span className="block text-muted-foreground">lead: {row.absent}</span> : null}
            </li>
          ))}
        </ul>
      </section>

      <section id="leads" className="space-y-3">
        <h2 className="text-xl font-semibold">Leads</h2>
        <ul className="space-y-2 text-sm">
          {payloadLeadsOf().map((row) => (
            <li key={row.where}><span className="font-mono">{row.where}</span><span className="block text-muted-foreground">{row.why}</span></li>
          ))}
        </ul>
      </section>

      <section id="components" className="space-y-3">
        <h2 className="text-xl font-semibold">Components</h2>
        <ul className="space-y-1 text-sm">
          {surface.components.map((row) => (
            <li key={row.file}>
              <span className="font-mono">{row.file}</span>
              <span className="text-muted-foreground"> · {row.renders} · page {row.page ? 'yes' : 'no'}</span>
              {row.page ? null : <span className="block text-muted-foreground">lead: no page imports this file</span>}
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
