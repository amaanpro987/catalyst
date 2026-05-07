import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  Atom, FlaskConical, Database, Sparkles, BarChart3, RefreshCw,
  Send, Beaker, Activity, AlertTriangle, CheckCircle2, Layers,
  ChevronRight, Search, Settings, Home, BookOpen, Cpu, Zap, Bot, User,
  FileText, ArrowRight, Clock, Target, PlayCircle, ShieldCheck
} from "lucide-react";

export const Route = createFileRoute("/workspace")({
  component: Workspace,
  head: () => ({
    meta: [
      { title: "Workspace — CATALYST AI" },
      { name: "description", content: "AI research workspace for catalyst discovery: generative design, prediction, and closed-loop experimental feedback." },
    ],
  }),
});

const navItems = [
  { icon: Home, label: "Overview" },
  { icon: Sparkles, label: "Discovery" },
  { icon: Atom, label: "Candidates" },
  { icon: BarChart3, label: "Predictions" },
  { icon: FlaskConical, label: "Experiments" },
  { icon: RefreshCw, label: "Feedback Loop" },
  { icon: Database, label: "Knowledge Base" },
  { icon: BookOpen, label: "Protocols" },
];

const projects = [
  { name: "CO₂ → Methanol", status: "active", tag: "Cu/ZnO" },
  { name: "Ethanol → Jet Fuel", status: "running", tag: "Zeolite" },
  { name: "Lignin Valorization", status: "draft", tag: "Enzyme" },
];

const candidates = [
  { id: "CAT-0241", formula: "Cu₃Zn₁Al₀.₅Oₓ", score: 0.94, sel: 87, conv: 62, ea: 38, novel: true },
  { id: "CAT-0238", formula: "Cu₂ZnGa₀.₃Oₓ", score: 0.91, sel: 82, conv: 71, ea: 41, novel: true },
  { id: "CAT-0235", formula: "Pd₀.₅Cu₂.₅Oₓ", score: 0.88, sel: 79, conv: 58, ea: 35, novel: false },
  { id: "CAT-0231", formula: "Cu₃Zn₁Zr₀.₂Oₓ", score: 0.85, sel: 75, conv: 66, ea: 44, novel: true },
  { id: "CAT-0220", formula: "Pt₁Ni₃Oₓ", score: 0.82, sel: 72, conv: 80, ea: 48, novel: true },
  { id: "CAT-0215", formula: "Ru₀.₁Cu₂.₉Oₓ", score: 0.79, sel: 68, conv: 55, ea: 52, novel: false },
];

const chatMessages = [
  { role: "assistant" as const, text: "Initialized CO₂→methanol discovery cycle. Retrieved 1,284 reference structures from Materials Project + OC22." },
  { role: "user" as const, text: "Prioritize candidates with selectivity > 80% and Cu-based supports." },
  { role: "assistant" as const, text: "Filtered 47 candidates. Top 4 shown in workspace. CAT-0241 shows 12% higher selectivity than literature baseline (Cu/ZnO/Al₂O₃, Behrens 2012)." },
];

function Stat({ label, value, suffix }: { label: string; value: number | string; suffix?: string }) {
  return (
    <div className="rounded border border-border/60 bg-background/40 py-1.5 px-3 text-center">
      <div className="font-display text-base">{value}{suffix ? <span className="text-[10px] text-muted-foreground ml-0.5">{suffix}</span> : ""}</div>
      <div className="font-mono text-[9px] text-muted-foreground">{label}</div>
    </div>
  );
}

function Molecule3D() {
  return (
    <svg viewBox="0 0 320 280" className="w-full h-full">
      <defs>
        <radialGradient id="atomP" cx="0.3" cy="0.3">
          <stop offset="0" stopColor="oklch(0.92 0.18 165)" />
          <stop offset="1" stopColor="oklch(0.45 0.18 165)" />
        </radialGradient>
        <radialGradient id="atomA" cx="0.3" cy="0.3">
          <stop offset="0" stopColor="oklch(0.92 0.13 200)" />
          <stop offset="1" stopColor="oklch(0.40 0.13 200)" />
        </radialGradient>
        <radialGradient id="atomW" cx="0.3" cy="0.3">
          <stop offset="0" stopColor="oklch(0.95 0.15 75)" />
          <stop offset="1" stopColor="oklch(0.50 0.15 75)" />
        </radialGradient>
      </defs>
      <g className="animate-orbit-slow" style={{ transformOrigin: "160px 140px" }}>
        <g stroke="oklch(0.78 0.18 165 / 0.5)" strokeWidth="2">
          <line x1="160" y1="140" x2="80" y2="80" />
          <line x1="160" y1="140" x2="240" y2="80" />
          <line x1="160" y1="140" x2="80" y2="200" />
          <line x1="160" y1="140" x2="240" y2="200" />
          <line x1="160" y1="140" x2="160" y2="40" />
          <line x1="160" y1="140" x2="160" y2="240" />
        </g>
        <circle cx="160" cy="140" r="22" fill="url(#atomP)" />
        <circle cx="80" cy="80" r="14" fill="url(#atomA)" />
        <circle cx="240" cy="80" r="14" fill="url(#atomA)" />
        <circle cx="80" cy="200" r="14" fill="url(#atomW)" />
        <circle cx="240" cy="200" r="14" fill="url(#atomW)" />
        <circle cx="160" cy="40" r="11" fill="url(#atomA)" />
        <circle cx="160" cy="240" r="11" fill="url(#atomW)" />
      </g>
      <ellipse cx="160" cy="140" rx="110" ry="40" fill="none" stroke="oklch(0.78 0.18 165 / 0.2)" strokeDasharray="3 6" />
      <ellipse cx="160" cy="140" rx="40" ry="110" fill="none" stroke="oklch(0.82 0.13 200 / 0.2)" strokeDasharray="3 6" />
    </svg>
  );
}

function Sparkline() {
  const pts = [82, 78, 74, 71, 68, 64, 60, 57, 54, 52, 49, 47, 45, 43];
  const max = Math.max(...pts), min = Math.min(...pts);
  const w = 280, h = 50;
  const path = pts.map((p, i) => {
    const x = (i / (pts.length - 1)) * w;
    const y = h - ((p - min) / (max - min)) * h;
    return `${i === 0 ? "M" : "L"}${x},${y}`;
  }).join(" ");
  return (
    <svg viewBox={`0 0 ${w} ${h + 10}`} className="w-full h-14">
      <path d={`${path} L${w},${h} L0,${h} Z`} fill="oklch(0.78 0.18 165 / 0.15)" />
      <path d={path} fill="none" stroke="oklch(0.78 0.18 165)" strokeWidth="1.5" />
      {pts.map((p, i) => {
        const x = (i / (pts.length - 1)) * w;
        const y = h - ((p - min) / (max - min)) * h;
        return <circle key={i} cx={x} cy={y} r="1.5" fill="oklch(0.78 0.18 165)" />;
      })}
    </svg>
  );
}

function OverviewView() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-display">Welcome back, Dr. Sharma</h1>
          <p className="text-muted-foreground text-sm mt-1">Here's the status of your catalyst discovery pipeline.</p>
        </div>
        <button className="bg-primary text-primary-foreground px-4 py-2 rounded-md font-mono text-xs uppercase flex items-center gap-2 hover:opacity-90">
          <Zap className="h-4 w-4" /> New Project
        </button>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Active Projects", val: "3", icon: Target, col: "text-primary" },
          { label: "Candidates Generated", val: "1,492", icon: Sparkles, col: "text-accent" },
          { label: "Experiments Logged", val: "18", icon: FlaskConical, col: "text-amber-500" },
          { label: "Compute Hours", val: "342h", icon: Cpu, col: "text-blue-500" },
        ].map(s => (
          <div key={s.label} className="bg-card/60 border border-border p-5 rounded-xl">
            <div className={`mb-3 ${s.col}`}><s.icon className="h-6 w-6" /></div>
            <div className="font-display text-3xl mb-1">{s.val}</div>
            <div className="font-mono text-[10px] uppercase text-muted-foreground">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-card/60 border border-border p-5 rounded-xl">
          <h2 className="font-mono text-xs uppercase tracking-widest text-primary mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {[
              { text: "Model retraining completed for CO2 reduction.", time: "2h ago", icon: RefreshCw },
              { text: "New synthesis protocol generated for CAT-0241.", time: "5h ago", icon: FileText },
              { text: "GC-MS results uploaded by Lab-A.", time: "1d ago", icon: CheckCircle2 },
            ].map((a, i) => (
              <div key={i} className="flex gap-3 text-sm">
                <a.icon className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                <div className="flex-1">
                  <div className="text-foreground">{a.text}</div>
                  <div className="text-muted-foreground text-xs">{a.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-card/60 border border-border p-5 rounded-xl">
          <h2 className="font-mono text-xs uppercase tracking-widest text-primary mb-4">Active Projects Status</h2>
          <div className="space-y-4">
            {projects.map((p) => (
              <div key={p.name} className="flex items-center justify-between p-3 rounded bg-background/40 border border-border/50">
                <div className="flex items-center gap-3">
                  <div className={`h-2 w-2 rounded-full ${p.status === 'active' ? 'bg-primary' : 'bg-muted-foreground'}`} />
                  <span className="font-medium">{p.name}</span>
                </div>
                <span className="font-mono text-[10px] text-muted-foreground">{p.tag}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function CandidatesView() {
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-display">Candidate Pool</h1>
          <p className="text-muted-foreground text-sm mt-1">Explore all generated and retrieved candidates for the current project.</p>
        </div>
        <div className="flex gap-2">
          <button className="px-3 py-1.5 border border-border bg-card rounded text-sm flex items-center gap-2 hover:bg-secondary">
            <Search className="h-4 w-4" /> Filter
          </button>
          <button className="px-3 py-1.5 bg-primary text-primary-foreground rounded text-sm hover:opacity-90">
            Export CSV
          </button>
        </div>
      </div>

      <div className="border border-border rounded-xl bg-card/60 overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-background/80 font-mono text-[10px] uppercase text-muted-foreground border-b border-border">
            <tr>
              <th className="px-4 py-3">ID</th>
              <th className="px-4 py-3">Formula</th>
              <th className="px-4 py-3">Score</th>
              <th className="px-4 py-3">Selectivity</th>
              <th className="px-4 py-3">Conversion</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {candidates.map((c) => (
              <tr key={c.id} className="hover:bg-secondary/40 transition-colors">
                <td className="px-4 py-3 font-mono text-xs">{c.id}</td>
                <td className="px-4 py-3 font-medium">{c.formula}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-1.5 rounded bg-secondary overflow-hidden">
                      <div className="h-full bg-primary" style={{ width: `${c.score * 100}%` }} />
                    </div>
                    <span className="font-mono text-xs">{c.score.toFixed(2)}</span>
                  </div>
                </td>
                <td className="px-4 py-3 font-mono text-xs">{c.sel}%</td>
                <td className="px-4 py-3 font-mono text-xs">{c.conv}%</td>
                <td className="px-4 py-3">
                  {c.novel ? 
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-accent/20 text-accent border border-accent/40">NOVEL</span> :
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-muted text-muted-foreground border border-border">LIT</span>
                  }
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function PredictionsView() {
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-display">Prediction Models</h1>
          <p className="text-muted-foreground text-sm mt-1">Review GNN and MLIP prediction confidences and uncertainties.</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-card/60 border border-border p-5 rounded-xl h-80 flex flex-col items-center justify-center text-muted-foreground">
           <BarChart3 className="h-10 w-10 mb-4 opacity-50" />
           <p>Selectivity vs Conversion Distribution Chart</p>
           <p className="text-xs mt-2">(Recharts placeholder)</p>
        </div>
        <div className="bg-card/60 border border-border p-5 rounded-xl h-80 flex flex-col items-center justify-center text-muted-foreground">
           <Activity className="h-10 w-10 mb-4 opacity-50" />
           <p>Uncertainty Quantification</p>
           <p className="text-xs mt-2">(Recharts placeholder)</p>
        </div>
      </div>
    </div>
  );
}

function ExperimentsView() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-display mb-1">Experiment Logs</h1>
      <p className="text-muted-foreground text-sm mb-6">Track physical synthesis and testing of selected candidates.</p>
      
      <div className="grid grid-cols-3 gap-6">
        {['Queued', 'In Progress', 'Completed'].map((col, idx) => (
          <div key={col} className="bg-card/40 border border-border rounded-xl p-4 min-h-[500px]">
            <h3 className="font-mono text-xs uppercase tracking-widest text-primary mb-4 flex justify-between items-center">
              {col} <span className="bg-secondary px-2 py-0.5 rounded text-foreground">{idx === 0 ? 2 : idx === 1 ? 1 : 4}</span>
            </h3>
            {idx === 1 && (
              <div className="bg-background border border-primary/40 rounded-lg p-3 shadow-sm mb-3">
                <div className="flex justify-between items-start mb-2">
                  <span className="font-mono text-xs text-primary">CAT-0241</span>
                  <span className="text-[10px] text-muted-foreground">Lab-A</span>
                </div>
                <div className="text-sm font-medium mb-3">Co-precipitation synthesis</div>
                <div className="w-full bg-secondary h-1.5 rounded-full overflow-hidden">
                  <div className="bg-primary h-full w-[60%] animate-pulse" />
                </div>
              </div>
            )}
            {idx === 2 && (
              <div className="bg-background border border-border rounded-lg p-3 shadow-sm mb-3">
                <div className="flex justify-between items-start mb-2">
                  <span className="font-mono text-xs text-muted-foreground">CAT-0215</span>
                  <ShieldCheck className="h-3.5 w-3.5 text-accent" />
                </div>
                <div className="text-sm font-medium mb-1">GC-MS Analysis</div>
                <div className="text-xs text-muted-foreground">Results logged. Sel: 67%</div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function FeedbackLoopView() {
  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <RefreshCw className="h-12 w-12 text-primary mx-auto mb-4" />
        <h1 className="text-3xl font-display">Closed-Loop Feedback</h1>
        <p className="text-muted-foreground mt-2">Aligning physical experiment outcomes with AI predictions to fine-tune models.</p>
      </div>

      <div className="bg-[oklch(0.82_0.15_75)]/5 border border-[oklch(0.82_0.15_75)]/40 p-6 rounded-xl">
        <div className="flex items-center gap-3 mb-4 text-[oklch(0.82_0.15_75)]">
          <AlertTriangle className="h-5 w-5" />
          <h2 className="text-lg font-medium">Active Discrepancy Detected</h2>
        </div>
        <p className="text-sm text-foreground/90 mb-6">
          Recent experiments on Cu-based candidates show a systematic underestimation of selectivity by 8-12%. 
          The model predicted 72% average selectivity, while lab results yield 81%.
        </p>
        <button className="bg-[oklch(0.82_0.15_75)] text-white px-4 py-2 rounded font-mono text-xs uppercase flex items-center gap-2 hover:opacity-90">
          <Zap className="h-4 w-4" /> Initiate Retraining Cycle
        </button>
      </div>

      <div className="bg-card/60 border border-border p-6 rounded-xl">
        <h3 className="font-mono text-xs uppercase tracking-widest text-primary mb-4">Retraining History</h3>
        <table className="w-full text-sm text-left">
          <thead>
            <tr className="text-muted-foreground border-b border-border">
              <th className="pb-2">Date</th>
              <th className="pb-2">Model Version</th>
              <th className="pb-2">Trigger</th>
              <th className="pb-2">Improvement</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            <tr>
              <td className="py-3 text-muted-foreground">2026-04-12</td>
              <td className="py-3 font-mono">v1.4.2</td>
              <td className="py-3">Conv% overestimation in Zeolites</td>
              <td className="py-3 text-primary">+4.2% Accuracy</td>
            </tr>
            <tr>
              <td className="py-3 text-muted-foreground">2026-03-28</td>
              <td className="py-3 font-mono">v1.4.1</td>
              <td className="py-3">Stability metrics adjustment</td>
              <td className="py-3 text-primary">+2.1% Accuracy</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

function KnowledgeBaseView() {
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-display">Knowledge Base</h1>
          <p className="text-muted-foreground text-sm mt-1">Search through 1.2M+ materials, papers, and logged experiments.</p>
        </div>
        <div className="relative w-72">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <input placeholder="Search materials or papers..." className="w-full bg-input border border-border rounded-md pl-9 pr-3 py-2 text-sm focus:outline-none focus:border-primary/60" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="bg-card/40 border border-border p-4 rounded-xl flex gap-4">
            <div className="h-12 w-12 rounded bg-secondary/80 flex items-center justify-center shrink-0">
              <Database className="h-5 w-5 text-muted-foreground" />
            </div>
            <div>
              <h4 className="font-medium text-sm mb-1 hover:text-primary cursor-pointer transition-colors">High-throughput screening of Cu-based catalysts</h4>
              <p className="text-xs text-muted-foreground mb-2">ACS Catalysis · 2024 · 42 citations</p>
              <div className="flex gap-2">
                <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-primary/10 text-primary">CO2 Reduction</span>
                <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-secondary text-muted-foreground">Dataset</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProtocolsView() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-display mb-1">Synthesis Protocols</h1>
      <p className="text-muted-foreground text-sm mb-6">AI-generated and lab-verified instructions for catalyst synthesis.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { title: "Standard Co-precipitation", target: "Cu/ZnO/Al2O3", verified: true },
          { title: "Sol-gel method", target: "TiO2 supported", verified: true },
          { title: "Incipient Wetness Impregnation", target: "Pd/C", verified: false },
        ].map((p, i) => (
          <div key={i} className="bg-card/60 border border-border rounded-xl p-5 hover:border-primary/40 transition-colors cursor-pointer group">
            <div className="flex justify-between items-start mb-3">
              <FileText className="h-6 w-6 text-muted-foreground group-hover:text-primary transition-colors" />
              {p.verified ? (
                <span className="flex items-center gap-1 text-[10px] font-mono text-primary bg-primary/10 px-2 py-1 rounded">
                  <CheckCircle2 className="h-3 w-3" /> VERIFIED
                </span>
              ) : (
                <span className="flex items-center gap-1 text-[10px] font-mono text-muted-foreground bg-secondary px-2 py-1 rounded">
                  AI DRAFT
                </span>
              )}
            </div>
            <h3 className="font-medium mb-1">{p.title}</h3>
            <p className="text-xs text-muted-foreground mb-4">Target: {p.target}</p>
            <div className="flex items-center text-xs text-primary font-mono group-hover:underline">
              View Protocol <ArrowRight className="h-3 w-3 ml-1" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function Workspace() {
  const [reaction, setReaction] = useState("CO2 + 3H2 -> CH3OH + H2O");
  const [selected, setSelected] = useState(candidates[0]);
  const [chat, setChat] = useState(chatMessages);
  const [input, setInput] = useState("");
  const [activeTab, setActiveTab] = useState("Discovery");

  const send = () => {
    if (!input.trim()) return;
    setChat([...chat, { role: "user", text: input }, {
      role: "assistant",
      text: "Analyzing… cross-referencing with feedback loop. Predicted ΔG = -41.2 kJ/mol. Suggesting variant with Ga doping for improved CO₂ activation.",
    }]);
    setInput("");
  };

  const renderContent = () => {
    switch (activeTab) {
      case "Overview": return <OverviewView />;
      case "Discovery": return (
        <>
          {/* Reaction input */}
          <div className="px-6 pt-6">
            <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-primary mb-2">
              <Beaker className="h-3.5 w-3.5" /> Reaction Input
            </div>
            <div className="rounded-xl border border-border bg-card/60 p-4 flex flex-col md:flex-row gap-3 items-stretch md:items-center" style={{ boxShadow: "var(--shadow-card)" }}>
              <input
                value={reaction}
                onChange={(e) => setReaction(e.target.value)}
                className="flex-1 bg-input border border-border rounded-md px-3 py-2.5 font-mono text-sm focus:outline-none focus:border-primary/60"
              />
              <div className="flex gap-2">
                <select className="bg-input border border-border rounded-md px-2 py-2 text-sm">
                  <option>Heterogeneous</option>
                  <option>Homogeneous</option>
                  <option>Enzymatic</option>
                </select>
                <button className="px-4 py-2 rounded-md bg-primary text-primary-foreground font-mono text-xs uppercase tracking-widest hover:opacity-90 flex items-center gap-2">
                  <Zap className="h-3.5 w-3.5" /> Generate
                </button>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 mt-3">
              {[
                ["Constraint", "T < 250 °C"],
                ["Constraint", "P < 50 bar"],
                ["Goal", "Selectivity > 80%"],
                ["Element", "Cu-based"],
              ].map(([k, v]) => (
                <span key={v} className="font-mono text-[10px] px-2 py-1 rounded border border-border bg-secondary/60">
                  <span className="text-muted-foreground">{k}:</span> <span className="text-foreground">{v}</span>
                </span>
              ))}
            </div>
          </div>

          {/* Candidate cards */}
          <div className="px-6 pt-6">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-primary">
                <Sparkles className="h-3.5 w-3.5" /> AI-Generated Candidates · 47 ranked
              </div>
              <span className="font-mono text-[10px] text-muted-foreground">Sorted by composite score</span>
            </div>
            <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-3">
              {candidates.slice(0,4).map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelected(c)}
                  className={`text-left rounded-xl border p-4 transition-colors ${
                    selected.id === c.id ? "border-primary/60 bg-primary/5" : "border-border bg-card/60 hover:border-primary/40"
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <span className="font-mono text-[10px] text-muted-foreground">{c.id}</span>
                    {c.novel && <span className="font-mono text-[9px] px-1.5 py-0.5 rounded bg-accent/20 text-accent border border-accent/40">NOVEL</span>}
                  </div>
                  <div className="font-display text-lg mb-3">{c.formula}</div>
                  <div className="grid grid-cols-3 gap-2 text-center mb-3">
                    <Stat label="Sel%" value={c.sel} />
                    <Stat label="Conv%" value={c.conv} />
                    <Stat label="Eₐ" value={c.ea} suffix="kJ" />
                  </div>
                  <div className="flex items-center justify-between font-mono text-[10px]">
                    <span className="text-muted-foreground">Score</span>
                    <div className="flex-1 mx-2 h-1 rounded bg-secondary overflow-hidden">
                      <div className="h-full bg-primary" style={{ width: `${c.score * 100}%` }} />
                    </div>
                    <span className="text-primary">{c.score.toFixed(2)}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* 3D viewer + Predictions */}
          <div className="px-6 pt-6 grid lg:grid-cols-5 gap-4">
            {/* 3D Visualization */}
            <div className="lg:col-span-3 rounded-xl border border-border bg-card/60 p-5 relative overflow-hidden" style={{ boxShadow: "var(--shadow-card)" }}>
              <div className="absolute inset-0 grid-bg opacity-20" />
              <div className="relative flex items-center justify-between mb-4">
                <div>
                  <div className="font-mono text-[10px] uppercase tracking-widest text-primary mb-1">3D Structure</div>
                  <div className="font-display text-xl">{selected.formula}</div>
                </div>
                <div className="flex gap-1.5 font-mono text-[10px]">
                  {["Ball+Stick", "Surface", "Orbital"].map((m, i) => (
                    <button key={m} className={`px-2 py-1 rounded border ${i === 0 ? "border-primary/50 text-primary bg-primary/10" : "border-border text-muted-foreground"}`}>{m}</button>
                  ))}
                </div>
              </div>
              <div className="relative h-72 flex items-center justify-center">
                <Molecule3D />
              </div>
              <div className="relative grid grid-cols-4 gap-2 mt-2 font-mono text-[10px]">
                {[
                  ["Atoms", "47"],
                  ["Bonds", "82"],
                  ["Symmetry", "Pm-3m"],
                  ["a (Å)", "4.21"],
                ].map(([k, v]) => (
                  <div key={k} className="rounded border border-border/60 bg-background/40 px-2 py-1.5">
                    <div className="text-muted-foreground">{k}</div>
                    <div className="text-foreground">{v}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Prediction analytics */}
            <div className="lg:col-span-2 rounded-xl border border-border bg-card/60 p-5" style={{ boxShadow: "var(--shadow-card)" }}>
              <div className="flex items-center justify-between mb-4">
                <div className="font-mono text-[10px] uppercase tracking-widest text-primary flex items-center gap-2">
                  <BarChart3 className="h-3.5 w-3.5" /> Prediction Analytics
                </div>
                <span className="font-mono text-[9px] text-muted-foreground">±2σ uncertainty</span>
              </div>

              <div className="space-y-3">
                {[
                  { label: "Selectivity", val: selected.sel, unc: 4, col: "bg-primary" },
                  { label: "CO₂ Conversion", val: selected.conv, unc: 6, col: "bg-accent" },
                  { label: "Stability (h)", val: 720, unc: 80, max: 1000, col: "bg-[oklch(0.82_0.15_75)]" },
                  { label: "Activation Energy", val: selected.ea, unc: 3, max: 80, col: "bg-[oklch(0.70_0.20_280)]", suffix: " kJ/mol" },
                ].map((m) => (
                  <div key={m.label}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-muted-foreground">{m.label}</span>
                      <span className="font-mono text-foreground">{m.val}{m.suffix ?? "%"} <span className="text-muted-foreground">±{m.unc}</span></span>
                    </div>
                    <div className="relative h-2 bg-secondary/60 rounded overflow-hidden">
                      <div className={`absolute inset-y-0 left-0 ${m.col}`} style={{ width: `${(m.val / (m.max ?? 100)) * 100}%` }} />
                      <div className="absolute inset-y-0 bg-foreground/20" style={{ left: `${((m.val - m.unc) / (m.max ?? 100)) * 100}%`, width: `${((2 * m.unc) / (m.max ?? 100)) * 100}%` }} />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-5 pt-4 border-t border-border/60">
                <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-2">Cycle convergence</div>
                <Sparkline />
              </div>
            </div>
          </div>

          {/* Experiment log + Discrepancy */}
          <div className="px-6 py-6 grid lg:grid-cols-2 gap-4">
            {/* Experiment log */}
            <div className="rounded-xl border border-border bg-card/60 p-5" style={{ boxShadow: "var(--shadow-card)" }}>
              <div className="flex items-center justify-between mb-4">
                <div className="font-mono text-[10px] uppercase tracking-widest text-primary flex items-center gap-2">
                  <FlaskConical className="h-3.5 w-3.5" /> Experiment Log · {selected.id}
                </div>
                <button className="font-mono text-[10px] uppercase tracking-widest text-primary border border-primary/40 px-2.5 py-1 rounded hover:bg-primary/10">+ Entry</button>
              </div>
              <div className="grid grid-cols-2 gap-3 mb-3">
                {[
                  ["Predicted Sel%", selected.sel, "Actual Sel%", 79],
                  ["Predicted Conv%", selected.conv, "Actual Conv%", 54],
                ].map(([pl, pv, al, av]) => (
                  <div key={String(pl)} className="rounded-md border border-border/60 bg-background/40 p-3">
                    <div className="flex justify-between font-mono text-[10px] text-muted-foreground">
                      <span>{pl}</span><span>{al}</span>
                    </div>
                    <div className="flex justify-between items-baseline">
                      <span className="font-display text-2xl text-primary">{pv}</span>
                      <span className="font-display text-2xl text-foreground">{av}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="space-y-2">
                {[
                  { d: "2026-05-04", op: "Lab-A · Patel", note: "Synthesis complete · co-precipitation pH 7.2", ok: true },
                  { d: "2026-05-05", op: "Lab-A · Patel", note: "GC-MS run 01 · selectivity below pred. by 8%", ok: false },
                  { d: "2026-05-06", op: "Lab-A · Patel", note: "Repeat with reduced calcination T (350°C)", ok: true },
                ].map((l) => (
                  <div key={l.d + l.note} className="flex gap-3 text-sm py-1.5 border-b border-border/40 last:border-0">
                    <span className="font-mono text-[10px] text-muted-foreground shrink-0 mt-1">{l.d}</span>
                    {l.ok ? <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" /> : <AlertTriangle className="h-4 w-4 text-[oklch(0.82_0.15_75)] shrink-0 mt-0.5" />}
                    <div className="flex-1">
                      <div>{l.note}</div>
                      <div className="font-mono text-[10px] text-muted-foreground">{l.op}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Discrepancy analysis */}
            <div className="rounded-xl border border-[oklch(0.82_0.15_75)]/40 bg-[oklch(0.82_0.15_75)]/5 p-5">
              <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-[oklch(0.82_0.15_75)] mb-3">
                <AlertTriangle className="h-3.5 w-3.5" /> AI Discrepancy Analysis
              </div>
              <div className="font-display text-lg mb-3">
                Predicted vs. observed selectivity diverges by <span className="text-[oklch(0.82_0.15_75)]">−8.4%</span>
              </div>
              <div className="space-y-2.5 text-sm text-muted-foreground">
                {[
                  { p: 0.72, h: "Steric hindrance at Cu-Zn interface underestimated by GNN" },
                  { p: 0.41, h: "Calcination temperature drives Cu particle migration" },
                  { p: 0.23, h: "Trace Fe contamination in support" },
                ].map((h) => (
                  <div key={h.h} className="flex items-start gap-3 rounded-md border border-border/60 bg-background/40 p-2.5">
                    <span className="font-mono text-[10px] text-primary mt-0.5">P={h.p.toFixed(2)}</span>
                    <span className="text-foreground/90">{h.h}</span>
                  </div>
                ))}
              </div>
              <button onClick={() => setActiveTab('Feedback Loop')} className="mt-4 w-full font-mono text-[10px] uppercase tracking-widest border border-primary/40 text-primary py-2 rounded hover:bg-primary/10 flex items-center justify-center gap-2">
                <RefreshCw className="h-3.5 w-3.5" /> Trigger retraining cycle
              </button>
            </div>
          </div>

          {/* Closed-loop workflow */}
          <div className="px-6 pb-10">
            <div className="font-mono text-[10px] uppercase tracking-widest text-primary mb-3 flex items-center gap-2">
              <RefreshCw className="h-3.5 w-3.5" /> Closed-Loop Learning
            </div>
            <div className="rounded-xl border border-border bg-card/60 p-5">
              <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                {[
                  { i: Database, l: "Retrieve", s: "1,284 refs" },
                  { i: Sparkles, l: "Generate", s: "47 candidates" },
                  { i: Cpu, l: "Predict", s: "GNN + MLIP" },
                  { i: BarChart3, l: "Rank", s: "Top 4 surfaced", active: true },
                  { i: FlaskConical, l: "Test", s: "Lab-A logging" },
                  { i: RefreshCw, l: "Retrain", s: "Δ analysis ready" },
                ].map((s, idx) => {
                  const Icon = s.i;
                  return (
                    <div key={s.l} className={`relative rounded-lg border p-3 ${s.active ? "border-primary/60 bg-primary/10" : "border-border bg-background/40"}`}>
                      <div className="flex items-center justify-between mb-2">
                        <Icon className={`h-4 w-4 ${s.active ? "text-primary" : "text-muted-foreground"}`} />
                        <span className="font-mono text-[9px] text-muted-foreground">0{idx + 1}</span>
                      </div>
                      <div className="text-sm">{s.l}</div>
                      <div className="font-mono text-[10px] text-muted-foreground">{s.s}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </>
      );
      case "Candidates": return <CandidatesView />;
      case "Predictions": return <PredictionsView />;
      case "Experiments": return <ExperimentsView />;
      case "Feedback Loop": return <FeedbackLoopView />;
      case "Knowledge Base": return <KnowledgeBaseView />;
      case "Protocols": return <ProtocolsView />;
      default: return null;
    }
  };

  return (
    <div className="h-screen w-full bg-background text-foreground flex overflow-hidden font-sans">
      {/* LEFT SIDEBAR */}
      <aside className="w-64 shrink-0 border-r border-border/60 bg-card/40 flex flex-col">
        <div className="px-5 py-5 border-b border-border/60">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="relative h-7 w-7">
              <div className="absolute inset-0 rounded-full bg-primary/20 animate-pulse-glow" />
              <div className="absolute inset-1 rounded-full bg-primary glow-emerald" />
              <div className="absolute inset-[10px] rounded-full bg-background" />
            </div>
            <span className="font-display text-base font-semibold tracking-tight">
              CATALYST<span className="text-primary">.AI</span>
            </span>
          </Link>
        </div>

        <div className="px-3 py-3">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
            <input
              placeholder="Search…"
              className="w-full bg-input border border-border rounded-md pl-8 pr-2 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary/60"
            />
          </div>
        </div>

        <nav className="px-2 flex-1 overflow-y-auto">
          <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground px-3 py-2">Workflow</div>
          {navItems.map((it) => {
            const Icon = it.icon;
            const isActive = activeTab === it.label;
            return (
              <button
                key={it.label}
                onClick={() => setActiveTab(it.label)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                  isActive
                    ? "bg-primary/15 text-foreground border border-primary/30"
                    : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground border border-transparent"
                }`}
              >
                <Icon className="h-4 w-4" />
                {it.label}
              </button>
            );
          })}

          <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground px-3 py-2 mt-4">Active Projects</div>
          {projects.map((p) => (
            <button key={p.name} className="w-full flex items-center justify-between px-3 py-2 rounded-md text-sm text-muted-foreground hover:bg-secondary/60 hover:text-foreground">
              <span className="flex items-center gap-2 truncate">
                <span className={`h-1.5 w-1.5 rounded-full ${p.status === "active" ? "bg-primary animate-blink" : p.status === "running" ? "bg-accent" : "bg-muted-foreground"}`} />
                <span className="truncate">{p.name}</span>
              </span>
              <span className="font-mono text-[9px] text-muted-foreground/70">{p.tag}</span>
            </button>
          ))}
        </nav>

        <div className="border-t border-border/60 p-3 flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground text-xs font-semibold">DR</div>
          <div className="flex-1 min-w-0">
            <div className="text-sm truncate">Dr. R. Sharma</div>
            <div className="font-mono text-[10px] text-muted-foreground truncate">GPS Renewables · Lead</div>
          </div>
          <Settings className="h-4 w-4 text-muted-foreground hover:text-foreground cursor-pointer" />
        </div>
      </aside>

      {/* CENTRAL WORKSPACE */}
      <section className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <div className="border-b border-border/60 bg-background/80 backdrop-blur px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Workspace</span>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-foreground">{activeTab}</span>
            {activeTab === "Discovery" && (
              <>
                <ChevronRight className="h-3.5 w-3.5" />
                <span className="text-foreground">CO₂ → Methanol</span>
                <ChevronRight className="h-3.5 w-3.5" />
                <span className="text-foreground">Cycle 14</span>
              </>
            )}
          </div>
          <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-widest">
            {activeTab === "Discovery" && (
              <>
                <span className="text-muted-foreground">Cycle</span>
                <span className="text-primary">14 / Active</span>
                <span className="text-muted-foreground">·</span>
              </>
            )}
            <span className="flex items-center gap-1.5 text-primary">
              <span className="h-1.5 w-1.5 rounded-full bg-primary animate-blink" /> Models online
            </span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {renderContent()}
        </div>
      </section>

      {/* RIGHT AI ASSISTANT */}
      <aside className="w-96 shrink-0 border-l border-border/60 bg-card/40 flex flex-col">
        <div className="px-5 py-4 border-b border-border/60 flex items-center gap-3">
          <div className="relative h-9 w-9 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
            <Bot className="h-5 w-5 text-primary-foreground" />
            <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-primary border-2 border-card animate-blink" />
          </div>
          <div>
            <div className="font-display text-sm">Catalyst Copilot</div>
            <div className="font-mono text-[10px] text-muted-foreground">GNN-v3 · ESM-2 · MLIP grounded</div>
          </div>
        </div>

        <div className="px-4 py-3 border-b border-border/60 grid grid-cols-3 gap-2 font-mono text-[10px]">
          {[
            ["Cycles", "14"],
            ["ΔAcc", "+3.1%"],
            ["Drift", "0.8σ"],
          ].map(([k, v]) => (
            <div key={k} className="rounded border border-border/60 bg-background/40 px-2 py-1.5 text-center">
              <div className="text-muted-foreground">{k}</div>
              <div className="text-foreground text-sm font-display">{v}</div>
            </div>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
          {chat.map((m, i) => (
            <div key={i} className={`flex gap-2.5 ${m.role === "user" ? "flex-row-reverse" : ""}`}>
              <div className={`h-7 w-7 shrink-0 rounded-md flex items-center justify-center ${m.role === "user" ? "bg-secondary" : "bg-primary/15 border border-primary/30"}`}>
                {m.role === "user" ? <User className="h-3.5 w-3.5" /> : <Bot className="h-3.5 w-3.5 text-primary" />}
              </div>
              <div className={`max-w-[85%] rounded-lg px-3 py-2 text-sm ${m.role === "user" ? "bg-primary text-primary-foreground" : "bg-background/60 border border-border/60"}`}>
                {m.text}
              </div>
            </div>
          ))}

          <div className="rounded-lg border border-primary/30 bg-primary/5 p-3">
            <div className="font-mono text-[10px] uppercase tracking-widest text-primary mb-2 flex items-center gap-1.5">
              <Layers className="h-3 w-3" /> Suggested next action
            </div>
            <div className="text-sm mb-2">Run DFT validation on CAT-0241 surface (111) before committing to wet lab.</div>
            <button className="font-mono text-[10px] uppercase tracking-widest text-primary border border-primary/40 px-2 py-1 rounded hover:bg-primary/10">Queue job</button>
          </div>
        </div>

        <div className="border-t border-border/60 p-3">
          <div className="flex flex-wrap gap-1.5 mb-2">
            {["Compare to baseline", "Export protocol", "Find references"].map((q) => (
              <button key={q} onClick={() => setInput(q)} className="font-mono text-[10px] px-2 py-1 rounded border border-border bg-secondary/60 hover:border-primary/40">{q}</button>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder="Ask the copilot…"
              className="flex-1 bg-input border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:border-primary/60"
            />
            <button onClick={send} className="h-9 w-9 rounded-md bg-primary text-primary-foreground flex items-center justify-center hover:opacity-90">
              <Send className="h-4 w-4" />
            </button>
          </div>
          <div className="font-mono text-[9px] text-muted-foreground mt-2 flex items-center gap-1.5">
            <Activity className="h-3 w-3" /> Grounded in 1,284 retrieved refs · cycle 14 context
          </div>
        </div>
      </aside>
    </div>
  );
}
