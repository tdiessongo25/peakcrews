-- PeakCrews Database Setup for Supabase (Safe Version)
-- This script handles existing tables gracefully

-- Create users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  phone TEXT,
  user_type TEXT CHECK (user_type IN ('client', 'worker', 'admin')) DEFAULT 'client',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create jobs table
CREATE TABLE IF NOT EXISTS public.jobs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  trade TEXT NOT NULL,
  location TEXT NOT NULL,
  budget_min DECIMAL(10,2),
  budget_max DECIMAL(10,2),
  urgency TEXT CHECK (urgency IN ('low', 'medium', 'high', 'urgent')) DEFAULT 'medium',
  status TEXT CHECK (status IN ('open', 'in_progress', 'completed', 'cancelled')) DEFAULT 'open',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create worker profiles table
CREATE TABLE IF NOT EXISTS public.worker_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE,
  trade TEXT NOT NULL,
  skills TEXT[],
  experience TEXT,
  certifications TEXT[],
  availability BOOLEAN DEFAULT true,
  location TEXT,
  bio TEXT,
  hourly_rate DECIMAL(10,2),
  resume_url TEXT,
  profile_status TEXT CHECK (profile_status IN ('pending', 'approved', 'rejected')) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create applications table
CREATE TABLE IF NOT EXISTS public.applications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  job_id UUID REFERENCES public.jobs(id) ON DELETE CASCADE,
  worker_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  proposal TEXT NOT NULL,
  bid_amount DECIMAL(10,2),
  status TEXT CHECK (status IN ('pending', 'accepted', 'rejected', 'withdrawn')) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(job_id, worker_id)
);

-- Create reviews table
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  job_id UUID REFERENCES public.jobs(id) ON DELETE CASCADE,
  reviewer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  reviewee_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
  comment TEXT,
  category TEXT CHECK (category IN ('communication', 'quality', 'timeliness', 'professionalism', 'overall')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create payments table
CREATE TABLE IF NOT EXISTS public.payments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  job_id UUID REFERENCES public.jobs(id) ON DELETE CASCADE,
  client_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  worker_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  stripe_payment_intent_id TEXT,
  status TEXT CHECK (status IN ('pending', 'completed', 'failed', 'refunded')) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create notifications table
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT CHECK (type IN ('job_application', 'payment', 'review', 'system', 'message')) DEFAULT 'system',
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create messages table
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  job_id UUID REFERENCES public.jobs(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  receiver_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security on all tables (safe to run multiple times)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.worker_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;

DROP POLICY IF EXISTS "Anyone can view open jobs" ON public.jobs;
DROP POLICY IF EXISTS "Clients can view own jobs" ON public.jobs;
DROP POLICY IF EXISTS "Clients can insert own jobs" ON public.jobs;
DROP POLICY IF EXISTS "Clients can update own jobs" ON public.jobs;

DROP POLICY IF EXISTS "Anyone can view approved worker profiles" ON public.worker_profiles;
DROP POLICY IF EXISTS "Workers can view own profile" ON public.worker_profiles;
DROP POLICY IF EXISTS "Workers can insert own profile" ON public.worker_profiles;
DROP POLICY IF EXISTS "Workers can update own profile" ON public.worker_profiles;

DROP POLICY IF EXISTS "Workers can view own applications" ON public.applications;
DROP POLICY IF EXISTS "Clients can view applications for their jobs" ON public.applications;
DROP POLICY IF EXISTS "Workers can insert applications" ON public.applications;
DROP POLICY IF EXISTS "Workers can update own applications" ON public.applications;

DROP POLICY IF EXISTS "Anyone can view reviews" ON public.reviews;
DROP POLICY IF EXISTS "Users can create reviews" ON public.reviews;

DROP POLICY IF EXISTS "Users can view own payments" ON public.payments;
DROP POLICY IF EXISTS "Users can insert payments" ON public.payments;

DROP POLICY IF EXISTS "Users can view own notifications" ON public.notifications;
DROP POLICY IF EXISTS "Users can update own notifications" ON public.notifications;

DROP POLICY IF EXISTS "Users can view own messages" ON public.messages;
DROP POLICY IF EXISTS "Users can send messages" ON public.messages;

-- Create RLS policies
-- Profiles: Users can read their own profile and update it
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Jobs: Anyone can view open jobs, clients can manage their own jobs
CREATE POLICY "Anyone can view open jobs" ON public.jobs FOR SELECT USING (status = 'open');
CREATE POLICY "Clients can view own jobs" ON public.jobs FOR SELECT USING (client_id = auth.uid());
CREATE POLICY "Clients can insert own jobs" ON public.jobs FOR INSERT WITH CHECK (client_id = auth.uid());
CREATE POLICY "Clients can update own jobs" ON public.jobs FOR UPDATE USING (client_id = auth.uid());

-- Worker profiles: Anyone can view approved profiles, workers can manage their own
CREATE POLICY "Anyone can view approved worker profiles" ON public.worker_profiles FOR SELECT USING (profile_status = 'approved');
CREATE POLICY "Workers can view own profile" ON public.worker_profiles FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Workers can insert own profile" ON public.worker_profiles FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Workers can update own profile" ON public.worker_profiles FOR UPDATE USING (user_id = auth.uid());

-- Applications: Workers can view their applications, clients can view applications for their jobs
CREATE POLICY "Workers can view own applications" ON public.applications FOR SELECT USING (worker_id = auth.uid());
CREATE POLICY "Clients can view applications for their jobs" ON public.applications FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.jobs WHERE jobs.id = applications.job_id AND jobs.client_id = auth.uid())
);
CREATE POLICY "Workers can insert applications" ON public.applications FOR INSERT WITH CHECK (worker_id = auth.uid());
CREATE POLICY "Workers can update own applications" ON public.applications FOR UPDATE USING (worker_id = auth.uid());

-- Reviews: Anyone can view reviews, users can create reviews for completed jobs
CREATE POLICY "Anyone can view reviews" ON public.reviews FOR SELECT USING (true);
CREATE POLICY "Users can create reviews" ON public.reviews FOR INSERT WITH CHECK (reviewer_id = auth.uid());

-- Payments: Users can view payments they're involved in
CREATE POLICY "Users can view own payments" ON public.payments FOR SELECT USING (client_id = auth.uid() OR worker_id = auth.uid());
CREATE POLICY "Users can insert payments" ON public.payments FOR INSERT WITH CHECK (client_id = auth.uid());

-- Notifications: Users can view their own notifications
CREATE POLICY "Users can view own notifications" ON public.notifications FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can update own notifications" ON public.notifications FOR UPDATE USING (user_id = auth.uid());

-- Messages: Users can view messages they're involved in
CREATE POLICY "Users can view own messages" ON public.messages FOR SELECT USING (sender_id = auth.uid() OR receiver_id = auth.uid());
CREATE POLICY "Users can send messages" ON public.messages FOR INSERT WITH CHECK (sender_id = auth.uid());

-- Create indexes for better performance (safe to run multiple times)
CREATE INDEX IF NOT EXISTS idx_jobs_status ON public.jobs(status);
CREATE INDEX IF NOT EXISTS idx_jobs_trade ON public.jobs(trade);
CREATE INDEX IF NOT EXISTS idx_jobs_location ON public.jobs(location);
CREATE INDEX IF NOT EXISTS idx_applications_job_id ON public.applications(job_id);
CREATE INDEX IF NOT EXISTS idx_applications_worker_id ON public.applications(worker_id);
CREATE INDEX IF NOT EXISTS idx_reviews_reviewee_id ON public.reviews(reviewee_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_messages_job_id ON public.messages(job_id);

-- Create functions for automatic timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at (safe to run multiple times)
DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_jobs_updated_at ON public.jobs;
CREATE TRIGGER update_jobs_updated_at BEFORE UPDATE ON public.jobs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_worker_profiles_updated_at ON public.worker_profiles;
CREATE TRIGGER update_worker_profiles_updated_at BEFORE UPDATE ON public.worker_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_applications_updated_at ON public.applications;
CREATE TRIGGER update_applications_updated_at BEFORE UPDATE ON public.applications FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_payments_updated_at ON public.payments;
CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON public.payments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data for testing (only if profiles table is empty)
INSERT INTO public.profiles (id, email, full_name, user_type) 
SELECT 
  gen_random_uuid(), 'admin@peakcrews.com', 'Admin User', 'admin'
WHERE NOT EXISTS (SELECT 1 FROM public.profiles WHERE email = 'admin@peakcrews.com');

INSERT INTO public.profiles (id, email, full_name, user_type) 
SELECT 
  gen_random_uuid(), 'client@example.com', 'John Client', 'client'
WHERE NOT EXISTS (SELECT 1 FROM public.profiles WHERE email = 'client@example.com');

INSERT INTO public.profiles (id, email, full_name, user_type) 
SELECT 
  gen_random_uuid(), 'worker@example.com', 'Mike Worker', 'worker'
WHERE NOT EXISTS (SELECT 1 FROM public.profiles WHERE email = 'worker@example.com');

-- Add table comments
COMMENT ON TABLE public.profiles IS 'User profiles extending Supabase auth';
COMMENT ON TABLE public.jobs IS 'Job postings by clients';
COMMENT ON TABLE public.worker_profiles IS 'Worker professional profiles';
COMMENT ON TABLE public.applications IS 'Job applications by workers';
COMMENT ON TABLE public.reviews IS 'Reviews and ratings between users';
COMMENT ON TABLE public.payments IS 'Payment transactions';
COMMENT ON TABLE public.notifications IS 'User notifications';
COMMENT ON TABLE public.messages IS 'Direct messages between users';

-- Success message
SELECT 'PeakCrews database setup completed successfully!' as status;
