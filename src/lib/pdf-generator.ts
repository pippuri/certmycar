import { chromium, Browser, Page } from "playwright";
import { createServerSupabaseClient } from "@/lib/supabase";

interface CertificateData {
  certificate_id: string;
  tesla_vin: string;
  vehicle_name: string;
  vehicle_model: string;
  vehicle_trim: string;
  vehicle_year: number;
  odometer_miles: number | null;
  software_version: string | null;
  battery_health_data: {
    health_percentage: number;
    degradation_percentage: number;
    original_capacity_kwh: number;
    current_capacity_kwh: number;
    confidence_level: string;
    methodology: string;
    battery_chemistry?: string;
    battery_supplier?: string;
  };
  battery_data: {
    battery_level: number;
    usable_battery_level: number;
    charge_limit_soc: number;
    ideal_battery_range: number;
    est_battery_range: number;
    battery_range: number;
  };
  is_paid: boolean;
  created_at: string;
}

class PDFGenerator {
  private browser: Browser | null = null;

  async initialize() {
    if (!this.browser) {
      console.log("Initializing Playwright browser for PDF generation...");
      this.browser = await chromium.launch({
        headless: true,
        args: [
          "--no-sandbox",
          "--disable-setuid-sandbox",
          "--disable-dev-shm-usage",
          "--disable-web-security",
          "--disable-features=VizDisplayCompositor",
        ],
      });
    }
  }

  async generateCertificatePDF(
    certificateId: string,
    vin?: string
  ): Promise<Buffer> {
    await this.initialize();

    if (!this.browser) {
      throw new Error("Failed to initialize browser");
    }

    let page: Page | null = null;

    try {
      console.log(`Generating PDF for certificate ${certificateId}...`);

      // Get certificate data
      const certificate = await this.getCertificateData(certificateId);
      if (!certificate) {
        throw new Error(`Certificate ${certificateId} not found`);
      }

      // Verify VIN if provided
      if (vin && certificate.tesla_vin !== vin) {
        throw new Error("VIN mismatch for certificate access");
      }

      // Create new page
      page = await this.browser.newPage();

      // Set viewport for consistent PDF generation
      await page.setViewportSize({ width: 1200, height: 1600 });

      // Navigate to certificate page with print mode
      const baseUrl =
        process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
      const certificateUrl = `${baseUrl}/en-US/certificate/${certificateId}?vin=${certificate.tesla_vin}&pdf=true`;

      console.log(`Loading certificate page: ${certificateUrl}`);

      // Wait for the page to load completely
      await page.goto(certificateUrl, {
        waitUntil: "networkidle",
        timeout: 30000,
      });

      // Wait for certificate content to be fully rendered
      await page.waitForSelector("[data-certificate-content]", {
        timeout: 10000,
      });

      // Wait a bit more for any dynamic content/charts to render
      await page.waitForTimeout(2000);

      // Generate PDF with A3 format and more aggressive zoom to fit content
      const pdfBuffer = await page.pdf({
        format: "A3",
        margin: {
          top: "0.25in",
          right: "0.25in",
          bottom: "0.25in",
          left: "0.25in",
        },
        printBackground: true,
        preferCSSPageSize: false,
        displayHeaderFooter: false,
        scale: 0.75, // 75% zoom to compress content more aggressively
      });

      console.log(
        `PDF generated successfully for certificate ${certificateId}, size: ${pdfBuffer.length} bytes`
      );
      return pdfBuffer;
    } catch (error) {
      console.error(
        `PDF generation failed for certificate ${certificateId}:`,
        error
      );
      throw error;
    } finally {
      if (page) {
        await page.close();
      }
    }
  }

  private async getCertificateData(
    certificateId: string
  ): Promise<CertificateData | null> {
    // Get from database - all certificates including demo ones are stored in DB
    const supabase = await createServerSupabaseClient();
    const { data: certificate } = await supabase
      .from("certificates")
      .select("*")
      .eq("certificate_id", certificateId)
      .single();

    return certificate;
  }

  async close() {
    if (this.browser) {
      console.log("Closing Playwright browser...");
      await this.browser.close();
      this.browser = null;
    }
  }
}

// Singleton instance for reuse
let pdfGenerator: PDFGenerator | null = null;

export async function generateCertificatePDF(
  certificateId: string,
  vin?: string
): Promise<Buffer> {
  if (!pdfGenerator) {
    pdfGenerator = new PDFGenerator();
  }

  return await pdfGenerator.generateCertificatePDF(certificateId, vin);
}

export async function closePDFGenerator() {
  if (pdfGenerator) {
    await pdfGenerator.close();
    pdfGenerator = null;
  }
}

// Auto-cleanup on process exit
process.on("exit", () => {
  if (pdfGenerator) {
    pdfGenerator.close();
  }
});

process.on("SIGINT", async () => {
  if (pdfGenerator) {
    await pdfGenerator.close();
  }
  process.exit(0);
});

process.on("SIGTERM", async () => {
  if (pdfGenerator) {
    await pdfGenerator.close();
  }
  process.exit(0);
});
