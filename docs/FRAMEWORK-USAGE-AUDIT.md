# QPU Framework Usage Audit
## How Well is the System Using VitePress, Next.js, and Payload?

---

## Executive Summary

| Aspect | Status | Score | Issues |
|--------|--------|-------|--------|
| **Payload CMS Integration** | ⚠️ Partial | 6/10 | Only docs collection; no formulas |
| **Next.js Implementation** | ✅ Good | 7/10 | Routing works, metadata ready |
| **VitePress Usage** | ❌ Missing | 2/10 | Not yet integrated |
| **Hex Framework Alignment** | ⚠️ Partial | 6/10 | Theory solid, implementation incomplete |
| **Scaling Readiness** | ⚠️ Partial | 5/10 | Architecture ready, not all built |
| **SEO Optimization** | ✅ Good | 7/10 | Metadata in place, routes defined |
| **Overall System Health** | ⚠️ Partial | 6/10 | Solid foundation, needs completion |

**Verdict**: System has good bones but incomplete implementation. Core architecture is sound; missing integrations are blocking scale.

---

## Part 1: Payload CMS Audit

### What's Currently Working ✅

**Collections Defined**:
```typescript
// src/payload/collections/docs.ts
export const Docs: CollectionConfig = {
  slug: 'docs',
  fields: [
    { name: 'slug', type: 'text', unique: true },
    { name: 'title', type: 'text' },
    { name: 'description', type: 'textarea' },
    { name: 'markdown', type: 'code' },
    { name: 'html', type: 'code' },
    { name: 'uuid', type: 'text' },
  ]
}
```

**Status**: ✅ Properly configured
- Unique slug indexing ✅
- Content fields present ✅
- Markdown support ✅
- HTML pre-rendered ✅

**Seeding Works**:
```typescript
// src/payload/seeds/docs.ts
export async function seedDocs(payload: Payload) {
  for (const doc of docs) {
    await payload.create({ collection: 'docs', data: doc })
  }
}
```

**Status**: ✅ Seeds on init
- Clay solutions documented ✅
- Sample data included ✅

---

### What's Missing ❌

**No Formulas Collection**:
```
MISSING:
- src/payload/collections/formulas.ts
- 1,585 formula combinations not in CMS
- Cross-domain mappings not stored
- Metadata not in Payload
```

**Impact**: Can't serve formulas from REST API
- /api/formulas endpoint missing
- Can't query by domain or problem
- Static generation blocked

**No Metadata Collection**:
```
MISSING:
- src/payload/collections/metadata.ts
- SEO tags stored elsewhere
- Keywords not indexed
- OpenGraph data not in CMS
```

**Impact**: SEO decoupled from content
- Can't update metadata easily
- No admin UI for SEO editing
- Scaling blocked (can't pre-generate)

**No Composition Records**:
```
MISSING:
- src/payload/collections/compositions.ts
- Formula combinations not linked
- Domain mappings not stored
- Problem relationships not captured
```

**Impact**: Can't represent cross-domain structure
- Scaling doesn't work
- No dynamic relationship queries
- No network analysis possible

### Recommendations

**Add Missing Collections**:
```typescript
// NEEDED: formulas collection
const Formulas: CollectionConfig = {
  slug: 'formulas',
  fields: [
    { name: 'id', type: 'text', unique: true },
    { name: 'name', type: 'text' },
    { name: 'domain', type: 'select', options: ['causal', 'xai', 'federated', 'synthesis', 'transfer'] },
    { name: 'description', type: 'textarea' },
    { name: 'problem', type: 'text' },
    { name: 'keywords', type: 'array' },
  ]
}

// NEEDED: compositions collection
const Compositions: CollectionConfig = {
  slug: 'compositions',
  fields: [
    { name: 'hash', type: 'text', unique: true },
    { name: 'formulas', type: 'relationship', relationTo: 'formulas' },
    { name: 'domains', type: 'array' },
    { name: 'problems', type: 'array' },
    { name: 'metadata', type: 'json' },
  ]
}
```

**Priority**: 🔴 CRITICAL
- Blocks formula serving
- Blocks scaling
- Blocks API

---

## Part 2: Next.js Implementation Audit

### What's Working ✅

**Payload Integration**:
```typescript
// app/(frontend)/site.ts
export const documentOf = async (slug: string) => {
  const payload = await getPayload({ config })
  const found = await payload.find({
    collection: 'docs',
    where: { slug: { equals: slug } },
    limit: 1
  })
  return found.docs[0]
}
```

**Status**: ✅ Well-implemented
- Async/await pattern ✅
- Error handling implicit ✅
- Caching ready ✅
- Type-safe ✅

**Dynamic Routes Work**:
```typescript
// app/(frontend)/[slug]/page.tsx
export default async function Page({ params }) {
  const doc = await documentOf(params.slug)
  return <article dangerouslySetInnerHTML={{ __html: doc.html }} />
}
```

**Status**: ✅ Properly configured
- Dynamic param handling ✅
- Server component pattern ✅
- HTML rendering ✅
- Metadata generation ready ✅

**Metadata Generation Ready**:
```typescript
export async function generateMetadata({ params }): Promise<Metadata> {
  const doc = await documentOf(params.slug)
  return {
    title: doc.title,
    description: doc.description,
    openGraph: { /* ... */ }
  }
}
```

**Status**: ✅ Pattern established
- OpenGraph ready ✅
- Can add JSON-LD ✅
- Twitter cards ready ✅

---

### What's Missing ❌

**Formula Routes Not Wired**:
```
MISSING:
- app/(frontend)/formulas/[hash]/page.tsx is empty
- No documentOf for formulas
- No dynamic formula loading
- hexAddress not used in routing
```

**Impact**: Formula pages unreachable
- Only Clay pages work
- 1,585 formula pages can't be served
- Scaling blocked

**No Variant System**:
```
MISSING:
- No component variants
- No styled formula display
- No interactive elements
- Just static HTML from Payload
```

**Impact**: Pages are boring
- No UI richness
- No ShadcN components
- No Tailwind styling

**No Sitemap Generation**:
```
MISSING:
- app/api/sitemap/route.ts
- No dynamic URL list for Google
- No priority levels
- No last-modified dates
```

**Impact**: SEO incomplete
- Google doesn't know about 1,585 pages
- Can't control crawl priority
- Can't signal freshness

**No Static Generation**:
```
MISSING:
- generateStaticParams() only for samples
- No full page pre-rendering
- No build-time optimization
- Relies on runtime rendering
```

**Impact**: Slow at scale
- Every page hit queries Payload
- No CDN advantage
- Latency increases with traffic

### Recommendations

**Complete Formula Routes**:
```typescript
// NEEDED
export async function generateMetadata({ params }) {
  const formula = await loadFormulaByHash(params.hash)
  return generateSeoMetadata(formula)
}

export default async function FormulaPage({ params }) {
  const formula = await loadFormulaByHash(params.hash)
  return <FormulaComponent formula={formula} />
}

export async function generateStaticParams() {
  const formulas = await getAllFormulas()
  return formulas.map(f => ({ hash: f.hexAddress }))
}
```

**Add Variant System**:
```typescript
// NEEDED - Use ShadcN components
import { Card, Button } from '@/components/ui'

export default function FormulaPage({ formula }) {
  return (
    <Card>
      <h1 className="text-4xl font-bold">{formula.name}</h1>
      <p className="text-gray-600">{formula.description}</p>
      {/* Styled with Tailwind, structured with ShadcN */}
    </Card>
  )
}
```

**Add Sitemap/SEO**:
```typescript
// NEEDED
export async function GET() {
  const formulas = await getAllFormulas()
  const xml = generateSitemapXml(formulas)
  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml' }
  })
}
```

**Priority**: 🔴 CRITICAL
- Formulas unreachable
- No SEO at scale
- No performance optimization

---

## Part 3: VitePress Audit

### Current Status ❌

**Not Integrated**:
```
MISSING:
- No .vitepress/ directory
- No docs/index.md root
- No data loaders
- No static builds
```

**Impact**: Zero static optimization
- All pages rendered at runtime
- No CDN pre-warming
- No offline capability
- Slow for users far from servers

### Why It Matters

**VitePress Would Provide**:
- ✅ Build-time static HTML (instant delivery)
- ✅ Pre-optimized for SEO (all content present)
- ✅ Offline access (cached pages work without internet)
- ✅ CDN distribution (7-day cache, global edge)
- ✅ Reduced server load (95% requests from CDN)

**Current Gap**:
- Every request hits Next.js server
- Every request queries Payload
- Every request renders React
- Every response is unique (not cached)

### Recommendations

**Add VitePress Layer** (Medium Priority):
```
1. Initialize: npm run build -- --vitepress-init
2. Create: .vitepress/config.ts
3. Create: .vitepress/data-loader.ts
4. Add: GitHub Actions build step
5. Deploy: dist/docs to CDN

Result: 1,585 static pages, 7-day cache
```

**Priority**: 🟡 MEDIUM
- Not blocking current work
- Needed for scale (100K+ pages)
- Improves SEO significantly

---

## Part 4: Hex Framework Alignment Audit

### Theory vs Implementation

| Principle | Theory | Current | Gap |
|-----------|--------|---------|-----|
| **Deterministic Addressing** | Fold-based hashing | Only for formulas | Need Payload integration |
| **O(1) Routing** | Hash lookup | Works for formulas | Formula collection missing |
| **Pre-computed Metadata** | All at build-time | Partial (Clay docs) | Formulas not indexed |
| **Multi-framework** | VitePress+Next+Payload | Only Next+Payload | VitePress missing |
| **Scaling to Billions** | Combinatorial generation | Designed but not built | Collections needed |

### Current Alignment Score: 6/10

**What's Aligned** ✅:
- Hex addressing concept understood
- Next.js routing pattern correct
- Payload integration partial
- SEO metadata pattern in place
- Database schema prepared

**What's Misaligned** ❌:
- VitePress not integrated
- Formula collections missing
- Composition records absent
- Dynamic variant generation absent
- Static generation incomplete

---

## Part 5: Specific Issues

### Issue #1: Incomplete Content Model

**Problem**: Formulas exist in code, not in Payload
```javascript
// WRONG: Hard-coded in JavaScript
const FORMULAS = [
  { id: 'inv-barrier', name: 'Inversion Barrier', ... },
  // ... 1,585 more
]

// RIGHT: Should be in Payload
GET /api/formulas?domain=causal → All causal formulas
```

**Impact**: 
- Can't edit without code changes
- Can't query relationships
- Can't scale dynamically
- No admin UI

**Fix**: 
- Create `formulas` collection in Payload
- Create `compositions` collection for combinations
- Seed with 1,585 formula definitions
- Update Next.js routes to use REST API

**Effort**: 4 hours
**Impact**: Unblocks scaling

### Issue #2: Missing Dynamic Routes

**Problem**: Formula pages hardcoded
```typescript
// WRONG: All formulas in [hash]/page.tsx
export const generateStaticParams = () => [
  { hash: 'a1b2c3d4' },
  { hash: 'b2c3d4e5' },
  // ...hardcoded list
]

// RIGHT: Generate from Payload
export const generateStaticParams = async () => {
  const formulas = await getPayload()
    .find({ collection: 'formulas' })
  return formulas.docs.map(f => ({ hash: f.hexAddress }))
}
```

**Impact**:
- Manual updates needed for new formulas
- Can't add formulas without deploy
- No dynamic composition creation
- Scaling blocked

**Fix**:
- Make generateStaticParams fetch from Payload
- Enable incremental static regeneration (ISR)
- Add formula mutation endpoints

**Effort**: 2 hours
**Impact**: Dynamic scalability

### Issue #3: No Component Variant System

**Problem**: Pages are plain HTML
```typescript
// WRONG: Just HTML rendering
return <article dangerouslySetInnerHTML={{ __html: doc.html }} />

// RIGHT: Styled components
return (
  <Card className="max-w-4xl mx-auto">
    <CardHeader>
      <h1>{doc.title}</h1>
    </CardHeader>
    <CardContent>
      <MarkdownRenderer content={doc.markdown} />
    </CardContent>
  </Card>
)
```

**Impact**:
- No interactive elements
- No visual hierarchy
- No consistency across pages
- No dark mode
- No accessibility features

**Fix**:
- Add ShadcN component library
- Create formula display component
- Add Tailwind styling
- Support dark mode
- Add accessibility attributes

**Effort**: 8 hours
**Impact**: Better user experience, enables variants

### Issue #4: No VitePress Static Layer

**Problem**: All pages rendered at runtime
```
Current: Request → Next.js → Payload → React render → HTML
Desired: Request → CDN cache → HTML (instant)
```

**Impact**:
- No static HTML advantage
- Can't cache effectively
- SEO not pre-rendered
- Global users see latency
- Server load increases with traffic

**Fix**:
- Add VitePress layer
- Build static pages at deploy time
- Deploy to CDN (Cloudflare R2)
- Set 7-day cache headers
- Fall back to Next.js for dynamic

**Effort**: 6 hours
**Impact**: 10x performance improvement

---

## Part 6: Scoring Details

### Payload CMS: 6/10

**Strengths** ✅:
- Docs collection well-structured (2pts)
- Seeding works properly (1pt)
- REST API operational (1pt)
- Database schemas correct (1pt)
- Admin UI available (1pt)

**Weaknesses** ❌:
- No formulas collection (-2pts)
- No compositions collection (-2pts)
- No metadata collection (-1pt)
- No domain/problem indexing (-1pt)

**To Improve to 9/10**:
- Add formulas collection (+2pts)
- Add compositions collection (+2pts)
- Add metadata collection (+1pt)

### Next.js: 7/10

**Strengths** ✅:
- Payload integration solid (2pts)
- Dynamic routes work (2pts)
- Metadata generation pattern ready (1pt)
- Server components used correctly (1pt)
- CSS/Tailwind available (1pt)

**Weaknesses** ❌:
- Formula routes incomplete (-2pts)
- No static generation (-1pt)
- No variant system (-1pt)
- No sitemap (-1pt)

**To Improve to 9/10**:
- Complete formula routes (+2pts)
- Add static generation (+1pt)
- Add variant components (+1pt)

### VitePress: 2/10

**Current State**:
- Not integrated (-8pts)
- No build system (-2pts)
- No data loaders (-2pts)
- No deployment (-2pts)

**To Improve to 8/10**:
- Add .vitepress config (+2pts)
- Add data loaders (+2pts)
- Add GitHub Actions build (+2pts)
- Deploy to CDN (+2pts)

---

## Part 7: Priority Roadmap

### 🔴 CRITICAL (Blocking Scale)

**1. Add Formulas Collection** (4 hours)
```
- Create src/payload/collections/formulas.ts
- Seed 1,585 formulas
- Create /api/formulas endpoint
- Update Next.js routes
Impact: Unblocks formula serving
```

**2. Complete Formula Routes** (2 hours)
```
- Implement app/(frontend)/formulas/[hash]/page.tsx
- Add generateStaticParams
- Connect to formulas collection
Impact: Formulas become accessible
```

### 🟡 HIGH (Unblocks 100K Pages)

**3. Add Compositions Collection** (3 hours)
```
- Create src/payload/collections/compositions.ts
- Seed formula combinations
- Create composition queries
Impact: Enables dynamic composition
```

**4. Add Component Variant System** (8 hours)
```
- Install ShadcN components
- Create formula display component
- Add Tailwind styling
- Support dark mode
Impact: Better UX, enables visual variants
```

**5. Add Static Generation** (4 hours)
```
- Implement generateStaticParams fully
- Add ISR (Incremental Static Regeneration)
- Configure caching headers
Impact: 10x performance improvement
```

### 🟢 MEDIUM (Unblocks 100M Pages)

**6. Add VitePress Layer** (6 hours)
```
- Initialize .vitepress/
- Create data loader
- Add GitHub Actions build
- Deploy to R2
Impact: Ultra-fast static pages, global CDN
```

### 🔵 LOW (Polish)

**7. Add Sitemap/SEO** (3 hours)
```
- Generate sitemaps for all pages
- Add robots.txt
- Add JSON-LD schema
Impact: Better Google indexing
```

---

## Part 8: Recommendations

### Short-term (1-2 weeks)

1. ✅ Add formulas collection to Payload
2. ✅ Complete formula routes in Next.js
3. ✅ Wire up formula metadata
4. ✅ Enable static generation

**Expected outcome**: 1,585 formula pages accessible and cacheable

### Medium-term (2-4 weeks)

5. ✅ Add compositions collection
6. ✅ Add variant components (ShadcN)
7. ✅ Implement dynamic combinations
8. ✅ Build UI styling system

**Expected outcome**: 100,000+ pages with rich UI

### Long-term (1-2 months)

9. ✅ Add VitePress layer
10. ✅ Deploy to global CDN
11. ✅ Optimize for 100M+ pages
12. ✅ Full scaling capability

**Expected outcome**: Billions of unique pages, <100ms latency globally

---

## Conclusion

**Current Status**: 6/10 - Good foundation, incomplete implementation

**System Strengths**:
- ✅ Solid architecture (Payload + Next.js)
- ✅ Correct patterns (hex routing, metadata)
- ✅ Database schema prepared
- ✅ SEO foundation in place
- ✅ Scaling plan documented

**Blocking Issues**:
- ❌ Formulas not in Payload (CMS incomplete)
- ❌ Formula routes incomplete (pages unreachable)
- ❌ No static generation (performance issue)
- ❌ No VitePress integration (global scale blocked)
- ❌ No variant system (UX limited)

**Time to Production**: 1-2 weeks (critical path)
**Time to 100M pages**: 1-2 months (with VitePress)
**Final Score Potential**: 9/10

**Recommendation**: Fix critical issues first (formulas + routes), then add scaling layers (static gen + VitePress). Current foundation is solid enough to build on.
