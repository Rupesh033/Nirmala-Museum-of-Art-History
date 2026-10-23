"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Crosshair, ZoomIn } from "lucide-react";
import { stillLifeArtwork } from "@/lib/museum-data";

const ZOOM_LEVELS = [2, 4, 6] as const;
const LENS_SIZE = 200; // px

export function Magnifier() {
  const stageRef = useRef<HTMLDivElement>(null);
  const [stage, setStage] = useState({ w: 1, h: 1 });
  const [zoom, setZoom] = useState<(typeof ZOOM_LEVELS)[number]>(4);
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);

  // measure the displayed stage so we can map cursor px → background %
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const measure = () => {
      const r = el.getBoundingClientRect();
      setStage({ w: r.width, h: r.height });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const onMove = useCallback(
    (e: React.MouseEvent) => {
      const el = stageRef.current;
      if (!el || stage.w < 2) return;
      const r = el.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      setPos({ x, y });

      // find nearest detail hotspot
      let nearest: string | null = null;
      let best = Infinity;
      for (const d of stillLifeArtwork.details) {
        const dx = (d.x / 100) * r.width - x;
        const dy = (d.y / 100) * r.height - y;
        const dist = Math.hypot(dx, dy);
        if (dist < best) {
          best = dist;
          nearest = d.id;
        }
      }
      setActiveId(best < 90 ? nearest : null);
    },
    [stage.w]
  );

  const onLeave = useCallback(() => {
    setPos(null);
    setActiveId(null);
  }, []);

  // background-position: the lens shows a magnified region of the source image.
  // We position the lens centre at (pos.x, pos.y) and offset the bg so the
  // corresponding point of the source sits at the lens centre.
  const lensLeft = pos ? pos.x - LENS_SIZE / 2 : 0;
  const lensTop = pos ? pos.y - LENS_SIZE / 2 : 0;

  // bg position as a percentage of the magnified background size
  const bgPosX = pos
    ? (pos.x / stage.w) * 100
    : 50;
  const bgPosY = pos
    ? (pos.y / stage.h) * 100
    : 50;

  return (
    <section
      id="magnifier"
      className="relative mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:py-24"
      aria-label="Conservator's magnifier"
    >
      <header className="mb-8 sm:mb-10">
        <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.35em] text-primary/80">
          Conservation Lab · Interactive
        </p>
        <h2 className="font-serif-display text-3xl text-foreground sm:text-4xl lg:text-5xl">
          The Conservator&apos;s Lens
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
          Drag your cursor across the panel. A true {zoom}&times; loupe tracks
          your movement, revealing the brushwork and glazes invisible to the
          naked eye. Land on a hotspot to read the conservator&apos;s note.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
        {/* stage */}
        <div
          ref={stageRef}
          onMouseMove={onMove}
          onMouseLeave={onLeave}
          className="grain relative aspect-[7/4] w-full cursor-none overflow-hidden rounded-md border border-border bg-black"
        >
          <img
            src={stillLifeArtwork.image}
            alt={`${stillLifeArtwork.title} — ${stillLifeArtwork.artist}`}
            className="h-full w-full select-none object-cover"
            draggable={false}
          />

          {/* dimming layer that the lens "cuts" through */}
          <div
            className="pointer-events-none absolute inset-0 transition-opacity duration-300"
            style={{
              opacity: pos ? 1 : 0,
              background: "oklch(0.10 0.012 60 / 55%)",
            }}
          />

          {/* hotspot markers */}
          {stillLifeArtwork.details.map((d) => (
            <div
              key={d.id}
              className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${d.x}%`, top: `${d.y}%` }}
            >
              <div
                className={`h-3 w-3 rounded-full border border-primary transition-all ${
                  activeId === d.id
                    ? "scale-150 bg-primary"
                    : "bg-primary/40"
                }`}
              />
            </div>
          ))}

          {/* the magnifying lens */}
          {pos && (
            <div
              className="pointer-events-none absolute z-20"
              style={{
                width: LENS_SIZE,
                height: LENS_SIZE,
                left: lensLeft,
                top: lensTop,
              }}
            >
              <div
                className="h-full w-full rounded-full border-2 border-primary shadow-[0_0_40px_rgba(0,0,0,0.7)]"
                style={{
                  backgroundColor: "oklch(0.10 0.012 60)",
                  backgroundImage: `url(${stillLifeArtwork.image})`,
                  backgroundRepeat: "no-repeat",
                  // magnified size = stage size * zoom; centre the sampled point
                  backgroundSize: `${stage.w * zoom}px ${stage.h * zoom}px`,
                  backgroundPosition: `${bgPosX}% ${bgPosY}%`,
                }}
              />
              {/* crosshair */}
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-primary/40" />
                <div className="absolute top-1/2 left-0 h-px w-full -translate-y-1/2 bg-primary/40" />
                <Crosshair className="h-5 w-5 text-primary/70" />
              </div>
              {/* zoom badge */}
              <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 rounded-full border border-primary/60 bg-background px-2 py-0.5 font-mono text-[10px] text-primary">
                {zoom}&times;
              </div>
            </div>
          )}

          {/* empty-state hint */}
          {!pos && (
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <div className="flex flex-col items-center gap-2 text-foreground/70">
                <ZoomIn className="h-7 w-7" />
                <p className="font-mono text-[11px] uppercase tracking-[0.3em]">
                  Hover to magnify
                </p>
              </div>
            </div>
          )}
        </div>

        {/* side panel: zoom toggle + active note */}
        <aside className="flex flex-col gap-4">
          <div className="rounded-md border border-border bg-card p-4">
            <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
              Magnification
            </p>
            <div className="flex gap-2">
              {ZOOM_LEVELS.map((z) => (
                <button
                  key={z}
                  type="button"
                  onClick={() => setZoom(z)}
                  className={`flex-1 rounded border px-2 py-2 font-mono text-sm transition ${
                    zoom === z
                      ? "border-primary bg-primary/15 text-primary"
                      : "border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"
                  }`}
                >
                  {z}&times;
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-md border border-border bg-card p-4">
            <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
              {stillLifeArtwork.year} · {stillLifeArtwork.medium}
            </p>
            <h3 className="mt-1 font-serif-display text-xl text-foreground">
              {stillLifeArtwork.title}
            </h3>
            <p className="text-sm italic text-muted-foreground">
              {stillLifeArtwork.artist}
            </p>
          </div>

          <div className="flex-1 rounded-md border border-border bg-card p-4">
            <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.3em] text-primary/80">
              Conservator&apos;s Note
            </p>
            {activeId ? (
              (() => {
                const d = stillLifeArtwork.details.find(
                  (x) => x.id === activeId
                );
                return d ? (
                  <div>
                    <h4 className="font-serif text-lg text-foreground">
                      {d.label}
                    </h4>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                      {d.description}
                    </p>
                  </div>
                ) : null;
              })()
            ) : (
              <p className="text-sm leading-relaxed text-muted-foreground">
                Move the lens over one of the four marked details — the silver
                goblet, the drapery, the peach, the feather — to read a note on
                its materials and execution.
              </p>
            )}
          </div>
        </aside>
      </div>
    </section>
  );
}
