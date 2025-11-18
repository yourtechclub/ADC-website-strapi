# Implementation Plan: ADC Homepage

**Feature ID**: `homepage-r1`  
**Spec Reference**: `.specify/memory/spec-homepage.md`  
**Created**: 2025-11-18  
**Planner**: Lead Architect Agent

---

## Technical Context

### Stack
- **Frontend**: React Router 7 (v7.7.1) with SSR
- **Backend**: Strapi 5 (v5.20.0) headless CMS
- **UI Library**: shadcn/ui + Tailwind CSS 4
- **Database**: SQLite (dev), PostgreSQL (prod)
- **Deployment**: Digital Ocean App Platform

### Dependencies
```json
{
  "frontend": {
    "@strapi/client": "^5.20.0",
    "react-router": "^7.7.1", 
    "shadcn/ui": "latest",
    "embla-carousel-react": "^8.0.0",
    "lucide-react": "^0.263.1"
  },
  "backend": {
    "@strapi/strapi": "^5.20.0",
    "@strapi/plugin-users-permissions": "^5.20.0"
  }
}
```

### Project Structure
```
strapi-react-router-7-starter/
├── client/                          # React Router 7 frontend
│   ├── app/
│   │   ├── routes/
│   │   │   └── _index.tsx          # Homepage route (NEW)
│   │   ├── components/
│   │   │   ├── blocks/             # Homepage block components (NEW)
│   │   │   │   ├── Hero.tsx
│   │   │   │   ├── IndustryCarousel.tsx
│   │   │   │   ├── CaseGrid.tsx
│   │   │   │   ├── InsightGrid.tsx
│   │   │   │   └── CtaBanner.tsx
│   │   │   └── ui/                 # shadcn components (EXISTS)
│   │   ├── lib/
│   │   │   └── strapi.ts           # Strapi API client (UPDATE)
│   │   └── app.css                 # ADC design tokens (EXISTS)
│   └── public/fonts/               # Ease Display/SemiDisplay (NEW)
├── server/                          # Strapi backend
│   └── src/api/
│       ├── industry/                # Industry collection (NEW)
│       │   └── content-types/industry/
│       │       └── schema.json
│       ├── case-study/              # Case collection (NEW)
│       │   └── content-types/case-study/
│       │       └── schema.json
│       └── landing-page/            # Landing page single type (UPDATE)
│           └── content-types/landing-page/
│               └── schema.json
└── .specify/
    ├── memory/
    │   ├── spec-homepage.md         # Feature spec (EXISTS)
    │   ├── plan-homepage.md         # This file (NEW)
    │   ├── tasks-homepage.md        # Tasks breakdown (GENERATE)
    │   └── data-model-homepage.md   # Data model (GENERATE)
    └── contracts/
        └── homepage-api.yaml        # API contracts (GENERATE)
```

---

## Constitution Check

### Alignment Review
✅ **Mobile-first**: Spec requires mobile breakpoints starting at 320px  
✅ **Generous whitespace**: 48px mobile, 80px desktop padding specified  
✅ **Accessibility**: WCAG 2.1 AA compliance in NFR-2  
✅ **Performance**: Core Web Vitals targets defined (LCP ≤2.5s)  
✅ **Brand consistency**: Ease Display/SemiDisplay fonts from CF guidelines  
✅ **Content management**: All sections editable in Strapi CMS  

### Gates
- **Gate 1**: Design tokens configured ✅ (completed in Task 2)
- **Gate 2**: shadcn/ui components installed ✅ (completed in Task 1)
- **Gate 3**: Strapi content types exist ⏳ (pending)
- **Gate 4**: Components match Figma designs ⏳ (pending)
- **Gate 5**: Accessibility audit passes ⏳ (pending)

---

## Phase 0: Research & Decisions

### Research Topics

#### 1. Carousel Library Selection
**Decision**: Use embla-carousel-react  
**Rationale**:
- Lightweight (13KB gzipped)
- Native feel on touch devices
- Accessible keyboard navigation built-in
- Works well with React and SSR
**Alternatives**: Swiper (too heavy), react-slick (outdated)

#### 2. Image Optimization Strategy
**Decision**: WebP format with lazy loading  
**Rationale**:
- 97% browser support (caniuse.com)
- 25-35% smaller than PNG/JPEG
- Strapi can auto-generate WebP on upload
- AVIF deferred to Phase 2 (lower priority)
**Alternatives**: AVIF (92% support, complex setup)

#### 3. Data Fetching Pattern
**Decision**: React Router loaders with Strapi Client  
**Rationale**:
- SSR-friendly (data fetched server-side)
- Automatic error boundaries
- Type-safe with TypeScript
- Follows React Router 7 best practices
**Alternatives**: useEffect client-side (poor SEO, slower LCP)

#### 4. Component State Management
**Decision**: Server-fetched props + local UI state  
**Rationale**:
- No global state needed (single page)
- Carousel state managed locally
- Content from Strapi is read-only
**Alternatives**: Zustand/Redux (overkill for homepage)

---

## Phase 1: Data Model

See `.specify/memory/data-model-homepage.md` for complete entity definitions.

**Summary**:
- **Landing Page** (Single Type): Hero, sections configuration
- **Industry** (Collection): Name, slug, icon, description
- **Case Study** (Collection): Title, slug, summary, featured flag, image, industry relation
- **Article** (Collection): Title, slug, excerpt, thumbnail, author, publish date (Phase 2)

---

## Phase 1: API Contracts

See `.specify/contracts/homepage-api.yaml` for OpenAPI specification.

**Key Endpoints**:
- `GET /api/landing-page?populate=deep` - Fetch homepage data with relations
- `GET /api/industries?populate=*` - Fetch all industries
- `GET /api/case-studies?filters[featured][$eq]=true&populate=*` - Fetch featured cases

---

## Phase 1: Quickstart Scenarios

See `.specify/memory/quickstart-homepage.md` for test scenarios.

**Core Scenarios**:
1. Homepage loads with all sections visible
2. Industry carousel navigates correctly on mobile
3. Case study cards link to detail pages
4. CTA buttons navigate to correct destinations
5. Accessibility: All interactive elements keyboard-navigable

---

## Phase 2: Implementation Strategy

### Build Order (MVP-first approach)

**Sprint 1: Foundation (Days 1-2)**
1. Create Strapi content types (Industry, Case Study, Landing Page)
2. Seed sample content (3 industries, 3 cases)
3. Update Strapi API client utilities

**Sprint 2: Core Components (Days 3-5)**
4. Hero component with background image support
5. Industry section (mobile carousel + desktop grid)
6. Case grid with featured filtering
7. CTA banner

**Sprint 3: Integration & Polish (Days 6-7)**
8. Homepage route with loader integration
9. Error boundaries and loading states
10. Responsive layout testing
11. Performance optimization (lazy loading, code splitting)

**Sprint 4: Quality Assurance (Day 8)**
12. E2E tests with Playwright
13. Accessibility audit with axe-core
14. Cross-browser testing
15. Lighthouse performance audit

### Parallel Work Opportunities

**Can work in parallel**:
- Backend: Create content types → Frontend: Build UI components (with mock data)
- Frontend: Hero component → Frontend: CTA banner (independent)
- Testing: Write E2E tests → Development: Build components

**Must be sequential**:
- Content types MUST exist before loader integration
- UI components MUST exist before route integration
- Route integration MUST complete before E2E tests

---

## Phase 3: Testing Strategy

### Unit Tests
- Component rendering with props
- Empty state handling
- CTA link validation

### Integration Tests
- Loader data fetching
- Error handling (Strapi unreachable)
- Loading states

### E2E Tests (Playwright)
- Homepage loads < 3s
- All CTAs clickable
- Carousel navigation works
- Accessibility scan passes

### Performance Tests
- Lighthouse score ≥ 90
- LCP ≤ 2.5s
- FID ≤ 100ms
- CLS ≤ 0.1

---

## Phase 4: Deployment

### Checklist
- [ ] All tests passing (unit, integration, E2E)
- [ ] Lighthouse score ≥ 90
- [ ] Accessibility audit zero violations
- [ ] Cross-browser tested (Chrome, Firefox, Safari, Edge)
- [ ] Strapi content seeded in production
- [ ] Digital Ocean environment variables configured
- [ ] Sabrina (ADC) UAT approval

---

## Risk Assessment

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Figma designs not finalized | High | Low | Use CF brand guidelines as fallback |
| Font files missing | Medium | Medium | Fallback to system fonts, request from design team |
| Strapi API performance | Medium | Low | Implement caching, optimize queries |
| Carousel library issues | Low | Low | Well-tested library, extensive docs |

---

## Next Steps

1. **Generate tasks.md**: Run `/speckit.tasks` to break plan into actionable tasks
2. **Create GitHub issues**: Run `/speckit.taskstoissues` to create tracking issues
3. **Start implementation**: Begin with Sprint 1 (Strapi content types)

---

**Status**: Plan Complete  
**Ready for**: Task Generation (`/speckit.tasks`)
