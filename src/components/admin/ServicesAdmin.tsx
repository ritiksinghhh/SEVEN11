import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useServices, type Service } from "@/lib/queries";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Pencil, Plus, Trash2 } from "lucide-react";

export function ServicesAdmin() {
  const { data, isLoading } = useServices();
  const qc = useQueryClient();
  const [editing, setEditing] = useState<Service | null>(null);
  const [creating, setCreating] = useState(false);

  const refresh = () => qc.invalidateQueries({ queryKey: ["services"] });

  const remove = async (s: Service) => {
    if (!confirm(`Delete "${s.name}"?`)) return;
    const { error } = await supabase.from("services").delete().eq("id", s.id);
    if (error) toast.error(error.message);
    else {
      toast.success("Service deleted");
      refresh();
    }
  };

  if (editing || creating) {
    return (
      <ServiceForm
        service={editing}
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
        <h2 className="font-serif text-2xl">Services</h2>
        <Button onClick={() => setCreating(true)}>
          <Plus className="h-4 w-4 mr-2" /> New Service
        </Button>
      </div>
      {isLoading ? (
        <p className="text-muted-foreground">Loading…</p>
      ) : (
        <div className="border border-border divide-y divide-border">
          {(data ?? []).map((s) => (
            <div key={s.id} className="flex items-center gap-4 p-4">
              <div className="flex-1 min-w-0">
                <div className="font-serif text-lg">{s.name}</div>
                <div className="text-xs text-muted-foreground truncate">{s.description}</div>
              </div>
              <span className="text-xs text-muted-foreground">{s.icon}</span>
              <Button variant="ghost" size="icon" onClick={() => setEditing(s)}>
                <Pencil className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => remove(s)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ServiceForm({
  service,
  onClose,
  onSaved,
}: {
  service: Service | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [name, setName] = useState(service?.name ?? "");
  const [description, setDescription] = useState(service?.description ?? "");
  const [icon, setIcon] = useState(service?.icon ?? "");
  const [displayOrder, setDisplayOrder] = useState<number>(service?.display_order ?? 0);
  const [busy, setBusy] = useState(false);

  const save = async () => {
    if (!name) return toast.error("Name is required");
    setBusy(true);
    const payload = { name, description, icon, display_order: displayOrder };
    const { error } = service
      ? await supabase.from("services").update(payload).eq("id", service.id)
      : await supabase.from("services").insert(payload);
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
        <h2 className="font-serif text-2xl">{service ? "Edit Service" : "New Service"}</h2>
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
      </div>

      <div className="space-y-4 max-w-2xl">
        <div>
          <Label>Name</Label>
          <Input value={name} onChange={(e) => setName(e.target.value)} className="mt-2" />
        </div>
        <div>
          <Label>Description</Label>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="mt-2"
          />
        </div>
        <div>
          <Label>Icon name (lucide-react)</Label>
          <Input
            value={icon}
            onChange={(e) => setIcon(e.target.value)}
            placeholder="e.g. Building2, Sofa, Hammer"
            className="mt-2"
          />
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
          <Button onClick={save} disabled={busy}>
            {busy ? "Saving…" : "Save"}
          </Button>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}
