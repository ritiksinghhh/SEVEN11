import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useStudioSettings } from "@/lib/queries";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export function SettingsAdmin() {
  const { data } = useStudioSettings();
  const qc = useQueryClient();
  const [form, setForm] = useState<any>({});
  const [busy, setBusy] = useState(false);
  const [mapUrl, setMapUrl] = useState("");

  useEffect(() => {
    if (data) setForm(data);
  }, [data]);

  const set = (k: string, v: any) => setForm((f: any) => ({ ...f, [k]: v }));

  const extractFromMapUrl = () => {
    let url = mapUrl.trim();
    if (!url) return toast.error("Paste a Google Maps URL or embed code first");
    // If user pasted an <iframe ...>, grab the src
    const iframeMatch = url.match(/<iframe[^>]*\ssrc=["']([^"']+)["']/i);
    if (iframeMatch) url = iframeMatch[1];
    // Try common patterns: @lat,lng / !3dlat!4dlng / !2dlng!3dlat (embed) / q=lat,lng
    const patterns: Array<{ re: RegExp; lat: number; lng: number }> = [
      { re: /@(-?\d+\.\d+),(-?\d+\.\d+)/, lat: 1, lng: 2 },
      { re: /!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/, lat: 1, lng: 2 },
      { re: /!2d(-?\d+\.\d+)!3d(-?\d+\.\d+)/, lat: 2, lng: 1 },
      { re: /[?&](?:q|ll|destination)=(-?\d+\.\d+),(-?\d+\.\d+)/, lat: 1, lng: 2 },
    ];
    for (const { re, lat, lng } of patterns) {
      const m = url.match(re);
      if (m) {
        set("map_latitude", m[lat]);
        set("map_longitude", m[lng]);
        return toast.success(`Location set: ${m[lat]}, ${m[lng]}`);
      }
    }
    toast.error("Couldn't find coordinates. Open the place in Google Maps, then copy the URL from the address bar (it should contain @lat,lng).");
  };

  const save = async () => {
    if (!data?.id) {
      // create row
      setBusy(true);
      const { error } = await supabase.from("studio_settings").insert(form);
      setBusy(false);
      if (error) return toast.error(error.message);
      qc.invalidateQueries({ queryKey: ["studio_settings"] });
      return toast.success("Saved");
    }
    setBusy(true);
    const { error } = await supabase
      .from("studio_settings")
      .update({
        studio_name: form.studio_name,
        tagline: form.tagline,
        email: form.email,
        phone: form.phone,
        whatsapp: form.whatsapp,
        address_line1: form.address_line1,
        address_line2: form.address_line2,
        city: form.city,
        state: form.state,
        country: form.country,
        map_latitude: form.map_latitude ? Number(form.map_latitude) : null,
        map_longitude: form.map_longitude ? Number(form.map_longitude) : null,
        established_year: form.established_year ? Number(form.established_year) : null,
        instagram_url: form.instagram_url,
        linkedin_url: form.linkedin_url,
      })

      .eq("id", data.id);
    setBusy(false);
    if (error) toast.error(error.message);
    else {
      toast.success("Settings saved");
      qc.invalidateQueries({ queryKey: ["studio_settings"] });
    }
  };

  return (
    <div>
      <h2 className="font-serif text-2xl mb-6">Studio Settings</h2>
      <div className="grid md:grid-cols-2 gap-6 max-w-4xl">
        <Field label="Studio name" value={form.studio_name} onChange={(v) => set("studio_name", v)} />
        <Field label="Tagline" value={form.tagline} onChange={(v) => set("tagline", v)} />
        <Field label="Email" value={form.email} onChange={(v) => set("email", v)} />
        <Field label="Phone" value={form.phone} onChange={(v) => set("phone", v)} />
        <Field label="WhatsApp (digits only)" value={form.whatsapp} onChange={(v) => set("whatsapp", v)} />
        <Field label="Established year" value={form.established_year} onChange={(v) => set("established_year", v)} />
        <Field label="Instagram URL" value={form.instagram_url} onChange={(v) => set("instagram_url", v)} />
        <Field label="LinkedIn URL" value={form.linkedin_url} onChange={(v) => set("linkedin_url", v)} />
        <Field label="Address line 1" value={form.address_line1} onChange={(v) => set("address_line1", v)} />
        <Field label="Address line 2" value={form.address_line2} onChange={(v) => set("address_line2", v)} />
        <Field label="City" value={form.city} onChange={(v) => set("city", v)} />
        <Field label="State" value={form.state} onChange={(v) => set("state", v)} />
        <Field label="Country" value={form.country} onChange={(v) => set("country", v)} />
        <Field label="Map latitude" value={form.map_latitude} onChange={(v) => set("map_latitude", v)} />
        <Field label="Map longitude" value={form.map_longitude} onChange={(v) => set("map_longitude", v)} />
        <div className="md:col-span-2 border border-border p-4 rounded-md bg-secondary/40">
          <Label>Set location from Google Maps URL</Label>
          <p className="text-xs text-muted-foreground mt-1 mb-2">
            Open the place on Google Maps, copy the URL from the browser address bar, paste here, then click Extract.
          </p>
          <div className="flex gap-2">
            <Input
              placeholder="https://www.google.com/maps/place/.../@26.8944,81.0557,..."
              value={mapUrl}
              onChange={(e) => setMapUrl(e.target.value)}
            />
            <Button type="button" variant="outline" onClick={extractFromMapUrl}>
              Extract
            </Button>
          </div>
        </div>
      </div>
      <div className="mt-8">
        <Button onClick={save} disabled={busy}>
          {busy ? "Saving…" : "Save Settings"}
        </Button>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value: any;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <Label>{label}</Label>
      <Input value={value ?? ""} onChange={(e) => onChange(e.target.value)} className="mt-2" />
    </div>
  );
}
