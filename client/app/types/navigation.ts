/**
 * Navigation type definitions for ADC website
 * 
 * Based on Strapi navigation single type with menu items component
 */

export interface MenuItem {
  id: number;
  label: string;
  url: string;
  order: number;
  isExternal: boolean;
}

export interface Logo {
  label: string;
  href: string;
  imageUrl: string | null;
  altText: string;
}

export interface NavigationData {
  menuItems: MenuItem[];
}

export type NavigationVariant = 'default' | 'dark' | 'transparent';

export interface NavigationProps {
  menuItems: MenuItem[];
  logo: Logo;
  variant?: NavigationVariant;
}

/**
 * Strapi API response format for navigation endpoint
 */
export interface StrapiNavigationResponse {
  data: {
    id: number;
    attributes: {
      menuItems: Array<{
        id: number;
        label: string;
        url: string;
        order: number;
        isExternal: boolean;
      }>;
      createdAt: string;
      updatedAt: string;
      publishedAt: string;
    };
  };
  meta: Record<string, unknown>;
}
