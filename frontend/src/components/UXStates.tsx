import { Skeleton } from "./ui/skeleton";
import { Alert, AlertTitle, AlertDescription } from "./ui/alert";
import { AlertTriangle, Database, Info, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

// --- Skeletons ---

export function StatSkeleton() {
  return (
    <div className="bg-card/60 border border-border p-5 rounded-xl animate-pulse">
      <Skeleton className="h-6 w-6 mb-3 rounded-full" />
      <Skeleton className="h-8 w-16 mb-2" />
      <Skeleton className="h-3 w-24" />
    </div>
  );
}

export function TableRowSkeleton({ cols = 5 }: { cols?: number }) {
  return (
    <tr className="animate-pulse">
      {Array(cols).fill(0).map((_, i) => (
        <td key={i} className="px-4 py-4">
          <Skeleton className="h-4 w-full" />
        </td>
      ))}
    </tr>
  );
}

export function ChartSkeleton() {
  return (
    <div className="bg-card/60 border border-border p-5 rounded-xl h-80 flex flex-col gap-4 animate-pulse">
      <div className="flex justify-between">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-4 w-16" />
      </div>
      <div className="flex-1 flex items-end gap-2 px-2">
        {Array(8).fill(0).map((_, i) => (
          <Skeleton key={i} className="w-full" style={{ height: `${20 + Math.random() * 60}%` }} />
        ))}
      </div>
    </div>
  );
}

// --- Empty States ---

export function EmptyState({ 
  icon: Icon = Database, 
  title, 
  description, 
  action 
}: { 
  icon?: any, 
  title: string, 
  description: string, 
  action?: React.ReactNode 
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center animate-fade-in-up">
      <div className="h-16 w-16 rounded-full bg-secondary/40 flex items-center justify-center mb-6 border border-border/50">
        <Icon className="h-8 w-8 text-muted-foreground/60" />
      </div>
      <h3 className="text-xl font-display mb-2">{title}</h3>
      <p className="text-muted-foreground text-sm max-w-md mb-8 leading-relaxed">
        {description}
      </p>
      {action}
    </div>
  );
}

// --- Error States ---

export function ErrorState({ 
  error, 
  onRetry 
}: { 
  error?: string | Error, 
  onRetry?: () => void 
}) {
  const message = typeof error === 'string' ? error : error?.message || "An unexpected error occurred.";

  return (
    <div className="p-6 animate-fade-in-up">
      <Alert variant="destructive" className="bg-destructive/5 border-destructive/20 text-foreground">
        <AlertTriangle className="h-5 w-5" />
        <AlertTitle className="font-display text-lg mb-2">Scientific Discrepancy / System Error</AlertTitle>
        <AlertDescription className="flex flex-col gap-4">
          <p className="text-muted-foreground">
            The discovery engine encountered an issue while processing the current request. This might be due to network connectivity or a complex simulation failure.
          </p>
          <div className="bg-background/40 p-3 rounded font-mono text-xs border border-destructive/10 overflow-x-auto">
            {message}
          </div>
          {onRetry && (
            <button 
              onClick={onRetry}
              className="w-fit flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md text-xs font-mono uppercase tracking-widest hover:opacity-90 transition-opacity"
            >
              <RefreshCw className="h-3.5 w-3.5" /> Re-initialize Process
            </button>
          )}
        </AlertDescription>
      </Alert>
    </div>
  );
}

// --- Layout Helpers ---

export function PageTransition({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <div className={cn("animate-fade-in-up transition-page", className)}>
      {children}
    </div>
  );
}
