import { useState, useMemo } from "react";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  Legend,
  ReferenceLine,
  Label,
} from "recharts";
import { Filter, SortAsc, SortDesc, Info } from "lucide-react";

// ─── Shared types ────────────────────────────────────────────────────────────

export interface CandidateData {
  catalyst_id: string;
  composition: string;
  activity: number;
  selectivity: number;
  stability: number;
  combined_score: number;
  uncertainty: number;
  source: "generated" | "retrieved";
  explanation?: string;
}

// ─── Colour helpers ──────────────────────────────────────────────────────────

const PRIMARY = "oklch(0.78 0.18 165)";
const ACCENT = "oklch(0.82 0.13 200)";
const AMBER = "oklch(0.82 0.15 75)";
const VIOLET = "oklch(0.70 0.20 280)";

// Interpolate grey → primary based on 0-1 value
function scoreColor(score: number): string {
  // Map 0→grey, 1→green (primary)
  const h = 165;
  const c = 0.04 + score * 0.14;
  const l = 0.35 + score * 0.45;
  return `oklch(${l.toFixed(2)} ${c.toFixed(2)} ${h})`;
}

// ─── Custom tooltip styles ────────────────────────────────────────────────────

const tooltipStyle = {
  backgroundColor: "var(--card)",
  border: "1px solid var(--border)",
  borderRadius: "8px",
  padding: "10px 14px",
  fontSize: "11px",
  fontFamily: "var(--font-mono, monospace)",
  color: "var(--foreground)",
  boxShadow: "0 4px 24px rgba(0,0,0,0.18)",
};

const axisStyle = {
  fontSize: 10,
  fontFamily: "var(--font-mono, monospace)",
  fill: "var(--muted-foreground)",
};

// ─── 1. Activity vs Selectivity Scatter Plot ──────────────────────────────────

interface ScatterTooltipProps {
  active?: boolean;
  payload?: Array<{ payload: CandidateData }>;
}

function ScatterTooltip({ active, payload }: ScatterTooltipProps) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div style={tooltipStyle}>
      <div style={{ fontWeight: 700, marginBottom: 6, color: PRIMARY }}>{d.composition}</div>
      <div>Activity: <span style={{ color: ACCENT }}>{d.activity.toFixed(1)}%</span></div>
      <div>Selectivity: <span style={{ color: PRIMARY }}>{d.selectivity.toFixed(1)}%</span></div>
      <div>Score: <span style={{ color: VIOLET }}>{d.combined_score.toFixed(3)}</span></div>
      <div style={{ marginTop: 4, opacity: 0.7 }}>{d.source === "generated" ? "NOVEL" : "KNOWN"}</div>
    </div>
  );
}

export function ActivitySelectivityScatter({ candidates }: { candidates: CandidateData[] }) {
  const [minScore, setMinScore] = useState(0);
  const [sourceFilter, setSourceFilter] = useState<"all" | "generated" | "retrieved">("all");

  const filtered = useMemo(
    () =>
      candidates.filter(
        (c) =>
          c.combined_score >= minScore &&
          (sourceFilter === "all" || c.source === sourceFilter),
      ),
    [candidates, minScore, sourceFilter],
  );

  const generated = filtered.filter((c) => c.source === "generated");
  const retrieved = filtered.filter((c) => c.source === "retrieved");

  return (
    <ChartCard
      title="Activity vs Selectivity"
      subtitle="Pareto frontier analysis"
      badge={`${filtered.length} candidates`}
      controls={
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <Filter className="h-3 w-3 text-muted-foreground" />
            <span className="font-mono text-[10px] text-muted-foreground">Min score:</span>
            <input
              type="range"
              min={0}
              max={0.9}
              step={0.05}
              value={minScore}
              onChange={(e) => setMinScore(parseFloat(e.target.value))}
              className="w-20 accent-primary h-1"
            />
            <span className="font-mono text-[10px] text-primary w-8">{minScore.toFixed(2)}</span>
          </div>
          <div className="flex gap-1">
            {(["all", "generated", "retrieved"] as const).map((s) => (
              <button
                key={s}
                onClick={() => setSourceFilter(s)}
                className={`font-mono text-[10px] px-2 py-0.5 rounded border transition-colors ${
                  sourceFilter === s
                    ? "border-primary/60 bg-primary/10 text-primary"
                    : "border-border text-muted-foreground hover:border-primary/30"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      }
    >
      <ResponsiveContainer width="100%" height={260}>
        <ScatterChart margin={{ top: 10, right: 20, bottom: 20, left: 0 }}>
          <CartesianGrid strokeDasharray="3 4" stroke="var(--border)" strokeOpacity={0.5} />
          <XAxis
            dataKey="activity"
            type="number"
            domain={[0, 100]}
            tick={axisStyle}
            tickLine={false}
            axisLine={{ stroke: "var(--border)" }}
          >
            <Label value="Activity (%)" offset={-10} position="insideBottom" style={{ ...axisStyle, fill: "var(--muted-foreground)" }} />
          </XAxis>
          <YAxis
            dataKey="selectivity"
            type="number"
            domain={[0, 100]}
            tick={axisStyle}
            tickLine={false}
            axisLine={{ stroke: "var(--border)" }}
          >
            <Label value="Selectivity (%)" angle={-90} position="insideLeft" offset={10} style={{ ...axisStyle, fill: "var(--muted-foreground)" }} />
          </YAxis>
          {/* 80% target lines */}
          <ReferenceLine x={80} stroke={PRIMARY} strokeDasharray="4 4" strokeOpacity={0.4} />
          <ReferenceLine y={80} stroke={PRIMARY} strokeDasharray="4 4" strokeOpacity={0.4} />
          <Tooltip content={<ScatterTooltip />} />
          <Scatter
            name="Novel"
            data={generated}
            fill={PRIMARY}
            fillOpacity={0.85}
            r={6}
          />
          <Scatter
            name="Known"
            data={retrieved}
            fill={ACCENT}
            fillOpacity={0.65}
            r={5}
          />
          <Legend
            wrapperStyle={{ fontSize: 10, fontFamily: "var(--font-mono, monospace)", color: "var(--muted-foreground)" }}
          />
        </ScatterChart>
      </ResponsiveContainer>
      <div className="flex items-center gap-2 mt-1 font-mono text-[10px] text-muted-foreground">
        <Info className="h-3 w-3" />
        Dashed lines mark 80% selectivity &amp; activity targets. Points in the upper-right quadrant are top candidates.
      </div>
    </ChartCard>
  );
}

// ─── 2. Stability Comparison Chart ───────────────────────────────────────────

interface StabilityTooltipProps {
  active?: boolean;
  payload?: Array<{ value: number; name: string }>;
  label?: string;
}

function StabilityTooltip({ active, payload, label }: StabilityTooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div style={tooltipStyle}>
      <div style={{ fontWeight: 700, marginBottom: 6, color: AMBER }}>{label}</div>
      {payload.map((p) => (
        <div key={p.name}>
          {p.name}: <span style={{ color: AMBER }}>{p.value?.toFixed(1)}</span>
        </div>
      ))}
    </div>
  );
}

type SortKey = "stability" | "composition";

export function StabilityComparisonChart({ candidates }: { candidates: CandidateData[] }) {
  const [sortKey, setSortKey] = useState<SortKey>("stability");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const sorted = useMemo(() => {
    const data = candidates.slice(0, 10).map((c) => ({
      name: c.composition.length > 14 ? c.composition.slice(0, 14) + "…" : c.composition,
      stability: parseFloat(c.stability.toFixed(1)),
      score: parseFloat((c.combined_score * 100).toFixed(1)),
      source: c.source,
    }));
    return data.sort((a, b) => {
      if (sortKey === "stability") {
        return sortDir === "desc" ? b.stability - a.stability : a.stability - b.stability;
      }
      const cmp = a.name.localeCompare(b.name);
      return sortDir === "desc" ? -cmp : cmp;
    });
  }, [candidates, sortKey, sortDir]);

  const toggleSort = (k: SortKey) => {
    if (sortKey === k) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortKey(k); setSortDir("desc"); }
  };

  return (
    <ChartCard
      title="Stability Comparison"
      subtitle="Thermal & chemical stability scores"
      badge={`Top ${sorted.length}`}
      controls={
        <div className="flex items-center gap-2">
          <span className="font-mono text-[10px] text-muted-foreground">Sort:</span>
          {(["stability", "composition"] as SortKey[]).map((k) => {
            const active = sortKey === k;
            const Icon = sortDir === "desc" ? SortDesc : SortAsc;
            return (
              <button
                key={k}
                onClick={() => toggleSort(k)}
                className={`flex items-center gap-1 font-mono text-[10px] px-2 py-0.5 rounded border transition-colors ${
                  active
                    ? "border-amber-500/60 bg-amber-500/10 text-amber-500"
                    : "border-border text-muted-foreground hover:border-amber-500/30"
                }`}
              >
                {active && <Icon className="h-3 w-3" />} {k}
              </button>
            );
          })}
        </div>
      }
    >
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={sorted} margin={{ top: 10, right: 10, bottom: 30, left: 0 }} barSize={22}>
          <CartesianGrid strokeDasharray="3 4" stroke="var(--border)" strokeOpacity={0.5} vertical={false} />
          <XAxis
            dataKey="name"
            tick={{ ...axisStyle, fontSize: 9 }}
            tickLine={false}
            axisLine={{ stroke: "var(--border)" }}
            angle={-35}
            textAnchor="end"
            interval={0}
          />
          <YAxis
            domain={[0, 100]}
            tick={axisStyle}
            tickLine={false}
            axisLine={false}
          >
            <Label value="Stability" angle={-90} position="insideLeft" offset={10} style={{ ...axisStyle, fill: "var(--muted-foreground)" }} />
          </YAxis>
          <Tooltip content={<StabilityTooltip />} />
          <ReferenceLine y={70} stroke={AMBER} strokeDasharray="4 4" strokeOpacity={0.5} />
          <Bar dataKey="stability" radius={[4, 4, 0, 0]}>
            {sorted.map((entry, idx) => (
              <Cell
                key={idx}
                fill={entry.source === "generated" ? AMBER : "oklch(0.60 0.10 75)"}
                fillOpacity={0.85 - idx * 0.04}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <div className="flex items-center gap-4 mt-1 font-mono text-[10px] text-muted-foreground">
        <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-sm" style={{ background: AMBER }} />Novel</span>
        <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-sm" style={{ background: "oklch(0.60 0.10 75)" }} />Known</span>
        <span className="ml-auto"><Info className="h-3 w-3 inline mr-1" />Dashed = 70% stability threshold</span>
      </div>
    </ChartCard>
  );
}

// ─── 3. Confidence Score Visualization (Radar) ────────────────────────────────

interface ConfidenceTooltipProps {
  active?: boolean;
  payload?: Array<{ value: number; name: string }>;
}

function ConfidenceTooltip({ active, payload }: ConfidenceTooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div style={tooltipStyle}>
      {payload.map((p, i) => (
        <div key={i}>
          {p.name}: <span style={{ color: VIOLET }}>{p.value?.toFixed(1)}</span>
        </div>
      ))}
    </div>
  );
}

export function ConfidenceScoreVisualization({ candidates }: { candidates: CandidateData[] }) {
  const [selected, setSelected] = useState<string | null>(null);

  // Take top 3 candidates for comparison
  const top3 = useMemo(
    () =>
      [...candidates]
        .sort((a, b) => b.combined_score - a.combined_score)
        .slice(0, 3),
    [candidates],
  );

  const active = selected ? candidates.find((c) => c.catalyst_id === selected) ?? top3[0] : top3[0];

  const radarData = active
    ? [
        { metric: "Selectivity", value: active.selectivity, fullMark: 100 },
        { metric: "Activity", value: active.activity, fullMark: 100 },
        { metric: "Stability", value: active.stability, fullMark: 100 },
        { metric: "Confidence", value: (1 - active.uncertainty) * 100, fullMark: 100 },
        { metric: "Composite", value: active.combined_score * 100, fullMark: 100 },
        { metric: "Novelty", value: active.source === "generated" ? 92 : 38, fullMark: 100 },
      ]
    : [];

  return (
    <ChartCard
      title="Confidence Score Analysis"
      subtitle="Multi-axis candidate performance radar"
      badge={active ? active.composition : "—"}
      controls={
        <div className="flex items-center gap-2 overflow-x-auto">
          <span className="font-mono text-[10px] text-muted-foreground shrink-0">Compare:</span>
          {top3.map((c) => (
            <button
              key={c.catalyst_id}
              onClick={() => setSelected(c.catalyst_id)}
              className={`font-mono text-[10px] px-2 py-0.5 rounded border whitespace-nowrap transition-colors ${
                (selected ?? top3[0]?.catalyst_id) === c.catalyst_id
                  ? "border-violet-500/60 bg-violet-500/10 text-violet-400"
                  : "border-border text-muted-foreground hover:border-violet-500/30"
              }`}
            >
              {c.composition.slice(0, 12)}
            </button>
          ))}
        </div>
      }
    >
      <div className="flex gap-4">
        <ResponsiveContainer width="60%" height={260}>
          <RadarChart data={radarData} margin={{ top: 10, right: 20, bottom: 10, left: 20 }}>
            <PolarGrid stroke="var(--border)" strokeOpacity={0.6} />
            <PolarAngleAxis
              dataKey="metric"
              tick={{ ...axisStyle, fontSize: 10, fill: "var(--muted-foreground)" }}
            />
            <Radar
              dataKey="value"
              stroke={VIOLET}
              fill={VIOLET}
              fillOpacity={0.15}
              strokeWidth={2}
            />
            <Tooltip content={<ConfidenceTooltip />} />
          </RadarChart>
        </ResponsiveContainer>
        {/* Numeric breakdown */}
        <div className="flex-1 flex flex-col justify-center space-y-2">
          {radarData.map((d) => {
            const pct = d.value / d.fullMark;
            return (
              <div key={d.metric}>
                <div className="flex justify-between font-mono text-[10px] mb-0.5">
                  <span className="text-muted-foreground">{d.metric}</span>
                  <span className="text-foreground">{d.value.toFixed(1)}</span>
                </div>
                <div className="h-1.5 rounded bg-secondary/50 overflow-hidden">
                  <div
                    className="h-full rounded transition-all duration-700"
                    style={{ width: `${pct * 100}%`, background: VIOLET, opacity: 0.75 + pct * 0.25 }}
                  />
                </div>
              </div>
            );
          })}
          {active && (
            <div className="mt-3 pt-3 border-t border-border/50">
              <div className="font-mono text-[10px] text-muted-foreground">Uncertainty</div>
              <div className="font-display text-lg text-violet-400">
                ±{(active.uncertainty * 100).toFixed(1)}%
              </div>
            </div>
          )}
        </div>
      </div>
    </ChartCard>
  );
}

// ─── 4. Candidate Ranking Heatmap ────────────────────────────────────────────

const HEATMAP_METRICS = ["activity", "selectivity", "stability", "combined_score"] as const;
type HeatmapMetric = (typeof HEATMAP_METRICS)[number];

const METRIC_LABELS: Record<HeatmapMetric, string> = {
  activity: "Activity",
  selectivity: "Selectivity",
  stability: "Stability",
  combined_score: "Score",
};

// Normalize a value within the range of all candidates
function normalize(val: number, min: number, max: number): number {
  if (max === min) return 0.5;
  return (val - min) / (max - min);
}

interface HeatmapCellProps {
  value: number;    // raw
  norm: number;     // 0-1
  metric: HeatmapMetric;
}

function HeatmapCell({ value, norm, metric }: HeatmapCellProps) {
  const display = metric === "combined_score" ? value.toFixed(2) : Math.round(value);
  const bg = scoreColor(norm);
  return (
    <div
      className="flex items-center justify-center h-10 rounded text-[11px] font-mono font-semibold transition-all duration-300 cursor-default"
      style={{
        background: bg,
        color: norm > 0.5 ? "oklch(0.15 0.05 165)" : "oklch(0.75 0.04 165)",
      }}
      title={`${METRIC_LABELS[metric]}: ${display}`}
    >
      {display}
    </div>
  );
}

export function CandidateRankingHeatmap({ candidates }: { candidates: CandidateData[] }) {
  const [sortMetric, setSortMetric] = useState<HeatmapMetric>("combined_score");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [highlight, setHighlight] = useState<string | null>(null);

  const { sorted, ranges } = useMemo(() => {
    const data = candidates.slice(0, 12);
    const ranges: Record<HeatmapMetric, { min: number; max: number }> = {
      activity: { min: Infinity, max: -Infinity },
      selectivity: { min: Infinity, max: -Infinity },
      stability: { min: Infinity, max: -Infinity },
      combined_score: { min: Infinity, max: -Infinity },
    };
    data.forEach((c) => {
      HEATMAP_METRICS.forEach((m) => {
        const v = c[m];
        if (v < ranges[m].min) ranges[m].min = v;
        if (v > ranges[m].max) ranges[m].max = v;
      });
    });
    const sorted = [...data].sort((a, b) =>
      sortDir === "desc" ? b[sortMetric] - a[sortMetric] : a[sortMetric] - b[sortMetric],
    );
    return { sorted, ranges };
  }, [candidates, sortMetric, sortDir]);

  const toggleSort = (m: HeatmapMetric) => {
    if (sortMetric === m) setSortDir((d) => (d === "desc" ? "asc" : "desc"));
    else { setSortMetric(m); setSortDir("desc"); }
  };

  return (
    <ChartCard
      title="Candidate Ranking Heatmap"
      subtitle="Cross-metric comparison at a glance"
      badge={`${sorted.length} candidates`}
      controls={
        <div className="flex items-center gap-1.5">
          <span className="font-mono text-[10px] text-muted-foreground">Sort by:</span>
          {HEATMAP_METRICS.map((m) => {
            const active = sortMetric === m;
            const Icon = sortDir === "desc" ? SortDesc : SortAsc;
            return (
              <button
                key={m}
                onClick={() => toggleSort(m)}
                className={`flex items-center gap-1 font-mono text-[10px] px-2 py-0.5 rounded border transition-colors ${
                  active
                    ? "border-primary/60 bg-primary/10 text-primary"
                    : "border-border text-muted-foreground hover:border-primary/30"
                }`}
              >
                {active && <Icon className="h-3 w-3" />}
                {METRIC_LABELS[m]}
              </button>
            );
          })}
        </div>
      }
    >
      {/* Header row */}
      <div className="grid gap-1" style={{ gridTemplateColumns: "1fr repeat(4, 1fr)" }}>
        <div className="font-mono text-[9px] text-muted-foreground uppercase tracking-widest self-end pb-1">
          Composition
        </div>
        {HEATMAP_METRICS.map((m) => (
          <button
            key={m}
            onClick={() => toggleSort(m)}
            className="font-mono text-[9px] text-muted-foreground uppercase tracking-widest text-center pb-1 hover:text-primary transition-colors"
          >
            {METRIC_LABELS[m]}
            {sortMetric === m && (sortDir === "desc" ? " ↓" : " ↑")}
          </button>
        ))}
      </div>

      <div className="space-y-1 mt-1 max-h-[320px] overflow-y-auto pr-1 scrollbar-thin">
        {sorted.map((c, idx) => (
          <div
            key={c.catalyst_id}
            className={`grid gap-1 rounded transition-all duration-200 ${
              highlight === c.catalyst_id ? "ring-1 ring-primary/40" : ""
            }`}
            style={{ gridTemplateColumns: "1fr repeat(4, 1fr)" }}
            onMouseEnter={() => setHighlight(c.catalyst_id)}
            onMouseLeave={() => setHighlight(null)}
          >
            {/* Rank + name */}
            <div className="flex items-center gap-1.5 h-10 px-1">
              <span className="font-mono text-[10px] text-muted-foreground w-4 text-right">
                {idx + 1}
              </span>
              <div className="min-w-0">
                <div className="font-medium text-[11px] truncate leading-tight">
                  {c.composition}
                </div>
                <div className="font-mono text-[9px] text-muted-foreground">
                  {c.source === "generated" ? (
                    <span className="text-accent">NOVEL</span>
                  ) : (
                    <span>KNOWN</span>
                  )}
                </div>
              </div>
            </div>

            {HEATMAP_METRICS.map((m) => (
              <HeatmapCell
                key={m}
                value={c[m]}
                norm={normalize(c[m], ranges[m].min, ranges[m].max)}
                metric={m}
              />
            ))}
          </div>
        ))}
      </div>

      {/* Colour scale legend */}
      <div className="flex items-center gap-2 mt-3 font-mono text-[10px] text-muted-foreground">
        <span>Low</span>
        <div className="flex-1 h-1.5 rounded overflow-hidden" style={{
          background: "linear-gradient(to right, oklch(0.35 0.04 165), oklch(0.78 0.18 165))"
        }} />
        <span>High</span>
      </div>
    </ChartCard>
  );
}

// ─── Chart Card wrapper ───────────────────────────────────────────────────────

interface ChartCardProps {
  title: string;
  subtitle?: string;
  badge?: string;
  controls?: React.ReactNode;
  children: React.ReactNode;
}

function ChartCard({ title, subtitle, badge, controls, children }: ChartCardProps) {
  return (
    <div className="bg-card/60 border border-border rounded-xl p-5 flex flex-col gap-3">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <span className="font-mono text-xs uppercase tracking-widest text-primary">{title}</span>
            {badge && (
              <span className="font-mono text-[9px] px-1.5 py-0.5 rounded bg-primary/10 text-primary border border-primary/20">
                {badge}
              </span>
            )}
          </div>
          {subtitle && (
            <p className="text-muted-foreground text-[11px]">{subtitle}</p>
          )}
        </div>
        {controls && <div className="flex-shrink-0">{controls}</div>}
      </div>
      {children}
    </div>
  );
}
