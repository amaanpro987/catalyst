const rows = [
  { dim: "Candidate Generation", common: "Database search only", us: "Generative AI proposes novel designs" },
  { dim: "Model Learning", common: "Static, one-shot predictions", us: "Continuously retrained on experimental feedback" },
  { dim: "Experimental Integration", common: "Manual, disconnected", us: "Structured loop with discrepancy analysis" },
  { dim: "Scientist Experience", common: "Black-box outputs", us: "Interactive viz + explainable predictions" },
  { dim: "Knowledge Capture", common: "Positive results only", us: "Negative results refine future models" },
];

export function UspTable() {
  return (
    <section id="platform" className="relative py-28 border-t border-border/60 bg-card/30">
      <div className="mx-auto max-w-7xl px-6">
        <div className="max-w-3xl mb-14">
          <div className="font-mono text-xs uppercase tracking-[0.2em] text-primary mb-4">02 / Core USP</div>
          <h2 className="font-display text-4xl md:text-5xl leading-[1.05] tracking-tight">
            Not another prediction tool. <span className="italic text-primary">A closed-loop platform.</span>
          </h2>
          <p className="mt-5 text-lg text-muted-foreground">
            AI augments researchers — never replaces them. Every novel candidate passes an SME
            plausibility gate. Every prediction comes with uncertainty. Every experiment teaches
            the next one.
          </p>
        </div>

        <div className="rounded-xl border border-border bg-background/60 overflow-hidden">
          <div className="grid grid-cols-12 px-6 py-4 border-b border-border font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            <div className="col-span-4">Dimension</div>
            <div className="col-span-4">Common Approaches</div>
            <div className="col-span-4 text-primary">CATALYST AI</div>
          </div>
          {rows.map((r, i) => (
            <div key={r.dim} className={`grid grid-cols-12 px-6 py-5 items-center ${i !== rows.length - 1 ? "border-b border-border/60" : ""}`}>
              <div className="col-span-4 font-display text-lg">{r.dim}</div>
              <div className="col-span-4 text-sm text-muted-foreground">{r.common}</div>
              <div className="col-span-4 text-sm text-foreground flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0 shadow-[0_0_10px] shadow-primary" />
                {r.us}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
