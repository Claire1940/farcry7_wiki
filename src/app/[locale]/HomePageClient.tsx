"use client";

import { useState, Suspense, lazy } from "react";
import {
  ArrowRight,
  BookOpen,
  Calendar,
  ChevronDown,
  Clock,
  Cpu,
  ExternalLink,
  Film,
  Gamepad2,
  GitCompare,
  Images,
  MapPin,
  Newspaper,
  Play,
  Sparkles,
  Timer,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useMessages } from "next-intl";
import { VideoFeature } from "@/components/home/VideoFeature";
import { LatestGuidesAccordion } from "@/components/home/LatestGuidesAccordion";
import { NativeBannerAd, AdBanner } from "@/components/ads";
import { getPreferredMobileBannerSelection } from "@/components/ads/mobileAdConfigs";
import { scrollToSection } from "@/lib/scrollToSection";
import { DynamicIcon } from "@/components/ui/DynamicIcon";
import type { ContentItemWithType } from "@/lib/getLatestArticles";
import type { ModuleLinkMap } from "@/lib/buildModuleLinkMap";

// Lazy load heavy components
const HeroStats = lazy(() => import("@/components/home/HeroStats"));
const FAQSection = lazy(() => import("@/components/home/FAQSection"));
const CTASection = lazy(() => import("@/components/home/CTASection"));

// Loading placeholder
const LoadingPlaceholder = ({ height = "h-64" }: { height?: string }) => (
  <div
    className={`${height} bg-white/5 border border-border rounded-xl animate-pulse`}
  />
);

// 模块顶部统一头部：小标签 + 图标 + 标题 + 简介
function ModuleHeader({
  icon: Icon,
  eyebrow,
  title,
  intro,
}: {
  icon: React.ComponentType<{ className?: string }>;
  eyebrow?: string;
  title: string;
  intro?: string;
}) {
  return (
    <div className="text-center mb-10 md:mb-14 scroll-reveal">
      {eyebrow && (
        <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 mb-3 md:mb-4 bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)]">
          <Icon className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />
          <span className="text-xs md:text-sm font-semibold tracking-wide uppercase text-[hsl(var(--nav-theme-light))]">
            {eyebrow}
          </span>
        </div>
      )}
      <h2 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4 leading-tight">
        {title}
      </h2>
      {intro && (
        <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto">
          {intro}
        </p>
      )}
    </div>
  );
}

// 外部参考链接 chips（模块底部，仅外部链接）
function SourceLinks({ sources }: { sources?: string[] }) {
  if (!sources || sources.length === 0) return null;
  return (
    <div className="scroll-reveal mt-10 md:mt-14">
      <div className="flex flex-wrap gap-2 justify-center">
        {sources.map((url, i) => {
          let label: string;
          try {
            label = new URL(url).hostname.replace(/^www\./, "");
          } catch {
            label = url;
          }
          return (
            <a
              key={i}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-border text-xs md:text-sm text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors"
            >
              {label}
              <ExternalLink className="w-3 h-3" />
            </a>
          );
        })}
      </div>
    </div>
  );
}

interface HomePageClientProps {
  latestArticles: ContentItemWithType[];
  moduleLinkMap: ModuleLinkMap;
  locale: string;
}

export default function HomePageClient({
  latestArticles,
  moduleLinkMap,
  locale,
}: HomePageClientProps) {
  // moduleLinkMap 在内容为空时为 {}（content/ 已清空），首页不渲染内部文章链接
  void moduleLinkMap;
  const t = useMessages() as any;
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://www.farcry7.wiki";

  // Tools Grid 锚点与下方 8 个 section 一一对应
  const toolSectionIds = [
    "release-date",
    "trailer-reveal",
    "platforms",
    "story-characters",
    "setting-map",
    "gameplay-timer",
    "multiplayer-maverick",
    "engine-development",
  ];

  // Structured data
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: siteUrl,
        name: "Far Cry 7 Wiki",
        description:
          "Unofficial Far Cry 7 wiki tracking the release date, trailers, platforms, setting, story, multiplayer details, and verified Ubisoft updates.",
        image: {
          "@type": "ImageObject",
          url: `${siteUrl}/images/hero.webp`,
          width: 1920,
          height: 1080,
          caption: "Far Cry 7 - Unofficial Release Date & News Tracker",
        },
        potentialAction: {
          "@type": "SearchAction",
          target: `${siteUrl}/search?q={search_term_string}`,
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@type": "Organization",
        "@id": `${siteUrl}/#organization`,
        name: "Far Cry 7 Wiki",
        alternateName: "Far Cry 7",
        url: siteUrl,
        description:
          "Unofficial Far Cry 7 tracker covering verified Ubisoft announcements, release news, trailers, platforms, setting, story, and clearly labeled rumors.",
        logo: {
          "@type": "ImageObject",
          url: `${siteUrl}/android-chrome-512x512.png`,
          width: 512,
          height: 512,
        },
        image: {
          "@type": "ImageObject",
          url: `${siteUrl}/images/hero.webp`,
          width: 1920,
          height: 1080,
          caption: "Far Cry 7 Wiki - Unofficial Release Date & News Tracker",
        },
        sameAs: [
          "https://www.ubisoft.com/en-us/franchise/far-cry",
          "https://www.youtube.com/user/ubisoft",
          "https://x.com/farcrygame",
          "https://www.reddit.com/r/farcry",
        ],
      },
      {
        "@type": "VideoGame",
        name: "Far Cry 7",
        gamePlatform: ["PC", "PlayStation 5", "Xbox Series X|S"],
        applicationCategory: "Game",
        genre: ["Open-World", "First-Person Shooter", "Action-Adventure"],
        numberOfPlayers: {
          minValue: 1,
          maxValue: 1,
        },
        offers: {
          "@type": "Offer",
          priceCurrency: "USD",
          availability: "https://schema.org/PreOrder",
          url: "https://www.ubisoft.com/en-us/franchise/far-cry",
        },
      },
      {
        "@type": "VideoObject",
        name: "NEW Far Cry 7 Leaks Have Been Revealed",
        description:
          "Unofficial news video covering reported Far Cry 7 leaks. Not an official Far Cry 7 trailer.",
        uploadDate: "2026-06-15",
        thumbnailUrl: `${siteUrl}/images/hero.webp`,
        embedUrl: "https://www.youtube.com/embed/YV-RrdakDfY",
        url: "https://www.youtube.com/watch?v=YV-RrdakDfY",
      },
    ],
  };

  // Module 5 accordion state
  const [settingExpanded, setSettingExpanded] = useState<number | null>(0);
  const mobileBannerAd = getPreferredMobileBannerSelection();

  return (
    <div className="home-shell min-h-screen bg-background text-foreground">
      {/* Structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* 广告位 1: 顶部固定横幅 */}
      <div className="sticky top-20 z-20 border-b border-border py-2">
        <AdBanner type="banner-320x50" adKey={process.env.NEXT_PUBLIC_AD_MOBILE_320X50} />
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 pt-24 pb-14 md:pt-32 md:pb-20">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-8 scroll-reveal">
            {/* Badge */}
            <div
              className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 md:px-4 md:py-2
                            bg-[hsl(var(--nav-theme)/0.1)]
                            border border-[hsl(var(--nav-theme)/0.3)] mb-4 md:mb-6"
            >
              <Sparkles className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />
              <span className="text-xs md:text-sm font-medium">
                {t.hero.badge}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-4 md:mb-6 leading-[1.05]">
              {t.hero.title}
            </h1>

            {/* Description */}
            <p className="mx-auto mb-8 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg md:mb-10 md:max-w-3xl md:text-2xl">
              {t.hero.description}
            </p>

            {/* CTA Buttons */}
            <div className="mb-10 flex flex-col justify-center gap-3 sm:flex-row md:mb-12 md:gap-4">
              <button
                onClick={() => scrollToSection("release-date")}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 md:px-8 md:py-4
                           bg-[hsl(var(--nav-theme))] hover:bg-[hsl(var(--nav-theme)/0.9)]
                           text-white rounded-lg font-semibold text-base md:text-lg transition-colors"
              >
                <BookOpen className="w-5 h-5" />
                {t.hero.getFreeCodesCTA}
              </button>
              <a
                href="https://www.ubisoft.com/en-us/franchise/far-cry"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 md:px-8 md:py-4
                           border border-border hover:bg-white/10 rounded-lg
                           font-semibold text-base md:text-lg transition-colors"
              >
                {t.hero.playOnSteamCTA}
                <ArrowRight className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Stats */}
          <Suspense fallback={<LoadingPlaceholder height="h-32" />}>
            <HeroStats stats={Object.values(t.hero.stats)} />
          </Suspense>
        </div>
      </section>

      {/* Video Section - 紧跟 Hero，IntersectionObserver 自动播放 */}
      <section className="px-4 py-10 md:py-12">
        <div className="scroll-reveal container mx-auto max-w-5xl">
          <div className="relative overflow-hidden rounded-2xl">
            <VideoFeature
              videoId="YV-RrdakDfY"
              title="NEW Far Cry 7 Leaks Have Been Revealed"
            />
          </div>
          <p className="mt-3 text-center text-xs md:text-sm text-muted-foreground">
            Unofficial news video — not an official Far Cry 7 trailer.
          </p>
        </div>
      </section>

      {/* Tools Grid - 8 Navigation Cards（位于视频区之后、Latest Updates 之前） */}
      <section className="px-4 py-14 md:py-20 bg-white/[0.02]">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8 md:mb-12 scroll-reveal">
            <h2 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4">
              {t.tools.title}{" "}
              <span className="text-[hsl(var(--nav-theme-light))]">
                {t.tools.titleHighlight}
              </span>
            </h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto">
              {t.tools.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-4">
            {t.tools.cards.map((card: any, index: number) => {
              const sectionId = toolSectionIds[index];
              return (
                <a
                  key={index}
                  href={`#${sectionId}`}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection(sectionId);
                  }}
                  className="scroll-reveal group rounded-xl border border-border p-4 md:p-6
                             bg-card hover:border-[hsl(var(--nav-theme)/0.5)]
                             transition-all duration-300 cursor-pointer text-left
                             hover:shadow-lg hover:shadow-[hsl(var(--nav-theme)/0.1)] block"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div
                    className="mb-3 h-10 w-10 rounded-lg md:mb-4 md:h-12 md:w-12
                                bg-[hsl(var(--nav-theme)/0.1)]
                                flex items-center justify-center
                                group-hover:bg-[hsl(var(--nav-theme)/0.2)]
                                transition-colors"
                  >
                    <DynamicIcon
                      name={card.icon}
                      className="h-5 w-5 md:h-6 md:w-6 text-[hsl(var(--nav-theme-light))]"
                    />
                  </div>
                  <h3 className="mb-1.5 text-sm md:text-base font-semibold">
                    {card.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {card.description}
                  </p>
                </a>
              );
            })}
          </div>
        </div>
      </section>

      {/* Latest Updates Section */}
      <LatestGuidesAccordion
        articles={latestArticles}
        locale={locale}
        max={12}
      />

      {/* 广告位 2: 首屏内容之后再加载广告 */}
      <NativeBannerAd adKey={process.env.NEXT_PUBLIC_AD_NATIVE_BANNER || ""} />

      {/* 广告位 3: 移动端优先使用方形，桌面端保留横幅 */}
      <AdBanner
        type="banner-300x250"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_300X250}
        className="md:hidden"
      />
      <AdBanner
        type="banner-728x90"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_728X90}
        className="hidden md:flex"
      />

      {/* Module 1: Release Date and Announcement Status (timeline) */}
      <section id="release-date" className="scroll-mt-24 px-4 py-14 md:py-20">
        <div className="container mx-auto max-w-5xl">
          <ModuleHeader
            icon={Calendar}
            eyebrow={t.modules.farCry7ReleaseStatus.eyebrow}
            title={t.modules.farCry7ReleaseStatus.title}
            intro={t.modules.farCry7ReleaseStatus.intro}
          />
          <div className="scroll-reveal relative pl-8 md:pl-10 border-l-2 border-[hsl(var(--nav-theme)/0.3)] space-y-6 md:space-y-8">
            {t.modules.farCry7ReleaseStatus.milestones.map(
              (m: any, index: number) => (
                <div key={index} className="relative">
                  <div className="absolute -left-[2.1rem] md:-left-[2.6rem] w-5 h-5 rounded-full bg-[hsl(var(--nav-theme))] border-2 border-background flex items-center justify-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-white" />
                  </div>
                  <div className="p-5 md:p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors">
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      <span className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] font-semibold text-[hsl(var(--nav-theme-light))]">
                        {m.category}
                      </span>
                      <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="w-3.5 h-3.5" />
                        {m.date}
                      </span>
                    </div>
                    <h3 className="text-lg md:text-xl font-bold mb-2">
                      {m.title}
                    </h3>
                    <p className="text-sm md:text-base text-muted-foreground">
                      {m.description}
                    </p>
                  </div>
                </div>
              ),
            )}
          </div>
        </div>
      </section>

      {/* 广告位 4: 第一模块之后的阅读停顿位 */}
      <AdBanner
        type="banner-300x250"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_300X250}
        className="md:hidden"
      />
      <AdBanner
        type="banner-468x60"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_468X60}
        className="hidden md:flex"
      />

      {/* Module 2: Trailer and Reveal News (video-card-list) */}
      <section id="trailer-reveal" className="scroll-mt-24 px-4 py-14 md:py-20 bg-white/[0.02]">
        <div className="container mx-auto max-w-5xl">
          <ModuleHeader
            icon={Film}
            eyebrow={t.modules.farCry7TrailerReveal.eyebrow}
            title={t.modules.farCry7TrailerReveal.title}
            intro={t.modules.farCry7TrailerReveal.intro}
          />
          <div className="scroll-reveal grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {(() => {
              const mediaIcons = [Film, Play, Images, Newspaper];
              return t.modules.farCry7TrailerReveal.items.map(
                (item: any, index: number) => {
                  const ItemIcon = mediaIcons[index % mediaIcons.length];
                  const published = item.status === "Published";
                  return (
                    <div
                      key={index}
                      className="p-5 md:p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors flex flex-col"
                    >
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] font-semibold">
                          <ItemIcon className="w-3.5 h-3.5 text-[hsl(var(--nav-theme-light))]" />
                          {item.mediaType}
                        </span>
                        <span
                          className={`text-xs px-2.5 py-1 rounded-full border font-semibold ${published ? "bg-[hsl(var(--nav-theme)/0.15)] border-[hsl(var(--nav-theme)/0.4)] text-[hsl(var(--nav-theme-light))]" : "bg-white/5 border-border text-muted-foreground"}`}
                        >
                          {item.status}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold mb-1.5">{item.title}</h3>
                      <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {item.date}
                      </p>
                      <p className="text-sm text-muted-foreground flex-1">
                        {item.description}
                      </p>
                      {item.url && (
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-[hsl(var(--nav-theme-light))] hover:underline self-start"
                        >
                          Watch / Open
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                  );
                },
              );
            })()}
          </div>
          <SourceLinks sources={t.modules.farCry7TrailerReveal.sources} />
        </div>
      </section>

      {/* Module 3: Platforms and System Requirements (comparison-table) */}
      <section id="platforms" className="scroll-mt-24 px-4 py-14 md:py-20">
        <div className="container mx-auto max-w-5xl">
          <ModuleHeader
            icon={Gamepad2}
            eyebrow={t.modules.farCry7Platforms.eyebrow}
            title={t.modules.farCry7Platforms.title}
            intro={t.modules.farCry7Platforms.intro}
          />
          <div className="scroll-reveal overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-sm md:text-base">
              <thead>
                <tr className="bg-[hsl(var(--nav-theme)/0.1)] text-left">
                  <th className="p-3 md:p-4 font-semibold">Platform</th>
                  <th className="p-3 md:p-4 font-semibold">Availability</th>
                  <th className="p-3 md:p-4 font-semibold">System Requirements</th>
                  <th className="p-3 md:p-4 font-semibold">Details</th>
                </tr>
              </thead>
              <tbody>
                {t.modules.farCry7Platforms.platforms.map(
                  (p: any, index: number) => {
                    const announced = p.availability !== "Not announced";
                    return (
                      <tr
                        key={index}
                        className="border-t border-border align-top hover:bg-white/5 transition-colors"
                      >
                        <td className="p-3 md:p-4 font-bold whitespace-nowrap">
                          {p.platform}
                        </td>
                        <td className="p-3 md:p-4">
                          <span
                            className={`inline-block text-xs px-2 py-1 rounded-full border font-semibold ${announced ? "bg-[hsl(var(--nav-theme)/0.15)] border-[hsl(var(--nav-theme)/0.4)] text-[hsl(var(--nav-theme-light))]" : "bg-white/5 border-border text-muted-foreground"}`}
                          >
                            {p.availability}
                          </span>
                        </td>
                        <td className="p-3 md:p-4 text-muted-foreground">
                          {p.systemRequirements}
                        </td>
                        <td className="p-3 md:p-4 text-muted-foreground">
                          {p.details}
                        </td>
                      </tr>
                    );
                  },
                )}
              </tbody>
            </table>
          </div>
          <SourceLinks sources={t.modules.farCry7Platforms.sources} />
        </div>
      </section>

      {/* Module 4: Story Characters and Villain (character-card-list) */}
      <section id="story-characters" className="scroll-mt-24 px-4 py-14 md:py-20 bg-white/[0.02]">
        <div className="container mx-auto max-w-5xl">
          <ModuleHeader
            icon={Users}
            eyebrow={t.modules.farCry7StoryCharacters.eyebrow}
            title={t.modules.farCry7StoryCharacters.title}
            intro={t.modules.farCry7StoryCharacters.intro}
          />
          <div className="scroll-reveal grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {t.modules.farCry7StoryCharacters.characters.map(
              (c: any, index: number) => (
                <div
                  key={index}
                  className="p-5 md:p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-10 w-10 rounded-lg bg-[hsl(var(--nav-theme)/0.1)] flex items-center justify-center flex-shrink-0">
                      <Users className="w-5 h-5 text-[hsl(var(--nav-theme-light))]" />
                    </div>
                    <span className="text-xs px-2 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] font-semibold">
                      {c.role}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold mb-2">{c.name}</h3>
                  <p className="text-sm text-muted-foreground">{c.description}</p>
                </div>
              ),
            )}
          </div>
          <SourceLinks sources={t.modules.farCry7StoryCharacters.sources} />
        </div>
      </section>

      {/* Module 5: Setting Map and Open World (accordion) */}
      <section id="setting-map" className="scroll-mt-24 px-4 py-14 md:py-20">
        <div className="container mx-auto max-w-5xl">
          <ModuleHeader
            icon={MapPin}
            eyebrow={t.modules.farCry7SettingMap.eyebrow}
            title={t.modules.farCry7SettingMap.title}
            intro={t.modules.farCry7SettingMap.intro}
          />
          <div className="scroll-reveal space-y-3">
            {t.modules.farCry7SettingMap.faqs.map((f: any, index: number) => {
              const open = settingExpanded === index;
              return (
                <div
                  key={index}
                  className="border border-border rounded-xl overflow-hidden bg-white/5"
                >
                  <button
                    onClick={() => setSettingExpanded(open ? null : index)}
                    className="w-full flex items-center justify-between gap-3 p-4 md:p-5 text-left hover:bg-white/5 transition-colors"
                  >
                    <span className="font-semibold text-base md:text-lg">
                      {f.title}
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 flex-shrink-0 transition-transform ${open ? "rotate-180 text-[hsl(var(--nav-theme-light))]" : ""}`}
                    />
                  </button>
                  {open && (
                    <div className="px-4 md:px-5 pb-5">
                      <p className="text-sm md:text-base text-foreground mb-3">
                        {f.summary}
                      </p>
                      <ul className="space-y-2">
                        {f.details.map((d: string, i: number) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[hsl(var(--nav-theme-light))] flex-shrink-0" />
                            <span className="text-sm text-muted-foreground">
                              {d}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 广告位 5: 中部阅读停顿 */}
      <AdBanner
        type="banner-300x250"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_300X250}
        className="md:hidden"
      />
      <AdBanner
        type="banner-728x90"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_728X90}
        className="hidden md:flex"
      />

      {/* Module 6: Gameplay Timer and Interrogation (mechanic-cards) */}
      <section id="gameplay-timer" className="scroll-mt-24 px-4 py-14 md:py-20 bg-white/[0.02]">
        <div className="container mx-auto max-w-5xl">
          <ModuleHeader
            icon={Timer}
            eyebrow={t.modules.farCry7GameplayTimer.eyebrow}
            title={t.modules.farCry7GameplayTimer.title}
            intro={t.modules.farCry7GameplayTimer.intro}
          />
          <div className="scroll-reveal grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {t.modules.farCry7GameplayTimer.mechanics.map(
              (m: any, index: number) => (
                <div
                  key={index}
                  className="p-5 md:p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors"
                >
                  <div className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] font-semibold text-[hsl(var(--nav-theme-light))] mb-3">
                    <Timer className="w-3.5 h-3.5" />
                    {m.value}
                  </div>
                  <h3 className="text-lg font-bold mb-2">{m.name}</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    {m.description}
                  </p>
                  <p className="text-sm border-t border-border pt-3 text-muted-foreground">
                    <span className="font-semibold text-foreground">
                      Player impact:{" "}
                    </span>
                    {m.playerImpact}
                  </p>
                </div>
              ),
            )}
          </div>
        </div>
      </section>

      {/* Module 7: Multiplayer and Project Maverick (comparison-grid) */}
      <section id="multiplayer-maverick" className="scroll-mt-24 px-4 py-14 md:py-20">
        <div className="container mx-auto max-w-5xl">
          <ModuleHeader
            icon={GitCompare}
            eyebrow={t.modules.farCry7MultiplayerMaverick.eyebrow}
            title={t.modules.farCry7MultiplayerMaverick.title}
            intro={t.modules.farCry7MultiplayerMaverick.intro}
          />
          <div className="scroll-reveal overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-sm md:text-base">
              <thead>
                <tr className="bg-[hsl(var(--nav-theme)/0.1)] text-left">
                  <th className="p-3 md:p-4 font-semibold">Feature</th>
                  <th className="p-3 md:p-4 font-semibold text-[hsl(var(--nav-theme-light))]">
                    Project Blackbird
                  </th>
                  <th className="p-3 md:p-4 font-semibold">Project Maverick</th>
                </tr>
              </thead>
              <tbody>
                {t.modules.farCry7MultiplayerMaverick.comparisons.map(
                  (c: any, index: number) => (
                    <tr
                      key={index}
                      className="border-t border-border align-top hover:bg-white/5 transition-colors"
                    >
                      <td className="p-3 md:p-4 font-bold whitespace-nowrap">
                        {c.feature}
                      </td>
                      <td className="p-3 md:p-4 text-foreground">
                        {c.blackbird}
                      </td>
                      <td className="p-3 md:p-4 text-muted-foreground">
                        {c.maverick}
                      </td>
                    </tr>
                  ),
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 广告位 6: 移动端横幅 */}
      {mobileBannerAd && (
        <AdBanner
          type={mobileBannerAd.type}
          adKey={mobileBannerAd.adKey}
          className="md:hidden"
        />
      )}

      {/* Module 8: Engine Development and Latest News (update-timeline) */}
      <section id="engine-development" className="scroll-mt-24 px-4 py-14 md:py-20 bg-white/[0.02]">
        <div className="container mx-auto max-w-5xl">
          <ModuleHeader
            icon={Cpu}
            eyebrow={t.modules.farCry7EngineDevelopment.eyebrow}
            title={t.modules.farCry7EngineDevelopment.title}
            intro={t.modules.farCry7EngineDevelopment.intro}
          />
          <div className="scroll-reveal relative pl-8 md:pl-10 border-l-2 border-[hsl(var(--nav-theme)/0.3)] space-y-6 md:space-y-8">
            {t.modules.farCry7EngineDevelopment.updates.map(
              (u: any, index: number) => (
                <div key={index} className="relative">
                  <div className="absolute -left-[2.1rem] md:-left-[2.6rem] w-5 h-5 rounded-full bg-[hsl(var(--nav-theme))] border-2 border-background flex items-center justify-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-white" />
                  </div>
                  <div className="p-5 md:p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors">
                    <p className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] font-semibold text-[hsl(var(--nav-theme-light))] mb-3">
                      <Clock className="w-3.5 h-3.5" />
                      {u.date}
                    </p>
                    <h3 className="text-lg md:text-xl font-bold mb-2">
                      {u.title}
                    </h3>
                    <p className="text-sm md:text-base text-muted-foreground">
                      {u.description}
                    </p>
                  </div>
                </div>
              ),
            )}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <Suspense fallback={<LoadingPlaceholder />}>
        <FAQSection
          title={t.faq.title}
          titleHighlight={t.faq.titleHighlight}
          subtitle={t.faq.subtitle}
          questions={t.faq.questions}
        />
      </Suspense>

      {/* CTA Section */}
      <Suspense fallback={<LoadingPlaceholder />}>
        <CTASection
          title={t.cta.title}
          description={t.cta.description}
          joinCommunity={t.cta.joinCommunity}
          joinGame={t.cta.joinGame}
        />
      </Suspense>

      {/* Ad Banner 3 */}
      <AdBanner
        type="banner-300x250"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_300X250}
        className="md:hidden"
      />
      <AdBanner
        type="banner-728x90"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_728X90}
        className="hidden md:flex"
      />

      {/* Footer */}
      <footer className="bg-white/[0.02] border-t border-border">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Brand */}
            <div>
              <h3 className="text-xl font-bold mb-4 text-[hsl(var(--nav-theme-light))]">
                {t.footer.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {t.footer.description}
              </p>
            </div>

            {/* Community - External Links Only */}
            <div>
              <h4 className="font-semibold mb-4">{t.footer.community}</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href="https://www.reddit.com/r/farcry"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.discord}
                  </a>
                </li>
                <li>
                  <a
                    href="https://x.com/farcrygame"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.twitter}
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.youtube.com/user/ubisoft"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.steamCommunity}
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.ubisoft.com/en-us/franchise/far-cry"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.steamStore}
                  </a>
                </li>
              </ul>
            </div>

            {/* Legal - Internal Routes Only */}
            <div>
              <h4 className="font-semibold mb-4">{t.footer.legal}</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="/about"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.about}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/privacy-policy"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.privacy}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms-of-service"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.terms}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/copyright"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.copyrightNotice}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Copyright */}
            <div>
              <p className="text-sm text-muted-foreground mb-2">
                {t.footer.copyright}
              </p>
              <p className="text-xs text-muted-foreground">
                {t.footer.disclaimer}
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
