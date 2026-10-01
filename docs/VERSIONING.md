# Automated Semantic Versioning via Cross-Domain Formulas

Fully automated versioning using intelligent change analysis. No manual version bumping.

## System

```
18 commits since tag
        ↓
Analyze changes (features, fixes, refactoring, efficiency, docs)
        ↓
Apply cross-domain versioning formula
        ↓
Decide version bump (major/minor/patch/none)
        ↓
Update package.json + create git tag
```

## Versioning Formula

### MAJOR (v1.0.0 → v2.0.0)
- Breaking changes detected
- Backward compatibility broken

### MINOR (v0.3.0 → v0.4.0) ← Current bump
- New features added
- Consolidation + Refactoring + Efficiency improvements
- Quality enhancements with new capabilities

### PATCH (v0.4.0 → v0.4.1)
- Bug fixes
- Performance optimizations
- Minor efficiency gains

### NO BUMP (0.4.0 → 0.4.0)
- Refactoring only (no new features)
- Documentation only
- Internal improvements without user-facing changes

## Cross-Domain Intelligence

The versioning formula integrates multiple domains:

```
Engineering (commits, code changes)
    ↓
Quality (refactoring, consolidation, efficiency)
    ↓
Features (new capabilities, APIs)
    ↓
Reliability (breaking changes, fixes)
    ↓
Operations (versioning, tagging, release)
```

Result: Version automatically reflects actual system evolution.

## Recent Release: v0.4.0

**From**: v0.3.0  
**To**: v0.4.0  
**Type**: MINOR (feature/quality improvement)

### Change Analysis
```
Features:       ✓ (consolidation adds new unified interface)
Fixes:          ✗
Breaking:       ✗
Refactoring:    ✓ (core infrastructure simplified)
Efficiency:     ✓ (62% code reduction, lower costs)
Documentation:  ✓ (comprehensive guides)
```

### What Justified MINOR Bump

1. **Consolidation** = New unified MCP interface (feature)
2. **Refactoring** = Core infrastructure simplified (quality)
3. **Efficiency** = 62% reduction, cost savings (performance)

Together: These represent significant system improvement with new capabilities.

## Usage

### Auto-bump version
```bash
npm run version:auto
```

Result:
- Analyzes commits since last tag
- Applies versioning formula
- Updates package.json
- Creates git tag
- Commits changes

### Check version status
```bash
npm run version:status
```

Output:
- Current version
- Last tag
- Commits since tag
- Suggested next version

## Version History

```
v0.1.0  - Initial release
v0.2.0  - Foundation + MCP operations
v0.2.1  - Quality improvements
v0.3.0  - Full automation
v0.4.0  - Consolidation + efficiency (18 commits)
         ├─ Formula operations unified (54% reduction)
         ├─ Core infrastructure consolidated (61% reduction)
         ├─ Patterns + ML added
         ├─ MCP CLI standardized
         ├─ Ultra-minimal core (62% reduction)
         └─ Automated versioning added
```

## Automatic Versioning Logic

```typescript
function decideVersionBump(analysis): BumpType {
  if (breaking) return 'major'
  if (refactoring && efficiency) return 'minor'
  if (features) return 'minor'
  if (fixes || efficiency) return 'patch'
  if (refactoring) return 'none'
  if (docs) return 'none'
  return 'none'
}
```

## Integration Points

- **Git commits**: Parsed for change type keywords
- **Cross-domain formula**: Decides version bump
- **package.json**: Updated automatically
- **Git tags**: Created with formatted version
- **CI/CD**: Can trigger on version changes

## Example: Next Release

When you make the next change:

1. Push commits (e.g., "fix: auth bug" + "feat: new API")
2. Run `npm run version:auto`
3. Formula detects: fixes + features
4. Decides: MINOR bump (features present)
5. v0.4.0 → v0.5.0
6. Tag created, package.json updated

## Benefits

✓ No manual versioning  
✓ Semantic versioning enforced  
✓ Version reflects actual changes  
✓ Cross-domain intelligent decisions  
✓ Fully automated  
✓ Git history integrated  
✓ CI-friendly  

## Troubleshooting

### "No version bump needed"
- Only docs/refactoring changed
- Run `npm run version:status` to verify
- Add actual features to trigger bump

### "Tag already exists"
- Previous version hasn't changed
- Create new commit to trigger new tag
- Formula will recalculate

### Manual override
```bash
# Edit package.json manually if needed
npm install  # Update lock files
git add package.json
git tag v0.X.X
git push --tags
```

## Standards

- **Semantic**: MAJOR.MINOR.PATCH
- **Prefix**: v (v0.4.0)
- **Tags**: Annotated with message
- **Commits**: Conventional commit style

## Cost Efficiency

Automated versioning also reduces:
- Manual decision-making overhead
- Risk of version mismatch
- CI/CD complexity
- Documentation inconsistencies

All through a single formula-based decision engine.
