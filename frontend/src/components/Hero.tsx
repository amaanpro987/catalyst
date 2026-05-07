import heroMolecule from "@/assets/hero-molecule.jpg";

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-32 pb-24 noise">
      <div className="absolute inset-0 grid-bg opacity-60" />
      <div
        className="absolute inset-0"
        style={{ background: "var(--gradient-glow)" }}
      />

      <div className="relative mx-auto max-w-7xl px-6 grid lg:grid-cols-12 gap-10 items-center">
        <div className="lg:col-span-7 space-y-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.18em] text-primary">
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-blink" />
            GPS Renewables × Hackathon Round 02
          </div>

          <h1 className="font-display text-5xl md:text-7xl lg:text-[5.5rem] leading-[0.95] tracking-tight text-balance">
            Discovering molecules
            <span className="block italic text-primary text-glow">at the speed</span>
            <span className="block">of computation.</span>
          </h1>

          <p className="max-w-xl text-lg text-muted-foreground text-pretty leading-relaxed">
            CATALYST AI is an end-to-end discovery platform for chemical catalysis and synthetic
            biology — closing the loop between generative models, prediction engines, and the
            wet lab. Built for CO₂ → methanol, ethanol → jet fuel, and biomass valorization.
          </p>

          <div className="flex flex-wrap gap-3">
            <a href="#loop" className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-3 font-medium text-primary-foreground glow-emerald hover:opacity-90 transition">
              See the closed loop →
            </a>
            <a href="#capabilities" className="inline-flex items-center gap-2 rounded-md border border-border bg-card/60 px-5 py-3 font-medium text-foreground hover:bg-card transition">
              Explore capabilities
            </a>
          </div>

          <dl className="grid grid-cols-3 gap-6 pt-8 border-t border-border/60 max-w-lg">
            {[
              { k: "10×", v: "Faster discovery cycles" },
              { k: "40%", v: "Less experimental waste" },
              { k: "∞", v: "Institutional knowledge" },
            ].map((s) => (
              <div key={s.k}>
                <dt className="font-display text-3xl text-primary">{s.k}</dt>
                <dd className="mt-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{s.v}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="lg:col-span-5 relative aspect-square">
          <div className="absolute inset-0 rounded-full bg-primary/10 blur-3xl animate-pulse-glow" />
          <div className="absolute inset-0 animate-drift">
            <img
              src={heroMolecule}
              alt="CATALYST AI generative molecular catalyst structure"
              width={1536}
              height={1536}
              className="h-full w-full object-cover rounded-full mix-blend-screen"
            />
          </div>
          {/* Orbiting markers */}
          <div className="absolute inset-0 animate-orbit-slow">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 h-2 w-2 rounded-full bg-accent shadow-[0_0_20px] shadow-accent" />
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-2 w-2 rounded-full bg-primary shadow-[0_0_20px] shadow-primary" />
          </div>
          {/* Data labels */}
          <div className="absolute top-6 right-0 font-mono text-[10px] text-primary/80 text-right">
            <div>RXN_ID · ETH→JET_021</div>
            <div className="text-muted-foreground">ΔG = −124.3 kJ/mol</div>
          </div>
          <div className="absolute bottom-6 left-0 font-mono text-[10px] text-accent/80">
            <div>SELECTIVITY · 0.87</div>
            <div className="text-muted-foreground">σ ± 0.04</div>
          </div>
        </div>
      </div>
    </section>
  );
}
