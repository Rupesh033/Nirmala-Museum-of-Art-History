import { museumInfo } from "@/lib/museum-data";

export function MuseumFooter() {
  return (
    <footer className="mt-auto w-full border-t border-border bg-background">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="sm:col-span-2 lg:col-span-1">
            <p className="font-serif-display text-3xl tracking-tight text-foreground">
              {museumInfo.name}
            </p>
            <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
              Museum of Art History
            </p>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
              {museumInfo.tagline}
            </p>
          </div>

          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-primary/80">
              Visit
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              {museumInfo.hours}
            </p>
            <p className="text-sm text-muted-foreground">
              {museumInfo.address}
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Founded {museumInfo.founded}
            </p>
          </div>

          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-primary/80">
              Galleries
            </p>
            <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
              <li>
                <a href="#hero" className="hover:text-foreground">
                  Spotlight
                </a>
              </li>
              <li>
                <a href="#magnifier" className="hover:text-foreground">
                  Conservator&apos;s Lens
                </a>
              </li>
              <li>
                <a href="#timeline" className="hover:text-foreground">
                  Genre Timeline
                </a>
              </li>
              <li>
                <a href="#tour" className="hover:text-foreground">
                  Virtual Tour
                </a>
              </li>
              <li>
                <a href="#audio" className="hover:text-foreground">
                  Audio Guide
                </a>
              </li>
            </ul>
          </div>

          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-primary/80">
              The Museum
            </p>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              A not-for-profit institution dedicated to the study and display
              of Western painting, from the Gothic cathedral to the
              contemporary white cube.
            </p>
          </div>
        </div>

        <div className="gold-hr my-8" />

        <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
            © {new Date().getFullYear()} {museumInfo.fullName}. All rights
            reserved.
          </p>
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
            Curatorial · Conservation · Education
          </p>
        </div>

        <div className="mt-6 flex flex-col items-center gap-2 border-t border-border/50 pt-6 text-center sm:flex-row sm:justify-center">
          <span className="font-serif text-sm italic text-muted-foreground">
            Design by
          </span>
          <a
            href="https://www.rupeshvish.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-serif text-sm font-medium tracking-wide text-primary transition-colors hover:text-primary/80 hover:underline"
          >
            Rupesh Vishwakarma
          </a>
          <span className="hidden font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground sm:inline">
            · Web &amp; UI Designer
          </span>
        </div>
      </div>
    </footer>
  );
}
