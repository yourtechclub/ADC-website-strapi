import { Outlet, useLoaderData } from 'react-router';
import type { Route } from './+types/_layout';
import { Navigation } from '~/components/layout/Navigation';
import { PreviewBanner } from '~/components/PreviewBanner';
import type { MenuItem } from '~/types/navigation';

const STRAPI_URL = process.env.STRAPI_URL || 'http://localhost:1337';

/**
 * Layout route loader - Fetches global data including header navigation from Strapi
 * 
 * This data is shared across all nested routes under this layout
 */
export async function loader() {
  try {
    const response = await fetch(`${STRAPI_URL}/api/global?populate=deep`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch global data: ${response.status} ${response.statusText}`);
    }
    
    const { data } = await response.json();
    
    // Strapi 5 Document API: data is at top level, not in data.attributes
    const navItems = data?.header?.navItems || [];
    const logoData = data?.header?.logo || {};
    
    console.log('[_layout loader] Found', navItems.length, 'navigation items');
    
    // Map shared.link component to MenuItem format
    const menuItems: MenuItem[] = navItems.map((item: any, index: number) => ({
      id: item.id,
      label: item.label,
      url: item.href,
      order: (index + 1) * 10,
      isExternal: item.isExternal || false
    }));
    
    // Extract logo information
    const logo = {
      label: logoData.label || 'ADC',
      href: logoData.href || '/',
      imageUrl: logoData.image?.url ? `${STRAPI_URL}${logoData.image.url}` : null,
      altText: logoData.image?.alternativeText || logoData.label || 'Logo'
    };
    
    return { 
      menuItems,
      logo,
      strapiUrl: STRAPI_URL 
    };
  } catch (error) {
    console.error('Global data loader error:', error);
    
    // Fallback: Return empty menu items array
    return {
      menuItems: [],
      logo: {
        label: 'ADC',
        href: '/',
        imageUrl: null,
        altText: 'ADC'
      },
      strapiUrl: STRAPI_URL
    };
  }
}

/**
 * Root Layout Component
 * 
 * Provides global navigation and structure for all pages
 */
export default function Layout({ loaderData }: Route.ComponentProps) {
  const { menuItems, logo } = loaderData;
  
  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <PreviewBanner />
      <Navigation menuItems={menuItems} logo={logo} variant="default" />
      <main>
        <Outlet />
      </main>
    </div>
  );
}
