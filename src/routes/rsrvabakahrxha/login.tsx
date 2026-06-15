import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export const Route = createFileRoute("/rsrvabakahrxha/login")({
  head: () => ({
    meta: [{ title: "Admin Login — Studio 711" }],
  }),
  component: AdminLogin,
});

function AdminLogin() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: window.location.origin + "/rsrvabakahrxha" },
        });
        if (error) throw error;
        // Try to claim admin if this is the first user
        await supabase.rpc("claim_admin_if_none");
      }
      toast.success("Signed in");
      navigate({ to: "/rsrvabakahrxha" });
    } catch (err: any) {
      toast.error(err.message ?? "Authentication failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-6">
      <div className="w-full max-w-sm">
        <Link to="/" className="block text-center font-serif text-3xl mb-2">
          Studio 711
        </Link>
        <h1 className="text-center text-xs uppercase tracking-[0.25em] text-muted-foreground mb-12">
          Admin
        </h1>

        <form onSubmit={submit} className="space-y-4">
          <div>
            <Label htmlFor="email" className="text-xs uppercase tracking-[0.2em]">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-2"
            />
          </div>
          <div>
            <Label htmlFor="password" className="text-xs uppercase tracking-[0.2em]">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-2"
            />
          </div>

          <Button type="submit" disabled={busy} className="w-full mt-4">
            {busy ? "Please wait…" : mode === "signin" ? "Sign In" : "Create Account"}
          </Button>
        </form>

        <button
          type="button"
          onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
          className="mt-6 w-full text-center text-xs uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground"
        >
          {mode === "signin"
            ? "First time? Create the admin account"
            : "Have an account? Sign in"}
        </button>
      </div>
    </div>
  );
}
