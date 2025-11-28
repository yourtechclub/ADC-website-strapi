import { Link } from "react-router";
import { getStrapiMedia } from "~/lib/utils";

interface Case {
  id: number;
  title: string;
  slug: string;
  description: string;
  category: string;
  image: {
    url: string;
    alternativeText?: string;
  };
}

interface FeaturedCasesProps {
  heading?: string;
  text?: string;
  buttonText?: string;
  cases?: Case[];
}

export function FeaturedCases({
  heading = "Featured cases",
  text,
  buttonText = "See all cases",
  cases = [],
}: FeaturedCasesProps) {
  return (
    <section className="w-full bg-white">
      <div className="mx-auto max-w-screen-2xl">
        <div className="flex flex-col gap-12 md:gap-12">
          {/* Header */}
          <div className="flex flex-col gap-6 md:gap-8 md:max-w-[774px]">
            <h2 className="font-display text-[56px] leading-none text-black">
              {heading}
            </h2>
            {text && (
              <p className="font-semidisplay text-xl leading-6 text-black">
                {text}
              </p>
            )}
            <Link
              to="/cases"
              className="inline-flex w-fit items-center justify-center rounded-full bg-zinc-100 px-[14px] py-2 font-semidisplay text-base font-medium text-zinc-900 transition-colors hover:bg-zinc-200"
            >
              {buttonText}
            </Link>
          </div>

          {/* Horizontal Scrolling Cases */}
          {cases && cases.length > 0 && (
            <div className="overflow-x-auto">
              <div className="flex gap-6 pb-4">
                {cases.map((caseItem) => (
                  <Link
                    key={caseItem.id}
                    to={`/cases/${caseItem.slug}`}
                    className="group relative flex h-[400px] w-[320px] flex-col justify-end gap-2 overflow-hidden rounded-lg p-6 md:h-[525px] md:w-[326px]"
                  >
                    {/* Background Image */}
                    <div className="absolute inset-0">
                      <img
                        src={getStrapiMedia(caseItem.image.url)}
                        alt={caseItem.image.alternativeText || caseItem.title}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent from-70% to-black/50" />
                    </div>

                    {/* Content */}
                    <div className="relative z-10 flex flex-col gap-2">
                      <p className="font-display text-lg leading-none text-white md:text-2xl">
                        {caseItem.category}
                      </p>
                      <p className="font-semidisplay text-lg leading-6 text-white md:font-display">
                        {caseItem.title}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
