export function SiteHeader() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/40 bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <a href="#" className="flex items-center gap-2.5">
          <div className="relative h-7 w-7">
            <div className="absolute inset-0 rounded-full bg-primary/20 animate-pulse-glow" />
            <div className="absolute inset-1 rounded-full bg-primary glow-emerald" />
            <div className="absolute inset-[10px] rounded-full bg-background" />
          </div>
          <span className="font-display text-lg font-semibold tracking-tight">
            CATALYST<span className="text-primary">.AI</span>
          </span>
        </a>
        <nav className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
          <a href="#platform" className="hover:text-foreground transition-colors">Platform</a>
          <a href="#loop" className="hover:text-foreground transition-colors">Closed Loop</a>
          <a href="#capabilities" className="hover:text-foreground transition-colors">Capabilities</a>
          <a href="#stack" className="hover:text-foreground transition-colors">Stack</a>
          <a href="#roadmap" className="hover:text-foreground transition-colors">Roadmap</a>
        </nav>
        <a href="/workspace" className="font-mono text-xs uppercase tracking-widest text-primary border border-primary/40 hover:bg-primary/10 px-4 py-2 rounded-md transition-colors">
          Open Workspace →
        </a>
      </div>
    </header>
  );
}
