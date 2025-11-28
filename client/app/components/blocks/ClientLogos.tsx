import { getStrapiMedia } from "~/lib/utils";

interface Logo {
  id: number;
  url: string;
  alternativeText?: string;
}

interface ClientLogosProps {
  heading?: string;
  logos?: Logo[];
}

export function ClientLogos({ heading, logos = [] }: ClientLogosProps) {
  if (!logos || logos.length === 0) return null;

  // Duplicate logos for seamless infinite scroll
  const duplicatedLogos = [...logos, ...logos, ...logos];

  return (
    <section className="w-full overflow-hidden bg-white">
      <div className="mx-auto max-w-screen-2xl">
        {heading && (
          <h2 className="mb-10 font-display text-2xl text-black md:mb-14 md:text-3xl">
            {heading}
          </h2>
        )}
        
        {/* Scrolling Container */}
        <div className="relative flex">
          {/* Animated Track */}
          <div className="flex animate-scroll-infinite items-center gap-6 md:gap-20">
            {duplicatedLogos.map((logo, index) => (
              <div
                key={`${logo.id}-${index}`}
                className="flex h-6 shrink-0 items-center md:h-8"
              >
                <img
                  src={getStrapiMedia(logo.url)}
                  alt={logo.alternativeText || "Client logo"}
                  className="h-full w-auto object-contain grayscale transition-all duration-300 hover:grayscale-0"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
