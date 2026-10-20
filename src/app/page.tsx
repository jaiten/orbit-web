import { Nav } from "@/components/sections/Nav";
import { Hero } from "@/components/sections/Hero";
import { LazyIsland } from "@/components/ui/LazyIsland";
import { QuickAddDemo } from "@/components/sections/QuickAddDemo";
import { TodaySection } from "@/components/sections/TodaySection";
import { HabitsSection } from "@/components/sections/HabitsSection";
import { WidgetsSection } from "@/components/sections/WidgetsSection";
import { WindowsSection } from "@/components/sections/WindowsSection";
import { SyncSection } from "@/components/sections/SyncSection";
import { SiriSection } from "@/components/sections/SiriSection";
import { FinalCta } from "@/components/sections/FinalCta";
import { Footer } from "@/components/kokonut/Footer";
import { links, siteUrl } from "@/lib/links";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Orbit",
  applicationCategory: "ProductivityApplication",
  operatingSystem: "iOS, Windows",
  description: "A calm, local-first planner for iPhone and Windows.",
  url: siteUrl,
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  sameAs: [links.github],
};

export default function Home() {
  return (
    <>
      <Nav />
      <main id="main">
        <Hero />
        {/* Below the hero: server-rendered HTML, hydrated as it nears the viewport. */}
        <LazyIsland>
          <QuickAddDemo />
        </LazyIsland>
        <LazyIsland>
          <TodaySection />
        </LazyIsland>
        <LazyIsland>
          <HabitsSection />
        </LazyIsland>
        <LazyIsland>
          <WidgetsSection />
        </LazyIsland>
        <LazyIsland>
          <WindowsSection />
        </LazyIsland>
        <LazyIsland>
          <SyncSection />
        </LazyIsland>
        <LazyIsland>
          <SiriSection />
        </LazyIsland>
        <LazyIsland>
          <FinalCta />
        </LazyIsland>
      </main>
      <Footer />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
