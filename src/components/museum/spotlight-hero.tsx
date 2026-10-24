"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";
import { heroArtworks } from "@/lib/museum-data";

const AUTOPLAY_MS = 6000;

export function SpotlightHero() {
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [coords, setCoords] = useState({ mx: "50%", my: "50%" });
  const stageRef = useRef<HTMLDivElement>(null);

  // advance to next slide
  const next = useCallback(() => {
    setIndex((i) => (i + 1) % heroArtworks.length);
  }, []);

  // autoplay
  useEffect(() => {
    if (!playing) return;
    const t = window.setTimeout(next, AUTOPLAY_MS);
    return () => window.clearTimeout(t);
  }, [playing, next, index]);

  // spotlight follows cursor (rAF-throttled via state)
  const onMove = useCallback((e: React.MouseEvent) => {
    const el = stageRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const mx = ((e.clientX - r.left) / r.width) * 100;
    const my = ((e.clientY - r.top) / r.height) * 100;
    setCoords({ mx: `${mx}%`, my: `${my}%` });
  }, []);

  const active = heroArtworks[index];

  return (
    <section
      id="hero"
      className="relative w-full overflow-hidden bg-background grain"
      aria-label="Featured masterpieces"
    >
      {/* cross-fade canvas layer */}
      <div
        ref={stageRef}
        onMouseMove={onMove}
        className="relative aspect-[16/9] w-full sm:aspect-[2/1] md:aspect-[21/9] lg:aspect-[2/1]"
        style={{ ["--mx" as string]: coords.mx, ["--my" as string]: coords.my }}
      >
        {heroArtworks.map((art, i) => (
          <div
            key={art.id}
            className="absolute inset-0 transition-opacity duration-[1600ms] ease-in-out"
            style={{ opacity: i === index ? 1 : 0 }}
            aria-hidden={i !== index}
          >
            <img
              src={art.image}
              alt={`${art.title} — ${art.period}`}
              className={`h-full w-full object-cover ${i === index ? "animate-kenburns" : ""}`}
              draggable={false}
            />
            {/* base darkening so the spotlight reads */}
            <div className="absolute inset-0 bg-black/45" />
          </div>
        ))}

        {/* spotlight overlay — brightens canvas wherever the cursor is */}
        <div
          className="pointer-events-none absolute inset-0 mix-blend-soft-light"
          style={{
            background: `radial-gradient(circle 260px at ${coords.mx} ${coords.my}, oklch(0.95 0.04 85 / 65%) 0%, transparent 60%)`,
          }}
        />
        {/* subtle moving glow ring */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background: `radial-gradient(circle 120px at ${coords.mx} ${coords.my}, oklch(0.74 0.13 75 / 18%) 0%, transparent 70%)`,
          }}
        />

        {/* vignette */}
        <div className="vignette pointer-events-none absolute inset-0" />

        {/* caption block */}
        <div className="absolute inset-x-0 bottom-0 p-6 sm:p-10 lg:p-14">
          <div className="mx-auto max-w-4xl">
            <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.35em] text-primary/80">
              {active.period}
            </p>
            <h1 className="font-serif-display text-3xl leading-tight text-foreground sm:text-5xl lg:text-6xl">
              {active.title}
            </h1>
            <p className="mt-3 font-serif text-base italic text-foreground/80 sm:text-lg">
              {active.artist} · {active.year} · {active.medium}
            </p>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-foreground/70 sm:text-base">
              {active.caption}
            </p>
          </div>
        </div>

        {/* controls */}
        <div className="absolute right-4 top-4 flex items-center gap-2 sm:right-6 sm:top-6">
          <button
            type="button"
            onClick={() => setPlaying((p) => !p)}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-primary/40 bg-background/40 text-foreground backdrop-blur transition hover:border-primary hover:text-primary"
            aria-label={playing ? "Pause autoplay" : "Play autoplay"}
          >
            {playing ? (
              <Pause className="h-4 w-4" />
            ) : (
              <Play className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      {/* thumbnail rail */}
      <div className="gold-hr" />
      <div className="no-scrollbar flex items-stretch gap-px overflow-x-auto bg-card/40">
        {heroArtworks.map((art, i) => (
          <button
            key={art.id}
            type="button"
            onClick={() => setIndex(i)}
            className={`group relative shrink-0 basis-1/4 overflow-hidden border-b-2 transition-colors ${
              i === index
                ? "border-primary"
                : "border-transparent hover:border-primary/40"
            }`}
            aria-label={`Show ${art.title}`}
          >
            <div className="relative aspect-[16/10] w-28 sm:w-40 lg:w-56">
              <img
                src={art.image}
                alt=""
                className={`h-full w-full object-cover transition ${
                  i === index ? "opacity-100" : "opacity-50 group-hover:opacity-80"
                }`}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-2 text-left sm:p-3">
                <p className="truncate font-serif text-xs text-foreground sm:text-sm">
                  {art.title}
                </p>
                <p className="truncate font-mono text-[9px] uppercase tracking-widest text-foreground/60 sm:text-[10px]">
                  {art.year}
                </p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}
