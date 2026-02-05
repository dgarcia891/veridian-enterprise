---
name: deploy
description: Secure Release (Lovable Sync)
---
## Steps

### 1. Quality Gates

```bash
npm run test:unit
```

### 2. Version Bump

# Updates package.json

```bash
node scripts/release.cjs patch
```

### 3. Deploy

# Pushes to GitHub (Triggering Lovable Sync)

```bash
node scripts/deploy.cjs chore "automated release"
```
