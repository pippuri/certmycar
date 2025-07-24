import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase";

// Test certificate data that matches the Tesla API structure
const testCertificates = [
  {
    certificate_id: 'CMB-2025-ABC123DEF',
    tesla_vin: 'LRW3E7EBXMC418780',
    vehicle_name: 'Razor Crest',
    vehicle_model: 'Model 3',
    vehicle_trim: 'Long Range',
    vehicle_year: 2021,
    odometer_miles: 39411.45,
    software_version: '2025.20.7',
    battery_health_data: {
      health_percentage: 93.0,
      degradation_percentage: 7.0,
      original_capacity_kwh: 75.0,
      current_capacity_kwh: 69.8,
      confidence_level: 'high',
      methodology: 'Tesla Ideal Range Analysis (NCM/LG Chem cells) - Vehicle from Shanghai, China (Giga Shanghai) (LG Generation 2 - 75kWh usable)',
      battery_chemistry: 'NCM',
      battery_supplier: 'LG',
      assembly_plant: 'Shanghai, China (Giga Shanghai)',
      estimated_range_loss_miles: 23
    },
    battery_data: {
      battery_level: 78,
      usable_battery_level: 72.5,
      charge_energy_added: 42.5,
      charge_limit_soc: 90,
      est_battery_range: 280,
      rated_battery_range: 315
    },
    is_paid: true,
    customer_email: 'owner@tesla.com',
    paid_at: new Date().toISOString(),
    created_at: new Date().toISOString()
  },
  {
    certificate_id: 'CMB-2025-XYZ789GHI',
    tesla_vin: '5YJ3E1EA4PF000001',
    vehicle_name: 'Tesla Model 3',
    vehicle_model: 'Model 3',
    vehicle_trim: 'Standard Range+',
    vehicle_year: 2021,
    odometer_miles: 25000,
    software_version: '2025.20.5',
    battery_health_data: {
      health_percentage: 95.2,
      degradation_percentage: 4.8,
      original_capacity_kwh: 57.0,
      current_capacity_kwh: 54.3,
      confidence_level: 'high',
      methodology: 'Tesla Ideal Range Analysis (LFP/CATL chemistry) - Vehicle from Shanghai, China (Giga Shanghai)',
      battery_chemistry: 'LFP',
      battery_supplier: 'CATL',
      assembly_plant: 'Shanghai, China (Giga Shanghai)',
      estimated_range_loss_miles: 12
    },
    battery_data: {
      battery_level: 65,
      usable_battery_level: 85,
      charge_energy_added: 38.2,
      charge_limit_soc: 90,
      est_battery_range: 200,
      rated_battery_range: 244
    },
    is_paid: true,
    customer_email: 'test@example.com',
    paid_at: new Date().toISOString(),
    created_at: new Date().toISOString()
  },
  {
    certificate_id: 'CMB-2025-DEF456JKL',
    tesla_vin: '5YJYGDEE2BF000001',
    vehicle_name: 'Tesla Model Y',
    vehicle_model: 'Model Y',
    vehicle_trim: 'Long Range',
    vehicle_year: 2022,
    odometer_miles: 15000,
    software_version: '2025.20.6',
    battery_health_data: {
      health_percentage: 98.1,
      degradation_percentage: 1.9,
      original_capacity_kwh: 77.0,
      current_capacity_kwh: 75.5,
      confidence_level: 'high',
      methodology: 'Tesla Ideal Range Analysis (NCM/LG Chem cells) - Vehicle from Berlin, Germany (Giga Berlin)',
      battery_chemistry: 'NCM',
      battery_supplier: 'LG',
      assembly_plant: 'Berlin, Germany (Giga Berlin)',
      estimated_range_loss_miles: 6
    },
    battery_data: {
      battery_level: 82,
      usable_battery_level: 95,
      charge_energy_added: 55.8,
      charge_limit_soc: 100,
      est_battery_range: 310,
      rated_battery_range: 330
    },
    is_paid: true,
    customer_email: 'premium@example.com',
    paid_at: new Date().toISOString(),
    created_at: new Date().toISOString()
  }
];

export async function POST() {
  try {
    const supabase = await createServerSupabaseClient();
    console.log('Creating demo certificates...');

    // Clear existing demo certificates first
    const { error: deleteError } = await supabase
      .from('certificates')
      .delete()
      .in('certificate_id', testCertificates.map(c => c.certificate_id));

    if (deleteError) {
      console.log('No existing certificates to delete or delete failed:', deleteError.message);
    } else {
      console.log('Cleared existing demo certificates');
    }

    // Insert test certificates
    const { data, error } = await supabase
      .from('certificates')
      .insert(testCertificates)
      .select();

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json({
        success: false,
        error: error.message,
        suggestion: "The certificates table may not exist. Please check the DATABASE_SETUP.md file for SQL to create it."
      }, { status: 500 });
    }

    console.log(`Created ${data.length} demo certificates`);

    return NextResponse.json({
      success: true,
      message: `Created ${data.length} demo certificates`,
      certificates: data.map(cert => ({
        certificate_id: cert.certificate_id,
        vehicle_name: cert.vehicle_name,
        vehicle_model: cert.vehicle_model,
        vehicle_trim: cert.vehicle_trim,
        degradation_percentage: cert.battery_health_data.degradation_percentage,
        test_url: `/api/certificate/pdf/${cert.certificate_id}?vin=${cert.tesla_vin}`
      })),
      next_steps: [
        `Test PDF generation: /api/certificate/pdf/CMB-2025-ABC123DEF?vin=LRW3E7EBXMC418780`,
        `Test PDF generation: /api/certificate/pdf/CMB-2025-XYZ789GHI?vin=5YJ3E1EA4PF000001`,
        `Test PDF generation: /api/certificate/pdf/CMB-2025-DEF456JKL?vin=5YJYGDEE2BF000001`
      ]
    });

  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to create demo certificates',
      details: error instanceof Error ? error.message : 'Unknown error',
      setup_required: "The database tables may not exist. Check DATABASE_SETUP.md for setup instructions."
    }, { status: 500 });
  }
}

// GET handler to check existing certificates
export async function GET() {
  try {
    const supabase = await createServerSupabaseClient();
    
    const { data, error } = await supabase
      .from('certificates')
      .select('certificate_id, vehicle_name, vehicle_model, tesla_vin, battery_health_data, created_at')
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json({
        success: false,
        error: error.message,
        setup_required: "The certificates table may not exist. Check DATABASE_SETUP.md for setup instructions."
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: `Found ${data.length} certificates in database`,
      certificates: data.map(cert => ({
        certificate_id: cert.certificate_id,
        vehicle_name: cert.vehicle_name,
        vehicle_model: cert.vehicle_model,
        degradation_percentage: cert.battery_health_data.degradation_percentage,
        created_at: cert.created_at,
        pdf_url: `/api/certificate/pdf/${cert.certificate_id}?vin=${cert.tesla_vin}`
      }))
    });

  } catch (error) {
    console.error('Error checking certificates:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to check certificates',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}