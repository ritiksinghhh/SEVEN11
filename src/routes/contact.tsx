import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { PageHero } from "@/components/site/PageHero";
import { useStudioSettings } from "@/lib/queries";
import { Instagram, Linkedin, Mail, MapPin, MessageCircle, Phone } from "lucide-react";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Studio 711" },
      {
        name: "description",
        content: "Get in touch with Studio 711 in Lucknow, India.",
      },
    ],
  }),
  component: Contact,
});

const WA = `https://wa.me/918840230877?text=${encodeURIComponent("Hello, I'd like to inquire about your services.")}`;

function Contact() {
  const { data: s } = useStudioSettings();
  const lat = s?.map_latitude ?? 26.894444;
  const lng = s?.map_longitude ?? 81.055778;

  return (
    <SiteLayout>
      <PageHero
        eyebrow="Get in touch"
        title={<>Let's begin<br />a conversation.</>}
        description="Tell us about your site, your routine, and what you'd like your space to feel like. We'll take it from there."
      />

      <section className="px-6 md:px-12 py-24 md:py-32 border-t border-border">
        <div className="max-w-[1200px] mx-auto grid md:grid-cols-2 gap-16">
          <div className="space-y-10">
            <div className="space-y-1">
              <div className="text-xs uppercase tracking-[0.25em] text-muted-foreground flex items-center gap-2">
                <Phone className="h-3.5 w-3.5" /> Phone
              </div>
              <a
                href={`tel:${s?.phone ?? "+918840230877"}`}
                className="text-xl md:text-2xl hover:opacity-70 font-serif"
              >
                {s?.phone ?? "+91 88402 30877"}
              </a>
            </div>

            <div className="space-y-1">
              <div className="text-xs uppercase tracking-[0.25em] text-muted-foreground flex items-center gap-2">
                <Mail className="h-3.5 w-3.5" /> Email
              </div>
              <a
                href={`mailto:${s?.email ?? "hello@studio711.in"}`}
                className="text-xl md:text-2xl hover:opacity-70 font-serif"
              >
                {s?.email ?? "hello@studio711.in"}
              </a>
            </div>

            <div className="space-y-1">
              <div className="text-xs uppercase tracking-[0.25em] text-muted-foreground flex items-center gap-2">
                <MapPin className="h-3.5 w-3.5" /> Studio
              </div>
              <p className="text-lg md:text-xl leading-snug font-serif">
                {s?.address_line1 ?? "1st Floor, A/24 Raghunandan Ashiyana"}
                <br />
                {s?.address_line2 ?? "Chinhat"}, {s?.city ?? "Lucknow"}
                <br />
                {s?.state ?? "Uttar Pradesh"}, {s?.country ?? "India"}
              </p>
            </div>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              <a
                href={WA}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 text-sm hover:opacity-90 transition-opacity"
              >
                <MessageCircle className="h-4 w-4" /> WhatsApp Us
              </a>
              <a
                href={s?.instagram_url ?? "https://www.instagram.com/_studio.711/"}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 border border-border text-foreground px-6 py-3 text-sm hover:bg-secondary transition-colors"
              >
                <Instagram className="h-4 w-4" /> Instagram
              </a>
              <a
                href={s?.linkedin_url ?? "https://www.linkedin.com/company/studio711/"}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 border border-border text-foreground px-6 py-3 text-sm hover:bg-secondary transition-colors"
              >
                <Linkedin className="h-4 w-4" /> LinkedIn
              </a>
            </div>
          </div>

          <div className="w-full aspect-square md:aspect-auto md:min-h-[500px] border border-border overflow-hidden">
            <iframe
              title="Studio 711 location map"
              src={`https://www.google.com/maps?q=${lat},${lng}&z=16&output=embed`}
              className="w-full h-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
