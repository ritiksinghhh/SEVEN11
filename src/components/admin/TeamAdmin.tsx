import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useTeamMembers, type TeamMember } from "@/lib/queries";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Pencil, Plus, Trash2, Upload, X } from "lucide-react";

export function TeamAdmin() {
  const { data, isLoading } = useTeamMembers();
  const qc = useQueryClient();
  const [editing, setEditing] = useState<TeamMember | null>(null);
  const [creating, setCreating] = useState(false);

  const refresh = () => qc.invalidateQueries({ queryKey: ["team_members"] });

  const remove = async (m: TeamMember) => {
    if (!confirm(`Delete "${m.name}"?`)) return;
    const { error } = await supabase.from("team_members").delete().eq("id", m.id);
    if (error) toast.error(error.message);
    else {
      toast.success("Team member deleted");
      refresh();
    }
  };

  if (editing || creating) {
    return (
      <TeamForm
        member={editing}
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
        <h2 className="font-serif text-2xl">Team</h2>
        <Button onClick={() => setCreating(true)}>
          <Plus className="h-4 w-4 mr-2" /> New Team Member
        </Button>
      </div>
      {isLoading ? (
        <p className="text-muted-foreground">Loading…</p>
      ) : (
        <div className="border border-border divide-y divide-border">
          {(data ?? []).map((m) => (
            <div key={m.id} className="flex items-center gap-4 p-4">
              {m.image_url ? (
                <img src={m.image_url} alt={m.name} className="h-12 w-12 object-cover rounded-full" />
              ) : (
                <div className="h-12 w-12 rounded-full bg-muted" />
              )}
              <div className="flex-1 min-w-0">
                <div className="font-serif text-lg">{m.name}</div>
                <div className="text-xs text-muted-foreground truncate">{m.role}</div>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setEditing(m)}>
                <Pencil className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => remove(m)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          {(data ?? []).length === 0 && (
            <div className="p-6 text-sm text-muted-foreground">No team members yet.</div>
          )}
        </div>
      )}
    </div>
  );
}

function TeamForm({
  member,
  onClose,
  onSaved,
}: {
  member: TeamMember | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [name, setName] = useState(member?.name ?? "");
  const [role, setRole] = useState(member?.role ?? "");
  const [bio, setBio] = useState(member?.bio ?? "");
  const [imageUrl, setImageUrl] = useState(member?.image_url ?? "");
  const [displayOrder, setDisplayOrder] = useState<number>(member?.display_order ?? 0);
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);

  const uploadImage = async (files: FileList | null) => {
    if (!files || !files[0]) return;
    setUploading(true);
    try {
      const file = files[0];
      const path = `team/${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
      const { error } = await supabase.storage.from("project-images").upload(path, file);
      if (error) throw error;
      const { data } = supabase.storage.from("project-images").getPublicUrl(path);
      setImageUrl(data.publicUrl);
      toast.success("Image uploaded");
    } catch (e: any) {
      toast.error(e.message ?? "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const save = async () => {
    if (!name) return toast.error("Name is required");
    setBusy(true);
    const payload = {
      name,
      role: role || null,
      bio: bio || null,
      image_url: imageUrl || null,
      display_order: displayOrder,
    };
    const { error } = member
      ? await supabase.from("team_members").update(payload).eq("id", member.id)
      : await supabase.from("team_members").insert(payload);
    setBusy(false);
    if (error) toast.error(error.message);
    else {
      toast.success("Saved");
      onSaved();
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-serif text-2xl">{member ? "Edit Team Member" : "New Team Member"}</h2>
        <Button variant="outline" onClick={onClose}>Cancel</Button>
      </div>

      <div className="space-y-4 max-w-2xl">
        <div>
          <Label>Name</Label>
          <Input value={name} onChange={(e) => setName(e.target.value)} className="mt-2" />
        </div>
        <div>
          <Label>Role / Title</Label>
          <Input
            value={role}
            onChange={(e) => setRole(e.target.value)}
            placeholder="e.g. Principal Architect"
            className="mt-2"
          />
        </div>
        <div>
          <Label>Bio</Label>
          <Textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={4} className="mt-2" />
        </div>
        <div>
          <Label>Photo</Label>
          <div className="mt-2 flex items-center gap-4">
            {imageUrl ? (
              <div className="relative">
                <img src={imageUrl} alt="" className="h-20 w-20 object-cover rounded-full" />
                <button
                  type="button"
                  onClick={() => setImageUrl("")}
                  className="absolute -top-2 -right-2 bg-background border border-border rounded-full p-1"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ) : (
              <div className="h-20 w-20 rounded-full bg-muted" />
            )}
            <label className="inline-flex items-center gap-2 cursor-pointer border border-border px-3 py-2 text-sm hover:bg-secondary">
              <Upload className="h-4 w-4" />
              {uploading ? "Uploading…" : "Upload photo"}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => uploadImage(e.target.files)}
              />
            </label>
          </div>
        </div>
        <div>
          <Label>Display order</Label>
          <Input
            type="number"
            value={displayOrder}
            onChange={(e) => setDisplayOrder(Number(e.target.value))}
            className="mt-2"
          />
        </div>
        <div className="flex gap-3 pt-4">
          <Button onClick={save} disabled={busy || uploading}>
            {busy ? "Saving…" : "Save"}
          </Button>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
        </div>
      </div>
    </div>
  );
}
