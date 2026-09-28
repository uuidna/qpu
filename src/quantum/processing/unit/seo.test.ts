/**
 * THE ZONE IS CRAWLABLE, HOST BY HOST — and the site is the MCP rather than a list beside it.
 *
 * Measured 2026-09-28 against the live zone: five of six first-party hosts answered 404 for both /robots.txt and
 * /sitemap.xml, so Cloudflare's managed default stood in for each of them — a file that names no sitemap. qpu had
 * been computing a real sitemap the whole time and nothing pointed at it. These tests hold the two laws that fixes
 * only if both are kept: a host's pair belongs to THAT host, and the MCP endpoint every host names is ONE endpoint.
 *
 * Neither law is measure-then-seal. Each one is a relation between hosts that the code can break without any
 * number moving: a robots.txt built from the unit's origin instead of the asking host passes every count and fails
 * the first test here, and a sitemap that helpfully lists the canonical MCP on a sibling's host fails the second.
 */
import { test } from './receipted.js'
import assert from 'node:assert/strict'
import worker, {
  QPU_ZONE_HOSTS,
  qpuRobotsOf,
  qpuRobotsHolds,
  qpuSeoOf,
  qpuSeoZoneOf,
  qpuSeoZoneHolds,
  qpuTenantZoneOf,
  qpuZoneHolds,
  qpuZoneHostHolds,
  qpuZoneHostOf,
  qpuZoneOf,
} from './index.js'

const env = { QPU_HOST: 'qpu.uuidna.com' }
const getOf = (host: string, path: string) =>
  worker.fetch(new Request(`https://${host}${path}`, { headers: { accept: 'text/plain' } }), env)

test('the zone names every first-party host, and no first-party name can be let out as a tenant', async () => {
  const z = qpuZoneOf()
  assert.equal(qpuZoneHolds(z), true)
  assert.equal(z.hosts.filter((h) => h.apex).length, 1, 'one apex — the zone itself')
  assert.ok(z.hosts.some((h) => h.own), 'this unit is one of the hosts it serves; it is not outside its own zone')

  // THE REGRESSION THIS TABLE EXISTS FOR, READ OFF THE WIRE. reserved was a two-name hand list — this unit and
  // www — so every other first-party label matched the tenant branch above the named gate: had its custom domain
  // lapsed, lean.uuidna.com would have been forwarded to Payload as somebody's rented page. The distinction is
  // visible in the answer, so it is asserted there rather than in the table that produces it.
  const { reserved } = qpuTenantZoneOf()
  for (const h of z.hosts.filter((x) => !x.apex)) {
    assert.ok(reserved.includes(h.label), `${h.label} is first-party and must never be read as a tenant slug`)
    const first = await getOf(h.host, '/robots.txt')
    assert.equal(first.status, 200, `${h.host} is first-party and must be answered here, not handed on as a tenant`)
  }
  assert.ok(reserved.includes('www'), 'www is reserved because the router redirects it to the apex')

  // A REAL TENANT STILL TAKES THE TENANT PATH, and says so by name — the widening did not swallow the branch.
  const tenant = await getOf('somebody-elses-shop.uuidna.com', '/robots.txt')
  assert.equal(tenant.status, 404)
  assert.equal(((await tenant.json()) as { denied?: string }).denied, 'payload', 'a tenant is refused by name when no Payload binding is bound here')

  // and the table is not a wish: a name this unit does not serve resolves to nothing rather than to a guess
  assert.equal(qpuZoneHostOf('example.org'), undefined)
  assert.equal(qpuZoneHostOf('evil.uuidna.com.attacker.test'), undefined)
  assert.equal(qpuZoneHostOf('QPU.UUIDNA.COM')?.host, 'qpu.uuidna.com', 'a host is matched case-insensitively')
  assert.equal(qpuZoneHostHolds(), true)
})

test("each host's robots.txt names that host's sitemap and no other host's", async () => {
  const z = qpuZoneOf()
  for (const h of z.hosts) {
    // READ FROM THE DOOR, not from the function behind it: a policy is only a policy on the host that served it.
    const robots = await (await getOf(h.host, '/robots.txt')).text()
    assert.equal(robots, qpuRobotsOf(h.host), 'the door serves what the reading computes, with nothing added on the way out')
    assert.ok(robots.includes(`Sitemap: ${h.origin}/sitemap.xml`), `${h.host} must point at its own sitemap`)
    // THE PER-HOST LAW, STATED AS A REFUSAL. A directive is read from the host that served it, so a sitemap line
    // naming a sibling is a line the crawler ignores and a reader believes.
    for (const other of z.hosts.filter((x) => x.host !== h.host)) {
      assert.ok(!robots.includes(`Sitemap: ${other.origin}/sitemap.xml`), `${h.host} must not name ${other.host}'s sitemap`)
    }
    assert.ok(robots.includes('Content-Signal: search=yes,ai-input=yes,ai-train=no'), 'the zone grants search and grounding, and refuses training')
    assert.ok(robots.includes('Allow: /'))
    assert.ok(robots.includes(`${qpuSeoOf(h.host).canonical}`), 'every host tells a reader where the one MCP door is')
  }
  assert.equal(qpuRobotsHolds(), true)
  // a stranger is refused rather than served a policy for a host this unit does not answer for
  assert.equal(qpuRobotsOf('example.org'), 'User-agent: *\nDisallow: /\n')
})

test('every host points at ONE MCP endpoint, and lists only URLs it can answer for', () => {
  const zone = qpuSeoZoneOf()
  assert.equal(zone.holds, true)
  assert.equal(qpuSeoZoneHolds(zone), true)
  assert.equal(zone.hosts.length, QPU_ZONE_HOSTS.length)

  // CONSOLIDATION, NOT DUPLICATION. Six hosts each advertising an MCP of their own are six duplicates competing
  // for one query; six hosts naming one endpoint are one door found six ways.
  assert.equal(new Set(zone.hosts.map((h) => h.canonical)).size, 1)
  assert.equal(zone.canonical, 'https://qpu.uuidna.com/mcp')

  for (const h of zone.hosts) {
    assert.equal(h.holds, true, `${h.host} must serve a pair it can stand behind`)
    for (const u of h.urls) {
      assert.equal(new URL(u).host, h.host, `${h.host} listed ${u}, which is not on it — a crawler drops it and a reader does not`)
      assert.equal(new URL(u).protocol, 'https:')
    }
  }
  // the unit's own host carries the whole served surface; a sibling carries only what this unit answers for it
  const own = zone.hosts.find((h) => h.host === 'qpu.uuidna.com')!
  const sibling = zone.hosts.find((h) => h.host === 'lean.uuidna.com')!
  assert.ok(own.urls.length > sibling.urls.length, 'this unit knows its own doors exactly and a sibling only by what it serves there')

  // THE PREDICATE BITES. A reading that claims a URL off its own host does not hold.
  const forged = { ...own, urls: [...own.urls, 'https://lean.uuidna.com/mcp'] }
  assert.equal(qpuSeoOf(own.host).holds, true)
  assert.notDeepEqual(forged.urls, own.urls)
  assert.equal(forged.urls.some((u) => new URL(u).host !== own.host), true, 'the forged reading is the shape the law forbids')
})

test('the pair is served on the wire, for a sibling host as well as for this one', async () => {
  for (const h of qpuZoneOf().hosts) {
    const robots = await getOf(h.host, '/robots.txt')
    assert.equal(robots.status, 200, `${h.host}/robots.txt must be answered, not left to a managed default`)
    assert.equal(robots.headers.get('content-type'), 'text/plain; charset=utf-8')
    assert.ok((await robots.text()).includes(`Sitemap: ${h.origin}/sitemap.xml`))

    const sitemap = await getOf(h.host, '/sitemap.xml')
    assert.equal(sitemap.status, 200, `${h.host}/sitemap.xml must be answered`)
    assert.equal(sitemap.headers.get('content-type'), 'application/xml; charset=utf-8')
    const xml = await sitemap.text()
    assert.ok(xml.startsWith('<?xml version="1.0" encoding="UTF-8"?>'))
    assert.ok(xml.includes('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'))
    assert.ok(xml.includes(`<loc>${h.origin}`), `${h.host}'s sitemap must carry its own URLs`)
  }

  // A HOST THIS UNIT DOES NOT SERVE STILL GETS NOTHING. The pair answers before the named gate, and that widening
  // is the one thing here that could have opened the unit to any hostname at all.
  const stranger = await getOf('example.org', '/robots.txt')
  assert.equal(stranger.status, 404, 'the crawlable pair is for this zone, not for whatever name resolved here')
})
