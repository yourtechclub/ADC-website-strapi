# ADC Website - AI Coding Agent Instructions

## Project Context: ADC Website Redesign

**IMPORTANT**: This codebase is building the ADC (Amsterdam Data Collective) website redesign. Always refer to the **Project Constitution** at `.specify/memory/constitution.md` for:
- Design philosophy (CF brand identity, generous whitespace, mobile-first)
- Technical constraints (React Router 7 + Strapi 5, NOT WordPress/PayloadCMS)
- Content architecture (Industries, Cases, Insights collections)
- Performance targets (Core Web Vitals, WCAG 2.1 AA)
- Integration requirements (HubSpot, GA4)

**Spec-Driven Development**: This project uses [GitHub Spec Kit](https://github.com/github/spec-kit) for structured requirements. See constitution for workflow details.

**Slash Commands Available**:
- `/speckit.constitution` - View/update project principles
- `/speckit.specify` - Capture requirements from Product Owner
- `/speckit.plan` - Create technical architecture (Lead Architect)
- `/speckit.tasks` - Generate specialist assignments
- `/speckit.implement` - Execute implementation

**Directory Structure**:
- `.github/agents/` - Specialist agent instructions (8 specialists)
- `.github/prompts/` - Spec-kit slash command templates
- `.specify/memory/` - Active specs, plans, tasks (constitution, specifications, etc.)

---

## Architecture Overview

This is a **React Router 7 + Strapi 5** separated architecture with headless CMS backend and modern React frontend.

**Key Architecture:**
```
Project Structure:
├── server/                    # Strapi 5 Backend
│   ├── src/
│   │   ├── api/              # Content Types (collections)
│   │   │   ├── article/
│   │   │   ├── author/
│   │   │   ├── tag/
│   │   │   └── page/
│   │   ├── components/       # Reusable Strapi components
│   │   └── index.ts
│   ├── config/               # Strapi configuration
│   ├── database/             # SQLite (dev), PostgreSQL (prod)
│   └── package.json
│
├── client/                    # React Router 7 Frontend
│   ├── app/
│   │   ├── routes/           # React Router routes
│   │   │   ├── _index.tsx    # Homepage
│   │   │   └── $.tsx         # Catch-all for dynamic pages
│   │   ├── components/       # React components
│   │   │   ├── ui/          # shadcn/ui components
│   │   │   └── blocks/      # Content blocks
│   │   ├── lib/             # Utilities
│   │   │   └── strapi.ts    # Strapi client config
│   │   └── root.tsx         # App shell
│   ├── public/              # Static assets
│   └── package.json
│
└── package.json              # Root workspace config
```

**Collections (Strapi Backend)**:
- **Single Types**: `global`, `landing-page`
- **Collection Types**: `article`, `author`, `tag`, `page`
- **ADC-specific**: `industries`, `cases`, `insights`, `news`, `events` (to be added)

**Components (Reusable Blocks)**:
- Header, Footer, Hero sections
- Banner, Feature sections
- Image + text combinations

## Critical Developer Workflows

### Development
```bash
# Start both servers concurrently
yarn dev

# Or separately:
cd server && yarn develop    # Strapi admin: http://localhost:1337/admin
cd client && yarn dev         # React Router: http://localhost:5174
```

### Database Operations
```bash
cd server
yarn strapi export -f ../seed-data.tar.gz  # Backup data
yarn strapi import -f ../seed-data.tar.gz  # Restore data
```

### Type Generation
Strapi auto-generates TypeScript types. Access via `@strapi/client`:
```typescript
import type { Article, Author, Global } from '@/types/strapi'
```

## Project-Specific Conventions

### 1. Component Structure (Client)
Every component should follow this pattern:
```tsx
// client/app/components/blocks/Hero.tsx
import type { FC } from 'react'

interface HeroProps {
  heading: string
  description?: string
  image?: {
    url: string
    alternativeText: string
  }
}

export const Hero: FC<HeroProps> = ({ heading, description, image }) => {
  return (
    <section className="bg-background text-foreground">
      <h1>{heading}</h1>
      {description && <p>{description}</p>}
    </section>
  )
}
```

**Key Rules:**
- Use TypeScript interfaces for props
- Use semantic HTML (`<section>`, `<article>`, `<nav>`, etc.)
- Apply theme CSS variables: `bg-background`, `text-foreground`, `border-border`
- Export as named export
- Keep components pure and testable

### 2. Data Fetching Pattern (React Router Loaders)
```tsx
// client/app/routes/_index.tsx
import { json, type LoaderFunctionArgs } from 'react-router'
import { useLoaderData } from 'react-router'
import { getStrapiURL } from '~/lib/strapi'

export async function loader({ request }: LoaderFunctionArgs) {
  const response = await fetch(`${getStrapiURL()}/api/landing-page?populate=deep`)
  const data = await response.json()
  
  return json({ landingPage: data.data })
}

export default function Index() {
  const { landingPage } = useLoaderData<typeof loader>()
  
  return (
    <div>
      <Hero {...landingPage.attributes.hero} />
    </div>
  )
}
```

**Key Rules:**
- Use React Router loaders for SSR data fetching
- Fetch from Strapi API with `?populate=deep` for relations
- Use `getStrapiURL()` helper for API base URL
- Type loader data with `useLoaderData<typeof loader>()`

### 3. Strapi Client Configuration
```typescript
// client/app/lib/strapi.ts
export function getStrapiURL() {
  return process.env.STRAPI_URL || 'http://localhost:1337'
}

export function getStrapiMedia(url: string | undefined) {
  if (!url) return null
  if (url.startsWith('http')) return url
  return `${getStrapiURL()}${url}`
}
```

### 4. Link Components Pattern
```tsx
import { Link } from 'react-router'

// Internal links
<Link to="/about" className="hover:underline">About</Link>

// External links
<a href="https://example.com" target="_blank" rel="noopener noreferrer">
  External Link
</a>
```

**DO NOT mix** `<a>` tags for internal navigation - always use React Router's `<Link>`.

### 5. Theme System
Theme managed via CSS variables in Tailwind config:
```tsx
// Always use semantic tokens
<div className="bg-background text-foreground border-border">
<Button variant="default">  // Uses theme primary color
<Button variant="secondary">  // Uses theme secondary color
```

**DO NOT hardcode colors** - use Tailwind theme classes.

### 6. Strapi Content Types Pattern
```typescript
// server/src/api/article/content-types/article/schema.json
{
  "kind": "collectionType",
  "collectionName": "articles",
  "info": {
    "singularName": "article",
    "pluralName": "articles",
    "displayName": "Article"
  },
  "options": {
    "draftAndPublish": true
  },
  "attributes": {
    "title": {
      "type": "string",
      "required": true
    },
    "slug": {
      "type": "uid",
      "targetField": "title"
    },
    "content": {
      "type": "richtext"
    },
    "author": {
      "type": "relation",
      "relation": "manyToOne",
      "target": "api::author.author"
    }
  }
}
```

**Key Rules:**
- Use `collectionType` for repeatable content, `singleType` for globals
- Always include `draftAndPublish` option
- Use `uid` type for slugs with `targetField`
- Relations: `manyToOne`, `oneToMany`, `manyToMany`, `oneToOne`

### 7. Component (Block) System in Strapi
```typescript
// server/src/components/sections/hero.json
{
  "collectionName": "components_sections_heroes",
  "info": {
    "displayName": "Hero",
    "description": "Hero section with heading and image"
  },
  "options": {},
  "attributes": {
    "heading": {
      "type": "string",
      "required": true
    },
    "description": {
      "type": "text"
    },
    "image": {
      "type": "media",
      "multiple": false,
      "allowedTypes": ["images"]
    }
  }
}
```

Use in content types:
```json
{
  "attributes": {
    "sections": {
      "type": "dynamiczone",
      "components": [
        "sections.hero",
        "sections.banner",
        "sections.features"
      ]
    }
  }
}
```

### 8. API Population Strategy
```typescript
// Deep populate (use sparingly)
/api/landing-page?populate=deep

// Selective populate (preferred)
/api/articles?populate[author]=*&populate[tags]=*&populate[image]=*

// Nested populate
/api/landing-page?populate[sections][populate]=*
```

## Integration Points

### Figma → Code Workflow
1. Export design tokens from Figma
2. Create Strapi components matching Figma sections
3. Build React components consuming Strapi data
4. Map Figma designs to component props

### HubSpot Forms Integration
```tsx
// client/app/components/forms/ContactForm.tsx
export const ContactForm: FC = () => {
  const handleSubmit = async (data: FormData) => {
    // Post to HubSpot API
    await fetch('https://api.hsforms.com/submissions/v3/integration/submit/:portalId/:formGuid', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fields: [
          { name: 'email', value: data.email },
          { name: 'firstname', value: data.firstName }
        ],
        context: {
          hutk: cookies.hubspotutk, // Track visitor
          pageUri: window.location.href
        }
      })
    })
  }
  
  return <form onSubmit={handleSubmit}>...</form>
}
```

### Google Analytics 4
```typescript
// client/app/lib/analytics.ts
export const trackEvent = (eventName: string, params?: Record<string, any>) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, params)
  }
}

// Usage
trackEvent('cta_click', { label: 'Contact Us', location: 'hero' })
```

## Common Pitfalls

1. **Not using loaders for SSR**: Always fetch data in loaders, not in components
2. **Missing populate parameters**: Strapi requires explicit `populate` for relations
3. **Hardcoding URLs**: Use `getStrapiURL()` helper
4. **Wrong relation types**: Understand `manyToOne` vs `oneToMany` directionality
5. **Not handling loading/error states**: Always show fallbacks
6. **Direct fetch in components**: Use loaders for initial data, React Query for client-side
7. **Ignoring mobile-first**: Design and test mobile layouts first (constitution requirement)

## Key Files Reference

### Server (Strapi)
- **`server/config/server.ts`**: Server configuration
- **`server/config/database.ts`**: Database adapter setup
- **`server/config/plugins.ts`**: Plugin configuration
- **`server/src/api/`**: Content type definitions
- **`server/src/components/`**: Reusable component definitions

### Client (React Router)
- **`client/app/root.tsx`**: App shell with providers
- **`client/app/routes/`**: Route definitions
- **`client/app/components/`**: React components
- **`client/app/lib/strapi.ts`**: Strapi client utilities
- **`client/tailwind.config.ts`**: Tailwind theme configuration

## Environment Variables

### Server (.env in server/)
```env
HOST=0.0.0.0
PORT=1337
APP_KEYS=... # Generate with: node -e "console.log(crypto.randomBytes(16).toString('base64'))"
API_TOKEN_SALT=...
ADMIN_JWT_SECRET=...
TRANSFER_TOKEN_SALT=...
JWT_SECRET=...

# Database (SQLite for dev, PostgreSQL for prod)
DATABASE_CLIENT=sqlite
DATABASE_FILENAME=.tmp/data.db

# PostgreSQL (production)
# DATABASE_CLIENT=postgres
# DATABASE_HOST=...
# DATABASE_PORT=5432
# DATABASE_NAME=strapi
# DATABASE_USERNAME=...
# DATABASE_PASSWORD=...
```

### Client (.env in client/)
```env
STRAPI_URL=http://localhost:1337
VITE_STRAPI_URL=http://localhost:1337

# Analytics
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# HubSpot
VITE_HUBSPOT_PORTAL_ID=...
VITE_HUBSPOT_FORM_GUID=...
```

## Design System

- **Components**: shadcn/ui + Radix UI in `client/app/components/ui/`
- **Customization**: Via Tailwind config and CSS variables
- **Theme**: ADC brand colors from Clever°Franke design system
- **Typography**: Ease Display (headings), Ease SemiDisplay (body)
- **Spacing**: Generous whitespace (mobile-first, constitution requirement)

## Performance & SEO

### Core Web Vitals Targets
- **LCP** (Largest Contentful Paint): ≤ 2.5s
- **FID** (First Input Delay): ≤ 100ms
- **CLS** (Cumulative Layout Shift): ≤ 0.1

### React Router Meta Tags
```tsx
// client/app/routes/_index.tsx
export const meta: MetaFunction = () => {
  return [
    { title: 'ADC - Amsterdam Data Collective' },
    { name: 'description', content: 'Data & AI Consultancy' },
    { property: 'og:title', content: 'ADC' },
    { property: 'og:image', content: '/og-image.jpg' }
  ]
}
```

### Image Optimization
```tsx
// Use Strapi image formats
<img 
  src={getStrapiMedia(image.formats?.medium?.url)} 
  srcSet={`
    ${getStrapiMedia(image.formats?.small?.url)} 640w,
    ${getStrapiMedia(image.formats?.medium?.url)} 1024w,
    ${getStrapiMedia(image.formats?.large?.url)} 1920w
  `}
  alt={image.alternativeText}
  loading="lazy"
/>
```

## Accessibility (WCAG 2.1 AA)

- ✅ Semantic HTML structure
- ✅ ARIA labels where needed
- ✅ Keyboard navigation support
- ✅ Focus visible indicators
- ✅ Color contrast ≥ 4.5:1
- ✅ Alt text for images
- ✅ Form labels and error messages

## Testing Strategy

### Unit Tests (Vitest)
```typescript
// client/app/components/Hero.test.tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Hero } from './Hero'

describe('Hero', () => {
  it('renders heading', () => {
    render(<Hero heading="Test Heading" />)
    expect(screen.getByRole('heading')).toHaveTextContent('Test Heading')
  })
})
```

### E2E Tests (Playwright)
```typescript
// tests/homepage.spec.ts
import { test, expect } from '@playwright/test'

test('homepage loads correctly', async ({ page }) => {
  await page.goto('http://localhost:5174')
  await expect(page.locator('h1')).toBeVisible()
})
```

## Deployment (Digital Ocean App Platform)

### Build Commands
```yaml
# Server
build_command: cd server && yarn build

# Client  
build_command: cd client && yarn build

# Run Command
run_command: yarn dev
```

### Database Migration
```bash
# Production: Switch to PostgreSQL
DATABASE_CLIENT=postgres
```

---

## World-Class AI Development Team Structure

### Specialist Agents (8 roles)
1. **Lead Architect** - Technical decisions, epic breakdown, PO interface
2. **Design System Specialist** - CF token integration, component library
3. **Figma Specialist** - Pixel-perfect Figma → code translation
4. **Backend Specialist** - Strapi content types, HubSpot integration
5. **Frontend Specialist** - React Router, SSR, performance optimization
6. **Database Specialist** - Schema design, migrations, relationships
7. **DevOps Specialist** - Digital Ocean deployment, CI/CD
8. **Testing Specialist** - E2E tests, accessibility, performance audits

### Workflow
1. **Specify** (`/speckit.specify`) - Capture requirements
2. **Plan** (`/speckit.plan`) - Technical architecture by Lead Architect
3. **Tasks** (`/speckit.tasks`) - Break down into specialist assignments
4. **Implement** (`/speckit.implement`) - Execute by specialists
5. **Review** - Cross-specialist code review
6. **Deploy** - Automated CI/CD pipeline

---

**Remember**: Always check `.specify/memory/constitution.md` for project-specific requirements and constraints. This is a high-quality, world-class implementation with no shortcuts.
