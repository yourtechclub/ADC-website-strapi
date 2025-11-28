import { Link } from "react-router";

interface Stat {
  id: number;
  number: string;
  label: string;
}

interface StatsProps {
  heading: string;
  text?: string;
  buttonText?: string;
  buttonLink?: string;
  stats?: Stat[];
}

export function Stats({
  heading,
  text,
  buttonText,
  buttonLink,
  stats = [],
}: StatsProps) {
  return (
    <section className="relative w-full overflow-hidden bg-white">
      {/* Decorative Background - Desktop only */}
      <div className="pointer-events-none absolute -right-32 top-0 hidden h-full w-full md:block">
        <svg
          viewBox="0 0 1733 740"
          fill="none"
          className="absolute left-1/4 top-0 h-full w-auto opacity-20"
        >
          <path
            d="M10.61 739.054C10.61 739.054 299 -0.38 1732.647 -0.38"
            stroke="#FF9BFC"
            strokeWidth="20"
          />
        </svg>
      </div>

      <div className="relative mx-auto max-w-screen-2xl">
        <div className="flex flex-col gap-6">
          {/* Header */}
          <div className="flex flex-col gap-6">
            <h2 className="font-display text-[48px] leading-none text-black md:max-w-[580px] md:text-[56px]">
              {heading}
            </h2>
            {text && (
              <p className="font-semidisplay text-xl leading-6 text-black md:max-w-[534px]">
                {text}
              </p>
            )}
          </div>

          {/* Stats Grid */}
          {stats && stats.length > 0 && (
            <div className="flex flex-col gap-8 py-6 md:grid md:grid-cols-3 md:gap-28 md:py-0">
              {stats.map((stat, index) => (
                <div
                  key={stat.id}
                  className="flex flex-col gap-3 border-t border-zinc-200 pt-4 md:gap-4 md:border-t-0 md:pb-8 md:pt-6"
                >
                  <p className="font-display text-[72px] leading-none tracking-tight text-black md:text-[128px] md:tracking-[-0.04em]">
                    {stat.number}
                  </p>
                  <p className="font-display text-xl leading-none text-black md:text-2xl">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* CTA Button */}
          {buttonText && buttonLink && (
            <Link
              to={buttonLink}
              className="inline-flex w-fit items-center justify-center rounded-full bg-zinc-100 px-[14px] py-2 font-semidisplay text-base font-medium text-zinc-900 transition-colors hover:bg-zinc-200"
            >
              {buttonText}
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
