import { Database, Sparkles, Atom, BarChart3, FlaskConical, RefreshCw } from "lucide-react";

const steps = [
  { icon: Database, label: "Knowledge Retrieval", note: "Materials Project · OC22 · BRENDA · UniProt" },
  { icon: Sparkles, label: "Generative Design", note: "Graph + diffusion · novel candidates" },
  { icon: Atom, label: "Multi-Scale Prediction", note: "GNNs · MLIPs · flux balance" },
  { icon: BarChart3, label: "Ranking & Visualization", note: "3D viewers · uncertainty bands" },
  { icon: FlaskConical, label: "Experimental Export", note: "Pre-filled lab protocols" },
  { icon: RefreshCw, label: "Feedback & Retraining", note: "Discrepancy analysis · safe drift control" },
];

export function ClosedLoop() {
  return (
    <section id="loop" className="relative py-28 border-t border-border/60 overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-30" />
      <div className="relative mx-auto max-w-7xl px-6">
        <div className="max-w-3xl mb-16">
          <div className="font-mono text-xs uppercase tracking-[0.2em] text-primary mb-4">03 / Architecture</div>
          <h2 className="font-display text-4xl md:text-5xl leading-[1.05] tracking-tight">
            One loop. <span className="italic text-primary">Six stages.</span> Every experiment makes the next one smarter.
          </h2>
        </div>

        <div className="relative grid md:grid-cols-3 gap-4">
          {steps.map((s, i) => {
            const Icon = s.icon;
            return (
              <div
                key={s.label}
                className="group relative rounded-xl border border-border bg-card/60 p-6 hover:border-primary/60 transition-colors"
                style={{ boxShadow: "var(--shadow-card)" }}
              >
                <div className="flex items-start justify-between mb-6">
                  <div className="h-11 w-11 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center text-primary group-hover:bg-primary/20 transition">
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="font-mono text-[10px] text-muted-foreground">
                    STAGE_{String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <h3 className="font-display text-xl mb-2">{s.label}</h3>
                <p className="text-sm text-muted-foreground">{s.note}</p>
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute -right-2 top-1/2 -translate-y-1/2 text-primary/40 z-10">→</div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-12 rounded-xl border border-primary/30 bg-primary/5 p-6 md:p-8 flex flex-col md:flex-row gap-6 items-start">
          <div className="font-mono text-[10px] uppercase tracking-widest text-primary shrink-0 mt-1">
            Critical<br />Differentiator
          </div>
          <div>
            <h4 className="font-display text-2xl mb-2">The feedback loop is the product.</h4>
            <p className="text-muted-foreground">
              Researchers log results — yield, selectivity, observations — into a structured form pre-filled
              with the model's predictions. The platform computes <span className="text-foreground">predicted vs.
              actual deviation</span>, surfaces hypotheses like <em className="text-primary">"steric hindrance at site
              X likely underestimated"</em>, and uses verified data for incremental retraining with safeguards
              against drift and low-quality entries.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
