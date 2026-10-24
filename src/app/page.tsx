import { SpotlightHero } from "@/components/museum/spotlight-hero";
import { Magnifier } from "@/components/museum/magnifier";
import { GenreTimeline } from "@/components/museum/genre-timeline";
import { VirtualTour } from "@/components/museum/virtual-tour";
import { AudioGuide } from "@/components/museum/audio-guide";
import { MuseumHeader } from "@/components/museum/museum-header";
import { MuseumFooter } from "@/components/museum/museum-footer";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <MuseumHeader />

      <main className="flex-1">
        <SpotlightHero />

        <Magnifier />

        <GenreTimeline />

        <VirtualTour />

        <AudioGuide />

        {/* closing invitation */}
        <section className="border-t border-border bg-background py-16 text-center sm:py-24">
          <div className="mx-auto max-w-2xl px-4 sm:px-6">
            <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.35em] text-primary/80">
              The Galleries Await
            </p>
            <h2 className="font-serif-display text-3xl text-foreground sm:text-4xl lg:text-5xl">
              Begin Your Visit
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
              Five centuries of painting, sculpture and the moving image,
              gathered under one roof. Scroll back to the spotlight, hover the
              conservator&apos;s lens, walk the halls, and let the audio guide
              read the wall for you.
            </p>
            <a
              href="#hero"
              className="mt-6 inline-flex items-center rounded-full border border-primary/60 px-6 py-2.5 font-mono text-[11px] uppercase tracking-[0.25em] text-primary transition hover:bg-primary hover:text-primary-foreground"
            >
              Return to the Spotlight
            </a>
          </div>
        </section>
      </main>

      <MuseumFooter />
    </div>
  );
}
