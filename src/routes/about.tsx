import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { PageHero } from "@/components/site/PageHero";
import { useStudioSettings, useTeamMembers, type TeamMember } from "@/lib/queries";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Studio 711" },
      {
        name: "description",
        content:
          "Studio 711 is an architecture and interior design studio based in Lucknow, India.",
      },
    ],
  }),
  component: About,
});

const values = [
  { title: "Clarity", body: "Decisions made in service of how a space is actually lived in." },
  { title: "Context", body: "Architecture rooted in its place — its light, its climate, its people." },
  { title: "Craft", body: "Considered detailing and a long relationship with the people who build." },
];

function About() {
  const { data: s } = useStudioSettings();
  const { data: team } = useTeamMembers();
  const [selected, setSelected] = useState<TeamMember | null>(null);

  return (
    <SiteLayout>
      <PageHero
        eyebrow="About · Studio 711"
        title={
          s?.about_title ? (
            s.about_title.split("\n").map((line, i) => (
              <span key={i}>
                {i > 0 && <br />}
                {line}
              </span>
            ))
          ) : (
            <>We design spaces that work<br />for the people who use them.</>
          )
        }
      />

      <section className="px-6 md:px-12 pb-24 md:pb-32 border-b border-border">
        <div className="max-w-[1200px] mx-auto grid md:grid-cols-2 gap-12 md:gap-16 items-center">
          <div className="aspect-[4/5] overflow-hidden bg-muted">
            {s?.about_image_url ? (
              <img
                src={s.about_image_url}
                alt="Studio 711"
                loading="lazy"
                className="w-full h-full object-cover"
              />
            ) : (
              <img
                src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&auto=format&fit=crop&q=80"
                alt="Studio 711 interior"
                loading="lazy"
                className="w-full h-full object-cover"
              />
            )}
          </div>
          <div className="space-y-6 text-base md:text-lg text-muted-foreground leading-relaxed font-light text-left">
            {s?.about_text ? (
              s.about_text.split("\n\n").map((para, i) => <p key={i}>{para}</p>)
            ) : (
              <>
                <p>
                  Studio 711 is an architecture and interior design practice established in 2025,
                  based in Lucknow, India. We work with residential and small commercial clients who
                  value thoughtful design and careful attention to detail.
                </p>
                <p>
                  Our approach is grounded in practicality. We believe that good design emerges from
                  understanding how people actually live — their routines, their needs, and their
                  relationship with space. We don't chase trends or make grand gestures. Instead, we
                  focus on creating environments that are calm, functional, and built to last.
                </p>
                <p>
                  Every project begins with listening. We take time to understand your requirements,
                  your constraints, and your aspirations. From there, we develop designs that respond
                  directly to your brief — nothing more, nothing less.
                </p>
              </>
            )}
          </div>
        </div>
      </section>



      <section className="px-6 md:px-12 py-24 md:py-32 border-t border-border">
        <div className="max-w-[1200px] mx-auto">
          <h2 className="font-serif text-3xl md:text-5xl tracking-tight mb-16 text-left">Values</h2>
          <div className="grid md:grid-cols-3 gap-12">
            {values.map((v, i) => (
              <div key={v.title}>
                <div className="text-xs uppercase tracking-[0.25em] text-accent mb-3">
                  0{i + 1}
                </div>
                <h3 className="font-serif text-2xl md:text-3xl mb-3">{v.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{v.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 md:px-12 py-24 md:py-32 border-t border-border">
        <div className="max-w-[1200px] mx-auto">
          <h2 className="font-serif text-3xl md:text-5xl tracking-tight mb-16 text-left">Team</h2>
          {team && team.length > 0 ? (
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-12">
              {team.map((m) => (
              <button
                  key={m.id}
                  type="button"
                  onClick={() => setSelected(m)}
                  className="text-center group focus:outline-none"
                >
                  <div className="aspect-square overflow-hidden bg-muted mb-5 rounded-full max-w-[220px] mx-auto transition-transform group-hover:scale-[1.02]">
                    {m.image_url ? (
                      <img
                        src={m.image_url}
                        alt={m.name}
                        loading="lazy"
                        className="w-full h-full object-cover"
                      />
                    ) : null}
                  </div>
                  <h3 className="font-serif text-xl md:text-2xl">{m.name}</h3>
                  {m.role && (
                    <p className="text-xs uppercase tracking-[0.2em] text-accent mt-1">{m.role}</p>
                  )}
                </button>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground italic text-center max-w-xl mx-auto">
              Our team page is being prepared. In the meantime, please reach out directly — we'd love
              to hear about your project.
            </p>
          )}
        </div>
      </section>

      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="max-w-md">
          {selected && (
            <>
              <div className="aspect-square overflow-hidden bg-muted rounded-full max-w-[240px] mx-auto">
                {selected.image_url ? (
                  <img
                    src={selected.image_url}
                    alt={selected.name}
                    className="w-full h-full object-cover"
                  />
                ) : null}
              </div>
              <DialogHeader className="text-center sm:text-center mt-4">
                <DialogTitle className="font-serif text-2xl">{selected.name}</DialogTitle>
                {selected.role && (
                  <p className="text-xs uppercase tracking-[0.2em] text-accent mt-1">
                    {selected.role}
                  </p>
                )}
              </DialogHeader>
              {selected.bio && (
                <DialogDescription className="text-sm text-muted-foreground leading-relaxed text-center mt-2">
                  {selected.bio}
                </DialogDescription>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>
    </SiteLayout>
  );
}
