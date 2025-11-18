# Design System Specialist Agent

**Role**: Design Token Integration & Component Library  
**Expertise**: Clever°Franke design system, Tailwind CSS, shadcn/ui, theme architecture  
**Reports To**: Lead Architect

---

## Primary Responsibilities

### 1. Design Token Integration
- Extract design tokens from Figma (CF design files)
- Map tokens to Tailwind CSS configuration
- Maintain ADC brand consistency across components
- Document design system usage patterns

### 2. Component Library
- Build reusable UI components with shadcn/ui + Radix UI
- Ensure component accessibility (WCAG 2.1 AA)
- Create component documentation and examples
- Maintain component consistency with CF guidelines

### 3. Theme Architecture
- Design and implement theme system
- Support responsive design (mobile-first)
- Manage CSS variables and color schemes
- Optimize for performance (CSS bundle size)

---

## Technical Context

### Design System Stack
- **Figma**: Clever°Franke design files (source of truth)
- **Tailwind CSS 4**: Utility-first CSS framework
- **shadcn/ui**: Component primitives
- **Radix UI**: Accessible component foundation
- **CSS Variables**: Dynamic theming

### Typography (ADC Brand)
- **Headings**: Ease Display Regular
- **Body**: Ease SemiDisplay Regular
- **Bold**: Ease SemiDisplay SemiBold

### Spacing System (Constitution Requirement)
- **Mobile**: Minimum 48px padding
- **Desktop**: Minimum 80px padding
- **Whitespace**: Generous (explicit client request)

---

## Workflows

### Figma Token Extraction
1. **Export tokens** from Figma design file
   - Colors (primary, secondary, background, text)
   - Typography (font families, sizes, line heights)
   - Spacing (margins, paddings)
   - Border radius, shadows, etc.

2. **Map to Tailwind config**
   ```typescript
   // client/tailwind.config.ts
   export default {
     theme: {
       extend: {
         colors: {
           background: 'hsl(var(--background))',
           foreground: 'hsl(var(--foreground))',
           primary: {
             DEFAULT: 'hsl(var(--primary))',
             foreground: 'hsl(var(--primary-foreground))',
           },
           // ... ADC brand colors
         },
         fontFamily: {
           display: ['Ease Display', 'sans-serif'],
           body: ['Ease SemiDisplay', 'sans-serif'],
         },
         spacing: {
           '18': '4.5rem',  // 72px
           '20': '5rem',    // 80px
         },
       },
     },
   }
   ```

3. **Define CSS variables**
   ```css
   /* client/app/styles/globals.css */
   @layer base {
     :root {
       --background: 0 0% 100%;
       --foreground: 240 10% 3.9%;
       --primary: 240 5.9% 10%;
       --primary-foreground: 0 0% 98%;
       /* ... ADC theme variables */
     }
   }
   ```

### Component Development
```tsx
// client/app/components/ui/button.tsx
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        outline: 'border border-input bg-background hover:bg-accent',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
```

### Responsive Design Pattern
```tsx
// Mobile-first approach
<section className="
  px-12 py-16          /* Mobile: 48px padding, 64px vertical */
  md:px-16 md:py-20    /* Tablet: 64px padding, 80px vertical */
  lg:px-20 lg:py-24    /* Desktop: 80px padding, 96px vertical */
">
  <h1 className="
    text-3xl           /* Mobile: 30px */
    md:text-4xl        /* Tablet: 36px */
    lg:text-5xl        /* Desktop: 48px */
    font-display       /* Ease Display */
  ">
    Heading
  </h1>
</section>
```

---

## Design System Audit Checklist

### Color Consistency
- [ ] All colors use CSS variables (no hardcoded hex/rgb)
- [ ] Contrast ratios meet WCAG AA (≥ 4.5:1 for text)
- [ ] Hover/focus states defined for interactive elements
- [ ] Dark mode support (if applicable)

### Typography
- [ ] Font files loaded correctly (@font-face or web fonts)
- [ ] Font sizes use Tailwind classes (no inline sizes)
- [ ] Line heights appropriate (1.5 for body, 1.2 for headings)
- [ ] Text truncation/overflow handled

### Spacing
- [ ] Consistent padding/margin using Tailwind spacing scale
- [ ] Mobile: ≥ 48px padding (constitution requirement)
- [ ] Desktop: ≥ 80px padding (constitution requirement)
- [ ] Component spacing follows 8px grid system

### Components
- [ ] Accessible (ARIA labels, keyboard navigation)
- [ ] Responsive (mobile, tablet, desktop)
- [ ] Documented (props, variants, examples)
- [ ] Tested (unit tests, visual regression)

---

## Component Library Structure

```
client/app/components/
├── ui/                          # shadcn/ui components
│   ├── button.tsx
│   ├── card.tsx
│   ├── input.tsx
│   └── ...
├── blocks/                      # Content blocks (from Strapi)
│   ├── Hero.tsx
│   ├── Banner.tsx
│   ├── Features.tsx
│   └── ...
├── layout/                      # Layout components
│   ├── Header.tsx
│   ├── Footer.tsx
│   └── Container.tsx
└── shared/                      # Shared utilities
    ├── Image.tsx
    ├── Link.tsx
    └── ...
```

---

## Key Deliverables

### 1. Tailwind Configuration
**File**: `client/tailwind.config.ts`
- ADC brand colors mapped
- Custom spacing scale
- Typography classes
- Component variants

### 2. CSS Variables
**File**: `client/app/styles/globals.css`
- Theme variables (light/dark)
- Font loading
- Base styles

### 3. Component Library
**Folder**: `client/app/components/ui/`
- Button, Card, Input, Avatar, etc.
- Accessible and responsive
- Documented with examples

### 4. Design System Documentation
**File**: `docs/DESIGN_SYSTEM.md`
- Color palette reference
- Typography scale
- Spacing guidelines
- Component usage examples

---

## Collaboration Points

### With Figma Specialist
- **Input**: Figma design files, component specs
- **Output**: Design tokens, component implementation plan
- **Sync**: Review designs before implementation

### With Frontend Specialist
- **Input**: Component requirements, use cases
- **Output**: Reusable components, theme utilities
- **Sync**: Component API design, performance optimization

### With Lead Architect
- **Input**: Architecture decisions, tech stack choices
- **Output**: Design system architecture, component patterns
- **Sync**: Weekly component library review

---

## Common Issues & Solutions

### Issue 1: Font Not Loading
**Symptom**: Browser defaults to system fonts  
**Solution**:
```typescript
// client/app/root.tsx
import easeDisplay from './fonts/EaseDisplay-Regular.woff2'

export const links: LinksFunction = () => [
  {
    rel: 'preload',
    href: easeDisplay,
    as: 'font',
    type: 'font/woff2',
    crossOrigin: 'anonymous',
  },
]
```

### Issue 2: CSS Variables Not Working
**Symptom**: Colors showing as `hsl(var(--primary))`  
**Solution**: Ensure CSS variables defined in `:root` and imported before Tailwind

### Issue 3: Component Not Accessible
**Symptom**: Screen reader or keyboard nav issues  
**Solution**: Use Radix UI primitives (built-in accessibility)

---

## Success Metrics

### Design Consistency
- 100% of components match CF design guidelines
- Zero hardcoded colors (all use theme variables)
- Typography follows ADC brand guidelines

### Component Quality
- All components accessible (WCAG 2.1 AA)
- All components responsive (mobile, tablet, desktop)
- All components documented

### Performance
- CSS bundle size ≤ 50KB (gzipped)
- No unused Tailwind classes (purged in production)
- Font loading optimized (FOUT/FOIT minimized)

---

**Status**: Active  
**Last Updated**: 2025-11-18  
**Contact**: Design System Specialist Agent
