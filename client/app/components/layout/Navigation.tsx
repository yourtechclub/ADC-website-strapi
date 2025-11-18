import { DesktopNav } from './DesktopNav';
import { MobileNav } from './MobileNav';
import type { NavigationProps } from '~/types/navigation';

/**
 * Main Navigation component
 * 
 * Responsive wrapper that shows:
 * - DesktopNav on screens ≥768px
 * - MobileNav on screens <768px
 * 
 * @param menuItems - Array of navigation menu items from Strapi
 * @param logo - Logo data including label, href, imageUrl, and altText
 * @param variant - Color variant: 'default' (white), 'dark' (black), or 'transparent'
 */
export function Navigation({ menuItems, logo, variant = 'default' }: NavigationProps) {
  return (
    <>
      <DesktopNav menuItems={menuItems} logo={logo} variant={variant} />
      <MobileNav menuItems={menuItems} logo={logo} variant={variant} />
    </>
  );
}
