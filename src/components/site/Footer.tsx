import { Link } from "@tanstack/react-router";
import { Instagram, Linkedin } from "lucide-react";
import { useStudioSettings } from "@/lib/queries";

export function Footer() {
  const { data: s } = useStudioSettings();
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border mt-32">
      <div className="max-w-[1600px] mx-auto px-6 md:px-12 py-16 grid gap-12 md:grid-cols-4">
        <div className="md:col-span-1">
          <Link to="/" className="font-serif text-3xl">
            Studio 711
          </Link>
          <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
            {s?.tagline ?? "Architecture & Interior Design — Lucknow, India"}
          </p>
        </div>

        <div>
          <h4 className="font-serif text-lg mb-4">Navigate</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/projects" className="hover:text-foreground">Projects</Link></li>
            <li><Link to="/about" className="hover:text-foreground">About</Link></li>
            <li><Link to="/services" className="hover:text-foreground">Services</Link></li>
            <li><Link to="/contact" className="hover:text-foreground">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-serif text-lg mb-4">Contact</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>{s?.phone ?? "+91 88402 30877"}</li>
            <li>
              <a href={`mailto:${s?.email ?? "hello@studio711.in"}`} className="hover:text-foreground">
                {s?.email ?? "hello@studio711.in"}
              </a>
            </li>
            <li className="leading-relaxed">
              {s?.address_line1 ?? "1st Floor, A/24 Raghunandan Ashiyana"}
              <br />
              {s?.address_line2 ?? "BBDU"}, {s?.city ?? "Lucknow"}
              <br />
              {s?.state ?? "Uttar Pradesh"}, {s?.country ?? "India"}
            </li>
          </ul>
          <div className="mt-4 flex gap-3">
            <a
              href={s?.instagram_url ?? "https://www.instagram.com/_studio.711/"}
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className="text-muted-foreground hover:text-foreground"
            >
              <Instagram className="h-5 w-5" />
            </a>
            <a
              href={s?.linkedin_url ?? "https://www.linkedin.com/company/studio711/"}
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn"
              className="text-muted-foreground hover:text-foreground"
            >
              <Linkedin className="h-5 w-5" />
            </a>
          </div>
        </div>

        <div>
          <h4 className="font-serif text-lg mb-4">Find Us</h4>
          <div className="aspect-video w-full overflow-hidden border border-border">
            <iframe
              title="Studio 711 location"
              src={`https://www.google.com/maps?q=${s?.map_latitude ?? 26.894444},${s?.map_longitude ?? 81.055778}&z=15&output=embed`}
              className="w-full h-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="max-w-[1600px] mx-auto px-6 md:px-12 py-6 text-xs text-muted-foreground tracking-wider uppercase">
          © {year} Studio 711. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
