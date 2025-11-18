# ADC Website Constitution

**Project**: ADC (Amsterdam Data Collective) Website Redesign  
**Client**: ADC - Data & AI Consultancy  
**Agency**: Your Tech Club (YTC)  
**Design Partner**: Clever°Franke (CF)

---

## Core Principles

### I. Design Philosophy (NON-NEGOTIABLE)
**Consistency First**: Every component, page, and interaction must feel cohesive across the entire platform.

**Clarity Over Complexity**: Communicate ADC's expertise without unnecessary jargon. Simple explanations for complex topics.

**Confident & Calm**: Mature, modern visual language portraying ADC as a trusted data leader.

**Mobile-First Always**: Every layout must be validated for mobile before desktop. Generous whitespace is mandatory (explicit client request).

### II. Technical Foundation (NON-NEGOTIABLE)
**Stack**: React Router 7 + Strapi 5 (headless CMS)  
**Database**: SQLite (development), PostgreSQL (production)  
**UI**: Radix UI + shadcn/ui + custom ADC components  
**Styling**: Tailwind CSS 4 with ADC design tokens  
**Hosting**: Digital Ocean App Platform

**Architecture Pattern**:
```
Separated Architecture
├── Backend (Strapi): /server
│   ├── Admin Panel: http://localhost:1337/admin
│   ├── API: http://localhost:1337/api
│   ├── Collections: Pages, Industries, Cases, Insights, News, Events
│   └── Database: SQLite (dev), PostgreSQL (prod)
├── Frontend (React Router 7): /client
│   ├── Routes: app/routes/
│   ├── Components: app/components/
│   ├── Strapi Client: @strapi/client
│   └── SSR Support: React Router serve
└── Deployment: Concurrent processes via yarn dev
```

**❌ NOT WordPress/PayloadCMS**: This project uses Strapi 5 + React Router 7, NOT WordPress or PayloadCMS.

### III. Brand Identity (NON-NEGOTIABLE)
**Typography**:
- Titles: `Ease Display Regular`
- Body: `Ease SemiDisplay Regular`
- Bold: `Ease SemiDisplay SemiBold`

**Visual Elements**:
- Color: Subtle, data-driven tones from CF design guide
- Imagery: Real ADC photography + abstract data visuals
- Layout: Editorial feel with strong hierarchy
- Icons: Simple, line-based, clear

**Assets**: CF Figma guidelines, ADC Brand Guidelines 3.pdf, fonts, photography

### IV. Performance & Accessibility (NON-NEGOTIABLE)
**Core Web Vitals**:
- LCP ≤ 2.5s
- CLS ≤ 0.1
- FID ≤ 100ms

**Accessibility**: WCAG 2.1 AA compliance minimum (keyboard nav, screen readers, color contrast)

**SEO**: Schema markup, meta templates, XML sitemap, 301 redirects, Google Search Console monitoring

### V. Phased Delivery (NON-NEGOTIABLE)
**Phase 1 (R1)** - Dec 18, 2025: Homepage, Industries, Cases, Insights, Careers, About, Contact

**Phase 2 (R2)** - Jan 2026: News & Events, content templates, advanced features

Design first → Build second. No development on unapproved designs.

## Content Architecture

### Collections (Strapi CMS)
- **Pages**: Static pages (Homepage, About, Careers, Contact)
- **Industries**: Vertical expertise showcase with related content
- **Cases**: Success stories with measurable outcomes + dual CTAs
- **Insights**: Unified hub (blogs, reports, press, events, awards)
- **News**: Press releases & company news
- **Events**: Webinars, conferences, meetups
- **Categories**: Taxonomy for filtering

### Content Types (Strapi)
**Single Types**: Global, Landing Page, Page Config
**Collection Types**: Article, Author, Tag, Page
**Components**: Reusable content blocks (Hero, Banner, Feature sections)

### Information Architecture Changes
**Remove/Hide**:
- ❌ Services (being redefined)
- ❌ Data Maturity Assessment
- ❌ "Schedule a free consult" language

**Rename**: "News" → "Insights" (unified knowledge hub)

**Add**: "News & Events" as separate section (Phase 2)

**Navigation**: Industries, Cases, Insights, Careers, About Us, Contact

## Component Library (Block System)

All components follow React Router 7 + Strapi best practices:

**Core Components**: Hero, TextMedia, CardGrid, IndustryCarousel, TestimonialSlider, StatCounter, CtaBanner, InsightFilterBar, FormBlock, Breadcrumbs, RelatedContent, CaseCta

**Development Rules**:
1. Fetch data from Strapi API using `@strapi/client`
2. Use React Router loaders for SSR data fetching
3. Apply semantic HTML with ARIA attributes
4. Use Tailwind CSS with ADC design tokens
5. Components in `client/app/components/`
6. Types generated from Strapi schemas
7. Server-side rendering via React Router
8. Client-side hydration for interactivity

## Integration Requirements

### HubSpot (Marketing Automation)
- Forms: Contact, Newsletter, Downloads, Careers
- Hidden fields: UTM parameters, source tracking
- Workflows: Maintain existing CRM automation
- Implementation: Custom server action integration

### Google Analytics 4
**Custom Events**: `cta_click`, `form_submit`, `insight_filter`, `navigation_click`, `scroll_depth`

### Google Search Console
- Monitor indexing post-launch
- Track keyword rankings
- Verify redirect coverage

## Quality Assurance

### Pre-Launch Checklist (Required)
- [ ] Functional testing (all links, forms, CTAs)
- [ ] Responsive testing (mobile, tablet, desktop)
- [ ] Browser testing (Chrome, Firefox, Safari, Edge)
- [ ] WCAG 2.1 AA compliance
- [ ] Core Web Vitals targets met
- [ ] SEO audit (meta, schema, canonicals, redirects)
- [ ] HubSpot forms tested
- [ ] GA4 events validated
- [ ] Security scan (SSL, GDPR)
- [ ] Sabrina (ADC) final approval

### Post-Launch Monitoring (2 weeks)
- Google Search Console: indexing, coverage
- GA4: event tracking, traffic patterns
- HubSpot: form submissions syncing
- Performance: Core Web Vitals in real traffic
- Error logs: 404s, 500s, console errors

## Team Roles

### YTC (Full Ownership)
- **Lead Architect**: PO interface, technical decisions, epic breakdown
- **Design System Specialist**: CF token integration, component library
- **Figma Specialist**: Pixel-perfect Figma → code
- **Backend Specialist**: HubSpot integration, server actions
- **Database Specialist**: PayloadCMS collections, schema design
- **Payload Specialist**: Admin UX, hooks, access control
- **DevOps Specialist**: Digital Ocean deploy, CI/CD
- **Testing Specialist**: E2E tests, accessibility, performance

### ADC (Client)
- **Sabrina (Marketing)**: Primary contact, final approvals, content review

## Communication Protocols

**Meeting Cadence**: Bi-weekly progress calls (YTC + Sabrina)

**Feedback Channels**:
- Design: Figma comments
- Development: GitHub Issues
- Content: Google Docs/Notion
- Urgent: Slack/Email

**Approval Gates**:
1. Design Approval: Sabrina signs off on Figma before dev
2. CF Brand Check: Optional visual consistency review
3. Staging Approval: Sabrina UAT (Dec 16)
4. Go-Live Approval: Final sign-off (Dec 17)

## Success Metrics

**Business Goals**:
- Reflect new ADC brand identity
- Improve credibility through case studies
- Increase organic traffic (SEO)
- Maintain/improve conversion rates
- Empower ADC team with scalable CMS

**Measurable KPIs**:
- SEO: Maintain/improve keyword rankings
- Performance: Core Web Vitals in "Good" range
- Conversion: Form submission rate ≥ baseline
- Engagement: Session duration, pages per session
- Accessibility: Zero critical WCAG violations

## Constraints

### Must Have (Critical)
- ✅ React Router 7 + Strapi 5 (NO WordPress/PayloadCMS)
- ✅ CF visual identity as foundation
- ✅ Mobile-first responsive
- ✅ Generous whitespace
- ✅ HubSpot integration maintained
- ✅ SEO preserved via redirects
- ✅ WCAG 2.1 AA
- ✅ Phased launch (R1 Dec 18, R2 Jan 2026)

### Should Have (Important)
- Core Web Vitals targets
- GA4 custom events
- Dual CTAs on case pages
- Image-led Insight filters
- Industry carousel + testimonials

### Won't Have (Out of Scope)
- ❌ E-commerce
- ❌ User authentication (public site only)
- ❌ Multi-language (English only for now)
- ❌ Blog commenting
- ❌ Live chat

## Governance

This constitution supersedes all other practices. All decisions, designs, and implementations must align with these principles.

**Amendments**: Require documentation, approval from Lead Architect + Sabrina, and migration plan.

**Compliance**: All PRs and reviews must verify alignment with constitution. Complexity must be justified.

**Guidance**: Refer to `.github/copilot-instructions.md` for runtime development patterns.

---

**Version**: 1.0  
**Ratified**: November 12, 2025  
**Last Amended**: November 12, 2025  
**Status**: Active  
**Next Step**: Create first specification with `/speckit.specify`
