// The heat of a Node process: on exit, its CPU microseconds (user and system) and its peak RSS appended to QPU_HEAT_FILE, so a step's heat is the
// sum over every Node process it spawned (next preloads this into each step through NODE_OPTIONS). Heat is CPU work, what makes the machine hot:
// a die's temperature needs privileged sensors, so it is never read and never claimed. Plain JavaScript, so it loads before any loader.
import { appendFileSync } from 'node:fs'
const file = process.env.QPU_HEAT_FILE
if (file) process.on('exit', () => { try { const u = process.resourceUsage(); appendFileSync(file, JSON.stringify({ cpuUs: u.userCPUTime + u.systemCPUTime, rssKb: u.maxRSS }) + '\n') } catch { /* a process that cannot write its heat leaves it unmeasured */ } })
