---
title: Audit
order: 46
---

# The surface audits itself

This page calls the `audit` tool, which calls every other tool the way a client would, replays every documented example,
and checks the leads registry against `tools/list`. The table is the tool's own result. When a check fails here, the
site build fails too.

<script setup>
import { handle } from '../src/quantum/mcp.ts'

const reply = handle({ jsonrpc: '2.0', id: 1, method: 'tools/call', params: { name: 'audit', arguments: {} } })
const audit = 'result' in reply ? reply.result.structuredContent : null
const widget = 'result' in reply ? reply.result._meta?.widget ?? '' : ''
if (import.meta.env.SSR && (!audit || audit.failed > 0)) throw new Error(`audit failed: ${JSON.stringify(audit?.checks.filter((c) => !c.passed) ?? reply)}`)
</script>

<p v-if="audit">{{ audit.passed }} of {{ audit.total }} checks pass over {{ audit.tools }} tools, {{ audit.examples }} examples and {{ audit.leads }} leads.</p>

<div v-html="widget"></div>
