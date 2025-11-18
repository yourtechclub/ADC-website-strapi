# Specification: ADC Homepage

**Feature ID**: `homepage-r1`  
**Priority**: P0 (Critical - Phase 1 Release)  
**Status**: Draft  
**Created**: 2025-11-18  
**Owner**: Lead Architect  

---

## Context & Problem Statement

ADC (Amsterdam Data Collective) needs a new homepage that reflects their repositioned brand identity as designed by Clever°Franke. The current starter template needs to be transformed into a production-ready ADC homepage with:
- Modern, confident visual design matching CF guidelines
- Mobile-first responsive layout with generous whitespace
- Editable content blocks managed in Strapi CMS
- Performance optimization (Core Web Vitals targets)
- Accessibility compliance (WCAG 2.1 AA)

**Business Goal**: Create an impactful first impression that establishes ADC as a trusted data & AI consultancy leader.

---

## Requirements

### Functional Requirements

#### FR-1: Hero Section
**Priority**: P0  
**Description**: Above-the-fold hero introducing ADC's value proposition

**Acceptance Criteria**:
- [ ] Primary heading (H1) with brand positioning statement
- [ ] Supporting subheading/description text
- [ ] Primary CTA button ("Let's Talk" → Contact page)
- [ ] Secondary CTA button ("View Cases" → Cases overview)
- [ ] Hero image or abstract data visualization background
- [ ] Fully editable in Strapi admin (Single Type: `landing-page`)

**Strapi Content Structure**:
```typescript
{
  "hero": {
    "heading": "string (required, max 80 chars)",
    "description": "text (optional, max 200 chars)",
    "primaryCta": {
      "label": "string",
      "url": "string",
      "type": "internal | external"
    },
    "secondaryCta": {
      "label": "string",
      "url": "string"
    },
    "backgroundImage": "media (single, images only)"
  }
}
```

**React Component**:
```tsx
<Hero
  heading={data.hero.heading}
  description={data.hero.description}
  primaryCta={data.hero.primaryCta}
  secondaryCta={data.hero.secondaryCta}
  backgroundImage={data.hero.backgroundImage}
/>
```

**Design Notes**:
- Typography: Ease Display Regular for heading
- Mobile: Full viewport height, centered content
- Desktop: 60% viewport height, left-aligned content with right image
- Whitespace: Minimum 48px padding on mobile, 80px on desktop

---

#### FR-2: Industries Overview Section
**Priority**: P0  
**Description**: Showcase ADC's vertical expertise (Finance, Retail, Energy, Government, etc.)

**Acceptance Criteria**:
- [ ] Section heading ("Industries We Serve")
- [ ] Horizontal carousel/slider on mobile
- [ ] Grid layout on desktop (3 columns)
- [ ] Each industry card shows: icon, title, short description
- [ ] Click leads to dedicated industry page
- [ ] Editable via Strapi relation to `industries` collection

**Strapi Content Structure**:
```typescript
{
  "industriesSection": {
    "heading": "string",
    "description": "text (optional)",
    "industries": "relation (manyToMany to api::industry.industry)"
  }
}

// Industry collection:
{
  "icon": "media (SVG preferred)",
  "title": "string",
  "shortDescription": "text (max 120 chars)",
  "slug": "uid (from title)",
  "detailPage": "richtext (full content)"
}
```

**React Component**:
```tsx
<IndustryCarousel
  heading={data.industriesSection.heading}
  industries={data.industriesSection.industries}
  viewMode="carousel" // mobile
/>

<IndustryGrid
  heading={data.industriesSection.heading}
  industries={data.industriesSection.industries}
  columns={3} // desktop
/>
```

**Design Notes**:
- Cards: White background, subtle shadow on hover
- Icons: 48x48px, ADC brand colors
- Animation: Smooth scroll on carousel, fade-in on grid

---

#### FR-3: Featured Cases Section
**Priority**: P0  
**Description**: Highlight 3 recent success stories with measurable outcomes

**Acceptance Criteria**:
- [ ] Section heading ("Recent Work")
- [ ] Display 3 case study cards
- [ ] Each card: client logo, title, outcome metrics, thumbnail image
- [ ] Dual CTAs: "Read Case Study" + "Get Similar Results"
- [ ] Selectable in Strapi (choose from `cases` collection)

**Strapi Content Structure**:
```typescript
{
  "featuredCases": {
    "heading": "string",
    "cases": "relation (manyToMany to api::case.case, max 3)"
  }
}

// Case collection:
{
  "clientLogo": "media",
  "title": "string",
  "slug": "uid",
  "summary": "text (max 150 chars)",
  "metrics": [
    { "value": "string", "label": "string" } // e.g., "40%", "Cost Reduction"
  ],
  "thumbnailImage": "media",
  "fullContent": "richtext"
}
```

**React Component**:
```tsx
<CaseGrid
  heading={data.featuredCases.heading}
  cases={data.featuredCases.cases}
  columns={3}
  showMetrics={true}
  dualCtas={true}
/>
```

**Design Notes**:
- Cards: Image-first design, 16:9 aspect ratio
- Metrics: Bold numbers with descriptive labels
- CTAs: Primary (ghost style), Secondary (filled style)

---

#### FR-4: Insights Preview Section
**Priority**: P1 (Nice to have for R1)  
**Description**: Show latest 3 blog posts/insights

**Acceptance Criteria**:
- [ ] Section heading ("Latest Insights")
- [ ] Auto-fetch 3 most recent published articles
- [ ] Each card: thumbnail, title, excerpt, author, publish date
- [ ] Link to full article and "View All Insights" button

**Strapi Content Structure**:
```typescript
// Auto-query in loader:
const articles = await strapi.find('articles', {
  sort: 'publishedAt:desc',
  pagination: { limit: 3 },
  populate: ['author', 'image', 'tags']
})
```

**React Component**:
```tsx
<InsightGrid
  heading="Latest Insights"
  articles={articles}
  columns={3}
  showAuthor={true}
  showDate={true}
/>
```

---

#### FR-5: CTA Banner Section
**Priority**: P0  
**Description**: Bottom-of-page conversion banner

**Acceptance Criteria**:
- [ ] Compelling heading ("Ready to Transform Your Data?")
- [ ] Short description
- [ ] Primary CTA ("Schedule a Call")
- [ ] Optional secondary CTA ("Download Our Guide")
- [ ] Background: Gradient or subtle pattern
- [ ] Fully editable in Strapi

**Strapi Content Structure**:
```typescript
{
  "ctaBanner": {
    "heading": "string",
    "description": "text",
    "primaryCta": { "label": "string", "url": "string" },
    "secondaryCta": { "label": "string", "url": "string", "optional": true },
    "backgroundType": "enum: gradient | image | pattern"
  }
}
```

---

### Non-Functional Requirements

#### NFR-1: Performance
- **LCP** ≤ 2.5s (Largest Contentful Paint)
- **FID** ≤ 100ms (First Input Delay)
- **CLS** ≤ 0.1 (Cumulative Layout Shift)
- Image optimization: WebP format, lazy loading below fold
- Code splitting: Separate chunks for carousel/slider libraries

#### NFR-2: Accessibility (WCAG 2.1 AA)
- Semantic HTML: `<header>`, `<section>`, `<article>`, `<footer>`
- ARIA labels for interactive elements
- Keyboard navigation: Tab through all CTAs and links
- Focus indicators: Visible outline on all focusable elements
- Color contrast: ≥ 4.5:1 for text
- Alt text: All images must have descriptive alt text

#### NFR-3: Responsiveness
- **Mobile-first design**: Develop mobile layout first, enhance for desktop
- Breakpoints:
  - Mobile: 320px - 767px
  - Tablet: 768px - 1023px
  - Desktop: 1024px+
- Touch targets: Minimum 44x44px for buttons/links
- Whitespace: Generous padding (48px mobile, 80px desktop)

#### NFR-4: SEO
- Meta title: "ADC - Data & AI Consultancy | Amsterdam Data Collective"
- Meta description: 150-160 characters with target keywords
- Open Graph tags for social sharing
- Structured data: Organization schema
- Canonical URL: https://amsterdamdatacollective.com

---

## Technical Design

### Architecture

```
React Router 7 Route:
└── app/routes/_index.tsx
    ├── Loader: Fetch landing-page data from Strapi
    ├── Meta: SEO tags
    └── Component: Render sections

Strapi Single Type:
└── api::landing-page.landing-page
    ├── hero (component)
    ├── industriesSection (component + relation)
    ├── featuredCases (component + relation)
    ├── insightsPreview (auto-query)
    └── ctaBanner (component)
```

### Data Flow

1. User navigates to `/`
2. React Router loader executes server-side
3. Fetch `GET /api/landing-page?populate=deep`
4. Strapi returns populated data (industries, cases)
5. Render HTML with hydrated React components
6. Client-side: Interactive carousels/sliders hydrate

### Component Tree

```tsx
<Homepage>
  <Hero />
  <IndustryCarousel /> {/* Mobile */}
  <IndustryGrid />     {/* Desktop */}
  <CaseGrid />
  <InsightGrid />      {/* Optional R1 */}
  <CtaBanner />
</Homepage>
```

---

## Dependencies

### Technical Dependencies
- `@strapi/client` - API client
- `react-router` - Routing and loaders
- `shadcn/ui` - UI components (Button, Card)
- `@radix-ui/react-avatar` - Avatar components
- `lucide-react` - Icons
- `embla-carousel-react` - Carousel/slider (if needed)

### Content Dependencies
- **Strapi Collections Required**:
  - `landing-page` (Single Type) - Create first
  - `industry` (Collection Type) - Seed 5-6 industries
  - `case` (Collection Type) - Seed 3 case studies
  - `article` (Collection Type) - Optional for R1

### Design Dependencies
- CF Figma file with homepage design
- ADC brand guidelines PDF
- Font files: Ease Display, Ease SemiDisplay
- Icon set (SVG format)

---

## Testing Strategy

### Unit Tests
- [ ] Hero component renders with props
- [ ] IndustryGrid displays correct number of items
- [ ] CaseGrid handles empty state gracefully
- [ ] CtaBanner links are correct

### Integration Tests
- [ ] Loader fetches data successfully
- [ ] Error handling when Strapi is unreachable
- [ ] Loading states display correctly

### E2E Tests (Playwright)
- [ ] Homepage loads in < 3s
- [ ] All CTAs are clickable
- [ ] Carousel navigation works on mobile
- [ ] Forms submit correctly
- [ ] Accessibility scan passes (axe-core)

### Performance Tests
- [ ] Lighthouse score ≥ 90
- [ ] Core Web Vitals in "Good" range
- [ ] Images optimized (WebP, lazy loading)

---

## Deployment Plan

### Phase 1 (R1 - Dec 18, 2025)
1. **Strapi Setup** (Backend Specialist)
   - Create `landing-page` Single Type
   - Create `industry`, `case` Collection Types
   - Add sample content for demo

2. **Component Development** (Frontend Specialist + Figma Specialist)
   - Build Hero component (match CF design pixel-perfect)
   - Build IndustryCarousel + IndustryGrid
   - Build CaseGrid with dual CTAs
   - Build CtaBanner

3. **Integration** (Lead Architect)
   - Connect React Router loader to Strapi API
   - Implement SSR data fetching
   - Add error boundaries

4. **Testing** (Testing Specialist)
   - Run accessibility audit
   - Performance testing
   - Cross-browser testing

5. **Deployment** (DevOps Specialist)
   - Deploy to Digital Ocean staging
   - UAT with Sabrina (ADC)
   - Production deployment

### Phase 2 (R2 - Jan 2026)
- Add InsightGrid section (auto-query articles)
- Implement advanced animations
- Add multilingual support (if needed)

---

## Success Metrics

### KPIs
- **Performance**: LCP ≤ 2.5s, FID ≤ 100ms, CLS ≤ 0.1
- **Accessibility**: Zero WCAG AA violations
- **Conversion**: Click-through rate on CTAs ≥ baseline
- **Engagement**: Avg session duration ≥ 2 minutes
- **SEO**: Maintain/improve keyword rankings

### Acceptance Criteria (Definition of Done)
- [x] All functional requirements implemented
- [x] All non-functional requirements met
- [x] Unit tests passing (≥ 80% coverage)
- [x] E2E tests passing
- [x] Lighthouse score ≥ 90
- [x] Accessibility audit passed
- [x] Cross-browser tested (Chrome, Firefox, Safari, Edge)
- [x] Sabrina (ADC) approval
- [x] Deployed to production

---

## Open Questions

1. **Carousel Library**: Use Embla Carousel or build custom? (Performance vs maintainability)
2. **Image Format**: WebP with AVIF fallback, or just WebP? (Browser support)
3. **Analytics**: GA4 events for section scrolling/interactions? (Tracking granularity)
4. **Testimonials**: Add client testimonials section? (Not in CF design, but requested?)
5. **Video**: Hero video background option? (Performance impact)

---

## References

- Constitution: `.specify/memory/constitution.md`
- Copilot Instructions: `.github/copilot-instructions.md`
- CF Design File: [Figma link TBD]
- ADC Brand Guidelines: `ADC Brand Guidelines 3.pdf`

---

**Status**: Ready for Planning (`/speckit.plan`)  
**Next Step**: Lead Architect creates technical implementation plan
