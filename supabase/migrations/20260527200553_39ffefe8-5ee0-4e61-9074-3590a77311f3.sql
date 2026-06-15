
-- ============ ENUM for roles ============
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- ============ user_roles ============
CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL DEFAULT 'user',
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE POLICY "Users can view their own roles" ON public.user_roles
  FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage roles" ON public.user_roles
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- ============ projects ============
CREATE TABLE public.projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  location text,
  category text NOT NULL DEFAULT 'Residential',
  year integer,
  description text,
  cover_image_url text,
  images text[] DEFAULT ARRAY[]::text[],
  featured boolean NOT NULL DEFAULT false,
  display_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.projects TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.projects TO authenticated;
GRANT ALL ON public.projects TO service_role;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read projects" ON public.projects
  FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins can insert projects" ON public.projects
  FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update projects" ON public.projects
  FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete projects" ON public.projects
  FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- ============ services ============
CREATE TABLE public.services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  icon text,
  display_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.services TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.services TO authenticated;
GRANT ALL ON public.services TO service_role;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read services" ON public.services
  FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins can insert services" ON public.services
  FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update services" ON public.services
  FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete services" ON public.services
  FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- ============ studio_settings ============
CREATE TABLE public.studio_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  studio_name text NOT NULL DEFAULT 'Studio 711',
  tagline text,
  email text,
  phone text,
  whatsapp text,
  address_line1 text,
  address_line2 text,
  city text,
  state text,
  country text,
  about_text text,
  map_latitude numeric,
  map_longitude numeric,
  established_year integer,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.studio_settings TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.studio_settings TO authenticated;
GRANT ALL ON public.studio_settings TO service_role;
ALTER TABLE public.studio_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read studio settings" ON public.studio_settings
  FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins can insert studio settings" ON public.studio_settings
  FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update studio settings" ON public.studio_settings
  FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete studio settings" ON public.studio_settings
  FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- ============ updated_at trigger ============
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END $$;

CREATE TRIGGER projects_set_updated_at BEFORE UPDATE ON public.projects
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER services_set_updated_at BEFORE UPDATE ON public.services
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER studio_settings_set_updated_at BEFORE UPDATE ON public.studio_settings
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============ Storage bucket ============
INSERT INTO storage.buckets (id, name, public)
VALUES ('project-images', 'project-images', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public can view project images"
  ON storage.objects FOR SELECT TO anon, authenticated
  USING (bucket_id = 'project-images');
CREATE POLICY "Admins can upload project images"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'project-images' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update project images"
  ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'project-images' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete project images"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'project-images' AND public.has_role(auth.uid(), 'admin'));

-- ============ Seed services ============
INSERT INTO public.services (name, description, icon, display_order) VALUES
  ('Architectural Design', 'Full building design from concept to completion.', 'Building2', 1),
  ('Interior Design', 'Thoughtful interiors tailored to how you live.', 'Sofa', 2),
  ('Renovation & Restoration', 'Sensitive upgrades to existing spaces.', 'Hammer', 3),
  ('Project Management', 'End-to-end execution and site supervision.', 'ClipboardList', 4),
  ('Space Planning', 'Efficient, functional layouts for any space.', 'LayoutGrid', 5);

-- ============ Seed studio settings ============
INSERT INTO public.studio_settings (
  studio_name, tagline, email, phone, whatsapp,
  address_line1, address_line2, city, state, country,
  about_text, map_latitude, map_longitude, established_year
) VALUES (
  'Studio 711',
  'Architecture & Interior Design — Lucknow, India',
  'hello@studio711.in',
  '+91 88402 30877',
  '918840230877',
  '1st Floor, A/24 Raghunandan Ashiyana',
  'BBDU',
  'Lucknow',
  'Uttar Pradesh',
  'India',
  'Studio 711 is a residential architecture and interior design studio based in Lucknow, founded in 2023. We design calm, considered spaces shaped by context, craft, and the quiet rhythms of daily life.',
  26.894444,
  81.055778,
  2023
);
