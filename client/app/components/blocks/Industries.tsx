import { Link } from "react-router";
import { getStrapiMedia } from "~/lib/utils";

interface Industry {
  id: number;
  title: string;
  slug: string;
  image: {
    url: string;
    alternativeText?: string;
  };
}

interface IndustriesProps {
  heading?: string;
  text?: string;
  buttonText?: string;
  industries?: Industry[];
}

export function Industries({
  heading = "Industries",
  text,
  buttonText = "See all industries",
  industries = [],
}: IndustriesProps) {
  return (
    <section className="w-full bg-white">
      <div className="mx-auto flex max-w-screen-2xl flex-col items-start gap-14">
        {/* Header Section */}
        <div className="flex w-full flex-col items-start gap-6">
          <h2 className="font-display text-[60px] leading-none text-black md:text-[72px]">
            {heading}
          </h2>
          {text && (
            <p className="font-semidisplay text-xl leading-6 text-black md:max-w-lg">
              {text}
            </p>
          )}
          <Link
            to="/industries"
            className="inline-flex items-center justify-center rounded-full bg-zinc-100 px-6 py-3 font-semidisplay text-base font-medium text-zinc-900 transition-colors hover:bg-zinc-200"
          >
            {buttonText}
          </Link>
        </div>

        {/* Industries Grid */}
        {industries && industries.length > 0 && (
          <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-3">
            {industries.map((industry) => (
              <Link
                key={industry.id}
                to={`/industries/${industry.slug}`}
                className="group relative flex h-[160px] items-end overflow-hidden rounded-lg md:h-[200px]"
              >
                {/* Background Image */}
                <div className="absolute inset-0">
                  <img
                    src={getStrapiMedia(industry.image.url)}
                    alt={industry.image.alternativeText || industry.title}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent from-70% to-black/50" />
                </div>

                {/* Title */}
                <div className="relative z-10 p-6">
                  <h3 className="font-display text-xl text-white md:text-2xl">
                    {industry.title}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
