"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Share2, Download, Check, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";

interface ShareButtonProps {
  certificateId: string;
}

export function ShareButton({ certificateId }: ShareButtonProps) {
  const [isSharing, setIsSharing] = useState(false);
  const [isShared, setIsShared] = useState(false);
  const t = useTranslations("certificate_actions");

  const handleShare = async () => {
    setIsSharing(true);

    try {
      if (navigator.share) {
        // Use native sharing if available
        await navigator.share({
          title: t("share_title", { certificateId }),
          text: t("share_text"),
          url: window.location.href,
        });
        setIsShared(true);
      } else {
        // Fallback to clipboard
        await navigator.clipboard.writeText(window.location.href);
        setIsShared(true);
        setTimeout(() => setIsShared(false), 2000);
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
      {isShared ? t("copied") : t("share")}
    </Button>
  );
}

interface DownloadButtonProps {
  certificateId: string;
  vin: string;
}

export function DownloadButton({ certificateId, vin }: DownloadButtonProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  const t = useTranslations("certificate_actions");

  const handleDownload = async () => {
    setIsDownloading(true);

    try {
      // Call PDF generation API with VIN for security
      const response = await fetch(
        `/api/certificate/pdf/${certificateId}?vin=${encodeURIComponent(vin)}`
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
    } catch (error) {
      console.error("Download error:", error);
      alert(
        t("download_error", {
          error: error instanceof Error ? error.message : "Unknown error",
        })
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
      {isDownloading ? t("generating") : t("download_pdf")}
    </Button>
  );
}
