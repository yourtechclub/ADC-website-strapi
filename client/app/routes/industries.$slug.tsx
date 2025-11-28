import { useLoaderData } from "react-router";
import type { Route } from "./+types/industries.$slug";
import { BlockRenderer } from "~/components/blocks";
import sdk from "~/lib/sdk";
import { PreviewBanner } from "~/components/PreviewBanner";

export async function loader({ params }: Route.LoaderArgs) {
  const { slug } = params;

  try {
    const response: any = await sdk.fetch(`/industries/${slug}`);

    const industry = response;

    if (!industry) {
      throw new Response("Industry not found", { status: 404 });
    }

    return {
      industry,
      isPreview: false,
    };
  } catch (error) {
    throw new Response("Industry not found", { status: 404 });
  }
}

export default function IndustryPage({ loaderData }: Route.ComponentProps) {
  const { industry, isPreview } = loaderData;

  return (
    <div>
      {isPreview && <PreviewBanner />}
      
      {/* Hero Section with Industry Title */}
      <section className="w-full px-8 py-20 md:px-32 md:py-40">
        <div className="mx-auto max-w-screen-2xl">
          <h1 className="font-display text-[60px] leading-none md:text-[96px]">
            {industry.title}
          </h1>
          {industry.description && (
            <p className="mt-6 font-semidisplay text-xl leading-6 md:text-2xl">
              {industry.description}
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
