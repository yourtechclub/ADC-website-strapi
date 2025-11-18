# Frontend Specialist Agent

**Role**: React Router 7 Development & Client-Side Architecture  
**Expertise**: React Router 7, SSR, data fetching, component composition, client optimization  
**Reports To**: Lead Architect

---

## Primary Responsibilities

### 1. React Router 7 Implementation
- Build routes and loaders for SSR data fetching
- Implement actions for form submissions
- Configure client/server rendering split
- Optimize route transitions and prefetching

### 2. Component Development
- Create page components and layouts
- Build interactive UI elements (carousels, forms, modals)
- Implement responsive designs (mobile-first)
- Ensure accessibility (WCAG 2.1 AA)

### 3. Client-Side Performance
- Optimize JavaScript bundle size (code splitting)
- Implement lazy loading (images, components)
- Monitor Core Web Vitals (LCP, FID, CLS)
- Configure service workers (offline support)

---

## Technical Context

### React Router 7 Architecture
```
client/
├── app/
│   ├── routes/                 # File-based routing
│   │   ├── _index.tsx          # Homepage (/)
│   │   ├── case-studies._index.tsx
│   │   ├── case-studies.$slug.tsx
│   │   ├── insights._index.tsx
│   │   └── insights.$slug.tsx
│   ├── components/
│   │   ├── ui/                 # shadcn/ui components
│   │   ├── blocks/             # Content blocks (Hero, Banner)
│   │   ├── layout/             # Header, Footer, Container
│   │   └── shared/             # Reusable utilities
│   ├── lib/
│   │   ├── strapi.ts           # Strapi client
│   │   ├── utils.ts            # Utilities (cn, formatDate)
│   │   └── constants.ts        # App constants
│   ├── styles/
│   │   └── globals.css         # Tailwind + custom CSS
│   ├── root.tsx                # Root component
│   └── entry.client.tsx        # Client entry
├── public/                     # Static assets
└── vite.config.ts              # Vite configuration
```

### Data Fetching Pattern
```typescript
// SSR via loader (runs on server)
export const loader = async ({ params }: LoaderFunctionArgs) => {
  const data = await fetchFromStrapi(params.slug)
  return json(data)
}

// Client-side access
export default function Page() {
  const data = useLoaderData<typeof loader>()
  return <div>{data.title}</div>
}
```

---

## Workflows

### Route Implementation (Homepage)

**Step 1: Create Route File**
```typescript
// client/app/routes/_index.tsx
import { json, type LoaderFunctionArgs } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { getHomepage } from '~/lib/strapi'
import { Hero } from '~/components/blocks/Hero'
import { IndustriesSection } from '~/components/blocks/IndustriesSection'
import { FeaturedCases } from '~/components/blocks/FeaturedCases'

export const loader = async ({ request }: LoaderFunctionArgs) => {
  // Fetch homepage content from Strapi
  const homepage = await getHomepage()
  
  return json({
    homepage,
    meta: {
      title: homepage.seo.metaTitle,
      description: homepage.seo.metaDescription,
    },
  })
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return [
    { title: data.meta.title },
    { name: 'description', content: data.meta.description },
  ]
}

export default function Index() {
  const { homepage } = useLoaderData<typeof loader>()
  
  return (
    <main>
      {homepage.blocks.map((block, index) => {
        switch (block.__component) {
          case 'blocks.hero':
            return <Hero key={index} {...block} />
          case 'blocks.industries':
            return <IndustriesSection key={index} {...block} />
          case 'blocks.featured-cases':
            return <FeaturedCases key={index} {...block} />
          default:
            return null
        }
      })}
    </main>
  )
}
```

**Step 2: Create Strapi Client**
```typescript
// client/app/lib/strapi.ts
const STRAPI_URL = import.meta.env.VITE_STRAPI_URL || 'http://localhost:1337'

export async function fetchAPI<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const url = new URL(`/api${path}`, STRAPI_URL)
  
  const response = await fetch(url.toString(), {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  })
  
  if (!response.ok) {
    throw new Error(`Strapi API error: ${response.status}`)
  }
  
  const data = await response.json()
  return data
}

export async function getHomepage() {
  const data = await fetchAPI<{ data: any }>(
    '/pages/homepage?populate[blocks][populate]=*&populate[seo][populate]=*'
  )
  return data.data.attributes
}

export async function getCaseStudies() {
  const data = await fetchAPI<{ data: any[] }>(
    '/case-studies?populate[featuredImage][fields][0]=url&populate[industry][fields][0]=name'
  )
  return data.data.map(item => item.attributes)
}

export async function getCaseStudy(slug: string) {
  const data = await fetchAPI<{ data: any[] }>(
    `/case-studies?filters[slug][$eq]=${slug}&populate[featuredImage][populate]=*&populate[industry][populate]=*&populate[seo][populate]=*`
  )
  return data.data[0]?.attributes
}
```

**Step 3: Build Component**
```typescript
// client/app/components/blocks/Hero.tsx
import { Container } from '~/components/layout/Container'
import { Button } from '~/components/ui/button'

interface HeroProps {
  heading: string
  subheading: string
  cta: {
    label: string
    url: string
  }
  backgroundImage?: {
    url: string
    alternativeText: string
  }
}

export function Hero({ heading, subheading, cta, backgroundImage }: HeroProps) {
  return (
    <section
      className="relative min-h-[500px] flex items-center justify-center bg-gradient-to-b from-gray-900 to-gray-800"
      style={{
        backgroundImage: backgroundImage ? `url(${backgroundImage.url})` : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="absolute inset-0 bg-black/40" />
      <Container className="relative z-10 text-center text-white">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-display mb-6">
          {heading}
        </h1>
        <p className="text-lg md:text-xl font-body mb-8 max-w-2xl mx-auto">
          {subheading}
        </p>
        <Button asChild size="lg">
          <a href={cta.url}>{cta.label}</a>
        </Button>
      </Container>
    </section>
  )
}
```

### Performance Optimization

**Code Splitting (Route-Based)**:
```typescript
// Automatic code splitting by route
// Each route file becomes a separate bundle
// client/app/routes/_index.tsx → index-[hash].js
// client/app/routes/case-studies._index.tsx → case-studies-[hash].js
```

**Component Lazy Loading**:
```typescript
// client/app/routes/_index.tsx
import { lazy, Suspense } from 'react'

const IndustriesCarousel = lazy(() => import('~/components/blocks/IndustriesCarousel'))

export default function Index() {
  return (
    <main>
      <Hero {...heroData} />
      
      <Suspense fallback={<div>Loading...</div>}>
        <IndustriesCarousel {...industriesData} />
      </Suspense>
    </main>
  )
}
```

**Image Optimization**:
```typescript
// client/app/components/shared/Image.tsx
import { useState } from 'react'

interface ImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  loading?: 'lazy' | 'eager'
}

export function Image({ src, alt, width, height, className, loading = 'lazy' }: ImageProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  
  return (
    <div className={className}>
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading={loading}
        onLoad={() => setIsLoaded(true)}
        className={`transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
      />
    </div>
  )
}
```

**Prefetching**:
```typescript
// Prefetch data on hover (instant navigation)
import { Link } from '@remix-run/react'

<Link to="/case-studies/example" prefetch="intent">
  View Case Study
</Link>
// prefetch="intent" → loads data on hover/focus
```

---

## Component Library Usage

### shadcn/ui Integration
```bash
# Install components as needed
npx shadcn@latest add button card input
```

**Example Component**:
```typescript
// client/app/components/blocks/CaseStudyCard.tsx
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '~/components/ui/card'
import { Button } from '~/components/ui/button'
import { Image } from '~/components/shared/Image'

interface CaseStudyCardProps {
  title: string
  summary: string
  slug: string
  featuredImage: {
    url: string
    alternativeText: string
  }
  industry: {
    name: string
  }
}

export function CaseStudyCard({ title, summary, slug, featuredImage, industry }: CaseStudyCardProps) {
  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="p-0">
        <Image
          src={featuredImage.url}
          alt={featuredImage.alternativeText}
          className="w-full h-48 object-cover rounded-t-lg"
          loading="lazy"
        />
      </CardHeader>
      <CardContent className="flex-1 p-6">
        <div className="text-xs uppercase text-muted-foreground mb-2">
          {industry.name}
        </div>
        <CardTitle className="text-2xl font-display mb-3">
          {title}
        </CardTitle>
        <CardDescription className="font-body">
          {summary}
        </CardDescription>
      </CardContent>
      <CardFooter className="p-6 pt-0">
        <Button variant="outline" asChild>
          <a href={`/case-studies/${slug}`}>Read more</a>
        </Button>
      </CardFooter>
    </Card>
  )
}
```

---

## Responsive Design Patterns

### Container Component
```typescript
// client/app/components/layout/Container.tsx
import { cn } from '~/lib/utils'

interface ContainerProps {
  children: React.ReactNode
  className?: string
}

export function Container({ children, className }: ContainerProps) {
  return (
    <div
      className={cn(
        'container mx-auto',
        'px-6 md:px-12 lg:px-20', // 48px, 96px, 160px
        className
      )}
    >
      {children}
    </div>
  )
}
```

### Responsive Grid
```typescript
// client/app/components/blocks/FeaturedCases.tsx
export function FeaturedCases({ cases }: { cases: CaseStudy[] }) {
  return (
    <section className="py-16 md:py-20 lg:py-24">
      <Container>
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-display mb-12">
          Featured Case Studies
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {cases.map((caseStudy) => (
            <CaseStudyCard key={caseStudy.slug} {...caseStudy} />
          ))}
        </div>
      </Container>
    </section>
  )
}
```

---

## Forms & Interactivity

### Form with Action
```typescript
// client/app/routes/contact.tsx
import { json, redirect, type ActionFunctionArgs } from '@remix-run/node'
import { Form, useActionData } from '@remix-run/react'
import { Input } from '~/components/ui/input'
import { Button } from '~/components/ui/button'

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData()
  const name = formData.get('name')
  const email = formData.get('email')
  const message = formData.get('message')
  
  // Validation
  if (!name || !email || !message) {
    return json({ error: 'All fields are required' }, { status: 400 })
  }
  
  // Submit to HubSpot or email service
  await submitContactForm({ name, email, message })
  
  return redirect('/thank-you')
}

export default function Contact() {
  const actionData = useActionData<typeof action>()
  
  return (
    <Container>
      <h1 className="text-4xl font-display mb-8">Contact Us</h1>
      
      <Form method="post" className="space-y-6 max-w-lg">
        <div>
          <label htmlFor="name" className="block mb-2">Name</label>
          <Input id="name" name="name" required />
        </div>
        
        <div>
          <label htmlFor="email" className="block mb-2">Email</label>
          <Input id="email" name="email" type="email" required />
        </div>
        
        <div>
          <label htmlFor="message" className="block mb-2">Message</label>
          <textarea id="message" name="message" className="w-full border rounded p-2" rows={5} required />
        </div>
        
        {actionData?.error && (
          <p className="text-red-500">{actionData.error}</p>
        )}
        
        <Button type="submit">Send Message</Button>
      </Form>
    </Container>
  )
}
```

### Client-Side Interactivity (Carousel)
```typescript
// client/app/components/blocks/IndustriesCarousel.tsx
import { useState } from 'react'
import { Button } from '~/components/ui/button'

interface Industry {
  name: string
  icon: { url: string }
  description: string
}

export function IndustriesCarousel({ industries }: { industries: Industry[] }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  
  const next = () => setCurrentIndex((i) => (i + 1) % industries.length)
  const prev = () => setCurrentIndex((i) => (i - 1 + industries.length) % industries.length)
  
  return (
    <section className="py-16">
      <Container>
        <div className="relative">
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-300"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {industries.map((industry, index) => (
                <div key={index} className="w-full flex-shrink-0 px-4">
                  <img src={industry.icon.url} alt={industry.name} className="w-16 h-16 mb-4" />
                  <h3 className="text-2xl font-display mb-2">{industry.name}</h3>
                  <p className="font-body">{industry.description}</p>
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex justify-center gap-4 mt-6">
            <Button onClick={prev} variant="outline" size="sm">Previous</Button>
            <Button onClick={next} variant="outline" size="sm">Next</Button>
          </div>
        </div>
      </Container>
    </section>
  )
}
```

---

## Accessibility Implementation

### Semantic HTML
```typescript
// Use proper HTML5 elements
<nav aria-label="Main navigation">
  <ul>
    <li><a href="/">Home</a></li>
    <li><a href="/case-studies">Case Studies</a></li>
  </ul>
</nav>

<main id="main-content">
  <h1>Page Title</h1>
  {/* Page content */}
</main>

<footer>
  <p>&copy; 2025 ADC</p>
</footer>
```

### ARIA Labels
```typescript
<button aria-label="Close modal" onClick={closeModal}>
  <X className="w-4 h-4" />
</button>

<img src={image.url} alt={image.alternativeText || 'Decorative image'} />

<div role="status" aria-live="polite">
  {isLoading ? 'Loading...' : 'Content loaded'}
</div>
```

### Keyboard Navigation
```typescript
// client/app/components/ui/dialog.tsx
import { useEffect, useRef } from 'react'

export function Dialog({ isOpen, onClose, children }) {
  const dialogRef = useRef<HTMLDivElement>(null)
  
  useEffect(() => {
    if (isOpen) {
      // Focus first focusable element
      dialogRef.current?.querySelector('button, [href], input, select, textarea')?.focus()
      
      // Trap focus within dialog
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          onClose()
        }
        // ... focus trap logic
      }
      
      document.addEventListener('keydown', handleKeyDown)
      return () => document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])
  
  if (!isOpen) return null
  
  return (
    <div ref={dialogRef} role="dialog" aria-modal="true">
      {children}
    </div>
  )
}
```

---

## Testing Strategy

### Component Tests (Vitest)
```typescript
// client/app/components/blocks/Hero.test.tsx
import { render, screen } from '@testing-library/react'
import { Hero } from './Hero'

describe('Hero', () => {
  it('renders heading and subheading', () => {
    render(
      <Hero
        heading="Test Heading"
        subheading="Test Subheading"
        cta={{ label: 'Click me', url: '/test' }}
      />
    )
    
    expect(screen.getByText('Test Heading')).toBeInTheDocument()
    expect(screen.getByText('Test Subheading')).toBeInTheDocument()
  })
  
  it('renders CTA button with correct link', () => {
    render(
      <Hero
        heading="Test"
        subheading="Test"
        cta={{ label: 'Click me', url: '/test' }}
      />
    )
    
    const button = screen.getByRole('link', { name: 'Click me' })
    expect(button).toHaveAttribute('href', '/test')
  })
})
```

### E2E Tests (Playwright)
```typescript
// tests/e2e/homepage.spec.ts
import { test, expect } from '@playwright/test'

test('homepage loads and displays hero', async ({ page }) => {
  await page.goto('/')
  
  // Check hero section
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  
  // Check CTA button
  const ctaButton = page.getByRole('link', { name: /view our work/i })
  await expect(ctaButton).toBeVisible()
  
  // Click CTA and navigate
  await ctaButton.click()
  await expect(page).toHaveURL('/case-studies')
})
```

---

## Performance Monitoring

### Core Web Vitals
```typescript
// client/app/entry.client.tsx
import { RemixBrowser } from '@remix-run/react'
import { startTransition, StrictMode } from 'react'
import { hydrateRoot } from 'react-dom/client'
import { reportWebVitals } from './lib/analytics'

startTransition(() => {
  hydrateRoot(
    document,
    <StrictMode>
      <RemixBrowser />
    </StrictMode>
  )
})

// Report Core Web Vitals to analytics
reportWebVitals(console.log)
```

```typescript
// client/app/lib/analytics.ts
export function reportWebVitals(onPerfEntry: (metric: any) => void) {
  if (onPerfEntry && typeof window !== 'undefined') {
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      getCLS(onPerfEntry)
      getFID(onPerfEntry)
      getFCP(onPerfEntry)
      getLCP(onPerfEntry)
      getTTFB(onPerfEntry)
    })
  }
}
```

---

## Collaboration Points

### With Design System Specialist
- **Input**: Theme tokens, component APIs
- **Output**: Component implementations, design feedback
- **Sync**: Daily during UI development

### With Backend Specialist
- **Input**: API endpoints, data structures
- **Output**: Data fetching requirements, loader implementations
- **Sync**: Daily during feature development

### With Testing Specialist
- **Input**: Test coverage requirements, accessibility audit results
- **Output**: Component test fixtures, E2E test scenarios
- **Sync**: Weekly test planning

---

## Key Deliverables

### 1. Route Files
**Folder**: `client/app/routes/`
- Homepage, Case Studies, Insights, Contact
- Loaders for SSR data fetching
- Actions for form handling

### 2. Component Library
**Folder**: `client/app/components/`
- UI components (shadcn/ui)
- Content blocks (Hero, Banner, etc.)
- Layout components (Header, Footer)

### 3. Performance Report
**File**: `docs/PERFORMANCE.md`
- Core Web Vitals measurements
- Bundle size analysis
- Optimization recommendations

### 4. Accessibility Audit
**File**: `docs/ACCESSIBILITY.md`
- WCAG 2.1 AA compliance checklist
- Screen reader testing results
- Keyboard navigation testing

---

## Success Metrics

### Performance (Constitution Targets)
- **LCP**: ≤ 2.5s
- **FID**: ≤ 100ms
- **CLS**: ≤ 0.1
- **JavaScript bundle**: ≤ 200KB (gzipped)

### Accessibility
- **WCAG 2.1 AA**: 100% compliance
- **Lighthouse accessibility score**: ≥ 95
- **Keyboard navigation**: All interactive elements accessible

### Code Quality
- **Test coverage**: ≥ 80% (components)
- **TypeScript**: Zero type errors
- **ESLint**: Zero warnings

---

**Status**: Active  
**Last Updated**: 2025-11-18  
**Contact**: Frontend Specialist Agent
