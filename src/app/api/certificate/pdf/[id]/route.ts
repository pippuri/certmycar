import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase";
import { generateCertificatePDF } from "@/lib/pdf-generator";
import sgMail from "@sendgrid/mail";

// Configure SendGrid
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

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

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { email, action } = await request.json();

    if (action !== "email_pdf") {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    // All certificates including demo ones are now stored in the database
    const supabase = await createServerSupabaseClient();
    const { data: certificate } = await supabase
      .from("certificates")
      .select("*")
      .eq("certificate_id", id)
      .single();

    if (!certificate) {
      return NextResponse.json(
        { error: "Certificate not found" },
        { status: 404 }
      );
    }

    // Generate PDF
    const pdfBuffer = await generateCertificatePDF(id, certificate.tesla_vin);

    // Send email with PDF attachment
    if (!process.env.SENDGRID_API_KEY) {
      console.warn("SendGrid API key not configured, skipping email send");
      return NextResponse.json(
        {
          success: false,
          error: "Email service not configured",
        },
        { status: 500 }
      );
    }

    const msg = {
      to: email,
      from: process.env.SENDGRID_FROM_EMAIL || "certificates@batterycert.com",
      subject: `Your Tesla Battery Certificate - ${certificate.vehicle_name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">Your Tesla Battery Certificate</h2>
          
          <p>Thank you for using batterycert.com! Your Tesla battery health certificate is attached.</p>
          
          <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #334155;">Certificate Details</h3>
            <p><strong>Vehicle:</strong> ${certificate.vehicle_name}</p>
            <p><strong>Health Score:</strong> ${Math.round(
              100 - certificate.battery_health_data.degradation_percentage
            )}%</p>
            <p><strong>Certificate ID:</strong> ${
              certificate.certificate_id
            }</p>
            <p><strong>Generated:</strong> ${new Date(
              certificate.created_at
            ).toLocaleDateString()}</p>
          </div>
          
          <p>You can also verify this certificate online at:</p>
          <p><a href="${
            process.env.NEXT_PUBLIC_SITE_URL || "https://batterycert.com"
          }/${id}?vin=${
        certificate.tesla_vin
      }" style="color: #2563eb;">View Certificate Online</a></p>
          
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #e2e8f0;">
          
          <p style="color: #64748b; font-size: 14px;">
            This certificate is valid for 3 months and provides official Tesla battery health data.
            For questions, contact us at support@batterycert.com
          </p>
          
          <p style="color: #64748b; font-size: 12px; margin-top: 20px;">
            © ${new Date().getFullYear()} batterycert.com - Tesla Battery Health Certificates
          </p>
        </div>
      `,
      attachments: [
        {
          content: pdfBuffer.toString("base64"),
          filename: `Tesla_Battery_Certificate_${certificate.certificate_id}.pdf`,
          type: "application/pdf",
          disposition: "attachment",
        },
      ],
    };

    try {
      await sgMail.send(msg);
      console.log(`PDF certificate ${id} emailed successfully to ${email}`);

      // Store email record in database for follow-up
      const supabase = await createServerSupabaseClient();
      const { error: emailLogError } = await supabase
        .from("certificate_emails")
        .insert({
          certificate_id: id,
          email_address: email,
          sent_at: new Date().toISOString(),
          email_type: "pdf_delivery",
        });

      if (emailLogError) {
        console.error("Failed to log email record:", emailLogError);
      }
    } catch (emailError) {
      console.error("SendGrid email error:", emailError);
      return NextResponse.json(
        {
          success: false,
          error: "Failed to send email",
          details:
            emailError instanceof Error
              ? emailError.message
              : "Unknown email error",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Certificate PDF emailed successfully to ${email}`,
      certificate: {
        id: certificate.certificate_id,
        vehicleName: certificate.vehicle_name,
        healthScore: Math.round(
          100 - certificate.battery_health_data.degradation_percentage
        ),
      },
    });
  } catch (error) {
    console.error("Email PDF error:", error);
    return NextResponse.json({ error: "Failed to email PDF" }, { status: 500 });
  }
}
