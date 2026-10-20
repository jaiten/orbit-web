import { Monitor, Smartphone } from "lucide-react";
import { OrbitMark } from "@/components/brand/OrbitMark";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { links } from "@/lib/links";

export function FinalCta() {
  return (
    <section id="get" aria-labelledby="cta-title" className="relative scroll-mt-20 overflow-hidden px-6 py-28 text-center sm:py-40">
      <OrbitMark aria-hidden className="orbit-spin mx-auto size-[clamp(180px,32vw,320px)]" />
      <Reveal className="relative">
        <h2 id="cta-title" className="display mx-auto mt-10 max-w-3xl text-[clamp(38px,6.4vw,64px)]">Make a little space today.</h2>
        <p className="lead mx-auto mt-4 max-w-md">Free on iPhone and Windows.</p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button href={links.testflight} size="lg" className="w-full sm:w-auto"><Smartphone size={18} /> Join the iPhone beta</Button>
          <Button href={links.windows} size="lg" variant="secondary" className="w-full sm:w-auto"><Monitor size={18} /> Download for Windows</Button>
        </div>
      </Reveal>
    </section>
  );
}
