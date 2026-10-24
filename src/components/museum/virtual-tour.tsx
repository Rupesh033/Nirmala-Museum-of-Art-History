"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { Compass, Eye, Move, Radio } from "lucide-react";
import { tourWings, type TourWing } from "@/lib/museum-data";

const clamp = (v: number, lo: number, hi: number) =>
  Math.min(hi, Math.max(lo, v));

export function VirtualTour() {
  const stageRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  const [wing, setWing] = useState<TourWing>(tourWings[0]);
  const [fading, setFading] = useState(false);

  // live values held in refs so the single RAF loop never goes stale
  const panRef = useRef(0); // current pan offset (px), 0 = leftmost
  const velRef = useRef(0); // current velocity (px/frame)
  const tiltRef = useRef(0); // current 3D tilt (deg)
  const maxPanRef = useRef(0); // current max pan (px)
  const draggingRef = useRef(false);
  const lastXRef = useRef(0);

  // render state
  const [panX, setPanX] = useState(0);
  const [tilt, setTilt] = useState(0);
  const [maxPan, setMaxPan] = useState(0);
  const [stageW, setStageW] = useState(1);
  const [imgW, setImgW] = useState(1);
  const [hasPointer, setHasPointer] = useState(false);

  // recompute stage + image metrics → maxPan
  const recompute = useCallback(() => {
    const el = stageRef.current;
    const img = imgRef.current;
    if (!el || !img) return;
    const sw = el.clientWidth;
    const iw = img.naturalWidth || img.clientWidth || sw * 2;
    const mp = Math.max(0, iw - sw);
    setStageW(sw);
    setImgW(iw);
    maxPanRef.current = mp;
    setMaxPan(mp);
    // re-clamp live pan into new bounds
    const clamped = clamp(panRef.current, 0, mp);
    panRef.current = clamped;
    setPanX(clamped);
  }, []);

  // single persistent inertia loop — set up once
  useEffect(() => {
    let raf = 0;
    const tick = () => {
      raf = requestAnimationFrame(tick);
      if (draggingRef.current) return;
      const v = velRef.current;
      if (Math.abs(v) > 0.05) {
        let next = panRef.current - v;
        // bounce at edges
        if (next < 0) {
          next = 0;
          velRef.current = -v * 0.28;
        } else if (next > maxPanRef.current) {
          next = maxPanRef.current;
          velRef.current = -v * 0.28;
        } else {
          velRef.current = v * 0.92;
        }
        panRef.current = next;
        tiltRef.current = clamp(v * 0.05, -5, 5);
        setPanX(next);
        setTilt(tiltRef.current);
      } else if (Math.abs(tiltRef.current) > 0.02) {
        tiltRef.current *= 0.82;
        setTilt(tiltRef.current);
      } else {
        velRef.current = 0;
        tiltRef.current = 0;
        setTilt(0);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  // observe stage size
  useLayoutEffect(() => {
    recompute();
    const el = stageRef.current;
    if (!el) return;
    const ro = new ResizeObserver(recompute);
    ro.observe(el);
    return () => ro.disconnect();
  }, [recompute]);

  // Center the visitor in the middle of the panorama whenever the wing
  // changes. Handles both freshly-loaded and already-cached images (the
  // React onLoad handler is unreliable for cached images that are already
  // complete at mount time).
  const centerForWing = useCallback(() => {
    const el = stageRef.current;
    const img = imgRef.current;
    if (!el || !img || !img.complete || img.naturalWidth === 0) return;
    recompute();
    const mp = maxPanRef.current;
    panRef.current = mp / 2;
    velRef.current = 0;
    tiltRef.current = 0;
    setPanX(mp / 2);
    setTilt(0);
  }, [recompute]);

  useEffect(() => {
    const img = imgRef.current;
    if (!img) return;
    centerForWing();
    img.addEventListener("load", centerForWing);
    return () => img.removeEventListener("load", centerForWing);
  }, [wing.id, centerForWing]);

  // when the wing changes, recompute after the new image loads (onLoad)
  const onImgLoad = useCallback(() => {
    centerForWing();
  }, [centerForWing]);

  // drag-to-look — mouse events (work with both real input and headless
  // automation; pointer events can be unreliable in headless/CDP contexts).
  // Document-level listeners keep the drag alive even if the cursor leaves
  // the stage, then inertia takes over on release.
  const onMouseDown = useCallback((e: React.MouseEvent) => {
    draggingRef.current = true;
    lastXRef.current = e.clientX;
    velRef.current = 0;
    setHasPointer(true);
    e.preventDefault();
  }, []);

  // touch support — pointer events only fire for touch/pen (not mouse, which
  // is handled by the mouse path above) to avoid double-processing.
  const onTouchPointerDown = useCallback((e: React.PointerEvent) => {
    if (e.pointerType === "mouse") return;
    draggingRef.current = true;
    lastXRef.current = e.clientX;
    velRef.current = 0;
    setHasPointer(true);
  }, []);

  const onTouchPointerMove = useCallback((e: React.PointerEvent) => {
    if (e.pointerType === "mouse" || !draggingRef.current) return;
    const dx = e.clientX - lastXRef.current;
    lastXRef.current = e.clientX;
    velRef.current = velRef.current * 0.5 + dx * 0.5;
    const next = clamp(panRef.current - dx, 0, maxPanRef.current);
    panRef.current = next;
    setPanX(next);
  }, []);

  const endDrag = useCallback(() => {
    draggingRef.current = false;
  }, []);

  // document-level mouse drag (so the drag continues outside the stage)
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!draggingRef.current) return;
      const dx = e.clientX - lastXRef.current;
      lastXRef.current = e.clientX;
      velRef.current = velRef.current * 0.5 + dx * 0.5;
      const next = clamp(panRef.current - dx, 0, maxPanRef.current);
      panRef.current = next;
      setPanX(next);
    };
    const onUp = () => {
      draggingRef.current = false;
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, []);

  // teleport between wings
  const teleport = useCallback(
    (targetId: string) => {
      if (targetId === wing.id) return;
      setFading(true);
      window.setTimeout(() => {
        const next = tourWings.find((w) => w.id === targetId);
        if (next) {
          setWing(next);
        }
        setFading(false);
      }, 360);
    },
    [wing.id]
  );

  // compass + minimap geometry
  const lookFraction = maxPan > 0 ? panX / maxPan : 0.5; // 0 west → 1 east
  const heading = lookFraction * 180 - 90; // -90 (W) → 90 (E), 0 = N(centre)
  const visibleFraction = imgW > 0 ? stageW / imgW : 0;
  const compassRot = heading; // rotate the rose so heading points up

  return (
    <section
      id="tour"
      className="relative w-full border-y border-border bg-background py-16 sm:py-20 lg:py-24"
      aria-label="3D virtual tour"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <header className="mb-8 flex flex-col gap-4 sm:mb-10 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.35em] text-primary/80">
              Virtual Tour · 3 Halls
            </p>
            <h2 className="font-serif-display text-3xl text-foreground sm:text-4xl lg:text-5xl">
              Walk the Galleries
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
              Click and drag inside the panorama to look around — release for
              momentum. Pulsing markers on the floor are teleport hotspots to
              the adjacent halls.
            </p>
          </div>
          <div className="flex items-center gap-3 rounded-full border border-border bg-card px-4 py-2">
            <Move className="h-4 w-4 text-primary" />
            <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
              Drag to look
            </span>
          </div>
        </header>
      </div>

      {/* stage */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div
          className="group relative aspect-[16/9] w-full cursor-grab overflow-hidden rounded-md border border-border bg-black select-none touch-none active:cursor-grabbing sm:aspect-[2/1]"
          onMouseDown={onMouseDown}
          onPointerDown={onTouchPointerDown}
          onPointerMove={onTouchPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          style={{ perspective: "1200px" }}
        >
          {/* cross-fade layer */}
          <div
            ref={stageRef}
            className="absolute inset-0"
            style={{ transformStyle: "preserve-3d" }}
          >
            <img
              ref={imgRef}
              src={wing.image}
              alt={`${wing.name} panorama`}
              onLoad={onImgLoad}
              draggable={false}
              className="pointer-events-none absolute top-0 h-full max-w-none select-none object-cover transition-opacity duration-300 will-change-transform"
              style={{
                width: "auto",
                minWidth: "100%",
                left: -panX,
                transform: `rotateY(${tilt}deg)`,
                transformOrigin: "center center",
                opacity: fading ? 0.15 : 1,
                // ensure the image is wide enough to pan; cap at 2.4× stage
                maxWidth: "240%",
              }}
            />
            {/* dim + vignette */}
            <div className="vignette pointer-events-none absolute inset-0" />
            <div className="pointer-events-none absolute inset-0 bg-black/15" />
          </div>

          {/* teleport hotspots (image-relative, move with the panorama) */}
          {wing.hotspots.map((h) => {
            const screenX =
              imgW > 0 ? (h.x / 100) * imgW - panX : h.x / 100 * stageW;
            const visible =
              screenX > -40 && screenX < stageW + 40 && !fading;
            if (!visible) return null;
            const target = tourWings.find((w) => w.id === h.targetWing);
            return (
              <button
                key={h.id}
                type="button"
                onPointerDown={(e) => {
                  e.stopPropagation();
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  teleport(h.targetWing);
                }}
                className="absolute top-[62%] z-20 -translate-x-1/2 -translate-y-1/2"
                style={{ left: screenX }}
                aria-label={`${h.label} — teleport to ${target?.name ?? ""}`}
              >
                <span className="relative flex h-10 w-10 items-center justify-center">
                  <span className="animate-hotspot absolute inset-0 rounded-full bg-primary/40" />
                  <span className="absolute inset-0 rounded-full border border-primary/60" />
                  <span className="relative flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg">
                    <Radio className="h-3.5 w-3.5" />
                  </span>
                </span>
                <span className="absolute left-1/2 top-full mt-2 w-44 -translate-x-1/2 rounded border border-border bg-background/90 px-2 py-1 text-center font-mono text-[10px] uppercase tracking-wider text-foreground backdrop-blur">
                  {h.label}
                </span>
              </button>
            );
          })}

          {/* overlay: hall name + compass */}
          <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between p-4 sm:p-6">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-foreground/70">
                {wing.subtitle}
              </p>
              <h3 className="mt-1 font-serif-display text-xl text-foreground drop-shadow sm:text-2xl">
                {wing.name}
              </h3>
            </div>

            {/* compass */}
            <div className="relative h-16 w-16 rounded-full border border-primary/40 bg-background/60 backdrop-blur sm:h-20 sm:w-20">
              <div
                className="absolute inset-0 flex items-center justify-center transition-transform duration-150"
                style={{ transform: `rotate(${-compassRot}deg)` }}
              >
                <span className="absolute -top-1 text-[10px] font-bold text-primary">
                  N
                </span>
                <span className="absolute -bottom-1 text-[9px] text-muted-foreground">
                  S
                </span>
                <span className="absolute -left-1 text-[9px] text-muted-foreground">
                  W
                </span>
                <span className="absolute -right-1 text-[9px] text-muted-foreground">
                  E
                </span>
                <Compass className="h-7 w-7 text-primary sm:h-9 sm:w-9" />
              </div>
            </div>
          </div>

          {/* overlay: minimap + FOV */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 p-4 sm:p-6">
            <div className="flex items-center gap-3">
              <Eye className="h-4 w-4 text-primary/80" />
              <div className="relative h-2 flex-1 overflow-hidden rounded-full bg-foreground/15">
                {/* the visible window */}
                <div
                  className="absolute h-full rounded-full bg-primary/70 transition-[left] duration-75"
                  style={{
                    left: `${maxPan > 0 ? (panX / imgW) * 100 : 0}%`,
                    width: `${(visibleFraction * 100).toFixed(2)}%`,
                  }}
                />
              </div>
              <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                {Math.round(lookFraction * 180 - 90)}° ·{" "}
                {lookFraction < 0.4
                  ? "West"
                  : lookFraction > 0.6
                    ? "East"
                    : "Centre"}
              </span>
            </div>
          </div>

          {/* empty hint before first interaction */}
          {!hasPointer && !fading && (
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <div className="rounded-full border border-primary/40 bg-background/70 px-4 py-2 font-mono text-[11px] uppercase tracking-[0.3em] text-foreground/80 backdrop-blur">
                Click &amp; drag to look around
              </div>
            </div>
          )}
        </div>

        {/* wing description + teleport chips */}
        <div className="mt-6 grid gap-4 rounded-md border border-border bg-card p-5 sm:p-6 md:grid-cols-[1fr_auto]">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
              {wing.subtitle}
            </p>
            <h3 className="mt-1 font-serif-display text-xl text-foreground sm:text-2xl">
              {wing.name}
            </h3>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
              {wing.description}
            </p>
          </div>
          <div className="flex flex-wrap content-start gap-2 md:flex-col">
            {tourWings.map((w) => (
              <button
                key={w.id}
                type="button"
                onClick={() => teleport(w.id)}
                className={`rounded-full border px-3 py-1.5 text-xs transition ${
                  w.id === wing.id
                    ? "border-primary bg-primary/15 text-primary"
                    : "border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"
                }`}
              >
                {w.name.replace(/^Hall [^—]+ — /, "")}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
