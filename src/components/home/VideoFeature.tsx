"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ExternalLink, Play } from "lucide-react";

interface VideoFeatureProps {
  videoId: string;
  title: string;
}

/**
 * 视频特性区。
 * - 进入视口时由 IntersectionObserver 自动加载并播放（autoplay=1&mute=1&loop=1，单视频 loop 需带 playlist=<id>）。
 * - 未激活时显示封面缩略图 + 播放按钮；点击播放按钮作为后备（带用户手势，可出声）。
 */
export function VideoFeature({ videoId, title }: VideoFeatureProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activated, setActivated] = useState(false);
  // 是否通过用户点击触发（点击播放 = 有手势，允许出声）
  const [clicked, setClicked] = useState(false);

  const watchUrl = useMemo(
    () => `https://www.youtube.com/watch?v=${videoId}`,
    [videoId],
  );

  // 自动播放源：静音 + 循环（单视频循环必须带 playlist=<videoId>）
  const autoplayEmbedUrl = useMemo(
    () =>
      `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&playsinline=1&rel=0`,
    [videoId],
  );

  // 点击播放源：有用户手势，可带声音
  const clickEmbedUrl = useMemo(
    () =>
      `https://www.youtube.com/embed/${videoId}?autoplay=1&playsinline=1&rel=0`,
    [videoId],
  );

  const posterUrl = useMemo(
    () => `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
    [videoId],
  );

  useEffect(() => {
    if (activated) return;
    if (typeof IntersectionObserver === "undefined") return;
    const node = containerRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActivated(true);
            observer.disconnect();
            break;
          }
        }
      },
      { threshold: 0.4 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [activated]);

  const handlePlay = () => {
    setClicked(true);
    setActivated(true);
  };

  const embedUrl = clicked ? clickEmbedUrl : autoplayEmbedUrl;

  return (
    <div className="space-y-4">
      <div
        ref={containerRef}
        className="relative w-full overflow-hidden rounded-lg bg-black"
        style={{ paddingBottom: "56.25%" }}
      >
        {activated ? (
          <iframe
            className="absolute top-0 left-0 w-full h-full"
            src={embedUrl}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        ) : (
          <button
            type="button"
            onClick={handlePlay}
            aria-label={`Play ${title}`}
            className="group absolute inset-0 w-full h-full"
          >
            {/* 封面缩略图 */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={posterUrl}
              alt={title}
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover"
            />
            {/* 渐变遮罩 */}
            <span className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/30" />
            {/* 播放按钮 */}
            <span className="absolute inset-0 flex items-center justify-center">
              <span className="flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-full bg-[hsl(var(--nav-theme))] text-white shadow-lg group-hover:scale-110 group-hover:bg-[hsl(var(--nav-theme)/0.9)] transition-transform">
                <Play className="w-7 h-7 md:w-9 md:h-9 fill-current ml-1" />
              </span>
            </span>
          </button>
        )}
      </div>

      <div className="flex justify-center">
        <a
          href={watchUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-white/10 hover:text-foreground transition-colors"
        >
          Watch on YouTube
          <ExternalLink className="h-4 w-4" />
        </a>
      </div>
    </div>
  );
}
