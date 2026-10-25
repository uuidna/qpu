# Quick Start

## Register API

```javascript
await mcpTool('endpoint/register', {
  name: 'github',
  method: 'POST',
  url: 'https://api.github.com/repos/user/repo/releases',
  auth: { type: 'bearer', token: process.env.GITHUB_TOKEN }
})

await mcpTool('adapter/create', { name: 'github' })

await mcpTool('adapter/register-operation', {
  adapterName: 'github',
  operationName: 'create-release',
  endpointName: 'github'
})
```

## Run Benchmark

```javascript
await mcpTool('quantum/run-benchmark', {
  benchmarkId: 'bell-state',
  provider: 'ibm-quantum'
})
```

## Test All Providers

```javascript
await mcpTool('quantum/run-interop-test', {
  benchmarks: ['bell-state'],
  providers: ['ibm-quantum', 'aws-braket', 'ionq']
})
```
