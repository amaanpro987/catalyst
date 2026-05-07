import protein from "@/assets/protein.jpg";
import pathway from "@/assets/pathway.jpg";
import molecule from "@/assets/hero-molecule.jpg";

const tracks = [
  {
    tag: "Direction 01",
    title: "Chemical Catalysis",
    img: molecule,
    bullets: [
      "Retrieve known catalysts + generate novel structural variants",
      "Predict activity, selectivity, and stability",
      "Visualize molecular structures, adsorption sites, reaction energy profiles",
    ],
  },
  {
    tag: "Direction 02",
    title: "Synthetic Biology",
    img: protein,
    bullets: [
      "Suggest enzyme variants, mutations, metabolic pathways",
      "Predict enzyme performance and pathway flux",
      "Visualize pathway maps with bottlenecks and mutation effects",
    ],
  },
  {
    tag: "Cross-Cutting",
    title: "Closed-Loop Learning",
    img: pathway,
    bullets: [
      "Predicted-vs-actual deviation analysis",
      "Outlier flagging + auto-generated hypotheses",
      "Incremental retraining with drift safeguards",
    ],
  },
];

export function Capabilities() {
  return (
    <section id="capabilities" className="relative py-28 border-t border-border/60">
      <div className="mx-auto max-w-7xl px-6">
        <div className="max-w-3xl mb-14">
          <div className="font-mono text-xs uppercase tracking-[0.2em] text-primary mb-4">04 / Capabilities</div>
          <h2 className="font-display text-4xl md:text-5xl leading-[1.05] tracking-tight">
            Two reaction worlds. <span className="italic text-primary">One platform.</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {tracks.map((t) => (
            <article
              key={t.title}
              className="group relative rounded-2xl border border-border bg-card overflow-hidden hover:border-primary/50 transition-colors"
              style={{ boxShadow: "var(--shadow-card)" }}
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-ink">
                <img
                  src={t.img}
                  alt={t.title}
                  loading="lazy"
                  width={1024}
                  height={768}
                  className="h-full w-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-card via-card/40 to-transparent" />
                <div className="absolute top-4 left-4 font-mono text-[10px] uppercase tracking-widest text-primary bg-background/80 backdrop-blur px-2.5 py-1 rounded">
                  {t.tag}
                </div>
              </div>
              <div className="p-6">
                <h3 className="font-display text-2xl mb-4">{t.title}</h3>
                <ul className="space-y-3">
                  {t.bullets.map((b) => (
                    <li key={b} className="flex gap-3 text-sm text-muted-foreground">
                      <span className="mt-1.5 h-1 w-1 rounded-full bg-primary flex-shrink-0" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
