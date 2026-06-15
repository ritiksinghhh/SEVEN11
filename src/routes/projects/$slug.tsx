import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Spinner } from "@/components/site/Spinner";
import { useProject } from "@/lib/queries";
import { ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/projects/$slug")({
  head: ({ params }) => ({
    meta: [
      { title: `${params.slug.replace(/-/g, " ")} — Studio 711` },
      { name: "description", content: "Project by Studio 711." },
    ],
  }),
  component: ProjectDetail,
});

function ProjectDetail() {
  const { slug } = Route.useParams();
  const { data: p, isLoading } = useProject(slug);

  if (isLoading) {
    return (
      <SiteLayout>
        <Spinner />
      </SiteLayout>
    );
  }

  if (!p) {
    return (
      <SiteLayout>
        <div className="max-w-3xl mx-auto px-6 py-32 text-center">
          <h1 className="font-serif text-4xl">Project not found</h1>
          <Link to="/projects" className="inline-block mt-6 underline">
            Back to projects
          </Link>
        </div>
      </SiteLayout>
    );
  }

  return (
    <SiteLayout>
      {p.cover_image_url && (
        <div className="w-full h-[70vh] md:h-[85vh] overflow-hidden -mt-20">
          <img
            src={p.cover_image_url}
            alt={p.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <section className="px-6 md:px-12 py-20 md:py-28">
        <div className="max-w-[1100px] mx-auto text-center">
          <p className="text-xs md:text-sm uppercase tracking-[0.3em] text-muted-foreground mb-6">
            {p.category}
          </p>
          <h1 className="font-serif text-5xl md:text-6xl leading-[1.05] tracking-tight">
            {p.title}
          </h1>
          <div className="mt-6 flex flex-wrap justify-center gap-x-8 gap-y-2 text-xs uppercase tracking-[0.25em] text-muted-foreground">
            <span>{p.location}</span>
            <span>{p.year}</span>
          </div>

          {p.description && (
            <p className="mt-12 max-w-2xl mx-auto text-base md:text-lg text-muted-foreground leading-relaxed font-light">
              {p.description}
            </p>
          )}
        </div>
      </section>

      {p.images && p.images.length > 0 && (
        <section className="px-6 md:px-12 pb-32 border-t border-border pt-16">
          <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12">
            {p.images.map((url, i) => (
              <div
                key={url + i}
                className={`overflow-hidden bg-muted ${
                  i % 3 === 0 ? "md:col-span-2 aspect-[16/9]" : "aspect-[4/3]"
                }`}
              >
                <img
                  src={url}
                  alt={`${p.title} ${i + 1}`}
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="px-6 md:px-12 py-16 border-t border-border">
        <div className="max-w-[1200px] mx-auto text-center">
          <Link
            to="/projects"
            className="inline-flex items-center gap-2 text-sm uppercase tracking-[0.2em] hover:gap-3 transition-all"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Projects
          </Link>
        </div>
      </section>
    </SiteLayout>
  );
}
