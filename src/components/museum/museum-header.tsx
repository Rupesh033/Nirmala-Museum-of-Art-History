"use client";

import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { museumInfo } from "@/lib/museum-data";

const NAV = [
  { href: "#hero", label: "Spotlight" },
  { href: "#magnifier", label: "Magnifier" },
  { href: "#timeline", label: "Timeline" },
  { href: "#tour", label: "Virtual Tour" },
  { href: "#audio", label: "Audio Guide" },
];

export function MuseumHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 w-full border-b transition-colors duration-300 ${
        scrolled
          ? "border-border bg-background/85 backdrop-blur-md"
          : "border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <a
          href="#hero"
          className="flex items-baseline gap-2"
          onClick={() => setOpen(false)}
        >
          <span className="font-serif-display text-2xl tracking-tight text-foreground">
            {museumInfo.name}
          </span>
          <span className="hidden font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground sm:inline">
            Museum of Art History
          </span>
        </a>

        <nav className="hidden items-center gap-1 md:flex">
          {NAV.map((n) => (
            <a
              key={n.href}
              href={n.href}
              className="rounded-full px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground transition hover:bg-card hover:text-foreground"
            >
              {n.label}
            </a>
          ))}
        </nav>

        <button
          type="button"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-foreground md:hidden"
          onClick={() => setOpen((o) => !o)}
          aria-label="Toggle navigation menu"
          aria-expanded={open}
        >
          {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </button>
      </div>

      {/* mobile menu */}
      {open && (
        <nav className="border-t border-border bg-background/95 px-4 py-3 backdrop-blur md:hidden">
          {NAV.map((n) => (
            <a
              key={n.href}
              href={n.href}
              onClick={() => setOpen(false)}
              className="block border-b border-border/50 py-2.5 font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground last:border-0 hover:text-foreground"
            >
              {n.label}
            </a>
          ))}
        </nav>
      )}
    </header>
  );
}
