"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Pause, Play, Headphones } from "lucide-react";
import { audioTracks } from "@/lib/museum-data";

const TICKS = 60;
const R_OUTER = 40;
const R_INNER = 33;
const R_ARC = 46;
const C_ARC = 2 * Math.PI * R_ARC;

// precompute tick geometry (deterministic, stable across renders)
const TICK_PATHS = Array.from({ length: TICKS }, (_, i) => {
  const a = (i / TICKS) * Math.PI * 2 - Math.PI / 2;
  const x1 = 50 + R_INNER * Math.cos(a);
  const y1 = 50 + R_INNER * Math.sin(a);
  const x2 = 50 + R_OUTER * Math.cos(a);
  const y2 = 50 + R_OUTER * Math.sin(a);
  return {
    i,
    x1: Math.round(x1 * 100) / 100,
    y1: Math.round(y1 * 100) / 100,
    x2: Math.round(x2 * 100) / 100,
    y2: Math.round(y2 * 100) / 100,
  };
});

// precompute waveform bar heights as INTEGERS so the server-rendered style
// string exactly matches the browser-normalised DOM value during hydration.
const WAVE_BARS = Array.from({ length: 28 }, (_, i) =>
  Math.round(20 + Math.abs(Math.sin(i * 1.3)) * 60)
);
const WAVE_DURATIONS = Array.from({ length: 28 }, (_, i) =>
  `${4 + (i % 6)}`
);
const WAVE_DELAYS = Array.from({ length: 28 }, (_, i) =>
  (((i % 7) * 6) / 100).toFixed(2)
);

function fmt(s: number) {
  const m = Math.floor(s / 60);
  const r = Math.floor(s % 60);
  return `${m}:${r.toString().padStart(2, "0")}`;
}

export function AudioGuide() {
  const [activeId, setActiveId] = useState(audioTracks[0].id);
  const [playing, setPlaying] = useState(true);
  const [elapsed, setElapsed] = useState(0);
  const elapsedRef = useRef(0);
  const activeIdRef = useRef(audioTracks[0].id);

  // keep ref synced (e.g. when external code changes state)
  useEffect(() => {
    activeIdRef.current = activeId;
  }, [activeId]);

  // simulated playback — 1 simulated second per 100ms of real time (10×)
  useEffect(() => {
    if (!playing) return;
    const t = window.setInterval(() => {
      const track =
        audioTracks.find((a) => a.id === activeIdRef.current) ?? audioTracks[0];
      const next = elapsedRef.current + 1;
      if (next >= track.duration) {
        // auto-advance to next track
        const idx = audioTracks.findIndex((a) => a.id === activeIdRef.current);
        const nextTrack = audioTracks[(idx + 1) % audioTracks.length];
        activeIdRef.current = nextTrack.id;
        setActiveId(nextTrack.id);
        elapsedRef.current = 0;
        setElapsed(0);
      } else {
        elapsedRef.current = next;
        setElapsed(next);
      }
    }, 100);
    return () => window.clearInterval(t);
  }, [playing]);

  const select = useCallback((id: string) => {
    activeIdRef.current = id;
    setActiveId(id);
    elapsedRef.current = 0;
    setElapsed(0);
    setPlaying(true);
  }, []);

  const activeIndex = audioTracks.findIndex((a) => a.id === activeId);
  const active = audioTracks[activeIndex];
  const progress = active ? elapsed / active.duration : 0;

  return (
    <section
      id="audio"
      className="relative w-full bg-card/30 py-16 sm:py-20 lg:py-24"
      aria-label="Audio guide"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <header className="mb-8 sm:mb-10">
          <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.35em] text-primary/80">
            Acoustiguide · Five Stops
          </p>
          <h2 className="font-serif-display text-3xl text-foreground sm:text-4xl lg:text-5xl">
            Listen to the Collection
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            Tap a ring to begin a stop. The tick marks fill as the narration
            advances; when a stop ends, the guide walks you to the next.
          </p>
        </header>

        {/* ring row */}
        <div className="no-scrollbar flex items-start gap-3 overflow-x-auto pb-2 sm:gap-6 sm:justify-center">
          {audioTracks.map((track, i) => {
            let p = 0;
            if (i < activeIndex) p = 1;
            else if (i === activeIndex) p = progress;
            const isActive = i === activeIndex;
            return (
              <button
                key={track.id}
                type="button"
                onClick={() => select(track.id)}
                className="group flex shrink-0 flex-col items-center gap-2"
                aria-label={`Play stop ${i + 1}: ${track.title}`}
              >
                <div className="relative h-28 w-28 sm:h-32 sm:w-32">
                  <svg
                    viewBox="0 0 100 100"
                    className={`h-full w-full -rotate-90 transition-transform duration-500 ${
                      isActive ? "scale-105" : "group-hover:scale-105"
                    }`}
                  >
                    {/* background ring */}
                    <circle
                      cx="50"
                      cy="50"
                      r={R_ARC}
                      fill="none"
                      stroke="oklch(0.30 0.014 65 / 50%)"
                      strokeWidth="1.5"
                    />
                    {/* tick marks */}
                    {TICK_PATHS.map((t) => {
                      const filled = t.i / TICKS < p;
                      return (
                        <line
                          key={t.i}
                          x1={t.x1}
                          y1={t.y1}
                          x2={t.x2}
                          y2={t.y2}
                          stroke={
                            filled
                              ? track.accent
                              : "oklch(0.30 0.014 65 / 60%)"
                          }
                          strokeWidth={filled ? 1.6 : 1}
                          strokeLinecap="round"
                        />
                      );
                    })}
                    {/* smooth progress arc */}
                    <circle
                      cx="50"
                      cy="50"
                      r={R_ARC}
                      fill="none"
                      stroke={track.accent}
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeDasharray={C_ARC}
                      strokeDashoffset={C_ARC * (1 - p)}
                      style={{ transition: "stroke-dashoffset 120ms linear" }}
                    />
                  </svg>
                  {/* centre label */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    {isActive && playing ? (
                      <Pause className="h-5 w-5" style={{ color: track.accent }} />
                    ) : (
                      <Play
                        className="h-5 w-5"
                        style={{ color: isActive ? track.accent : "oklch(0.55 0.014 65)" }}
                      />
                    )}
                    <span className="mt-1 font-mono text-[10px] text-muted-foreground">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                  {isActive && (
                    <span className="absolute -right-1 -top-1 flex h-3 w-3">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-60" />
                      <span className="relative inline-flex h-3 w-3 rounded-full bg-primary" />
                    </span>
                  )}
                </div>
                <span
                  className={`max-w-[7rem] text-center text-xs leading-tight sm:max-w-[8rem] ${
                    isActive ? "text-foreground" : "text-muted-foreground"
                  }`}
                >
                  {track.title}
                </span>
              </button>
            );
          })}
        </div>

        {/* now-playing pill */}
        <div className="mt-8 sm:mt-10">
          <div className="mx-auto flex max-w-3xl flex-col gap-4 rounded-lg border border-border bg-card p-5 sm:flex-row sm:items-center sm:p-6">
            <button
              type="button"
              onClick={() => setPlaying((p) => !p)}
              className="flex h-12 w-12 shrink-0 items-center justify-center self-start rounded-full bg-primary text-primary-foreground transition hover:opacity-90"
              aria-label={playing ? "Pause" : "Play"}
            >
              {playing ? (
                <Pause className="h-5 w-5" />
              ) : (
                <Play className="ml-0.5 h-5 w-5" />
              )}
            </button>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <Headphones className="h-3.5 w-3.5 text-primary/80" />
                <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                  {active.stop}
                </p>
              </div>
              <h3 className="mt-1 font-serif-display text-lg text-foreground sm:text-xl">
                {active.title}
              </h3>
              <p className="text-xs italic text-muted-foreground">
                {active.narrator}
              </p>
            </div>

            {/* waveform */}
            <div className="flex h-10 items-end gap-0.5 sm:w-40">
              {WAVE_BARS.map((h, i) => (
                <span
                  key={i}
                  className="w-1 rounded-full"
                  style={{
                    height: `${h}%`,
                    backgroundColor: active.accent,
                    opacity: playing ? 0.85 : 0.3,
                    animation: playing
                      ? `audiowave 0.${WAVE_DURATIONS[i]}s ease-in-out infinite alternate`
                      : "none",
                    animationDelay: `${WAVE_DELAYS[i]}s`,
                  }}
                />
              ))}
            </div>

            <div className="flex shrink-0 flex-col items-end font-mono text-sm">
              <span className="text-foreground tabular-nums">
                {fmt(elapsed)}
              </span>
              <span className="text-muted-foreground tabular-nums">
                {fmt(active.duration)}
              </span>
            </div>
          </div>

          {/* excerpt */}
          <p className="mx-auto mt-4 max-w-3xl border-l-2 border-primary/40 pl-4 font-serif text-sm italic leading-relaxed text-foreground/80 sm:text-base">
            &ldquo;{active.excerpt}&rdquo;
          </p>
        </div>
      </div>

    </section>
  );
}
