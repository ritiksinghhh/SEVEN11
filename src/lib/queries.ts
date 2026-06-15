import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export type Project = Tables<"projects">;
export type Service = Tables<"services">;
export type StudioSettings = Tables<"studio_settings">;
export type TeamMember = Tables<"team_members">;

export function useTeamMembers() {
  return useQuery({
    queryKey: ["team_members"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("team_members")
        .select("*")
        .order("display_order", { ascending: true })
        .order("created_at", { ascending: true });
      if (error) throw error;
      return data as TeamMember[];
    },
  });
}

export function useProjects(category?: string) {
  return useQuery({
    queryKey: ["projects", category ?? "all"],
    queryFn: async () => {
      let q = supabase
        .from("projects")
        .select("*")
        .order("display_order", { ascending: true })
        .order("created_at", { ascending: false });
      if (category && category !== "All") q = q.eq("category", category);
      const { data, error } = await q;
      if (error) throw error;
      return data as Project[];
    },
  });
}

export function useFeaturedProjects() {
  return useQuery({
    queryKey: ["projects", "featured"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("featured", true)
        .order("display_order", { ascending: true })
        .limit(4);
      if (error) throw error;
      return data as Project[];
    },
  });
}

export function useProject(slug: string) {
  return useQuery({
    queryKey: ["project", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("slug", slug)
        .maybeSingle();
      if (error) throw error;
      return data as Project | null;
    },
    enabled: !!slug,
  });
}

export function useServices() {
  return useQuery({
    queryKey: ["services"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("services")
        .select("*")
        .order("display_order", { ascending: true });
      if (error) throw error;
      return data as Service[];
    },
  });
}

export function useStudioSettings() {
  return useQuery({
    queryKey: ["studio_settings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("studio_settings")
        .select("*")
        .order("created_at", { ascending: true })
        .limit(1)
        .maybeSingle();
      if (error) throw error;
      return data as StudioSettings | null;
    },
  });
}

export function slugify(s: string) {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}
