import { useLoaderData } from "react-router";
import type { Route } from "./+types/cases.$slug";
import sdk from "~/lib/sdk";
import { validateApiResponse } from "~/lib/utils";
import { BlockRenderer } from "~/components/blocks/BlockRenderer";

export async function loader({ params }: Route.LoaderArgs) {
  const { slug } = params;
  const data = await sdk.fetch(`/cases/${slug}`);
  const caseData = validateApiResponse(data, "case");
  return { caseData };
}

export default function CaseDetail({ loaderData }: Route.ComponentProps) {
  const { caseData } = loaderData;

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative">
        <div className="mx-auto max-w-screen-2xl">
          <div className="flex flex-col gap-6">
            <p className="font-semidisplay text-sm uppercase tracking-wide text-zinc-600">
              {caseData.category}
            </p>
            <h1 className="font-display text-[48px] leading-none text-black md:text-[72px]">
              {caseData.title}
            </h1>
            <p className="font-semidisplay text-xl leading-6 text-black md:max-w-2xl">
              {caseData.description}
            </p>
          </div>
        </div>
      </section>

      {/* Content Blocks */}
      {caseData.content && caseData.content.length > 0 && (
        <BlockRenderer blocks={caseData.content} />
      )}
    </div>
  );
}
