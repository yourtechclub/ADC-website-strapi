# ADC Design Tokens

This document describes the design tokens used in the ADC website, sourced from Figma.

## Source

The design tokens are exported from Figma using the [Figma Design Tokens plugin](https://github.com/lukasoppermann/design-tokens) and stored in `design-tokens.json`.

## Color System

ADC uses a **dark theme by default** based on Tailwind's Zinc color palette:

### Primary Colors
- **Background**: `zinc-950` (#09090b) - HSL: `240 10% 4%`
- **Foreground**: `white` (#ffffff) - HSL: `0 0% 100%`
- **Primary**: `zinc-50` (#fafafa) - HSL: `0 0% 98%`
- **Secondary**: `zinc-900` (#18181b) - HSL: `240 6% 10%`

### Semantic Colors
- **Muted**: `zinc-500` - For subtle text and backgrounds
- **Accent**: `zinc-900` - For highlights and interactive elements
- **Border**: `zinc-200` (#e4e4e7) - HSL: `240 6% 90%`
- **Destructive**: `red-500` (#ef4444) - For errors and warnings
- **Success**: `green-600` (#16a34a) - For success states

## Typography

### Font Families
- **Display Font**: Ease Display Regular (400) - Used for headings
- **Body Font**: Ease SemiDisplay Regular (400), SemiBold (600) - Used for body text

### Font Files Required
Place these font files in `/public/fonts/`:
- `Ease-Display-Regular.woff2`
- `Ease-SemiDisplay-Regular.woff2`
- `Ease-SemiDisplay-SemiBold.woff2`

## Spacing

### Custom Spacing Values
- **Mobile Padding**: `48px` (3rem) - Generous whitespace on mobile
- **Desktop Padding**: `80px` (5rem) - Extra generous on desktop

### Border Radius
- **Small**: `calc(0.5rem - 4px)`
- **Medium**: `0.5rem` (default)
- **Large**: `calc(0.5rem + 4px)`

## Usage in Components

### Using Colors
```tsx
// Use Tailwind classes with semantic names
<div className="bg-background text-foreground">
<button className="bg-primary text-primary-foreground">
```

### Using Typography
```tsx
// Headings automatically use Ease Display
<h1 className="font-display">
// Body text uses Ease SemiDisplay
<p className="font-body">
```

### Using Spacing
```tsx
// Mobile: 48px, Desktop: 80px padding
<section className="px-[var(--mobile-padding)] lg:px-[var(--desktop-padding)]">
```

## Updating Design Tokens

1. Export tokens from Figma using the Design Tokens plugin
2. Replace `client/design-tokens.json` with the new export
3. Run the conversion script (if needed) to update `app.css`
4. Test the changes across all components

## Notes

- The design uses **Tailwind CSS 4** with `@theme inline` syntax
- All colors are defined in HSL format for better CSS variable compatibility
- The dark theme is the default; `.dark` class uses the same values
- Font files must be served from `/public/fonts/` directory
