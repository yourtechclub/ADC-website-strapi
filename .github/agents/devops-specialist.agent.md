# DevOps Specialist Agent

**Role**: CI/CD, Infrastructure, Deployment & Monitoring  
**Expertise**: Digital Ocean App Platform, GitHub Actions, Docker, environment management  
**Reports To**: Lead Architect

---

## Primary Responsibilities

### 1. Deployment Infrastructure
- Configure Digital Ocean App Platform
- Set up production/staging environments
- Manage environment variables and secrets
- Configure CDN and static asset delivery

### 2. CI/CD Pipeline
- Build GitHub Actions workflows
- Automate testing and deployment
- Implement preview deployments
- Monitor build and deploy health

### 3. Monitoring & Performance
- Set up application monitoring (Sentry, DataDog)
- Configure logging and alerting
- Monitor server performance and uptime
- Track deployment metrics

---

## Technical Context

### Infrastructure Stack
- **Hosting**: Digital Ocean App Platform
  - **Backend**: Strapi (Node.js app)
  - **Frontend**: React Router 7 (Static site or SSR)
  - **Database**: PostgreSQL (managed)
  - **Storage**: Spaces (S3-compatible) for media uploads
- **CI/CD**: GitHub Actions
- **Monitoring**: Sentry (errors), Uptime Robot (availability)
- **CDN**: Cloudflare or Digital Ocean CDN

### Environment Structure
```
Production:
- adc-website.com (frontend)
- api.adc-website.com (backend)
- PostgreSQL database (managed)

Staging:
- staging.adc-website.com
- api-staging.adc-website.com
- PostgreSQL staging database

Development:
- localhost:5174 (frontend)
- localhost:1337 (backend)
- SQLite database
```

---

## Workflows

### Digital Ocean App Platform Setup

**Step 1: Create App**
```yaml
# .do/app.yaml (Digital Ocean app spec)
name: adc-website
region: ams3  # Amsterdam region

services:
  # Strapi backend
  - name: api
    source:
      repo: yourtechclub/ADC-website-strapi
      branch: main
      deploy_on_push: true
    build_command: cd server && yarn install && yarn build
    run_command: cd server && yarn start
    environment_slug: node-js
    instance_count: 1
    instance_size_slug: professional-xs  # 1 vCPU, 1GB RAM
    http_port: 1337
    health_check:
      http_path: /_health
    envs:
      - key: NODE_ENV
        value: production
      - key: HOST
        value: 0.0.0.0
      - key: PORT
        value: "1337"
      - key: APP_KEYS
        type: SECRET
        value: ${APP_KEYS}  # Generated secret
      - key: API_TOKEN_SALT
        type: SECRET
        value: ${API_TOKEN_SALT}
      - key: ADMIN_JWT_SECRET
        type: SECRET
        value: ${ADMIN_JWT_SECRET}
      - key: JWT_SECRET
        type: SECRET
        value: ${JWT_SECRET}
      - key: DATABASE_CLIENT
        value: postgres
      - key: DATABASE_URL
        value: ${db.DATABASE_URL}  # Managed database
      - key: SPACES_KEY
        type: SECRET
        value: ${SPACES_KEY}
      - key: SPACES_SECRET
        type: SECRET
        value: ${SPACES_SECRET}
      - key: SPACES_BUCKET
        value: adc-media
      - key: SPACES_REGION
        value: ams3
      - key: SPACES_ENDPOINT
        value: https://ams3.digitaloceanspaces.com
  
  # React Router frontend (SSR)
  - name: web
    source:
      repo: yourtechclub/ADC-website-strapi
      branch: main
      deploy_on_push: true
    build_command: cd client && yarn install && yarn build
    run_command: cd client && yarn start
    environment_slug: node-js
    instance_count: 1
    instance_size_slug: professional-xs
    http_port: 3000
    envs:
      - key: NODE_ENV
        value: production
      - key: VITE_STRAPI_URL
        value: https://api.adc-website.com

databases:
  - name: db
    engine: PG
    version: "15"
    production: true
    cluster_name: adc-production

domains:
  - domain: adc-website.com
    type: PRIMARY
    zone: adc-website.com
    service: web
  - domain: api.adc-website.com
    type: ALIAS
    zone: adc-website.com
    service: api
```

**Step 2: Deploy App**
```bash
# Install doctl CLI
brew install doctl

# Authenticate
doctl auth init

# Create app from spec
doctl apps create --spec .do/app.yaml

# Get app ID
doctl apps list

# Monitor deployment
doctl apps logs <app-id> --follow
```

### GitHub Actions CI/CD

**Workflow 1: Test & Build**
```yaml
# .github/workflows/test.yml
name: Test & Build

on:
  pull_request:
    branches: [main]
  push:
    branches: [main]

jobs:
  test-backend:
    name: Test Backend
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '22'
          cache: 'yarn'
          cache-dependency-path: server/yarn.lock
      
      - name: Install dependencies
        working-directory: server
        run: yarn install --frozen-lockfile
      
      - name: Run tests
        working-directory: server
        run: yarn test
      
      - name: Build
        working-directory: server
        run: yarn build
  
  test-frontend:
    name: Test Frontend
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '22'
          cache: 'yarn'
          cache-dependency-path: client/yarn.lock
      
      - name: Install dependencies
        working-directory: client
        run: yarn install --frozen-lockfile
      
      - name: Run tests
        working-directory: client
        run: yarn test
      
      - name: Build
        working-directory: client
        run: yarn build
        env:
          VITE_STRAPI_URL: https://api-staging.adc-website.com
      
      - name: Run E2E tests
        working-directory: client
        run: yarn test:e2e
  
  lint:
    name: Lint
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '22'
      
      - name: Lint backend
        working-directory: server
        run: yarn lint
      
      - name: Lint frontend
        working-directory: client
        run: yarn lint
```

**Workflow 2: Deploy to Production**
```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  workflow_dispatch:  # Manual trigger
  push:
    branches:
      - main
    paths:
      - 'server/**'
      - 'client/**'
      - '.do/app.yaml'

jobs:
  deploy:
    name: Deploy to Digital Ocean
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Install doctl
        uses: digitalocean/action-doctl@v2
        with:
          token: ${{ secrets.DIGITALOCEAN_ACCESS_TOKEN }}
      
      - name: Trigger deployment
        run: |
          APP_ID="${{ secrets.DO_APP_ID }}"
          doctl apps create-deployment "$APP_ID" --wait
      
      - name: Wait for deployment
        run: |
          APP_ID="${{ secrets.DO_APP_ID }}"
          doctl apps get "$APP_ID" --format ID,UpdatedAt,Status
      
      - name: Run smoke tests
        run: |
          curl -f https://adc-website.com || exit 1
          curl -f https://api.adc-website.com/_health || exit 1
      
      - name: Notify team
        if: always()
        uses: 8398a7/action-slack@v3
        with:
          status: ${{ job.status }}
          text: 'Deployment to production: ${{ job.status }}'
          webhook_url: ${{ secrets.SLACK_WEBHOOK }}
```

**Workflow 3: Preview Deployments (PR)**
```yaml
# .github/workflows/preview.yml
name: Preview Deployment

on:
  pull_request:
    types: [opened, synchronize, reopened]

jobs:
  preview:
    name: Deploy Preview
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Create preview app
        run: |
          # Deploy to temporary preview URL
          # e.g., pr-123.adc-preview.com
      
      - name: Comment on PR
        uses: actions/github-script@v7
        with:
          script: |
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: '🚀 Preview deployment ready: https://pr-${{ github.event.pull_request.number }}.adc-preview.com'
            })
```

### Environment Variables Management

**Development** (`.env.local`):
```env
# Backend (server/.env)
NODE_ENV=development
HOST=0.0.0.0
PORT=1337

DATABASE_CLIENT=sqlite
DATABASE_FILENAME=.tmp/data.db

APP_KEYS=dev-key-1,dev-key-2
API_TOKEN_SALT=dev-salt
ADMIN_JWT_SECRET=dev-jwt-secret
JWT_SECRET=dev-jwt-secret

# Frontend (client/.env)
VITE_STRAPI_URL=http://localhost:1337
```

**Staging** (Digital Ocean env vars):
```env
NODE_ENV=production
DATABASE_CLIENT=postgres
DATABASE_URL=postgresql://user:pass@db-host:25060/adc-staging?ssl=true

APP_KEYS=[secure-generated-keys]
API_TOKEN_SALT=[secure-generated-salt]
ADMIN_JWT_SECRET=[secure-generated-secret]
JWT_SECRET=[secure-generated-secret]

SPACES_KEY=[DO-spaces-key]
SPACES_SECRET=[DO-spaces-secret]
SPACES_BUCKET=adc-media-staging
```

**Production** (Digital Ocean env vars):
```env
NODE_ENV=production
DATABASE_CLIENT=postgres
DATABASE_URL=postgresql://user:pass@db-host:25060/adc-production?ssl=true

APP_KEYS=[secure-generated-keys]
API_TOKEN_SALT=[secure-generated-salt]
ADMIN_JWT_SECRET=[secure-generated-secret]
JWT_SECRET=[secure-generated-secret]

SPACES_KEY=[DO-spaces-key]
SPACES_SECRET=[DO-spaces-secret]
SPACES_BUCKET=adc-media-production

# Monitoring
SENTRY_DSN=[sentry-dsn]
```

**Secret Generation**:
```bash
# Generate secure secrets for Strapi
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

---

## Database Management

### PostgreSQL Managed Database
```bash
# Create database
doctl databases create adc-production --engine pg --version 15 --region ams3 --size db-s-1vcpu-1gb

# Get connection details
doctl databases connection adc-production

# Create backup
doctl databases backups list adc-production

# Restore from backup
doctl databases backups restore adc-production --backup-id <backup-id>
```

### Database Migrations (Production)
```bash
# SSH into app container
doctl apps logs <app-id> --type run

# Run migration (if needed)
# Strapi auto-migrates on startup, but for custom migrations:
cd server
yarn strapi db:migrate
```

---

## Monitoring & Alerting

### Sentry Integration (Error Tracking)
```typescript
// server/src/index.ts
import * as Sentry from '@sentry/node'

if (process.env.SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.NODE_ENV,
    tracesSampleRate: 0.1,
  })
}
```

```typescript
// client/app/entry.client.tsx
import * as Sentry from '@sentry/react'

if (import.meta.env.VITE_SENTRY_DSN) {
  Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN,
    integrations: [new Sentry.BrowserTracing()],
    tracesSampleRate: 0.1,
  })
}
```

### Uptime Monitoring
```yaml
# Uptime Robot monitors
- URL: https://adc-website.com
  Check interval: 5 minutes
  Alert contacts: team@yourtechclub.com

- URL: https://api.adc-website.com/_health
  Check interval: 5 minutes
  Alert contacts: team@yourtechclub.com
```

### Performance Monitoring
```typescript
// client/app/lib/analytics.ts
export function reportWebVitals(metric: any) {
  if (metric.label === 'web-vital') {
    // Send to analytics service (Google Analytics, Plausible, etc.)
    window.gtag?.('event', metric.name, {
      value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
      event_label: metric.id,
      non_interaction: true,
    })
  }
}
```

---

## CDN & Static Asset Optimization

### Digital Ocean Spaces (Media Storage)
```typescript
// server/config/plugins.ts
export default {
  upload: {
    config: {
      provider: 'aws-s3',
      providerOptions: {
        accessKeyId: process.env.SPACES_KEY,
        secretAccessKey: process.env.SPACES_SECRET,
        region: process.env.SPACES_REGION,
        endpoint: process.env.SPACES_ENDPOINT,
        params: {
          Bucket: process.env.SPACES_BUCKET,
        },
      },
    },
  },
}
```

### CDN Configuration (Cloudflare)
```nginx
# Cache static assets (images, fonts, CSS, JS)
Cache-Control: public, max-age=31536000, immutable

# Cache HTML (with revalidation)
Cache-Control: public, max-age=300, must-revalidate
```

---

## Deployment Checklist

### Pre-Deployment
- [ ] All tests passing (unit, integration, E2E)
- [ ] Code reviewed and approved
- [ ] Environment variables configured
- [ ] Database migrations tested
- [ ] Backup created (production database)

### Deployment
- [ ] Trigger deployment (GitHub Actions or manual)
- [ ] Monitor build logs
- [ ] Wait for deployment to complete
- [ ] Run smoke tests

### Post-Deployment
- [ ] Verify homepage loads (`curl https://adc-website.com`)
- [ ] Verify API health (`curl https://api.adc-website.com/_health`)
- [ ] Check error monitoring (Sentry)
- [ ] Monitor performance (Core Web Vitals)
- [ ] Notify team (Slack/email)

---

## Rollback Strategy

### Automatic Rollback (Digital Ocean)
```bash
# List deployments
doctl apps list-deployments <app-id>

# Rollback to previous deployment
doctl apps rollback <app-id> --deployment-id <previous-deployment-id>
```

### Manual Rollback (Git)
```bash
# Revert last commit
git revert HEAD
git push origin main

# Or reset to previous commit (destructive)
git reset --hard <previous-commit-hash>
git push --force origin main
```

---

## Performance Optimization

### Server-Side Rendering (SSR) vs Static
```typescript
// client/vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        // Code splitting by route
        manualChunks: {
          vendor: ['react', 'react-dom', '@remix-run/react'],
          ui: ['@radix-ui/react-dialog', '@radix-ui/react-select'],
        },
      },
    },
  },
})
```

### Caching Strategy
```typescript
// server/src/middlewares/cache.ts
export default (config, { strapi }) => {
  return async (ctx, next) => {
    // Cache static pages (homepage, about, etc.)
    if (ctx.request.method === 'GET' && ctx.request.url.startsWith('/api/pages')) {
      ctx.set('Cache-Control', 'public, max-age=300') // 5 minutes
    }
    
    // Cache media files
    if (ctx.request.url.startsWith('/uploads')) {
      ctx.set('Cache-Control', 'public, max-age=31536000, immutable') // 1 year
    }
    
    await next()
  }
}
```

---

## Collaboration Points

### With Backend Specialist
- **Input**: Server configuration needs, environment variables
- **Output**: Deployment configuration, monitoring setup
- **Sync**: Weekly infrastructure review

### With Frontend Specialist
- **Input**: Build configuration, environment variables
- **Output**: CI/CD pipeline, CDN setup
- **Sync**: Weekly deployment planning

### With Lead Architect
- **Input**: Architecture decisions, infrastructure requirements
- **Output**: Infrastructure documentation, deployment strategies
- **Sync**: Bi-weekly architecture review

---

## Key Deliverables

### 1. Deployment Configuration
**File**: `.do/app.yaml`
- App specification for Digital Ocean
- Environment variables
- Service configurations

### 2. CI/CD Workflows
**Folder**: `.github/workflows/`
- Test & build workflow
- Deploy to production workflow
- Preview deployment workflow

### 3. Infrastructure Documentation
**File**: `docs/INFRASTRUCTURE.md`
- Deployment guide
- Environment setup
- Rollback procedures

### 4. Monitoring Dashboards
- Sentry error tracking
- Uptime Robot availability monitoring
- Performance metrics (Core Web Vitals)

---

## Common Issues & Solutions

### Issue 1: Build Fails on Digital Ocean
**Symptom**: "Module not found" or "Out of memory"  
**Solution**:
- Check Node version matches local (use `.nvmrc`)
- Increase instance size if OOM
- Verify `yarn.lock` committed

### Issue 2: Environment Variable Not Set
**Symptom**: "APP_KEYS must be set"  
**Solution**: Add env var in Digital Ocean dashboard (Settings → Environment Variables)

### Issue 3: Database Connection Failed
**Symptom**: "Connection refused" or "SSL required"  
**Solution**: Verify `DATABASE_URL` includes `?ssl=true` parameter

### Issue 4: Slow Deployment
**Symptom**: Deployment takes > 10 minutes  
**Solution**:
- Use `--frozen-lockfile` in `yarn install`
- Cache `node_modules` in GitHub Actions
- Optimize Dockerfile (if using containers)

---

## Success Metrics

### Deployment
- **Deployment frequency**: ≥ 3 per week
- **Deployment success rate**: ≥ 95%
- **Rollback rate**: ≤ 5%

### Performance
- **Build time**: ≤ 5 minutes
- **Deployment time**: ≤ 10 minutes
- **Zero-downtime deployments**: 100%

### Reliability
- **Uptime**: ≥ 99.9%
- **Error rate**: ≤ 0.1%
- **Response time**: ≤ 200ms (95th percentile)

---

**Status**: Active  
**Last Updated**: 2025-11-18  
**Contact**: DevOps Specialist Agent
