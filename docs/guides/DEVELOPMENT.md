# Development Guide

## Quick Commands

```bash
npm next              # Do next task (default)
npm next:status      # See progress
npm next:plan        # View roadmap
npm run test         # Run tests
npm run build        # Build
npm run dev          # Start dev server
npm run validate     # Type check + test + build
```

## Project Structure

- `src/quantum/` - Quantum algorithms & solver
- `src/cli/` - Command-line tools
- `src/ui/` - React components
- `src/mcp/` - Model Context Protocol servers
- `src/database/` - Data layer
- `src/api/` - REST API

## Testing

```bash
npm test              # Run all tests
npm run test:watch   # Watch mode
npm run test:coverage # Coverage report
```

## Building

```bash
npm run build        # TypeScript compilation
npm run build:worker # Cloudflare Worker build
npm run type check   # Type safety check
```

## Deployment

```bash
npm run deploy:staging  # Deploy to staging
npm run deploy:prod    # Deploy to production
npm run deploy:dev     # Local dev server
```

## Git Workflow

1. Create branch from `main`
2. Make changes
3. `npm run validate` passes
4. Create PR with description
5. Code review approval
6. Merge and deploy

## Adding a New Feature

1. Create file in appropriate `src/` folder
2. Export types from `src/types.ts`
3. Add constants to `src/constants.ts`
4. Create tests (*.test.ts)
5. Run `npm validate`
6. Update documentation

## Debugging

```bash
# Type checking
npx tsc --noEmit

# Test details
npm test -- --verbose

# Build output
npm run build -- --listFiles
```

## Resources

- [Quantum Optimization Roadmap](../QUANTUM-OPTIMIZATION-ROADMAP.md)
- [WAVE 8 Documentation](../architecture/WAVE8.md)
- [Compliance Report](../COMPLIANCE-CHECK-REPORT.md)
