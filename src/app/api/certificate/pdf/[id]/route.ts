import { NextRequest, NextResponse } from "next/server";
import { generateCertificatePDF } from "@/lib/pdf-generator";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const url = new URL(request.url);
    const vin = url.searchParams.get("vin");

    console.log(`PDF generation request for certificate ${id}, VIN: ${vin}`);

    // VIN is required for security
    if (!vin) {
      return NextResponse.json(
        { error: "VIN parameter is required for certificate access" },
        { status: 400 }
      );
    }

    // Generate PDF using Playwright (includes VIN validation)
    const pdfBuffer = await generateCertificatePDF(id, vin);

    // Return PDF as response
    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="Tesla_Battery_Certificate_${id}.pdf"`,
        "Content-Length": pdfBuffer.length.toString(),
        "Cache-Control": "no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    });
  } catch (error) {
    console.error("PDF generation error:", error);

    // Return detailed error for development
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      {
        error: "Failed to generate PDF",
        details: errorMessage,
        certificateId: (await params).id,
      },
      { status: 500 }
    );
  }
}