import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // Look up certificate data
    const supabase = await createServerSupabaseClient();
    let certificate;

    if (id === "CMB-DEMO-2024-SAMPLE") {
      // Demo certificate data
      certificate = {
        certificate_id: "CMB-DEMO-2024-SAMPLE",
        tesla_vin: "5YJ3E1EA4NF123456",
        vehicle_name: "Razor Crest",
        vehicle_model: "modely",
        vehicle_trim: "Long Range",
        vehicle_year: 2022,
        odometer_miles: 39411.451506,
        software_version: "2025.20.7",
        battery_health_data: {
          health_percentage: 92,
          degradation_percentage: 7.3,
          original_capacity_kwh: 79.5,
          current_capacity_kwh: 73.7,
          confidence_level: "high",
          methodology: "SoC vs Ideal Battery Range Analysis",
        },
        is_paid: true,
        created_at: "2024-01-21T14:54:00.000Z",
      };
    } else {
      const { data: dbCertificate } = await supabase
        .from("certificates")
        .select("*")
        .eq("certificate_id", id)
        .single();
      
      certificate = dbCertificate;
    }

    if (!certificate) {
      return NextResponse.json(
        { error: "Certificate not found" },
        { status: 404 }
      );
    }

    // For now, return a simple PDF URL
    // In production, you'd generate an actual PDF here using libraries like:
    // - puppeteer (headless Chrome)
    // - react-pdf
    // - jsPDF
    // - Playwright for PDF generation
    
    const pdfUrl = `${process.env.NEXT_PUBLIC_SITE_URL || "https://batterycert.com"}/certificate/${id}?vin=${certificate.tesla_vin}&print=true`;
    
    return NextResponse.json({
      success: true,
      pdfUrl,
      certificate: {
        id: certificate.certificate_id,
        vehicleName: certificate.vehicle_name,
        healthScore: Math.round(100 - certificate.battery_health_data.degradation_percentage)
      }
    });
  } catch (error) {
    console.error("PDF generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate PDF" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { email, action } = await request.json();
    
    if (action !== "email_pdf") {
      return NextResponse.json(
        { error: "Invalid action" },
        { status: 400 }
      );
    }

    let certificate;
    if (id === "CMB-DEMO-2024-SAMPLE") {
      certificate = {
        certificate_id: "CMB-DEMO-2024-SAMPLE",
        vehicle_name: "Razor Crest",
        battery_health_data: { degradation_percentage: 7.3 }
      };
    } else {
      const supabase = await createServerSupabaseClient();
      const { data: dbCertificate } = await supabase
        .from("certificates")
        .select("*")
        .eq("certificate_id", id)
        .single();
      certificate = dbCertificate;
    }

    if (!certificate) {
      return NextResponse.json(
        { error: "Certificate not found" },
        { status: 404 }
      );
    }

    // In production, you would:
    // 1. Generate actual PDF using Puppeteer/Playwright with CertificateDisplay component
    // 2. Send email with PDF attachment using service like SendGrid/Resend
    // 3. Store email in database for follow-up communications
    
    console.log(`Would email PDF certificate ${id} to ${email}`);
    
    return NextResponse.json({
      success: true,
      message: `Certificate will be emailed to ${email}`,
      certificate: {
        id: certificate.certificate_id,
        vehicleName: certificate.vehicle_name,
        healthScore: Math.round(100 - certificate.battery_health_data.degradation_percentage)
      }
    });
  } catch (error) {
    console.error("Email PDF error:", error);
    return NextResponse.json(
      { error: "Failed to email PDF" },
      { status: 500 }
    );
  }
}
