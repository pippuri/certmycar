-- Stripe Products Table for Multi-language Pricing
-- Run this in Supabase SQL Editor

-- Create stripe_products table
CREATE TABLE IF NOT EXISTS public.stripe_products (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    product_id TEXT NOT NULL, -- Stripe Product ID
    name TEXT NOT NULL, -- Product name in the locale
    description TEXT, -- Product description in the locale
    locale TEXT NOT NULL, -- Language code (en, es, de, fr, etc.)
    price_id TEXT NOT NULL, -- Stripe Price ID (this is what we use in checkout)
    active BOOLEAN DEFAULT true, -- Whether this product/price is active
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    
    -- Ensure unique combination of product_id and locale
    UNIQUE(product_id, locale)
);

-- Create index for efficient locale lookups
CREATE INDEX IF NOT EXISTS idx_stripe_products_locale ON public.stripe_products(locale);
CREATE INDEX IF NOT EXISTS idx_stripe_products_active ON public.stripe_products(active);

-- Enable Row Level Security
ALTER TABLE public.stripe_products ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for stripe_products
CREATE POLICY "Allow public read stripe_products" 
ON public.stripe_products FOR SELECT 
TO public USING (active = true);

CREATE POLICY "Allow authenticated insert stripe_products" 
ON public.stripe_products FOR INSERT 
TO authenticated WITH CHECK (true);

CREATE POLICY "Allow authenticated update stripe_products" 
ON public.stripe_products FOR UPDATE 
TO authenticated USING (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_stripe_products_updated_at 
    BEFORE UPDATE ON public.stripe_products 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data for different locales
-- Note: You'll need to create these products in your Stripe dashboard first
-- and replace the product_id and price_id values with your actual Stripe IDs

INSERT INTO public.stripe_products (product_id, name, description, locale, price_id) VALUES
-- English (US)
('prod_certificate_en', 'Tesla Battery Certificate', 'Official Tesla battery health certificate with verification QR code', 'en', 'price_certificate_en'),

-- Spanish
('prod_certificate_es', 'Certificado de Batería Tesla', 'Certificado oficial de salud de batería Tesla con código QR de verificación', 'es', 'price_certificate_es'),

-- German
('prod_certificate_de', 'Tesla Batterie-Zertifikat', 'Offizielles Tesla Batterie-Gesundheitszertifikat mit QR-Verifizierungscode', 'de', 'price_certificate_de'),

-- French
('prod_certificate_fr', 'Certificat de Batterie Tesla', 'Certificat officiel de santé de batterie Tesla avec code QR de vérification', 'fr', 'price_certificate_fr'),

-- Finnish
('prod_certificate_fi', 'Tesla Akku Sertifikaatti', 'Virallinen Tesla akun terveyden sertifikaatti QR-verifiointikoodilla', 'fi', 'price_certificate_fi'),

-- Swedish
('prod_certificate_sv', 'Tesla Batteri Certifikat', 'Officiellt Tesla batterihälsocertifikat med QR-verifieringskod', 'sv', 'price_certificate_sv'),

-- Norwegian
('prod_certificate_no', 'Tesla Batteri Sertifikat', 'Offisielt Tesla batterihelse-sertifikat med QR-verifikasjonskode', 'no', 'price_certificate_no'),

-- Danish
('prod_certificate_da', 'Tesla Batteri Certifikat', 'Officielt Tesla batteri sundhedscertifikat med QR-verifikationskode', 'da', 'price_certificate_da'),

-- Dutch
('prod_certificate_nl', 'Tesla Batterij Certificaat', 'Officieel Tesla batterij gezondheidscertificaat met QR-verificatiecode', 'nl', 'price_certificate_nl'),

-- Italian
('prod_certificate_it', 'Certificato Batteria Tesla', 'Certificato ufficiale di salute della batteria Tesla con codice QR di verifica', 'it', 'price_certificate_it'),

-- Portuguese
('prod_certificate_pt', 'Certificado de Bateria Tesla', 'Certificado oficial de saúde da bateria Tesla com código QR de verificação', 'pt', 'price_certificate_pt');

-- Create a view for easy access to active products
CREATE OR REPLACE VIEW public.active_stripe_products AS
SELECT 
    id,
    product_id,
    name,
    description,
    locale,
    price_id,
    created_at,
    updated_at
FROM public.stripe_products
WHERE active = true
ORDER BY locale, name;

-- Grant access to the view
GRANT SELECT ON public.active_stripe_products TO public;

-- Example queries for reference:
-- Get product for specific locale
-- SELECT * FROM public.stripe_products WHERE locale = 'en' AND active = true;

-- Get all active products
-- SELECT * FROM public.active_stripe_products;

-- Update a product (note: price changes should be done in Stripe Dashboard)
-- UPDATE public.stripe_products SET name = 'New Name' WHERE locale = 'en' AND product_id = 'prod_certificate_en'; 