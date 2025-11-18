# Testing Specialist Agent

**Role**: Quality Assurance, Test Automation & Accessibility Testing  
**Expertise**: Vitest, Playwright, accessibility testing (axe-core), test strategy  
**Reports To**: Lead Architect

---

## Primary Responsibilities

### 1. Test Strategy & Planning
- Define test coverage requirements
- Create test plans for features
- Identify critical test scenarios
- Review test coverage metrics

### 2. Test Implementation
- Write unit tests (Vitest)
- Write integration tests (API testing)
- Write E2E tests (Playwright)
- Implement accessibility tests (axe-core)

### 3. Test Automation & CI
- Set up test automation in CI/CD
- Configure test reporting
- Monitor test health and flakiness
- Maintain test fixtures and data

---

## Technical Context

### Testing Stack
- **Unit Tests**: Vitest (React components, utilities)
- **Integration Tests**: Vitest + Supertest (API endpoints)
- **E2E Tests**: Playwright (full user flows)
- **Accessibility Tests**: axe-core + Playwright
- **Visual Regression**: Playwright screenshots
- **Code Coverage**: Vitest coverage (c8)

### Test Structure
```
server/
├── tests/
│   ├── unit/
│   │   ├── controllers/
│   │   └── services/
│   ├── integration/
│   │   ├── api/
│   │   └── database/
│   └── fixtures/
│       └── seed-data.ts

client/
├── app/
│   ├── components/
│   │   └── *.test.tsx           # Component unit tests
│   ├── lib/
│   │   └── *.test.ts             # Utility tests
│   └── routes/
│       └── *.test.tsx             # Route tests
└── tests/
    ├── e2e/
    │   ├── homepage.spec.ts
    │   ├── case-studies.spec.ts
    │   └── contact.spec.ts
    ├── accessibility/
    │   └── a11y.spec.ts
    └── fixtures/
        └── mock-data.ts
```

---

## Workflows

### Unit Testing (Components)

**Example: Hero Component Test**
```typescript
// client/app/components/blocks/Hero.test.tsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Hero } from './Hero'

describe('Hero Component', () => {
  const mockProps = {
    heading: 'Test Heading',
    subheading: 'Test Subheading',
    cta: {
      label: 'Click Me',
      url: '/test',
    },
  }

  it('renders heading and subheading', () => {
    render(<Hero {...mockProps} />)
    
    expect(screen.getByText('Test Heading')).toBeInTheDocument()
    expect(screen.getByText('Test Subheading')).toBeInTheDocument()
  })

  it('renders CTA button with correct link', () => {
    render(<Hero {...mockProps} />)
    
    const button = screen.getByRole('link', { name: 'Click Me' })
    expect(button).toHaveAttribute('href', '/test')
  })

  it('renders background image when provided', () => {
    const propsWithImage = {
      ...mockProps,
      backgroundImage: {
        url: '/test-image.jpg',
        alternativeText: 'Test alt text',
      },
    }
    
    const { container } = render(<Hero {...propsWithImage} />)
    const section = container.querySelector('section')
    
    expect(section).toHaveStyle({
      backgroundImage: 'url(/test-image.jpg)',
    })
  })

  it('applies correct CSS classes for responsive design', () => {
    const { container } = render(<Hero {...mockProps} />)
    const heading = screen.getByText('Test Heading')
    
    expect(heading).toHaveClass('text-4xl', 'md:text-5xl', 'lg:text-6xl')
  })
})
```

**Example: Utility Function Test**
```typescript
// client/app/lib/utils.test.ts
import { describe, it, expect } from 'vitest'
import { cn, formatDate } from './utils'

describe('cn (className utility)', () => {
  it('merges class names', () => {
    expect(cn('class1', 'class2')).toBe('class1 class2')
  })

  it('handles conditional classes', () => {
    expect(cn('base', false && 'hidden', true && 'visible')).toBe('base visible')
  })

  it('merges Tailwind classes correctly', () => {
    // Should keep 'p-4' and override 'p-2'
    expect(cn('p-2', 'p-4')).toBe('p-4')
  })
})

describe('formatDate', () => {
  it('formats ISO date string', () => {
    expect(formatDate('2024-01-15')).toBe('January 15, 2024')
  })

  it('handles invalid date', () => {
    expect(formatDate('invalid')).toBe('Invalid Date')
  })
})
```

### Integration Testing (API)

**Example: Case Study API Test**
```typescript
// server/tests/integration/case-study.test.ts
import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import request from 'supertest'
import { setupStrapi, cleanupStrapi } from '../helpers/strapi'

describe('Case Study API', () => {
  let strapi: any

  beforeAll(async () => {
    strapi = await setupStrapi()
  })

  afterAll(async () => {
    await cleanupStrapi(strapi)
  })

  describe('GET /api/case-studies', () => {
    it('returns list of case studies', async () => {
      const response = await request(strapi.server.httpServer)
        .get('/api/case-studies')
        .expect(200)

      expect(response.body.data).toBeInstanceOf(Array)
      expect(response.body.data.length).toBeGreaterThan(0)
    })

    it('populates industry relation', async () => {
      const response = await request(strapi.server.httpServer)
        .get('/api/case-studies?populate=industry')
        .expect(200)

      const firstCase = response.body.data[0]
      expect(firstCase.attributes.industry).toBeDefined()
      expect(firstCase.attributes.industry.data.attributes.name).toBeTruthy()
    })

    it('filters by featured flag', async () => {
      const response = await request(strapi.server.httpServer)
        .get('/api/case-studies?filters[featured][$eq]=true')
        .expect(200)

      expect(response.body.data.every((cs: any) => cs.attributes.featured)).toBe(true)
    })
  })

  describe('GET /api/case-studies/:slug', () => {
    it('returns single case study by slug', async () => {
      const response = await request(strapi.server.httpServer)
        .get('/api/case-studies?filters[slug][$eq]=healthcare-analytics')
        .expect(200)

      const caseStudy = response.body.data[0]
      expect(caseStudy.attributes.slug).toBe('healthcare-analytics')
      expect(caseStudy.attributes.title).toBeTruthy()
    })

    it('returns 404 for non-existent slug', async () => {
      const response = await request(strapi.server.httpServer)
        .get('/api/case-studies?filters[slug][$eq]=non-existent')
        .expect(200)

      expect(response.body.data).toHaveLength(0)
    })
  })

  describe('POST /api/case-studies (authenticated)', () => {
    it('creates new case study with valid data', async () => {
      // Login first to get JWT
      const loginResponse = await request(strapi.server.httpServer)
        .post('/api/auth/local')
        .send({
          identifier: 'admin@test.com',
          password: 'admin123',
        })

      const jwt = loginResponse.body.jwt

      // Create case study
      const response = await request(strapi.server.httpServer)
        .post('/api/case-studies')
        .set('Authorization', `Bearer ${jwt}`)
        .send({
          data: {
            title: 'Test Case Study',
            slug: 'test-case-study',
            summary: 'Test summary',
            publishedDate: '2024-01-15',
          },
        })
        .expect(201)

      expect(response.body.data.attributes.title).toBe('Test Case Study')
    })

    it('returns 400 for missing required fields', async () => {
      const loginResponse = await request(strapi.server.httpServer)
        .post('/api/auth/local')
        .send({
          identifier: 'admin@test.com',
          password: 'admin123',
        })

      const jwt = loginResponse.body.jwt

      await request(strapi.server.httpServer)
        .post('/api/case-studies')
        .set('Authorization', `Bearer ${jwt}`)
        .send({
          data: {
            // Missing required 'title' field
            slug: 'test',
          },
        })
        .expect(400)
    })
  })
})
```

### E2E Testing (Playwright)

**Example: Homepage E2E Test**
```typescript
// client/tests/e2e/homepage.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Homepage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('has correct title', async ({ page }) => {
    await expect(page).toHaveTitle(/ADC - Amsterdam Data Collective/)
  })

  test('displays hero section', async ({ page }) => {
    const hero = page.locator('[data-testid="hero"]')
    await expect(hero).toBeVisible()

    const heading = hero.locator('h1')
    await expect(heading).toBeVisible()
    await expect(heading).toContainText(/data-driven solutions/i)
  })

  test('displays industries section', async ({ page }) => {
    const industries = page.locator('[data-testid="industries"]')
    await expect(industries).toBeVisible()

    // Should have at least 3 industry cards
    const industryCards = industries.locator('[data-testid="industry-card"]')
    await expect(industryCards).toHaveCount(3)
  })

  test('displays featured case studies', async ({ page }) => {
    const featuredCases = page.locator('[data-testid="featured-cases"]')
    await expect(featuredCases).toBeVisible()

    // Should have exactly 3 featured case studies
    const caseCards = featuredCases.locator('[data-testid="case-study-card"]')
    await expect(caseCards).toHaveCount(3)

    // Each card should have image, title, summary
    const firstCard = caseCards.first()
    await expect(firstCard.locator('img')).toBeVisible()
    await expect(firstCard.locator('h3')).toBeVisible()
    await expect(firstCard.locator('p')).toBeVisible()
  })

  test('CTA button navigates to case studies', async ({ page }) => {
    const ctaButton = page.locator('[data-testid="hero-cta"]')
    await ctaButton.click()

    await expect(page).toHaveURL('/case-studies')
  })

  test('loads within performance budget', async ({ page }) => {
    const navigationTiming = await page.evaluate(() =>
      JSON.stringify(performance.timing)
    )
    const timing = JSON.parse(navigationTiming)

    const loadTime = timing.loadEventEnd - timing.navigationStart
    expect(loadTime).toBeLessThan(3000) // 3 seconds
  })
})
```

**Example: Case Study Detail Page E2E Test**
```typescript
// client/tests/e2e/case-studies.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Case Study Detail Page', () => {
  test('displays case study content', async ({ page }) => {
    await page.goto('/case-studies/healthcare-analytics')

    // Title
    const title = page.locator('h1')
    await expect(title).toBeVisible()
    await expect(title).toContainText('Healthcare Analytics')

    // Industry tag
    const industry = page.locator('[data-testid="industry-tag"]')
    await expect(industry).toBeVisible()
    await expect(industry).toContainText('Healthcare')

    // Featured image
    const image = page.locator('[data-testid="featured-image"]')
    await expect(image).toBeVisible()

    // Content
    const content = page.locator('[data-testid="content"]')
    await expect(content).toBeVisible()
  })

  test('related case studies are displayed', async ({ page }) => {
    await page.goto('/case-studies/healthcare-analytics')

    const relatedSection = page.locator('[data-testid="related-cases"]')
    await expect(relatedSection).toBeVisible()

    const relatedCards = relatedSection.locator('[data-testid="case-study-card"]')
    await expect(relatedCards).toHaveCount(3)
  })

  test('returns 404 for non-existent case study', async ({ page }) => {
    const response = await page.goto('/case-studies/non-existent-slug')
    expect(response?.status()).toBe(404)

    await expect(page.locator('h1')).toContainText('404')
  })
})
```

### Accessibility Testing

**Example: Automated Accessibility Test**
```typescript
// client/tests/accessibility/a11y.spec.ts
import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

test.describe('Accessibility Tests', () => {
  test('homepage has no accessibility violations', async ({ page }) => {
    await page.goto('/')

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze()

    expect(accessibilityScanResults.violations).toEqual([])
  })

  test('case studies page has no accessibility violations', async ({ page }) => {
    await page.goto('/case-studies')

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze()

    expect(accessibilityScanResults.violations).toEqual([])
  })

  test('all interactive elements are keyboard accessible', async ({ page }) => {
    await page.goto('/')

    // Tab through all interactive elements
    const interactiveElements = await page.locator('a, button, input, select, textarea').all()

    for (const element of interactiveElements) {
      await element.focus()
      const isFocused = await element.evaluate((el) => el === document.activeElement)
      expect(isFocused).toBe(true)
    }
  })

  test('images have alt text', async ({ page }) => {
    await page.goto('/')

    const images = await page.locator('img').all()

    for (const image of images) {
      const alt = await image.getAttribute('alt')
      expect(alt).toBeTruthy()
    }
  })

  test('headings follow semantic hierarchy', async ({ page }) => {
    await page.goto('/')

    const headings = await page.locator('h1, h2, h3, h4, h5, h6').allTextContents()

    // Should have exactly one h1
    const h1Count = await page.locator('h1').count()
    expect(h1Count).toBe(1)

    // Should not skip heading levels (e.g., h1 → h3)
    // This is a simplified check; a full test would verify proper nesting
  })

  test('form inputs have labels', async ({ page }) => {
    await page.goto('/contact')

    const inputs = await page.locator('input, select, textarea').all()

    for (const input of inputs) {
      const id = await input.getAttribute('id')
      const label = page.locator(`label[for="${id}"]`)
      await expect(label).toBeVisible()
    }
  })
})
```

### Visual Regression Testing

**Example: Visual Regression Test**
```typescript
// client/tests/e2e/visual-regression.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Visual Regression Tests', () => {
  test('homepage matches snapshot', async ({ page }) => {
    await page.goto('/')

    // Wait for all images to load
    await page.waitForLoadState('networkidle')

    await expect(page).toHaveScreenshot('homepage.png', {
      fullPage: true,
      threshold: 0.05, // 5% difference allowed
    })
  })

  test('hero section matches snapshot', async ({ page }) => {
    await page.goto('/')

    const hero = page.locator('[data-testid="hero"]')
    await expect(hero).toHaveScreenshot('hero.png', {
      threshold: 0.01,
    })
  })

  test('case study card matches snapshot', async ({ page }) => {
    await page.goto('/')

    const firstCard = page.locator('[data-testid="case-study-card"]').first()
    await expect(firstCard).toHaveScreenshot('case-study-card.png')
  })
})
```

---

## Test Configuration

### Vitest Configuration
```typescript
// client/vitest.config.ts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    coverage: {
      provider: 'c8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'tests/',
        '**/*.config.ts',
        '**/*.d.ts',
      ],
      lines: 80,
      functions: 80,
      branches: 80,
      statements: 80,
    },
  },
  resolve: {
    alias: {
      '~': path.resolve(__dirname, './app'),
    },
  },
})
```

```typescript
// client/tests/setup.ts
import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'

// Cleanup after each test
afterEach(() => {
  cleanup()
})
```

### Playwright Configuration
```typescript
// client/playwright.config.ts
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:5174',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
  ],
  webServer: {
    command: 'yarn dev',
    url: 'http://localhost:5174',
    reuseExistingServer: !process.env.CI,
  },
})
```

---

## Test Data Management

### Mock Data (Fixtures)
```typescript
// client/tests/fixtures/mock-data.ts
export const mockCaseStudy = {
  title: 'Healthcare Analytics Platform',
  slug: 'healthcare-analytics',
  summary: 'Built a real-time analytics dashboard for healthcare providers',
  content: '...',
  industry: {
    name: 'Healthcare',
    slug: 'healthcare',
  },
  featuredImage: {
    url: '/test-image.jpg',
    alternativeText: 'Test image',
  },
  publishedDate: '2024-01-15',
  featured: true,
  seo: {
    metaTitle: 'Healthcare Analytics Platform - ADC',
    metaDescription: 'Real-time analytics for healthcare providers',
  },
}

export const mockIndustries = [
  { name: 'Healthcare', slug: 'healthcare', icon: { url: '/icons/healthcare.svg' } },
  { name: 'Finance', slug: 'finance', icon: { url: '/icons/finance.svg' } },
  { name: 'Retail', slug: 'retail', icon: { url: '/icons/retail.svg' } },
]
```

### Test Database Seeding
```typescript
// server/tests/helpers/strapi.ts
import Strapi from '@strapi/strapi'
import fs from 'fs'

export async function setupStrapi() {
  const strapi = await Strapi().load()

  // Seed test database
  await seedTestData(strapi)

  return strapi
}

export async function cleanupStrapi(strapi: any) {
  // Clear database
  await strapi.db.query('api::case-study.case-study').deleteMany({})
  await strapi.db.query('api::industry.industry').deleteMany({})

  await strapi.destroy()
}

async function seedTestData(strapi: any) {
  // Create test industries
  const healthcare = await strapi.entityService.create('api::industry.industry', {
    data: { name: 'Healthcare', slug: 'healthcare' },
  })

  // Create test case studies
  await strapi.entityService.create('api::case-study.case-study', {
    data: {
      title: 'Healthcare Analytics',
      slug: 'healthcare-analytics',
      summary: 'Test summary',
      industry: healthcare.id,
      publishedAt: new Date(),
    },
  })
}
```

---

## CI/CD Integration

### GitHub Actions Test Workflow
```yaml
# .github/workflows/test.yml (excerpt)
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
    
    - name: Install dependencies
      working-directory: client
      run: yarn install --frozen-lockfile
    
    - name: Run unit tests
      working-directory: client
      run: yarn test --coverage
    
    - name: Upload coverage report
      uses: codecov/codecov-action@v3
      with:
        files: ./client/coverage/coverage-final.json
    
    - name: Install Playwright browsers
      working-directory: client
      run: npx playwright install --with-deps
    
    - name: Run E2E tests
      working-directory: client
      run: yarn test:e2e
    
    - name: Upload Playwright report
      if: always()
      uses: actions/upload-artifact@v3
      with:
        name: playwright-report
        path: client/playwright-report/
```

---

## Collaboration Points

### With Frontend Specialist
- **Input**: Component implementations, UI interactions
- **Output**: Component tests, E2E test scenarios
- **Sync**: Daily during feature development

### With Backend Specialist
- **Input**: API endpoints, data structures
- **Output**: API integration tests, data validation tests
- **Sync**: Daily during API development

### With Lead Architect
- **Input**: Test strategy, quality requirements
- **Output**: Test coverage reports, quality metrics
- **Sync**: Weekly test planning

---

## Key Deliverables

### 1. Test Suite
**Folders**: `client/tests/`, `server/tests/`
- Unit tests (components, utilities)
- Integration tests (API endpoints)
- E2E tests (user flows)
- Accessibility tests (WCAG compliance)

### 2. Test Reports
- Code coverage report (≥ 80%)
- E2E test results (Playwright HTML report)
- Accessibility audit (axe-core violations)

### 3. Test Documentation
**File**: `docs/TESTING.md`
- Test strategy overview
- How to run tests locally
- How to write new tests
- CI/CD integration guide

---

## Success Metrics

### Code Coverage
- **Unit tests**: ≥ 80% coverage
- **Critical paths**: 100% coverage
- **Branches**: ≥ 75% coverage

### Test Quality
- **Flakiness**: ≤ 2% (tests fail inconsistently)
- **E2E test execution time**: ≤ 5 minutes
- **Test failure detection time**: ≤ 10 minutes (in CI)

### Accessibility
- **WCAG 2.1 AA**: Zero violations
- **Keyboard navigation**: 100% functional
- **Screen reader compatibility**: All content accessible

---

**Status**: Active  
**Last Updated**: 2025-11-18  
**Contact**: Testing Specialist Agent
