const stack = [
  { layer: "Generative", tools: ["Graph Neural Networks", "Diffusion Models", "OC20 / OC22"], note: "Strong on catalysis benchmarks" },
  { layer: "Prediction", tools: ["SchNet · DimeNet GNNs", "ESM-2", "Flux balance + ML"], note: "Catalysis + biology coverage" },
  { layer: "Visualization", tools: ["NGL Viewer", "3Dmol.js", "Plotly / Dash"], note: "Interactive 3D + dashboards" },
  { layer: "Backend", tools: ["Python", "FastAPI", "PyTorch"], note: "Production-grade research stack" },
  { layer: "Storage", tools: ["PostgreSQL", "MinIO", "MLflow"], note: "Metadata · molecular files · model versioning" },
];

const risks = [
  { r: "Invalid generated structures", m: "Valency / steric checks + SME review gate" },
  { r: "Model degradation", m: "A/B testing with rollback capability" },
  { r: "Data scarcity", m: "Transfer learning + active learning" },
  { r: "Over-reliance on AI", m: "Prominent uncertainty + human-in-the-loop gates" },
];

export function StackSection() {
  return (
    <section id="stack" className="relative py-28 border-t border-border/60 bg-card/30">
      <div className="mx-auto max-w-7xl px-6 grid lg:grid-cols-2 gap-16">
        <div>
          <div className="font-mono text-xs uppercase tracking-[0.2em] text-primary mb-4">05 / Tech Stack</div>
          <h2 className="font-display text-4xl md:text-5xl leading-[1.05] tracking-tight mb-10">
            Built on proven<br />open science.
          </h2>
          <div className="space-y-4">
            {stack.map((s) => (
              <div key={s.layer} className="border-l-2 border-primary/40 pl-5 py-1">
                <div className="flex items-baseline justify-between gap-4">
                  <span className="font-display text-xl">{s.layer}</span>
                  <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{s.note}</span>
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {s.tools.map((t) => (
                    <span key={t} className="font-mono text-xs px-2.5 py-1 rounded border border-border bg-background/60 text-foreground/90">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="font-mono text-xs uppercase tracking-[0.2em] text-amber-warn mb-4">Risks & Mitigations</div>
          <h2 className="font-display text-4xl md:text-5xl leading-[1.05] tracking-tight mb-10">
            Honest about<br />the hard parts.
          </h2>
          <div className="space-y-3">
            {risks.map((x) => (
              <div key={x.r} className="rounded-lg border border-border bg-background/60 p-5">
                <div className="flex items-start gap-3">
                  <span className="font-mono text-[10px] uppercase tracking-widest text-amber-warn shrink-0 mt-1">RISK</span>
                  <span className="font-display text-lg">{x.r}</span>
                </div>
                <div className="mt-2 flex items-start gap-3 pl-[52px]">
                  <span className="font-mono text-[10px] uppercase tracking-widest text-primary shrink-0 mt-1">MITIG</span>
                  <span className="text-sm text-muted-foreground">{x.m}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
