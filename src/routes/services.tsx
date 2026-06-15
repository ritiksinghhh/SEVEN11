import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { PageHero } from "@/components/site/PageHero";
import { Spinner } from "@/components/site/Spinner";
import { useServices } from "@/lib/queries";
import * as Icons from "lucide-react";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Services — Studio 711" },
      {
        name: "description",
        content: "Architecture, interior design, renovation, and project management services.",
      },
    ],
  }),
  component: Services,
});

function Services() {
  const { data, isLoading } = useServices();

  return (
    <SiteLayout>
      <PageHero
        eyebrow="Architecture · Interior · Turnkey"
        title={<>What we do,<br />end to end.</>}
        description="Considered, end-to-end design and delivery — from first sketch to final handover."
      />

      <section className="px-6 md:px-12 py-24 md:py-32 border-t border-border">
        <div className="max-w-[1200px] mx-auto">
          {isLoading ? (
            <Spinner />
          ) : (
            <div className="divide-y divide-border border-y border-border">
              {(data ?? []).map((s, i) => {
                const Icon = (s.icon && (Icons as any)[s.icon]) || Icons.Square;
                return (
                  <div
                    key={s.id}
                    className="grid grid-cols-12 gap-6 py-10 md:py-14 items-start"
                  >
                    <div className="col-span-12 md:col-span-1 text-xs uppercase tracking-[0.25em] text-accent">
                      0{i + 1}
                    </div>
                    <div className="col-span-12 md:col-span-1">
                      <Icon className="h-7 w-7 text-foreground/70" strokeWidth={1.25} />
                    </div>
                    <div className="col-span-12 md:col-span-4">
                      <h3 className="font-serif text-2xl md:text-3xl">{s.name}</h3>
                    </div>
                    <div className="col-span-12 md:col-span-6">
                      <p className="text-base md:text-lg text-muted-foreground leading-relaxed font-light">
                        {s.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </SiteLayout>
  );
}
