"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Share2, Download, Check, Loader2 } from "lucide-react";
import { analytics } from "@/lib/analytics";

interface CertificateActionsTranslations {
  share: string;
  copied: string;
  download_pdf: string;
  generating: string;
  share_title: string;
  share_text: string;
  download_error: string;
}

interface ShareButtonProps {
  certificateId: string;
  translations?: CertificateActionsTranslations;
}

export function ShareButton({ certificateId, translations }: ShareButtonProps) {
  const [isSharing, setIsSharing] = useState(false);
  const [isShared, setIsShared] = useState(false);

  // Default translations for fallback
  const defaultTranslations: CertificateActionsTranslations = {
    share: "Share",
    copied: "Copied!",
    download_pdf: "Download PDF",
    generating: "Generating...",
    share_title: "Tesla Battery Certificate - {certificateId}",
    share_text: "Check out this Tesla battery health certificate",
    download_error: "Failed to download PDF: {error}",
  };

  const t = translations || defaultTranslations;

  const handleShare = async () => {
    setIsSharing(true);

    try {
      let shareMethod = 'clipboard';
      
      if (navigator.share) {
        // Use native sharing if available
        await navigator.share({
          title: t.share_title.replace("{certificateId}", certificateId),
          text: t.share_text,
          url: window.location.href,
        });
        setIsShared(true);
        shareMethod = 'native_share';
      } else {
        // Fallback to clipboard
        await navigator.clipboard.writeText(window.location.href);
        setIsShared(true);
        setTimeout(() => setIsShared(false), 2000);
        shareMethod = 'clipboard';
      }
      
      // Track certificate share - don't break sharing if analytics fails
      try {
        analytics.trackCertificateShare(certificateId, shareMethod);
      } catch (analyticsError) {
        console.warn('Certificate share tracking failed:', analyticsError);
      }
    } catch (error) {
      console.error("Share error:", error);
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleShare}
      disabled={isSharing}
    >
      {isSharing ? (
        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
      ) : isShared ? (
        <Check className="h-4 w-4 mr-2" />
      ) : (
        <Share2 className="h-4 w-4 mr-2" />
      )}
      {isShared ? t.copied : t.share}
    </Button>
  );
}

interface DownloadButtonProps {
  certificateId: string;
  vin: string;
  locale?: string;
  translations?: CertificateActionsTranslations;
}

export function DownloadButton({
  certificateId,
  vin,
  locale = "en-US",
  translations,
}: DownloadButtonProps) {
  const [isDownloading, setIsDownloading] = useState(false);

  // Default translations for fallback
  const defaultTranslations: CertificateActionsTranslations = {
    share: "Share",
    copied: "Copied!",
    download_pdf: "Download PDF",
    generating: "Generating...",
    share_title: "Tesla Battery Certificate - {certificateId}",
    share_text: "Check out this Tesla battery health certificate",
    download_error: "Failed to download PDF: {error}",
  };

  const t = translations || defaultTranslations;

  const handleDownload = async () => {
    setIsDownloading(true);

    try {
      // Call PDF generation API with VIN for security and locale for language
      const response = await fetch(
        `/api/certificate/pdf/${certificateId}?vin=${encodeURIComponent(vin)}&locale=${encodeURIComponent(locale)}`
      );

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ error: "Unknown error" }));
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      // Get PDF blob from response
      const pdfBlob = await response.blob();

      // Create download link
      const url = window.URL.createObjectURL(pdfBlob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Tesla_Battery_Certificate_${certificateId}.pdf`;
      document.body.appendChild(a);
      a.click();

      // Cleanup
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      // Track certificate download - don't break download if analytics fails
      try {
        analytics.trackCertificateDownload(certificateId, 'Unknown'); // Vehicle model would need to be passed as prop
      } catch (analyticsError) {
        console.warn('Certificate download tracking failed:', analyticsError);
      }
    } catch (error) {
      console.error("Download error:", error);
      alert(
        t.download_error.replace(
          "{error}",
          error instanceof Error ? error.message : "Unknown error"
        )
      );
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <Button size="sm" onClick={handleDownload} disabled={isDownloading}>
      {isDownloading ? (
        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
      ) : (
        <Download className="h-4 w-4 mr-2" />
      )}
      {isDownloading ? t.generating : t.download_pdf}
    </Button>
  );
}
