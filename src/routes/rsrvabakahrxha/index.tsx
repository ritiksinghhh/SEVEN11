import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ProjectsAdmin } from "@/components/admin/ProjectsAdmin";
import { ServicesAdmin } from "@/components/admin/ServicesAdmin";
import { TeamAdmin } from "@/components/admin/TeamAdmin";
import { AboutAdmin } from "@/components/admin/AboutAdmin";
import { SettingsAdmin } from "@/components/admin/SettingsAdmin";
import { Spinner } from "@/components/site/Spinner";
import { toast } from "sonner";

export const Route = createFileRoute("/rsrvabakahrxha/")({
  head: () => ({
    meta: [{ title: "Admin — Studio 711" }],
  }),
  component: AdminDashboard,
});

function AdminDashboard() {
  const { user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const [claiming, setClaiming] = useState(false);

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/rsrvabakahrxha/login" });
  }, [loading, user, navigate]);

  const claimAdmin = async () => {
    setClaiming(true);
    const { data, error } = await supabase.rpc("claim_admin_if_none");
    setClaiming(false);
    if (error) return toast.error(error.message);
    if (data) {
      toast.success("Admin access granted. Reloading…");
      setTimeout(() => window.location.reload(), 600);
    } else {
      toast.error("An admin already exists. Ask them to grant you access.");
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/rsrvabakahrxha/login" });
  };

  if (loading) return <Spinner />;
  if (!user) return null;

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-6">
        <div className="text-center max-w-md">
          <h1 className="font-serif text-3xl mb-4">Not an admin</h1>
          <p className="text-muted-foreground mb-6">
            Your account ({user.email}) does not have admin access. If this is the first sign-in
            after setup, you can claim admin below.
          </p>
          <div className="flex gap-3 justify-center">
            <Button onClick={claimAdmin} disabled={claiming}>
              {claiming ? "…" : "Claim admin role"}
            </Button>
            <Button variant="outline" onClick={signOut}>
              Sign out
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 h-16 flex items-center justify-between">
          <Link to="/" className="font-serif text-xl">
            Studio 711 <span className="text-muted-foreground text-xs uppercase tracking-[0.2em] ml-2">Admin</span>
          </Link>
          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground hidden md:inline">{user.email}</span>
            <Link to="/" className="text-xs uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground">
              View site
            </Link>
            <Button variant="outline" size="sm" onClick={signOut}>
              Sign out
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-10">
        <Tabs defaultValue="projects">
          <TabsList>
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="services">Services</TabsTrigger>
            <TabsTrigger value="team">Team</TabsTrigger>
            <TabsTrigger value="about">About</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          <TabsContent value="projects" className="mt-8">
            <ProjectsAdmin />
          </TabsContent>
          <TabsContent value="services" className="mt-8">
            <ServicesAdmin />
          </TabsContent>
          <TabsContent value="team" className="mt-8">
            <TeamAdmin />
          </TabsContent>
          <TabsContent value="about" className="mt-8">
            <AboutAdmin />
          </TabsContent>
          <TabsContent value="settings" className="mt-8">
            <SettingsAdmin />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
