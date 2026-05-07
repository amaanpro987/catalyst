export function ProblemSection() {
  return (
    <section className="relative py-28 border-t border-border/60">
      <div className="mx-auto max-w-7xl px-6 grid md:grid-cols-12 gap-12">
        <div className="md:col-span-4">
          <div className="font-mono text-xs uppercase tracking-[0.2em] text-primary mb-4">
            01 / The Problem
          </div>
          <h2 className="font-display text-4xl md:text-5xl leading-[1.05] tracking-tight">
            Discovery cycles are <em className="text-primary">too slow</em> and too expensive.
          </h2>
        </div>
        <div className="md:col-span-7 md:col-start-6 space-y-6 text-muted-foreground text-lg leading-relaxed">
          <p className="text-foreground text-xl">
            India's transition to a low-carbon economy depends on breakthroughs in catalysis and
            synthetic biology — for CO₂ to methanol, syngas to ethanol, ethanol to jet fuel, and
            biomass valorization.
          </p>
          <p>
            A single catalyst screening campaign takes months of bench time with low success rates.
            Enzyme and pathway optimization requires testing hundreds of variants. The design space
            is vast, experimental feedback is slow.
          </p>
          <p>
            Worse, institutional knowledge — what worked, what failed, and why — remains fragmented
            across lab notebooks, papers, and individual memory.
          </p>
          <div className="grid sm:grid-cols-3 gap-4 pt-6">
            {[
              { k: "Months", v: "per screening campaign" },
              { k: "Hundreds", v: "of variants per pathway" },
              { k: "Fragmented", v: "negative-result knowledge" },
            ].map((x) => (
              <div key={x.k} className="border-l-2 border-primary/40 pl-4">
                <div className="font-display text-2xl text-foreground">{x.k}</div>
                <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mt-1">{x.v}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
