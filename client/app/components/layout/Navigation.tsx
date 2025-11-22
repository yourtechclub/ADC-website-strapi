import { DesktopNav } from './DesktopNav';
import { MobileNav } from './MobileNav';
import type { NavigationProps } from '~/types/navigation';

export interface NavigationComponentProps extends NavigationProps {
  hideMenuItems?: boolean;
}

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
 * @param hideMenuItems - If true, hides menu items from desktop nav (for hero section)
 */
export function Navigation({ menuItems, logo, variant = 'default', hideMenuItems = false }: NavigationComponentProps) {
  return (
    <>
      <DesktopNav menuItems={menuItems} logo={logo} variant={variant} hideMenuItems={hideMenuItems} />
      <MobileNav menuItems={menuItems} logo={logo} variant={variant} />
    </>
  );
}
