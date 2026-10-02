import { ClayAutomatedSolverTest, runClayAutomatedSolverTest } from './src/mcp/clay-solver-test'

runClayAutomatedSolverTest()
  .then(() => process.exit(0))
  .catch(err => {
    console.error(err)
    process.exit(1)
  })
