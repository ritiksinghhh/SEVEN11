import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useProjects, slugify, type Project } from "@/lib/queries";
import { useQueryClient } from "@tanstack/react-query";
import { Pencil, Plus, Trash2, Upload, X } from "lucide-react";

const CATS = ["Residential", "Interior", "Commercial"];

export function ProjectsAdmin() {
  const { data, isLoading } = useProjects();
  const qc = useQueryClient();
  const [editing, setEditing] = useState<Project | null>(null);
  const [creating, setCreating] = useState(false);

  const refresh = () => qc.invalidateQueries({ queryKey: ["projects"] });

  const remove = async (p: Project) => {
    if (!confirm(`Delete "${p.title}"?`)) return;
    const { error } = await supabase.from("projects").delete().eq("id", p.id);
    if (error) toast.error(error.message);
    else {
      toast.success("Project deleted");
      refresh();
    }
  };

  if (editing || creating) {
    return (
      <ProjectForm
        project={editing}
        onClose={() => {
          setEditing(null);
          setCreating(false);
        }}
        onSaved={() => {
          setEditing(null);
          setCreating(false);
          refresh();
        }}
      />
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-serif text-2xl">Projects</h2>
        <Button onClick={() => setCreating(true)}>
          <Plus className="h-4 w-4 mr-2" /> New Project
        </Button>
      </div>
      {isLoading ? (
        <p className="text-muted-foreground">Loading…</p>
      ) : (
        <div className="border border-border divide-y divide-border">
          {(data ?? []).map((p) => (
            <div key={p.id} className="flex items-center gap-4 p-4">
              <div className="w-16 h-16 bg-muted overflow-hidden flex-shrink-0">
                {p.cover_image_url && (
                  <img src={p.cover_image_url} alt="" className="w-full h-full object-cover" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-serif text-lg truncate">{p.title}</div>
                <div className="text-xs text-muted-foreground">
                  {p.location} · {p.category} · {p.year}
                  {p.featured ? " · Featured" : ""}
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setEditing(p)}>
                <Pencil className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => remove(p)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          {data?.length === 0 && (
            <div className="p-8 text-center text-muted-foreground">No projects yet.</div>
          )}
        </div>
      )}
    </div>
  );
}

function ProjectForm({
  project,
  onClose,
  onSaved,
}: {
  project: Project | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [title, setTitle] = useState(project?.title ?? "");
  const [slug, setSlug] = useState(project?.slug ?? "");
  const [location, setLocation] = useState(project?.location ?? "");
  const [category, setCategory] = useState(project?.category ?? "Residential");
  const [year, setYear] = useState<number | "">(project?.year ?? new Date().getFullYear());
  const [description, setDescription] = useState(project?.description ?? "");
  const [coverUrl, setCoverUrl] = useState(project?.cover_image_url ?? "");
  const [images, setImages] = useState<string[]>(project?.images ?? []);
  const [featured, setFeatured] = useState(project?.featured ?? false);
  const [displayOrder, setDisplayOrder] = useState<number>(project?.display_order ?? 0);
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);

  const onTitleChange = (v: string) => {
    setTitle(v);
    if (!project) setSlug(slugify(v));
  };

  const uploadFiles = async (files: FileList | null, target: "cover" | "gallery") => {
    if (!files || files.length === 0) return;
    setUploading(true);
    try {
      const uploaded: string[] = [];
      for (const file of Array.from(files)) {
        const path = `${Date.now()}-${Math.random().toString(36).slice(2)}-${file.name}`;
        const { error } = await supabase.storage.from("project-images").upload(path, file);
        if (error) throw error;
        const { data } = supabase.storage.from("project-images").getPublicUrl(path);
        uploaded.push(data.publicUrl);
      }
      if (target === "cover") setCoverUrl(uploaded[0]);
      else setImages((prev) => [...prev, ...uploaded]);
      toast.success("Uploaded");
    } catch (e: any) {
      toast.error(e.message ?? "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const save = async () => {
    if (!title || !slug) {
      toast.error("Title and slug are required");
      return;
    }
    setBusy(true);
    const payload = {
      title,
      slug,
      location,
      category,
      year: year === "" ? null : Number(year),
      description,
      cover_image_url: coverUrl || null,
      images,
      featured,
      display_order: displayOrder,
    };
    const { error } = project
      ? await supabase.from("projects").update(payload).eq("id", project.id)
      : await supabase.from("projects").insert(payload);
    setBusy(false);
    if (error) toast.error(error.message);
    else {
      toast.success(project ? "Project updated" : "Project created");
      onSaved();
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-serif text-2xl">{project ? "Edit Project" : "New Project"}</h2>
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <Label>Title</Label>
          <Input value={title} onChange={(e) => onTitleChange(e.target.value)} className="mt-2" />
        </div>
        <div>
          <Label>Slug</Label>
          <Input value={slug} onChange={(e) => setSlug(slugify(e.target.value))} className="mt-2" />
        </div>
        <div>
          <Label>Location</Label>
          <Input value={location} onChange={(e) => setLocation(e.target.value)} className="mt-2" />
        </div>
        <div>
          <Label>Category</Label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="mt-2">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CATS.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Year</Label>
          <Input
            type="number"
            value={year}
            onChange={(e) => setYear(e.target.value === "" ? "" : Number(e.target.value))}
            className="mt-2"
          />
        </div>
        <div>
          <Label>Display Order</Label>
          <Input
            type="number"
            value={displayOrder}
            onChange={(e) => setDisplayOrder(Number(e.target.value))}
            className="mt-2"
          />
        </div>
        <div className="md:col-span-2">
          <Label>Description</Label>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={5}
            className="mt-2"
          />
        </div>
        <div className="flex items-center gap-3">
          <Switch checked={featured} onCheckedChange={setFeatured} id="featured" />
          <Label htmlFor="featured">Featured on home page</Label>
        </div>
      </div>

      <div className="mt-8">
        <Label>Cover image</Label>
        <div className="mt-2 flex items-center gap-4">
          {coverUrl && (
            <div className="w-32 h-32 bg-muted overflow-hidden">
              <img src={coverUrl} alt="" className="w-full h-full object-cover" />
            </div>
          )}
          <label className="cursor-pointer inline-flex items-center gap-2 border border-border px-4 py-2 text-sm hover:bg-accent">
            <Upload className="h-4 w-4" /> {coverUrl ? "Replace" : "Upload"}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => uploadFiles(e.target.files, "cover")}
            />
          </label>
          {coverUrl && (
            <Button variant="ghost" size="icon" onClick={() => setCoverUrl("")}>
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      <div className="mt-8">
        <Label>Gallery images</Label>
        <div className="mt-2 grid grid-cols-3 md:grid-cols-5 gap-3">
          {images.map((url, i) => (
            <div key={url + i} className="relative aspect-square bg-muted overflow-hidden group">
              <img src={url} alt="" className="w-full h-full object-cover" />
              <button
                onClick={() => setImages((p) => p.filter((_, idx) => idx !== i))}
                className="absolute top-1 right-1 bg-background/80 p-1 opacity-0 group-hover:opacity-100"
                aria-label="Remove"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
          <label className="cursor-pointer aspect-square border border-dashed border-border flex items-center justify-center text-muted-foreground hover:bg-accent">
            <Upload className="h-5 w-5" />
            <input
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => uploadFiles(e.target.files, "gallery")}
            />
          </label>
        </div>
      </div>

      <div className="mt-10 flex gap-3">
        <Button onClick={save} disabled={busy || uploading}>
          {busy ? "Saving…" : "Save Project"}
        </Button>
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
      </div>
    </div>
  );
}
