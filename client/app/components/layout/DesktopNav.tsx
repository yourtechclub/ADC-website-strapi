import { Link } from 'react-router';
import type { MenuItem, Logo, NavigationVariant } from '~/types/navigation';

interface DesktopNavProps {
  menuItems: MenuItem[];
  logo: Logo;
  variant: NavigationVariant;
}

/**
 * Desktop navigation component (≥768px breakpoint)
 * 
 * Features:
 * - Horizontal layout with logo left, menu right
 * - 3 color variants: default (white bg), dark (black bg), transparent
 * - Typography: 20px Ease Display, 28px line height
 * - Spacing: 42px gap between items, 32px horizontal padding, 20px vertical padding
 */
export function DesktopNav({ menuItems, logo, variant }: DesktopNavProps) {
  // Variant-based background colors
  const bgClass: Record<NavigationVariant, string> = {
    default: 'bg-white',
    dark: 'bg-black',
    transparent: 'bg-transparent'
  };
  
  // Variant-based text colors
  const textClass: Record<NavigationVariant, string> = {
    default: 'text-black',
    dark: 'text-white',
    transparent: 'text-white'
  };
  
  return (
    <nav 
      className={`hidden md:block ${bgClass[variant]} px-8 py-5`}
      aria-label="Main navigation"
    >
      <div className="flex items-center justify-between">
        {/* Logo - Left aligned */}
        <Link 
          to={logo.href}
          className={`flex-shrink-0 font-display text-2xl font-bold ${textClass[variant]} hover:opacity-70 transition-opacity duration-200`}
        >
          {logo.imageUrl ? (
            <img 
              src={logo.imageUrl} 
              alt={logo.altText} 
              className="h-8 w-auto"
            />
          ) : (
            logo.label
          )}
        </Link>
        
        {/* Menu Items - Right aligned */}
        <ul className="flex items-center gap-[2.625rem]">
          {menuItems.map((item) => (
            <li key={item.id}>
              {item.isExternal ? (
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`
                    font-display text-xl leading-7 font-normal
                    ${textClass[variant]}
                    hover:opacity-70 
                    transition-opacity duration-200
                    focus-visible:outline-none 
                    focus-visible:ring-2 
                    focus-visible:ring-offset-2
                    focus-visible:ring-zinc-400
                  `}
                >
                  {item.label}
                </a>
              ) : (
                <Link
                  to={item.url}
                  className={`
                    font-display text-xl leading-7 font-normal
                    ${textClass[variant]}
                    hover:opacity-70 
                    transition-opacity duration-200
                    focus-visible:outline-none 
                    focus-visible:ring-2 
                    focus-visible:ring-offset-2
                    focus-visible:ring-zinc-400
                  `}
                >
                  {item.label}
                </Link>
              )}
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
