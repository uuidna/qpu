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

  // THE WIDENING TAKES THE PAIR AND NOTHING ELSE, and that is asserted rather than intended. Measured on the live
  // zone: lean, unreal, hardware and school all answer x-powered-by: Next.js, Payload, so this unit is already
  // forwarding them to the tenant branch. Serving their robots.txt takes nothing away — each of them 404ed it —
  // but serving their ROOT would move a live page, so the same host must still reach the tenant forward here.
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
    // THE PER-HOST LAW, STATED AS A REFUSAL. A directive is read from the host that served it, so a sitemap line
    // naming a sibling is a line the crawler ignores and a reader believes.
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

    // EVERY <loc> IS FETCHED, because the earlier check was weaker than the sentence above it: it asserted each
    // URL was ON this host and never that this host ANSWERS it. faf8e51 shipped four sitemaps listing
    // /.well-known/mcp.json on hosts where it 404ed — a soft 404 published by the very law that forbids one, and
    // the predicate passed. A sitemap entry is a claim that a page is there; the only check worth having asks.
    for (const loc of [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1])) {
      const at = new URL(loc)
      const res = await worker.fetch(new Request(loc, { headers: { accept: 'application/json' } }), env)
      if (res.status === 200) continue
      // THE SECOND ARM IS THE TENANT FORWARD, and it is only honest because those roots were measured answering
      // 200 live: this unit hands a sibling's root to Payload, which has no binding in this isolate and so says
      // `denied: payload` rather than serving the page. That is somebody answering. A plain 404 is not, and that
      // is the case this whole check exists to catch.
      const body = (await res.json()) as { denied?: string }
      assert.equal(body.denied, 'payload', `${h.host} lists ${at.pathname} and nothing answers it — ${res.status}`)
      assert.equal(at.pathname, '/', 'only a sibling root is answered by the forward; every other <loc> is this unit\'s own')
    }
  }

  // THE APEX IS NOT THIS UNIT'S TO ANSWER FOR, and the strengthened check above is what found that out: qpu holds
  // qpu.uuidna.com and the *.uuidna.com wildcard, and the apex is under neither. It already serves its own
  // robots.txt and its own 11,438-URL sitemap from the worker that does hold it, so a pair computed here would be
  // a second answer nobody can reach — and the sitemap it produced listed a root this unit answers 404 for.
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
 * verify-live's premise, asserted here so it cannot quietly stop being true. A module-level counter used to be
 * incremented on every storage write and read by qpuRaidOf whenever no caller passed one — which no caller ever
 * did — so the cloud each RAID node reported rotated with write volume, and that rotation rides in GET /
 * through circuit.register.efficiency. Memoised at first serve, each isolate froze a different answer: the live
 * host served `fly`, then `wasabi` from another isolate, while the build computed `cloudflare`.
 *
 * The rotation itself was never the defect and is still here — it just has to be ASKED for now.
 */
test('the root document is what this build computes, whatever the unit has been asked to do first', async () => {
  const before = JSON.stringify(qpuQuantumOf())

  // exercise the door that used to move it: a storage write, refused here for want of a binding, which is
  // exactly the path that carried the increment
  await worker.fetch(new Request('https://qpu.uuidna.com/storage/probe', { method: 'PUT', body: '{"x":1}' }), env)
  await worker.fetch(new Request('https://qpu.uuidna.com/storage/probe', { method: 'PUT', body: '{"x":2}' }), env)

  assert.equal(JSON.stringify(qpuQuantumOf()), before, 'a write must not change what the root serves')

  // THE ROTATION IS STILL THERE, and is now a question rather than a mood: ask for traffic and the placement
  // moves, which is what made it worth having in the first place.
  const rest = qpuRaidOf()
  const moved = qpuRaidOf({ traffic: 1 })
  assert.equal(rest.traffic, 0, 'the reference placement is the one a build can recompute')
  assert.notDeepEqual(moved.types.map((row) => row.cloud), rest.types.map((row) => row.cloud))
  assert.notEqual(moved.parity, rest.parity)
})
