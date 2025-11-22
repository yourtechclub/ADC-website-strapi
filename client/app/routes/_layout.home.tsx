import type { Route } from "./+types/_layout.home";
import { BlockRenderer } from "../components/blocks";
import { getLandingPage } from "../lib/api";
import { handleApiError } from "../lib/utils";
import { useOutletContext, useNavigate } from "react-router";
import type { MenuItem } from "../types/navigation";
import { useEffect } from "react";

export async function loader({}: Route.LoaderArgs) {
  const response = await getLandingPage();
  handleApiError(response, "landing page");
  if (!response?.data)
    throw new Response("Landing page not found", { status: 404 });
  return response.data;
}

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Landing Page" },
    { name: "description", content: "This is the main website page." },
  ];
}

interface LayoutContext {
  menuItems: MenuItem[];
  setHideMenuItems?: (hide: boolean) => void;
}

export default function Home({ loaderData }: Route.ComponentProps) {
  const response = loaderData;
  const { menuItems, setHideMenuItems } = useOutletContext<LayoutContext>();

  // Check if there's a hero block with showMenuItemsInHero enabled
  useEffect(() => {
    const hasHeroWithMenuItems = response.blocks.some(
      (block: any) => block.__component === 'blocks.hero' && block.showMenuItemsInHero
    );
    
    if (setHideMenuItems) {
      setHideMenuItems(hasHeroWithMenuItems);
    }
    
    // Cleanup: reset when component unmounts
    return () => {
      if (setHideMenuItems) {
        setHideMenuItems(false);
      }
    };
  }, [response.blocks, setHideMenuItems]);

  return (
    <main>
      <BlockRenderer blocks={response.blocks} menuItems={menuItems} />
    </main>
  );
}
