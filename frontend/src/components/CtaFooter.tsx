export function CtaFooter() {
  return (
    <section id="contact" className="relative py-32 border-t border-border/60 overflow-hidden">
      <div className="absolute inset-0" style={{ background: "var(--gradient-glow)" }} />
      <div className="absolute inset-0 grid-bg opacity-40" />
      <div className="relative mx-auto max-w-5xl px-6 text-center">
        <div className="font-mono text-xs uppercase tracking-[0.2em] text-primary mb-6">
          [ closing the loop ]
        </div>
        <h2 className="font-display text-5xl md:text-7xl leading-[0.95] tracking-tight text-balance">
          Compress timelines. Reduce waste. <span className="italic text-primary">Capture knowledge.</span>
        </h2>
        <p className="mt-8 text-lg text-muted-foreground max-w-2xl mx-auto">
          We're committed to a longer-term pilot with GPS Renewables — co-developing CATALYST AI with
          your chemical engineers and biologists to strengthen India's edge in sustainable fuels.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <a href="mailto:team@catalyst.ai" className="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 font-medium text-primary-foreground glow-emerald hover:opacity-90 transition">
            Start a pilot conversation →
          </a>
          <a href="#loop" className="inline-flex items-center gap-2 rounded-md border border-border bg-card/60 px-6 py-3 font-medium text-foreground hover:bg-card transition">
            Re-read the architecture
          </a>
        </div>
      </div>

      <footer className="relative mt-24 border-t border-border/60 pt-8">
        <div className="mx-auto max-w-7xl px-6 flex flex-col md:flex-row items-center justify-between gap-4 font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
          <div>© 2026 · CATALYST AI · A platform for molecular discovery</div>
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-blink" />
            System operational · Round 02 build
          </div>
        </div>
      </footer>
    </section>
  );
}
