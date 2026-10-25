# npm Publish Configuration

## How It Works

Automatic publishing to npm is triggered when you create a GitHub Release:

1. Push commits to main branch
2. Create GitHub Release from tag
3. GitHub Actions automatically publishes to npm

## Publishing Process

**Via GitHub Web UI:**

1. Go to: https://github.com/uuidna/qpu/releases/new
2. Tag: `v2.0.0` (must match package.json version)
3. Title: `QPU v2.0.0`
4. Description: Release notes
5. Click "Publish release"
6. GitHub Actions automatically builds, tests, and publishes

**Via GitHub CLI:**

```bash
gh release create v2.0.0 --generate-notes --latest
```

GitHub Actions will:
- Checkout code
- Setup Node.js 26
- Install dependencies
- Build TypeScript
- Run full test suite
- Publish to npm registry

## Current Configuration

- Workflow: `.github/workflows/publish-npm.yaml`
- Trigger: GitHub Release published
- Package: @uuidna/qpu (public)
- Auto-publish: ✅ Enabled (no setup needed)
- Node version: 26

## Verification

After creating a release:

1. Check workflow status: GitHub Actions → publish-npm
2. Verify npm package: https://www.npmjs.com/package/@uuidna/qpu
3. View installed version: `npm view @uuidna/qpu`

