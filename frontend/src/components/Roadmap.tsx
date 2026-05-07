export function Roadmap() {
  return (
    <section id="roadmap" className="relative py-28 border-t border-border/60">
      <div className="mx-auto max-w-7xl px-6">
        <div className="max-w-3xl mb-14">
          <div className="font-mono text-xs uppercase tracking-[0.2em] text-primary mb-4">06 / Roadmap</div>
          <h2 className="font-display text-4xl md:text-5xl leading-[1.05] tracking-tight">
            From hackathon demo to <span className="italic text-primary">production pilot.</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="relative rounded-2xl border border-primary/40 bg-primary/5 p-8" style={{ boxShadow: "var(--shadow-card)" }}>
            <div className="flex items-center justify-between mb-6">
              <span className="font-mono text-[10px] uppercase tracking-widest text-primary">Phase 01 · Now</span>
              <span className="h-2 w-2 rounded-full bg-primary animate-blink shadow-[0_0_12px] shadow-primary" />
            </div>
            <h3 className="font-display text-3xl mb-5">Hackathon Round 02</h3>
            <ul className="space-y-3 text-muted-foreground">
              {[
                "Focused workflow for one key reaction (Ethanol-to-Jet)",
                "Retrieval + basic generative variants + prediction + visualization",
                "Simple experiment logging with predicted-vs-actual comparison",
                "Live demo: full cycle from reaction input to discrepancy highlighting",
              ].map((x) => (
                <li key={x} className="flex gap-3 text-sm">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                  <span>{x}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="relative rounded-2xl border border-border bg-card p-8" style={{ boxShadow: "var(--shadow-card)" }}>
            <div className="flex items-center justify-between mb-6">
              <span className="font-mono text-[10px] uppercase tracking-widest text-accent">Phase 02 · Pilot</span>
              <span className="h-2 w-2 rounded-full bg-accent shadow-[0_0_12px] shadow-accent" />
            </div>
            <h3 className="font-display text-3xl mb-5">GPS Renewables Co-Development</h3>
            <ul className="space-y-3 text-muted-foreground">
              {[
                "Integration with internal experimental data",
                "Custom models fine-tuned on GPS reaction conditions",
                "Full synthetic biology module",
                "Multi-user collaboration and production deployment",
              ].map((x) => (
                <li key={x} className="flex gap-3 text-sm">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-accent shrink-0" />
                  <span>{x}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
