import type { TImage, TLink } from "../../types";
import type { MenuItem } from "../../types/navigation";
import { StrapiImage } from "../custom/StrapiImage";
import { Button } from "../ui/button";
import { Link } from "react-router";
import AnimatedSVG from "~/components/custom/AnimatedSVG";

export interface IHero {
  __component: "blocks.hero";
  id: number;
  heading: string;
  subtitle?: string;
  showMenuItemsInHero?: boolean;
  ctaButtons: TLink[];
  backgroundImage?: TImage;
}

interface HeroProps extends IHero {
  menuItems?: MenuItem[];
}

export function Hero(props: HeroProps) {
  const { heading, subtitle, showMenuItemsInHero = true, ctaButtons, backgroundImage, menuItems = [] } = props;

  return (
    <section className="relative bg-white flex flex-col items-end justify-center px-8 py-36 w-full  overflow-hidden">
      {/* SVG Background - positioned exactly as in Figma */}
      <div className="absolute h-[1054px] left-[-282px] top-[-634.38px] w-[1242.852px]">
        <AnimatedSVG />
      </div>

      {/* Content container - 908px wide as in Figma */}
      <div className="relative flex flex-col gap-10 items-start w-full max-w-[908px]">
        {/* Heading - 96px, tracking -2.88px */}
        <h1 className="font-display text-[96px] leading-none tracking-[-2.88px] text-black whitespace-pre-wrap w-full">
          {heading}
        </h1>

        {/* Subtitle (optional) */}
        {subtitle && (
          <p className="text-xl text-black/70 max-w-2xl">{subtitle}</p>
        )}

        {/* Menu items - Desktop only, 749px wide container, 32px gap */}
        {showMenuItemsInHero && menuItems.length > 0 && (
          <nav className="hidden md:flex flex-wrap gap-8 items-start w-full max-w-[749px]" aria-label="Hero navigation">
            {menuItems.map((item) => (
              <div key={item.id} className="flex items-center justify-center py-2 transition-opacity hover:opacity-70">
                {item.isExternal ? (
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-display text-[20px] leading-6 text-black"
                  >
                    {item.label}
                  </a>
                ) : (
                  <Link to={item.url} className="font-display text-[20px] leading-6 text-black">
                    {item.label}
                  </Link>
                )}
              </div>
            ))}
          </nav>
        )}

        {/* CTA Buttons - Mobile only */}
        {ctaButtons.length > 0 && (
          <div className="flex md:hidden flex-col sm:flex-row gap-4">
            {ctaButtons.map((button) => (
              <Button key={button.id} size="lg" className="bg-black text-white hover:bg-black/90 px-10 py-4 rounded-full font-display text-lg" asChild>
                <Link
                  to={button.href}
                  target={button.isExternal ? "_blank" : undefined}
                  rel={button.isExternal ? "noopener noreferrer" : undefined}
                >
                  {button.label}
                </Link>
              </Button>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
