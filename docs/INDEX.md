# Payload CMS Documentation Index

**Quick Links**:
- 🚀 [Getting Started](guides/getting-started.md) - Start here (15 min)
- 🚀 [Deployment](guides/deployment.md) - Deploy to production (30 min)
- 🔌 [Integration](guides/integration.md) - Integrate with applications
- 👨‍💻 [Development](guides/development.md) - Customize and extend

**Reference**:
- 📚 [Collections Reference](reference/collections.md) - Collection schemas
- 🔑 [API Reference](reference/api.md) - REST/GraphQL endpoints
- 🎨 [Admin UI Reference](reference/admin-ui.md) - Dashboard components
- ⚙️ [Configuration](reference/configuration.md) - Config options

**Architecture**:
- 🏗️ [System Architecture](architecture/overview.md) - System design
- 🔄 [Data Flow](architecture/data-flow.md) - How data moves
- 🪝 [Hooks System](architecture/hooks.md) - Validation lifecycle
- 🎯 [Field References](architecture/field-references.md) - Type-safe fields

**Autonomous System**:
- 🤖 [Autonomous Reasoning System](../AUTONOMOUS_REASONING_SYSTEM.md) - Architecture & design
- 🌊 [Wave Execution Guide](../AUTONOMOUS_WAVE_EXECUTION_INDEX.md) - How to run autonomous waves
- 📊 [Wave Example](../WAVE_EXECUTION_EXAMPLE.md) - Real execution trace
- ✅ [Implementation Status](../AUTONOMOUS_IMPLEMENTATION_COMPLETE.md) - What's been built

**Release**:
- 📝 [Release Notes](../PAYLOAD_RELEASE_NOTES.md)
- ✅ [Release Validation](../PAYLOAD_RELEASE_VALIDATION.md)

---

## Choose Your Path

### 🎯 I want to...

**Get up and running**
→ [Getting Started Guide](guides/getting-started.md)

**Deploy to production**
→ [Deployment Guide](guides/deployment.md)

**Integrate Payload in my app**
→ [Integration Guide](guides/integration.md)

**Customize and extend**
→ [Development Guide](guides/development.md)

**Understand the architecture**
→ [Architecture Overview](architecture/overview.md)

**Reference API/Collections**
→ [Collections Reference](reference/collections.md)

---

## Documentation Structure

```
docs/
├── INDEX.md                    ← You are here
├── guides/
│   ├── getting-started.md     (15 min tutorial)
│   ├── deployment.md          (deployment steps)
│   ├── integration.md         (integrate in app)
│   └── development.md         (customize & extend)
├── reference/
│   ├── collections.md         (schema reference)
│   ├── api.md                 (endpoint reference)
│   ├── admin-ui.md           (UI components)
│   └── configuration.md       (config options)
└── architecture/
    ├── overview.md            (system design)
    ├── data-flow.md          (data movement)
    ├── hooks.md              (validation lifecycle)
    └── field-references.md   (type-safe fields)
```

---

## Quick Facts

- **Collections**: 7 (Users, Compliance, Audit, Support, Enrollments, Metrics, Certifications)
- **Seed Records**: 32 (all from test fixtures)
- **Fields**: 53 (all native Payload types)
- **Enums**: 12 (type-safe select options)
- **Hooks**: 6 (validation, normalization, audit)
- **Plugins**: 6 (Cloud Storage, Search, Webhooks, Nested Docs, Email, RichText)
- **APIs**: 42+ REST endpoints + GraphQL

---

## Installation (2 minutes)

```bash
npm install payload mongodb
npm run payload:admin
```

Then open: `http://localhost:3000/admin`

---

## Learn More

- [Official Payload CMS](https://payloadcms.com)
- [GitHub Repository](https://github.com/payloadcms/payload)
- [Documentation](https://payloadcms.com/docs)

---

**Version**: 1.0.0-payload  
**Last Updated**: 2026-09-29
