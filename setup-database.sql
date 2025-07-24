-- Database setup for CertMyCar
-- Run this in Supabase SQL Editor or psql

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    stripe_customer_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create assessments table
CREATE TABLE IF NOT EXISTS public.assessments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    tesla_vin TEXT NOT NULL,
    battery_health TEXT CHECK (battery_health IN ('Good', 'Fair', 'Poor')) NOT NULL,
    degradation_pct NUMERIC NOT NULL,
    assessment_date TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    user_agent TEXT
);

-- Create certificates table
CREATE TABLE IF NOT EXISTS public.certificates (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    certificate_id TEXT UNIQUE NOT NULL,
    tesla_vin TEXT NOT NULL,
    vehicle_name TEXT NOT NULL,
    vehicle_model TEXT NOT NULL DEFAULT 'Unknown',
    vehicle_trim TEXT NOT NULL DEFAULT 'Standard',
    vehicle_year INTEGER NOT NULL DEFAULT 2020,
    odometer_miles NUMERIC,
    software_version TEXT,
    battery_health_data JSONB NOT NULL,
    battery_data JSONB NOT NULL,
    is_paid BOOLEAN DEFAULT false NOT NULL,
    customer_email TEXT,
    stripe_session_id TEXT,
    paid_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Users can view own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Create RLS policies for assessments
-- Allow anonymous read (for public stats)
CREATE POLICY "Allow anonymous read assessments" ON public.assessments
    FOR SELECT TO anon USING (true);

-- Allow authenticated users to read all
CREATE POLICY "Allow authenticated read assessments" ON public.assessments
    FOR SELECT TO authenticated USING (true);

-- Allow anyone to insert assessments (for anonymous battery checks)
CREATE POLICY "Allow anonymous insert assessments" ON public.assessments
    FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "Allow authenticated insert assessments" ON public.assessments
    FOR INSERT TO authenticated WITH CHECK (true);

-- Allow users to update their own assessments
CREATE POLICY "Users can update own assessments" ON public.assessments
    FOR UPDATE USING (auth.uid() = user_id);

-- Create RLS policies for certificates
-- Allow anyone to read certificates (needed for verification)
CREATE POLICY "Allow public read certificates" ON public.certificates
    FOR SELECT TO anon USING (true);

CREATE POLICY "Allow authenticated read certificates" ON public.certificates
    FOR SELECT TO authenticated USING (true);

-- Allow anyone to insert certificates (for anonymous purchases)
CREATE POLICY "Allow anonymous insert certificates" ON public.certificates
    FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "Allow authenticated insert certificates" ON public.certificates
    FOR INSERT TO authenticated WITH CHECK (true);

-- Allow users to update their own certificates
CREATE POLICY "Users can update own certificates" ON public.certificates
    FOR UPDATE USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_assessments_tesla_vin ON public.assessments(tesla_vin);
CREATE INDEX IF NOT EXISTS idx_assessments_assessment_date ON public.assessments(assessment_date);
CREATE INDEX IF NOT EXISTS idx_certificates_certificate_id ON public.certificates(certificate_id);
CREATE INDEX IF NOT EXISTS idx_certificates_tesla_vin ON public.certificates(tesla_vin);
CREATE INDEX IF NOT EXISTS idx_certificates_created_at ON public.certificates(created_at);
CREATE INDEX IF NOT EXISTS idx_certificates_is_paid ON public.certificates(is_paid);

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON public.profiles TO authenticated;
GRANT SELECT, INSERT ON public.assessments TO anon, authenticated;
GRANT UPDATE ON public.assessments TO authenticated;
GRANT SELECT, INSERT ON public.certificates TO anon, authenticated;
GRANT UPDATE ON public.certificates TO authenticated;