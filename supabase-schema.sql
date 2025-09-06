-- Portfolio Database Schema for WOODY SOFTWARE DEVELOPMENT SERVICES
-- Apply this schema in your Supabase dashboard or using Supabase CLI

-- Create projects table for portfolio showcase
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
  name VARCHAR NOT NULL,
  description TEXT,
  tech_stack TEXT[],
  github_url TEXT,
  live_url TEXT,
  image_url TEXT,
  category VARCHAR,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create skills table for technical skills
CREATE TABLE IF NOT EXISTS public.skills (
  id UUID DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
  name VARCHAR NOT NULL,
  category VARCHAR,
  proficiency_level INTEGER CHECK (proficiency_level >= 1 AND proficiency_level <= 5),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create chat_interactions table for AI assistant
CREATE TABLE IF NOT EXISTS public.chat_interactions (
  id UUID DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
  session_id VARCHAR NOT NULL,
  message TEXT NOT NULL,
  response TEXT,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_interactions ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
-- Drop existing policies if they exist first
DROP POLICY IF EXISTS "Allow public read access on projects" ON public.projects;
DROP POLICY IF EXISTS "Allow public read access on skills" ON public.skills;
DROP POLICY IF EXISTS "Allow public read access on chat_interactions" ON public.chat_interactions;
DROP POLICY IF EXISTS "Allow public insert access on chat_interactions" ON public.chat_interactions;

-- Then create the new policies
CREATE POLICY "Allow public read access on projects" ON public.projects FOR SELECT USING (true);
CREATE POLICY "Allow public read access on skills" ON public.skills FOR SELECT USING (true);
CREATE POLICY "Allow public read access on chat_interactions" ON public.chat_interactions FOR SELECT USING (true);
CREATE POLICY "Allow public insert access on chat_interactions" ON public.chat_interactions FOR INSERT WITH CHECK (true);

-- Insert sample data for WOODY SOFTWARE DEVELOPMENT SERVICES
INSERT INTO public.projects (name, description, tech_stack, github_url, live_url, category, featured) VALUES
('WOODY SOFTWARE DEVELOPMENT SERVICES', 'Professional software development services specializing in web applications, mobile apps, and AI-powered solutions. Expert in modern technologies and agile development practices.', ARRAY['React', 'Node.js', 'Python', 'TypeScript', 'Next.js', 'PostgreSQL', 'AWS'], 'https://github.com/woody-software', 'https://woody-software.com', 'Services', true),
('Basketball League Management System', 'Comprehensive basketball league management platform with real-time scoring, player statistics, team management, and automated scheduling. Features include live game tracking, performance analytics, and mobile app integration.', ARRAY['Next.js', 'Supabase', 'Tailwind CSS', 'React Native', 'PostgreSQL', 'TypeScript'], 'https://github.com/woody-software/basketball-league', 'https://basketball-league.woody-software.com', 'Sports Management', true),
('AI-Powered Portfolio Website', 'Dynamic developer portfolio with integrated AI assistant that answers questions about projects and technical expertise. Built with modern web technologies and powered by advanced AI models.', ARRAY['Next.js', 'TypeScript', 'Tailwind CSS', 'DeepSeek AI', 'xAI Grok', 'Supabase'], 'https://github.com/woody-software/portfolio', 'https://woody-software.com/portfolio', 'Web Development', true);

-- Insert technical skills
INSERT INTO public.skills (name, category, proficiency_level) VALUES
('JavaScript/TypeScript', 'Frontend', 5),
('React/Next.js', 'Frontend', 5),
('Python', 'Backend', 5),
('Node.js', 'Backend', 5),
('PostgreSQL', 'Database', 4),
('Supabase', 'Backend-as-a-Service', 5),
('Tailwind CSS', 'Styling', 5),
('Git/GitHub', 'Version Control', 5),
('AWS', 'Cloud', 4),
('Docker', 'DevOps', 4),
('AI/ML Integration', 'AI', 4),
('REST APIs', 'Backend', 5),
('GraphQL', 'Backend', 4),
('Mobile Development', 'Mobile', 4),
('Agile/Scrum', 'Project Management', 5);
