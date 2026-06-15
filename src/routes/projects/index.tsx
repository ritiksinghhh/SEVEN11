import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { PageHero } from "@/components/site/PageHero";
import { Spinner } from "@/components/site/Spinner";
import { useProjects } from "@/lib/queries";

export const Route = createFileRoute("/projects/")({
  head: () => ({
    meta: [
      { title: "Projects — Studio 711" },
      {
        name: "description",
        content: "A selection of residential, interior, and commercial projects by Studio 711.",
      },
    ],
  }),
  component: ProjectsPage,
});

const categories = ["All", "Residential", "Interior", "Commercial"];

function ProjectsPage() {
  const [cat, setCat] = useState<string>("All");
  const { data, isLoading } = useProjects(cat);

  return (
    <SiteLayout>
      <PageHero
        eyebrow="Selected work"
        title={<>Projects shaped<br />by listening.</>}
        description="Houses, apartments, and interiors — quietly considered and built to last."
      />

      <section className="px-6 md:px-12 pb-32 border-t border-border pt-16">
        <div className="max-w-[1200px] mx-auto">
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-3 border-b border-border pb-6 mb-16">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setCat(c)}
                className={`text-sm uppercase tracking-[0.2em] transition-colors ${
                  cat === c ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          {isLoading ? (
            <Spinner />
          ) : data && data.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-16">
              {data.map((p, i) => (
                <Link
                  key={p.id}
                  to="/projects/$slug"
                  params={{ slug: p.slug }}
                  className={`group block ${
                    i % 5 === 0 ? "md:col-span-2" : ""
                  }`}
                >
                  <div className="relative overflow-hidden bg-muted aspect-[4/3]">
                    {p.cover_image_url ? (
                      <img
                        src={p.cover_image_url}
                        alt={p.title}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                      />
                    ) : (
                      <div className="w-full h-full bg-accent" />
                    )}
                  </div>
                  <div className="mt-5 flex items-baseline justify-between">
                    <h3 className="font-serif text-2xl md:text-3xl">{p.title}</h3>
                    <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                      {p.year}
                    </span>
                  </div>
                  <div className="mt-1 text-sm text-muted-foreground">
                    {p.location} · {p.category}
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground italic py-24">
              No projects yet. Add some from the admin panel.
            </p>
          )}
        </div>
      </section>
    </SiteLayout>
  );
}
