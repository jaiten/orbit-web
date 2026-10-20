import { Nav } from "@/components/sections/Nav";
import { Footer } from "@/components/kokonut/Footer";

/** Shell for the small text pages. */
export function PageShell({ title, intro, children }: { title: string; intro: string; children: React.ReactNode }) {
  return (
    <>
      <Nav />
      <main id="main" className="mx-auto max-w-3xl px-6 pb-24 pt-36">
        <h1 className="display text-[clamp(40px,6vw,60px)]">{title}</h1>
        <p className="lead mt-4">{intro}</p>
        <div className="mt-12">{children}</div>
      </main>
      <Footer />
    </>
  );
}
