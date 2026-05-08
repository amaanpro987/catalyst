import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { Hero } from "@/components/Hero";
import { ProblemSection } from "@/components/ProblemSection";
import { UspTable } from "@/components/UspTable";
import { ClosedLoop } from "@/components/ClosedLoop";
import { Capabilities } from "@/components/Capabilities";
import { StackSection } from "@/components/StackSection";
import { Roadmap } from "@/components/Roadmap";
import { CtaFooter } from "@/components/CtaFooter";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <Hero />
      <ProblemSection />
      <UspTable />
      <ClosedLoop />
      <Capabilities />
      <StackSection />
      <Roadmap />
      <CtaFooter />
    </main>
  );
}
