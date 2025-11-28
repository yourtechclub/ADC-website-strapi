import { Hero, type IHero } from "./Hero";
import { SectionHeading, type ISectionHeading } from "./SectionHeading";
import { CardGrid, type ICardGrid } from "./CardGrid";
import { ContentWithImage, type IContentWithImage } from "./ContentWithImage";
import { MarkdownText, type IMarkdownText } from "./MarkdownText";
import { PersonCard, type IPersonCard } from "./PersonCard";
import { FeaturedArticles, type IFeaturedArticles } from "./FeaturedArticles";
import { Industries } from "./Industries";
import { ClientLogos } from "./ClientLogos";
import { Stats } from "./Stats";
import type { MenuItem } from "~/types/navigation";

interface IIndustry {
  id: number;
  title: string;
  slug: string;
  image: {
    url: string;
    alternativeText?: string;
  };
}

interface IIndustries {
  id: number;
  __component: "blocks.industries";
  heading?: string;
  text?: string;
  buttonText?: string;
  industries?: IIndustry[];
}

interface ILogo {
  id: number;
  url: string;
  alternativeText?: string;
}

interface IClientLogos {
  id: number;
  __component: "blocks.client-logos";
  heading?: string;
  logos?: ILogo[];
}

interface IStat {
  id: number;
  number: string;
  label: string;
}

interface IStats {
  id: number;
  __component: "blocks.stats";
  heading: string;
  text?: string;
  buttonText?: string;
  buttonLink?: string;
  stats?: IStat[];
}

export type Block =
  | IHero
  | ISectionHeading
  | ICardGrid
  | IContentWithImage
  | IMarkdownText
  | IPersonCard
  | IFeaturedArticles
  | IIndustries
  | IClientLogos
  | IStats;

interface BlockRendererProps {
  blocks: Block[];
  menuItems?: MenuItem[];
}

export function BlockRenderer({ blocks, menuItems }: BlockRendererProps) {
  const renderBlock = (block: Block) => {
    switch (block.__component) {
      case "blocks.hero":
        return <Hero key={block.id} {...block} menuItems={menuItems} />;
      case "blocks.section-heading":
        return <SectionHeading key={block.id} {...block} />;
      case "blocks.card-grid":
        return <CardGrid key={block.id} {...block} />;
      case "blocks.content-with-image":
        return <ContentWithImage key={block.id} {...block} />;
      case "blocks.markdown":
        return <MarkdownText key={block.id} {...block} />;
      case "blocks.person-card":
        return <PersonCard key={block.id} {...block} />;
      case "blocks.featured-articles":
        return <FeaturedArticles key={block.id} {...block} />;
      case "blocks.industries":
        return <Industries key={block.id} {...block} />;
      case "blocks.client-logos":
        return <ClientLogos key={block.id} {...block} />;
      case "blocks.stats":
        return <Stats key={block.id} {...block} />;
      default:
        return null;
    }
  };

  return <div>{blocks.map((block) => renderBlock(block))}</div>;
}
