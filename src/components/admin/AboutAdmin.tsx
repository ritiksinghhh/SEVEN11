import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useStudioSettings } from "@/lib/queries";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export function AboutAdmin() {
  const { data } = useStudioSettings();
  const qc = useQueryClient();
  const [aboutTitle, setAboutTitle] = useState("");
  const [aboutText, setAboutText] = useState("");
  const [aboutImageUrl, setAboutImageUrl] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (data) {
      setAboutTitle(data.about_title ?? "");
      setAboutText(data.about_text ?? "");
      setAboutImageUrl(data.about_image_url ?? "");
    }
  }, [data]);

  const save = async () => {
    if (!data?.id) {
      toast.error("No settings row exists. Save settings first.");
      return;
    }
    setBusy(true);
    const { error } = await supabase
      .from("studio_settings")
      .update({ about_title: aboutTitle, about_text: aboutText, about_image_url: aboutImageUrl })
      .eq("id", data.id);
    setBusy(false);
    if (error) toast.error(error.message);
    else {
      toast.success("About content saved");
      qc.invalidateQueries({ queryKey: ["studio_settings"] });
    }
  };

  return (
    <div>
      <h2 className="font-serif text-2xl mb-6">About Page</h2>
      <div className="grid md:grid-cols-2 gap-6 max-w-4xl">
        <div className="md:col-span-2">
          <Label>About page title</Label>
          <p className="text-xs text-muted-foreground mt-1 mb-2">
            Use a new line for a line break in the hero.
          </p>
          <Textarea
            rows={2}
            value={aboutTitle}
            onChange={(e) => setAboutTitle(e.target.value)}
            className="mt-2"
          />
        </div>
        <div className="md:col-span-2">
          <Label>About text</Label>
          <p className="text-xs text-muted-foreground mt-1 mb-2">
            Use a blank line between paragraphs.
          </p>
          <Textarea
            rows={12}
            value={aboutText}
            onChange={(e) => setAboutText(e.target.value)}
            className="mt-2"
          />
        </div>
        <div className="md:col-span-2">
          <Label>About image</Label>
          {aboutImageUrl && (
            <div className="mt-2 mb-3 aspect-[4/5] max-w-[240px] overflow-hidden bg-muted">
              <img src={aboutImageUrl} alt="About" className="w-full h-full object-cover" />
            </div>
          )}
          <Input
            type="file"
            accept="image/*"
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              setBusy(true);
              const ext = file.name.split(".").pop();
              const path = `about/${Date.now()}.${ext}`;
              const { error: upErr } = await supabase.storage
                .from("project-images")
                .upload(path, file, { upsert: true });
              if (upErr) {
                setBusy(false);
                return toast.error(upErr.message);
              }
              const { data: pub } = supabase.storage.from("project-images").getPublicUrl(path);
              setAboutImageUrl(pub.publicUrl);
              setBusy(false);
              toast.success("Image uploaded — click Save to apply");
            }}
            className="mt-2"
          />
          <Input
            placeholder="Or paste image URL"
            value={aboutImageUrl}
            onChange={(e) => setAboutImageUrl(e.target.value)}
            className="mt-2"
          />
        </div>
      </div>
      <div className="mt-8">
        <Button onClick={save} disabled={busy}>
          {busy ? "Saving…" : "Save About Content"}
        </Button>
      </div>
    </div>
  );
}
