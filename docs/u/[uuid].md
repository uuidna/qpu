---
title: UUID
---

# <code>{{ $params.uuid }}</code>

A page from the id alone: its channel, its seal, its reflection, its program compiled and its next step executed here in the
browser by the same `handle` the MCP serves. The previous step is the page that sent you; the next is the program rotated.

<Channel :uuid="$params.uuid" />
<Verify :uuid="$params.uuid" />
<Compile :uuid="$params.uuid" />
