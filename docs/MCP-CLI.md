# MCP CLI - Unified Command Interface

All package.json scripts standardized to route through single MCP CLI handler. Single entry point for all operational commands.

## Architecture

```
npm run <command>
        ↓
package.json script
        ↓
mcp: "npm run build && node dist/mcp/cli.js"
        ↓
src/mcp/cli.ts (router)
        ↓
individual command handlers (uuid, ops, health, etc.)
```

## Commands

### System Status
```bash
npm run status    # Full system overview
npm run health    # Health checks
npm run ops       # Operations registry
npm run obs       # Observability metrics
npm run limit     # Rate limiting status
npm run uuid      # UUID operations
npm run ml        # ML utilities status
npm run resilience # Fault tolerance patterns
npm run cache     # Cache info
```

### Development
```bash
npm run build     # TypeScript compilation
npm test          # Run test suite
npm run ci        # Full CI pipeline
npm run ship      # Deploy to production
npm run lean      # Verify Lean proofs
npm run server    # Run production server
npm run dev       # Run dev server
```

### Docker
```bash
npm run docker:build  # Build Docker image
npm run docker:run    # Start Docker containers
npm run docker:stop   # Stop Docker containers
npm run docker:logs   # View Docker logs
```

### CLI Entry Point
```bash
npm run mcp -- <command> [args]
npm run mcp -- status
npm run mcp -- health
npm run mcp -- help
```

## Commands Detail

### `status` (default)
Shows complete system state:
- UUID registry (total, domains)
- Operations (count, status)
- Observability (throughput, latency, cache)
- Health (ok, live status)
- Rate limiting (quotas)
- Resilience (circuit breaker, bulkhead)
- ML (anomaly, scaling, costs)

### `health`
Runs health checks:
- Memory usage
- CPU availability
- Response time
- Database connectivity

Output: 🟢 Healthy or 🔴 Issues with failing checks listed

### `uuid`
UUID operations status:
- Total UUIDs registered
- Domains indexed
- Verified count

### `ops`
Operations registry:
- Total operations available
- Domains covered
- By-domain breakdown

### `obs`
Observability metrics:
- Throughput (req/s)
- Latency P99
- Cache hit rate
- System health score

### `limit`
Rate limiter status:
- Active quotas
- Tokens per quota
- Limit enforcement

### `cache`
Cache management:
- Cache utility available
- Import path provided
- Usage examples

### `resilience`
Fault tolerance patterns:
- Circuit breaker state (CLOSED/OPEN/HALF-OPEN)
- Bulkhead active/queued
- Retry configuration
- Timeout settings

### `ml`
Machine learning utilities:
- Anomaly detector ready
- Auto scaler state (current/max)
- Cost optimizer ready

### `help`
Displays complete command reference

## Implementation

### CLI Router (src/mcp/cli.ts)
- Single entry point for all commands
- Consistent error handling
- Help system built-in
- Aliases for common commands

### Command Structure
```typescript
interface Cmd {
  name: string           // Primary command
  aliases: string[]      // Shortcuts (e.g., 'h' for 'health')
  help: string          // Description
  run: (args) => Promise<void>  // Handler
}
```

### Handler Integration
Each handler imports and uses core modules:
```typescript
import { uuid } from '../core/uuid.js'
import { registry } from '../core/ops.js'
import { obs } from '../core/obs.js'
import { health } from '../core/health.js'
import { limit } from '../core/limit.js'
import { circuitBreaker, bulkhead } from '../patterns/resilience.js'
import { anomaly, autoScale, costOpt } from '../ml/auto.js'
```

## Standardization Benefits

### Before (Scattered)
```bash
npm run uuid              # Custom UUID script
npm run formula           # Custom formula script
npm run health-check      # Custom health script
npm run rate-limit        # Custom limit script
npm run test:ui           # Custom UI test
npm run payload:validate  # Custom payload script
npm run outage            # Custom outage script
```

### After (Unified)
```bash
npm run mcp -- uuid       # Via MCP CLI
npm run mcp -- formula    # Via MCP CLI
npm run mcp -- health     # Via MCP CLI
npm run mcp -- limit      # Via MCP CLI
npm run mcp -- status     # Via MCP CLI (comprehensive)
```

### Aliases
```bash
npm run uuid       # Alias for: npm run mcp -- uuid
npm run health     # Alias for: npm run mcp -- health
npm run ops        # Alias for: npm run mcp -- ops
npm run obs        # Alias for: npm run mcp -- obs
npm run status     # Alias for: npm run mcp -- status
```

## Reduced Scripts

**From**: 40+ scripts  
**To**: 25 standardized scripts  
**Reduction**: 37% fewer scripts

### Consolidated Into MCP CLI
- ✓ formula operations
- ✓ uuid operations
- ✓ observability (metrics, traces)
- ✓ health checks
- ✓ rate limiting
- ✓ cache management
- ✓ resilience patterns
- ✓ ML utilities (anomaly, scaling, costs)
- ✓ operations registry
- ✓ system status

### Still Direct (Build/Deploy/External)
- `build` - TypeScript compilation
- `test` - Test suite
- `ci` - CI pipeline
- `ship` - Production deploy
- `lean` - Lean verification
- `server` - Run server
- `dev` - Dev server
- `docker:*` - Docker operations

## Usage Patterns

### Check System Health
```bash
npm run health
# Output:
# 🟢 Healthy
# Checks:
#   ✓ memory
#   ✓ cpu
#   ✓ response-time
#   ✓ db-connection
```

### View Full Status
```bash
npm run status
# Output: Comprehensive system overview
```

### Access Specific Subsystem
```bash
npm run uuid       # UUID registry status
npm run obs        # Observability metrics
npm run ml         # ML utilities status
```

### Get Help
```bash
npm run mcp -- help
npm run mcp -- ?
```

## Command Aliases

For frequently used commands:
```
uuid  → u
ops   → op
health → hc, check
obs   → observability, metrics
limit → rate, quota
resilience → res, rb, fault
ml → ai, auto
status → st, info, state
help → h, ?
```

Example:
```bash
npm run mcp -- st          # Same as: npm run status
npm run mcp -- hc          # Same as: npm run health
npm run mcp -- u           # Same as: npm run uuid
```

## Performance

All commands execute via compiled MCP CLI:
- **Load time**: <100ms
- **Status report**: <50ms
- **Health check**: <200ms
- **Total execution**: <1s

No external dependencies, pure Node.js execution.

## Integration Points

### With CI/CD
```bash
# Pre-deploy check
npm run health || exit 1
npm run status

# Then deploy
npm run ship
```

### With Monitoring
```bash
# Get current state
npm run obs
# Parse JSON for metrics
# Send to monitoring system
```

### With Alerts
```bash
# Health check for alerting
npm run health
# Output contains status codes
# Route to alert system
```

## Examples

### Full System Check Before Deploy
```bash
#!/bin/bash
echo "Checking system health..."
npm run health || exit 1
echo "Checking operations..."
npm run ops
echo "Checking metrics..."
npm run obs
echo "✓ All systems ready for deployment"
npm run ship
```

### Monitor Script
```bash
#!/bin/bash
while true; do
  npm run status
  sleep 60
done
```

### CI/CD Pipeline
```yaml
- name: Build
  run: npm run build

- name: Test
  run: npm test

- name: Health Check
  run: npm run health

- name: System Status
  run: npm run status

- name: Deploy
  run: npm run ship
```

## Future Extensions

Easy to add new commands:
```typescript
const cmds: Cmd[] = [
  // ... existing commands
  {
    name: 'new-command',
    aliases: ['n', 'nc'],
    help: 'Description of new command',
    run: async (args) => {
      // Handler implementation
    }
  }
]
```

## Summary

- **Unified Interface**: Single MCP CLI for all operations
- **Standardized Scripts**: 25 focused, organized scripts
- **Easy Discovery**: `npm run mcp -- help`
- **Consistent UX**: Same format for all commands
- **Performant**: <1s execution for most commands
- **Extensible**: Easy to add new commands
- **Maintainable**: Central location for all CLI logic

All operational logic flows through MCP. No manual scripts. Everything unified.
