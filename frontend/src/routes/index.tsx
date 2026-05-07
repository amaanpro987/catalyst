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
  head: () => ({
    meta: [
      { title: "CATALYST AI — Molecular discovery for catalysis & synthetic biology" },
      {
        name: "description",
        content:
          "End-to-end AI discovery platform closing the loop between generative models, prediction, and the wet lab — for CO₂→methanol, ethanol→jet fuel, and biomass valorization.",
      },
      { property: "og:title", content: "CATALYST AI — Molecular Discovery Platform" },
      { property: "og:description", content: "Closed-loop AI for chemical catalysis and synthetic biology, built with GPS Renewables." },
    ],
  }),
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
