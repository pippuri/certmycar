# Database Setup for CertMyCar

## Manual Setup Steps

Since the database tables don't exist yet, you need to manually create them in Supabase.

### 1. Go to Supabase Dashboard

Visit: https://supabase.com/dashboard/project/sbctkzedwmdlgdvitlki

### 2. Open SQL Editor

Click on "SQL Editor" in the left sidebar.

### 3. Execute This SQL

Copy and paste this SQL into the editor and run it:

```sql
-- Create certificates table
CREATE TABLE public.certificates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Create assessments table
CREATE TABLE public.assessments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tesla_vin TEXT NOT NULL,
    battery_health TEXT CHECK (battery_health IN ('Good', 'Fair', 'Poor')) NOT NULL,
    degradation_pct NUMERIC NOT NULL,
    assessment_date TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    user_agent TEXT
);

-- Enable RLS (Row Level Security)
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessments ENABLE ROW LEVEL SECURITY;

-- Create policies for certificates
CREATE POLICY "Allow public read certificates" 
ON public.certificates FOR SELECT 
TO public USING (true);

CREATE POLICY "Allow public insert certificates" 
ON public.certificates FOR INSERT 
TO public WITH CHECK (true);

-- Create policies for assessments
CREATE POLICY "Allow public read assessments" 
ON public.assessments FOR SELECT 
TO public USING (true);

CREATE POLICY "Allow public insert assessments" 
ON public.assessments FOR INSERT 
TO public WITH CHECK (true);

-- Create indexes for performance
CREATE INDEX idx_certificates_certificate_id ON public.certificates(certificate_id);
CREATE INDEX idx_certificates_tesla_vin ON public.certificates(tesla_vin);
CREATE INDEX idx_certificates_created_at ON public.certificates(created_at);
CREATE INDEX idx_assessments_tesla_vin ON public.assessments(tesla_vin);
CREATE INDEX idx_assessments_assessment_date ON public.assessments(assessment_date);
```

### 4. Insert Test Data

After creating the tables, run this SQL to add test certificate data:

```sql
-- Insert test certificates
INSERT INTO public.certificates (
    certificate_id,
    tesla_vin,
    vehicle_name,
    vehicle_model,
    vehicle_trim,
    vehicle_year,
    odometer_miles,
    software_version,
    battery_health_data,
    battery_data,
    is_paid,
    customer_email,
    paid_at
) VALUES 
(
    'CMB-2025-ABC123DEF',
    'LRW3E7EBXMC418780',
    'Razor Crest',
    'Model 3',
    'Long Range',
    2021,
    39411.45,
    '2025.20.7',
    '{
        "health_percentage": 93.0,
        "degradation_percentage": 7.0,
        "original_capacity_kwh": 75.0,
        "current_capacity_kwh": 69.8,
        "confidence_level": "high",
        "methodology": "Tesla Ideal Range Analysis (NCM/LG Chem cells) - Vehicle from Shanghai, China (Giga Shanghai) (LG Generation 2 - 75kWh usable)",
        "battery_chemistry": "NCM",
        "battery_supplier": "LG",
        "assembly_plant": "Shanghai, China (Giga Shanghai)",
        "estimated_range_loss_miles": 23
    }',
    '{
        "battery_level": 78,
        "usable_battery_level": 72.5,
        "charge_energy_added": 42.5,
        "charge_limit_soc": 90,
        "est_battery_range": 280,
        "rated_battery_range": 315
    }',
    true,
    'owner@tesla.com',
    NOW()
),
(
    'CMB-2025-XYZ789GHI',
    '5YJ3E1EA4PF000001',
    'Tesla Model 3',
    'Model 3',
    'Standard Range+',
    2021,
    25000,
    '2025.20.5',
    '{
        "health_percentage": 95.2,
        "degradation_percentage": 4.8,
        "original_capacity_kwh": 57.0,
        "current_capacity_kwh": 54.3,
        "confidence_level": "high",
        "methodology": "Tesla Ideal Range Analysis (LFP/CATL chemistry) - Vehicle from Shanghai, China (Giga Shanghai)",
        "battery_chemistry": "LFP",
        "battery_supplier": "CATL",
        "assembly_plant": "Shanghai, China (Giga Shanghai)",
        "estimated_range_loss_miles": 12
    }',
    '{
        "battery_level": 65,
        "usable_battery_level": 85,
        "charge_energy_added": 38.2,
        "charge_limit_soc": 90,
        "est_battery_range": 200,
        "rated_battery_range": 244
    }',
    true,
    'test@example.com',
    NOW()
),
(
    'CMB-2025-DEF456JKL',
    '5YJYGDEE2BF000001',
    'Tesla Model Y',
    'Model Y',
    'Long Range',
    2022,
    15000,
    '2025.20.6',
    '{
        "health_percentage": 98.1,
        "degradation_percentage": 1.9,
        "original_capacity_kwh": 77.0,
        "current_capacity_kwh": 75.5,
        "confidence_level": "high",
        "methodology": "Tesla Ideal Range Analysis (NCM/LG Chem cells) - Vehicle from Berlin, Germany (Giga Berlin)",
        "battery_chemistry": "NCM",
        "battery_supplier": "LG",
        "assembly_plant": "Berlin, Germany (Giga Berlin)",
        "estimated_range_loss_miles": 6
    }',
    '{
        "battery_level": 82,
        "usable_battery_level": 95,
        "charge_energy_added": 55.8,
        "charge_limit_soc": 100,
        "est_battery_range": 310,
        "rated_battery_range": 330
    }',
    true,
    'premium@example.com',
    NOW()
);
```

## Test Certificate IDs

After setup, you can test PDF generation with these certificate IDs:

- `CMB-2025-ABC123DEF` - 2021 Model 3 Long Range (7% degradation)
- `CMB-2025-XYZ789GHI` - 2021 Model 3 Standard Range+ (4.8% degradation)
- `CMB-2025-DEF456JKL` - 2022 Model Y Long Range (1.9% degradation)

## Verification

After running the SQL, you should be able to:

1. Run `node check-database.js` successfully
2. Access `/api/certificate/pdf/CMB-2025-ABC123DEF` for PDF generation
3. Use the Tesla auth route to create new certificates

## Database Structure Summary

The database matches the TypeScript definitions in `/src/lib/supabase.ts`:

- **certificates** table: Stores complete certificate data with battery health analysis
- **assessments** table: Stores basic battery assessments (for analytics)
- **Battery health data**: JSONB with comprehensive Tesla-specific analysis
- **Battery data**: JSONB with current charge state and range data