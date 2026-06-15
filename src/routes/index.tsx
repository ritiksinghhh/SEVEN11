import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { useFeaturedProjects, useServices } from "@/lib/queries";
import { ArrowRight, ArrowUpRight, MessageCircle, Ruler, Palette, Hammer } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Studio 711 — Architecture & Interior Design Studio, Lucknow" },
      {
        name: "description",
        content:
          "A Lucknow-based architecture studio designing functional, thoughtful spaces for modern living. Calm, considered work built to last.",
      },
    ],
  }),
  component: Home,
});

const PROCESS = [
  {
    n: "01",
    title: "Consultation",
    body: "Understanding your vision, lifestyle, and site context through an in-depth discussion.",
  },
  {
    n: "02",
    title: "Concept Design",
    body: "Translating ideas into spatial layouts, mood boards, and preliminary directions.",
  },
  {
    n: "03",
    title: "Detailed Drawings",
    body: "Comprehensive construction drawings, material specifications, and technical documentation.",
  },
  {
    n: "04",
    title: "Execution",
    body: "On-site supervision and turnkey delivery — calm coordination from start to handover.",
  },
];

function Home() {
  const { data: featured } = useFeaturedProjects();
  const { data: services } = useServices();

  return (
    <SiteLayout>
      {/* Hero */}
      <section className="px-6 md:px-12 pt-24 md:pt-40 pb-24 md:pb-32">
        <div className="max-w-[1100px] mx-auto text-center">
          <p className="text-xs md:text-sm uppercase tracking-[0.3em] text-muted-foreground mb-8 whitespace-nowrap">
            Architecture <span className="mx-2">·</span> Interior <span className="mx-2">·</span> Turnkey
          </p>
          <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl leading-[1.05] tracking-tight font-normal text-foreground">
            Designing spaces that work
            <br />
            before they impress
          </h1>
          <p className="mt-8 max-w-xl mx-auto text-base md:text-lg text-muted-foreground leading-relaxed font-light">
            A Lucknow-based architecture studio designing functional, thoughtful spaces for modern living.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 text-sm hover:opacity-90 transition-opacity"
            >
              Book Consultation <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href="https://wa.me/918840230877?text=Hello%2C%20I'd%20like%20to%20inquire%20about%20your%20services."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 border border-border text-foreground px-6 py-3 text-sm hover:bg-secondary transition-colors"
            >
              <MessageCircle className="h-4 w-4" /> WhatsApp Now
            </a>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="px-6 md:px-12 py-24 md:py-32 border-t border-border">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-16">
            <div className="text-xs uppercase tracking-[0.3em] text-accent mb-4">
              What We Do
            </div>
            <h2 className="text-4xl md:text-6xl tracking-tight font-light font-serif">
              Our Services
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            {(services && services.length > 0
              ? services.slice(0, 3).map((s, i) => ({
                  title: s.name,
                  body: s.description,
                  Icon: [Ruler, Palette, Hammer][i] ?? Ruler,
                }))
              : [
                  { title: "Architecture Design", body: "Thoughtful spatial planning that balances aesthetics with everyday functionality.", Icon: Ruler },
                  { title: "Interior Design", body: "Curated interiors that reflect your personality while maximising comfort and flow.", Icon: Palette },
                  { title: "Turnkey Execution", body: "End-to-end project delivery — from concept to move-in ready, stress-free.", Icon: Hammer },
                ]
            ).map((s) => (
              <div
                key={s.title}
                className="border border-border bg-card p-8 md:p-10"
              >
                <s.Icon className="h-8 w-8 text-accent mb-12" strokeWidth={1.5} />
                <h3 className="text-xl md:text-2xl mb-3 font-serif">{s.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {s.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Selected Work */}
      <section className="px-6 md:px-12 py-24 md:py-32 border-t border-border">
        <div className="max-w-[1200px] mx-auto">
          <div className="flex items-end justify-between mb-12">
            <h2 className="text-3xl md:text-5xl tracking-tight font-light">
              Selected work.
            </h2>
            <Link
              to="/projects"
              className="hidden md:inline-flex items-center gap-2 text-sm uppercase tracking-[0.2em] hover:gap-3 transition-all"
            >
              All Projects <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>

          {featured && featured.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
              {featured.map((p) => (
                <Link
                  key={p.id}
                  to="/projects/$slug"
                  params={{ slug: p.slug }}
                  className="group block"
                >
                  <div className="relative overflow-hidden bg-muted aspect-[4/3]">
                    {p.cover_image_url ? (
                      <img
                        src={p.cover_image_url}
                        alt={p.title}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full bg-secondary" />
                    )}
                  </div>
                  <div className="mt-4 flex items-baseline justify-between">
                    <h3 className="text-lg font-medium">{p.title}</h3>
                    <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                      {p.location} · {p.year}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground italic">
              Featured projects will appear here.
            </p>
          )}
        </div>
      </section>

      {/* Process */}
      <section className="px-6 md:px-12 py-24 md:py-32 border-t border-border">
        <div className="max-w-[1200px] mx-auto">
          <h2 className="text-3xl md:text-5xl tracking-tight font-light mb-16">
            Our process.
          </h2>
          <div className="grid md:grid-cols-2 gap-x-16 gap-y-10">
            {PROCESS.map((step) => (
              <div
                key={step.n}
                className="border-l border-accent pl-6 py-2"
              >
                <span className="block text-xs tracking-[0.25em] text-accent mb-2">
                  {step.n}
                </span>
                <h3 className="text-xl mb-2 font-medium">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {step.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 md:px-12 py-24 md:py-32 border-t border-border bg-secondary">
        <div className="max-w-[900px] mx-auto text-center">
          <h2 className="text-3xl md:text-5xl tracking-tight font-light">
            Let's build something meaningful.
          </h2>
          <p className="mt-6 text-muted-foreground max-w-xl mx-auto">
            Tell us about your site, your routine, and what you'd like your
            space to feel like. We'll take it from there.
          </p>
          <div className="mt-10">
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 text-sm uppercase tracking-[0.2em] border-b border-foreground pb-1 hover:gap-3 transition-all"
            >
              Book consultation <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
