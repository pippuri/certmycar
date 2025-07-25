import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    const { certificateId } = await request.json();

    // Fetch certificate to get VIN
    const supabase = await createServerSupabaseClient();
    const { data: certificate, error } = await supabase
      .from("certificates")
      .select("tesla_vin")
      .eq("certificate_id", certificateId)
      .single();

    if (error || !certificate) {
      return NextResponse.json(
        { success: false, error: "Certificate not found" },
        { status: 404 }
      );
    }

    // Include VIN in share URL for security
    const shareUrl = `${
      process.env.NEXT_PUBLIC_SITE_URL || "https://batterycert.com"
    }/certificate/${certificateId}?vin=${certificate.tesla_vin}`;

    // In the future, you could:
    // - Track sharing analytics
    // - Generate short URLs
    // - Send notifications

    return NextResponse.json({
      success: true,
      shareUrl,
      message: "Share URL generated successfully",
    });
  } catch (error) {
    console.error("Share error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to generate share URL" },
      { status: 500 }
    );
  }
}
