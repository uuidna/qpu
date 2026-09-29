# Phase 2: Eliminate Code Duplication

## Strategy
Migrate all existing files to use `src/core` module instead of duplicate implementations

## Files to Migrate

### Priority 1: Server Integration
- `src/server.ts` - use core operations & manager
- `src/automation/server-integration.ts` - use core APIs

### Priority 2: Operation Files
- Remove duplicate clay-problem-solver.ts, use core
- Remove duplicate leads-tracking-system.ts, use core
- Remove duplicate domain-citations.ts, use core
- Remove duplicate prior-art-citations.ts, use core

### Priority 3: Cleanup
- Remove redundant type files
- Consolidate utilities
- Update imports across codebase

## Expected Outcome
- 30+ files → 8 core + thin adapters
- 5,000+ lines duplicate code → 3,000 total
- 100% feature parity
- Better maintainability

## Status: Adapter Layer Complete ✅

### Completed in Phase 2
- ✅ Created adapter layer (src/adapters/)
  - clay-adapter.ts: bridges old clay API to core
  - leads-adapter.ts: bridges old leads API to core
  - citations-adapter.ts: bridges old citations API to core
  - adapters/index.ts: unified exports
- ✅ Backward compatibility maintained
  - Old code can import from adapters
  - New code imports from core
  - Zero breaking changes during migration

### Next: Migrate Existing MCP Files
1. Update src/mcp/unified-mcp-router.ts to use core types
2. Update src/mcp/uuid-programmable-core.ts to re-export from core
3. Remove duplicate type definitions
4. Consolidate all operation registries
