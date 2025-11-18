import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { Menu, X } from 'lucide-react';
import type { MenuItem, Logo, NavigationVariant } from '~/types/navigation';

interface MobileNavProps {
  menuItems: MenuItem[];
  logo: Logo;
  variant: NavigationVariant;
}

/**
 * Mobile navigation component (<768px breakpoint)
 * 
 * Features:
 * - Closed state: 64px header with logo + hamburger icon
 * - Open state: Full-screen overlay with vertical menu
 * - Animation: Slide-down with fade (300ms)
 * - Closes on: X button click, backdrop click, Escape key, link click
 */
export function MobileNav({ menuItems, logo, variant }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  // Close menu on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen]);
  
  // Prevent body scroll when menu open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);
  
  // Variant-based colors
  const bgClass: Record<NavigationVariant, string> = {
    default: 'bg-white',
    dark: 'bg-black',
    transparent: 'bg-transparent'
  };
  
  const textClass: Record<NavigationVariant, string> = {
    default: 'text-black',
    dark: 'text-white',
    transparent: 'text-white'
  };
  
  return (
    <>
      {/* Closed State (Header) */}
      <nav 
        className={`md:hidden ${bgClass[variant]} px-4 h-16 flex items-center justify-between`}
        aria-label="Main navigation"
      >
        {/* Logo */}
        <Link 
          to={logo.href}
          className={`flex-shrink-0 font-display text-xl font-bold ${textClass[variant]} hover:opacity-70 transition-opacity`}
        >
          {logo.imageUrl ? (
            <img 
              src={logo.imageUrl} 
              alt={logo.altText} 
              className="h-7 w-auto"
            />
          ) : (
            logo.label
          )}
        </Link>
        
        {/* Hamburger Button */}
        <button
          onClick={() => setIsOpen(true)}
          aria-label="Open navigation menu"
          aria-expanded={isOpen}
          className={`${textClass[variant]} hover:opacity-70 transition-opacity`}
        >
          <Menu size={24} />
        </button>
      </nav>
      
      {/* Open State (Overlay) */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-50 md:hidden"
          role="dialog"
          aria-modal="true"
        >
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />
          
          {/* Menu Panel */}
          <div 
            className={`
              absolute inset-x-0 top-0 
              ${bgClass[variant]}
              min-h-[658px] 
              px-6 py-6
              animate-slide-down
            `}
          >
            {/* Header (Logo + Close) */}
            <div className="flex items-center justify-between mb-8">
              <Link 
                to={logo.href}
                onClick={() => setIsOpen(false)}
                className={`flex-shrink-0 font-display text-xl font-bold ${textClass[variant]} hover:opacity-70 transition-opacity`}
              >
                {logo.imageUrl ? (
                  <img 
                    src={logo.imageUrl} 
                    alt={logo.altText} 
                    className="h-7 w-auto"
                  />
                ) : (
                  logo.label
                )}
              </Link>
              
              <button
                onClick={() => setIsOpen(false)}
                aria-label="Close navigation menu"
                className={`${textClass[variant]} hover:opacity-70 transition-opacity`}
              >
                <X size={24} />
              </button>
            </div>
            
            {/* Menu Items */}
            <ul className="flex flex-col gap-8">
              {menuItems.map((item) => (
                <li key={item.id}>
                  {item.isExternal ? (
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setIsOpen(false)}
                      className={`
                        font-display text-2xl font-normal
                        ${textClass[variant]}
                        hover:opacity-70 
                        transition-opacity duration-200
                        block
                      `}
                    >
                      {item.label}
                    </a>
                  ) : (
                    <Link
                      to={item.url}
                      onClick={() => setIsOpen(false)}
                      className={`
                        font-display text-2xl font-normal
                        ${textClass[variant]}
                        hover:opacity-70 
                        transition-opacity duration-200
                        block
                      `}
                    >
                      {item.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </>
  );
}
