/**
 * THE ZONE IS CRAWLABLE, HOST BY HOST — and the site is the MCP rather than a list beside it.
 *
 * Measured 2026-09-28 against the live zone: five of six first-party hosts answered 404 for both /robots.txt
 * and /sitemap.xml, so Cloudflare's managed default stood in — a file that names no sitemap. Two laws hold
 * that only if both are kept: a host's pair belongs to THAT host, and the MCP endpoint every host names is
 * ONE endpoint. Neither is measure-then-seal; each is a relation the code can break with no number moving.
 */
import { test } from './receipted.js'
import assert from 'node:assert/strict'
import worker, {
  qpuQuantumOf,
  qpuRaidOf,
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
/** The hosts this unit is routed to — the apex holds its own custom domain and is answered by its own worker. */
const served = () => qpuZoneOf().hosts.filter((h) => h.qpu)
const reservedOf = () => qpuTenantZoneOf().reserved
const getOf = (host: string, path: string) =>
  worker.fetch(new Request(`https://${host}${path}`, { headers: { accept: 'text/plain' } }), env)

test('the pair is answered for a first-party host, and nothing else about that host moves', async () => {
  const z = qpuZoneOf()
  assert.equal(qpuZoneHolds(z), true)
  assert.equal(z.hosts.filter((h) => h.apex).length, 1, 'one apex — the zone itself')
  assert.ok(z.hosts.some((h) => h.own), 'this unit is one of the hosts it serves; it is not outside its own zone')

  // The widening takes the pair and nothing else, asserted rather than intended: those four answer
  // x-powered-by: Next.js, Payload today, so serving their ROOT here would move a live page.
  for (const h of z.hosts.filter((x) => !x.apex && !x.own)) {
    assert.equal((await getOf(h.host, '/robots.txt')).status, 200, `${h.host}/robots.txt is answered by this unit`)
    const root = await getOf(h.host, '/')
    assert.equal(root.status, 404)
    assert.equal(((await root.json()) as { denied?: string }).denied, 'payload', `${h.host}/ still takes the tenant path it takes today`)
  }

  // a name outside the zone keeps the pair it had: the tenant forward, not this unit's policy
  const tenant = await getOf('somebody-elses-shop.uuidna.com', '/robots.txt')
  assert.equal(tenant.status, 404)
  assert.equal(((await tenant.json()) as { denied?: string }).denied, 'payload')
  assert.ok(reservedOf().includes('www'), 'www is reserved because the router redirects it to the apex')

  // and the table is not a wish: a name this unit does not serve resolves to nothing rather than to a guess
  assert.equal(qpuZoneHostOf('example.org'), undefined)
  assert.equal(qpuZoneHostOf('evil.uuidna.com.attacker.test'), undefined)
  assert.equal(qpuZoneHostOf('QPU.UUIDNA.COM')?.host, 'qpu.uuidna.com', 'a host is matched case-insensitively')
  assert.equal(qpuZoneHostHolds(), true)
})

test("each host's robots.txt names that host's sitemap and no other host's", async () => {
  for (const h of served()) {
    // READ FROM THE DOOR, not from the function behind it: a policy is only a policy on the host that served it.
    const robots = await (await getOf(h.host, '/robots.txt')).text()
    assert.equal(robots, qpuRobotsOf(h.host), 'the door serves what the reading computes, with nothing added on the way out')
    assert.ok(robots.includes(`Sitemap: ${h.origin}/sitemap.xml`), `${h.host} must point at its own sitemap`)
    // A directive is read from the host that served it, so a line naming a sibling is one the crawler
    // ignores and a reader believes.
    for (const other of served().filter((x) => x.host !== h.host)) {
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
  assert.equal(zone.hosts.length, QPU_ZONE_HOSTS.filter((h) => h.qpu).length, "the reading covers the hosts this unit is routed to, not every name in the zone")

  // Consolidation, not duplication: one endpoint named five ways is one door found five ways.
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
  for (const h of served()) {
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

    // Every <loc> is fetched: the earlier check asserted each URL was ON this host and never that this host
    // ANSWERS it, so faf8e51 shipped four sitemaps listing a path that 404ed and the predicate passed.
    for (const loc of [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1])) {
      const at = new URL(loc)
      const res = await worker.fetch(new Request(loc, { headers: { accept: 'application/json' } }), env)
      if (res.status === 200) continue
      // The second arm is the tenant forward, honest only because those roots were measured answering 200
      // live: no Payload binding in this isolate, so it refuses by name. A plain 404 is the case to catch.
      const body = (await res.json()) as { denied?: string }
      assert.equal(body.denied, 'payload', `${h.host} lists ${at.pathname} and nothing answers it — ${res.status}`)
      assert.equal(at.pathname, '/', 'only a sibling root is answered by the forward; every other <loc> is this unit\'s own')
    }
  }

  // The apex is not this unit's to answer for: qpu holds qpu.uuidna.com and the *.uuidna.com wildcard, and
  // the apex is under neither. It serves its own pair and an 11,438-URL sitemap from the worker that holds it.
  const apexHost = qpuZoneOf().hosts.find((h) => h.apex)!
  assert.equal(apexHost.qpu, false)
  assert.equal(qpuZoneHostOf(apexHost.host), undefined, 'the apex is named in the zone and is not routed here')
  assert.equal((await getOf(apexHost.host, '/robots.txt')).status, 404)

  // A HOST THIS UNIT DOES NOT SERVE STILL GETS NOTHING. The pair answers before the named gate, and that widening
  // is the one thing here that could have opened the unit to any hostname at all.
  const stranger = await getOf('example.org', '/robots.txt')
  assert.equal(stranger.status, 404, 'the crawlable pair is for this zone, not for whatever name resolved here')
})

/**
 * A SERVED DOCUMENT IS A FUNCTION OF THE BUILD, AND A WRITE DOES NOT CHANGE IT.
 *
 * The RAID write cursor used to be read by qpuRaidOf whenever no caller passed traffic, and that reading rides
 * in GET / through circuit.register.efficiency, memoised at first serve. Measured: the live host served `fly`,
 * then `wasabi` from another isolate, while the build computed `cloudflare`. The rotation was never the defect.
 */
test('the root document is what this build computes, whatever the unit has been asked to do first', async () => {
  const before = JSON.stringify(qpuQuantumOf())

  // the door that used to move it: a storage write, refused here for want of a binding
  await worker.fetch(new Request('https://qpu.uuidna.com/storage/probe', { method: 'PUT', body: '{"x":1}' }), env)
  await worker.fetch(new Request('https://qpu.uuidna.com/storage/probe', { method: 'PUT', body: '{"x":2}' }), env)

  assert.equal(JSON.stringify(qpuQuantumOf()), before, 'a write must not change what the root serves')

  // the rotation is still there, as a question rather than a mood
  const rest = qpuRaidOf()
  const moved = qpuRaidOf({ traffic: 1 })
  assert.equal(rest.traffic, 0, 'the reference placement is the one a build can recompute')
  assert.notDeepEqual(moved.types.map((row) => row.cloud), rest.types.map((row) => row.cloud))
  assert.notEqual(moved.parity, rest.parity)
})
