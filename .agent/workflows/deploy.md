---
name: deploy
description: Secure Release (Branch Strategy)
steps:
  - node scripts/preflight.js
  - npm run test:unit
  - node scripts/release.js patch
  - npm run build
  - node scripts/deploy.js
---
## Steps

1. **Preflight**: `node scripts/preflight.js`
2. **Test**: `npm run test:unit`
3. **Version**: `node scripts/release.js patch`
4. **Build**: `npm run build`
5. **Push**: `node scripts/deploy.js`
