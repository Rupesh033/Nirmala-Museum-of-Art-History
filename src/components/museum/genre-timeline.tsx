"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { eras, type EraCard } from "@/lib/museum-data";

const MIN = 1140; // earliest start year
const MAX = 2025; // latest end year
const SPAN = MAX - MIN;

function widthPct(e: EraCard) {
  return ((e.endYear - e.startYear) / SPAN) * 100;
}

export function GenreTimeline() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [selected, setSelected] = useState<EraCard>(eras[1]); // Renaissance default
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const updateEdgeState = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setAtStart(el.scrollLeft <= 4);
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    updateEdgeState();
    const el = trackRef.current;
    if (!el) return;
    const onScroll = () => updateEdgeState();
    el.addEventListener("scroll", onScroll, { passive: true });
    const ro = new ResizeObserver(updateEdgeState);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", onScroll);
      ro.disconnect();
    };
  }, [updateEdgeState]);

  // convert vertical wheel to horizontal pan
  const onWheel = useCallback((e: React.WheelEvent) => {
    const el = trackRef.current;
    if (!el) return;
    if (e.deltaY !== 0) {
      el.scrollLeft += e.deltaY;
    }
  }, []);

  const scrollBy = useCallback((dir: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: "smooth" });
  }, []);

  return (
    <section
      id="timeline"
      className="relative w-full border-y border-border bg-card/30 py-16 sm:py-20 lg:py-24"
      aria-label="Genre timeline"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <header className="mb-8 flex flex-col gap-4 sm:mb-10 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.35em] text-primary/80">
              Permanent Collection · Timeline
            </p>
            <h2 className="font-serif-display text-3xl text-foreground sm:text-4xl lg:text-5xl">
              Eight Movements, Eight Centuries
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
              Each card is sized to the span of its movement. Scroll the axis
              horizontally — your mouse wheel works too — and select a card to
              read its hallmarks.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => scrollBy(-1)}
              disabled={atStart}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-muted-foreground transition hover:border-primary hover:text-primary disabled:opacity-30"
              aria-label="Scroll timeline left"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => scrollBy(1)}
              disabled={atEnd}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-muted-foreground transition hover:border-primary hover:text-primary disabled:opacity-30"
              aria-label="Scroll timeline right"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </header>
      </div>

      {/* horizontal track */}
      <div
        ref={trackRef}
        onWheel={onWheel}
        className="no-scrollbar flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 sm:px-6 lg:px-[max(1.5rem,calc((100vw-80rem)/2))]"
      >
        {eras.map((era, i) => {
          const w = Math.max(widthPct(era) * 8, 12); // visual min so cards stay usable
          const isSel = selected.id === era.id;
          return (
            <button
              key={era.id}
              type="button"
              onClick={() => setSelected(era)}
              className={`group relative h-[26rem] shrink-0 snap-start overflow-hidden rounded-md border text-left transition-all sm:h-[30rem] ${
                isSel
                  ? "border-primary ring-1 ring-primary/40"
                  : "border-border hover:border-primary/60"
              }`}
              style={{ width: `${w}rem` }}
              aria-pressed={isSel}
            >
              <img
                src={era.image}
                alt={`${era.name} era artwork`}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                draggable={false}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-4">
                <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-primary/80">
                  No. {String(i + 1).padStart(2, "0")} · {era.region}
                </p>
                <h3 className="mt-1 font-serif-display text-xl text-foreground sm:text-2xl">
                  {era.name}
                </h3>
                <p className="font-mono text-xs text-foreground/70">
                  {era.years}
                </p>
                <div className="mt-1 h-1 w-full overflow-hidden rounded-full bg-foreground/10">
                  <div
                    className="h-full bg-primary/60"
                    style={{ width: `${widthPct(era)}%` }}
                  />
                </div>
              </div>
            </button>
          );
        })}
        {/* trailing spacer so the last card can snap to the left edge */}
        <div className="w-4 shrink-0 sm:w-6" aria-hidden />
      </div>

      {/* axis ruler */}
      <div className="mx-auto mt-4 max-w-7xl px-4 sm:px-6">
        <div className="gold-hr" />
        <div className="mt-2 flex justify-between font-mono text-[10px] text-muted-foreground">
          <span>1140</span>
          <span>1500</span>
          <span>1750</span>
          <span>1900</span>
          <span>Today</span>
        </div>
      </div>

      {/* detail panel */}
      <div className="mx-auto mt-8 max-w-7xl px-4 sm:px-6">
        <div className="grid gap-6 rounded-md border border-border bg-card p-5 sm:p-6 md:grid-cols-[200px_1fr]">
          <div className="relative aspect-[3/4] w-full overflow-hidden rounded-sm">
            <img
              src={selected.image}
              alt={selected.name}
              className="h-full w-full object-cover"
              draggable={false}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-3">
              <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-primary/80">
                {selected.region}
              </p>
            </div>
          </div>
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
              {selected.years} · {Math.round(widthPct(selected))}% of the axis
            </p>
            <h3 className="mt-1 font-serif-display text-2xl text-foreground sm:text-3xl">
              {selected.name}
            </h3>
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground sm:text-base">
              {selected.summary}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {selected.hallmarks.map((h) => (
                <span
                  key={h}
                  className="rounded-full border border-border bg-background/40 px-3 py-1 text-xs text-foreground/80"
                >
                  {h}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
