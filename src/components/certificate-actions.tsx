"use client";

import { Button } from "@/components/ui/button";
import { Share2, Download, Check, Loader2 } from "lucide-react";
import { useState } from "react";

interface ShareButtonProps {
  certificateId: string;
}

export function ShareButton({ certificateId }: ShareButtonProps) {
  const [isSharing, setIsSharing] = useState(false);
  const [isShared, setIsShared] = useState(false);

  const handleShare = async () => {
    setIsSharing(true);
    
    try {
      if (navigator.share) {
        // Use native sharing if available
        await navigator.share({
          title: `Tesla Battery Certificate - ${certificateId}`,
          text: "Check out this Tesla battery health certificate",
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
      {isShared ? "Copied!" : "Share"}
    </Button>
  );
}

interface DownloadButtonProps {
  certificateId: string;
}

export function DownloadButton({ certificateId }: DownloadButtonProps) {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    setIsDownloading(true);
    
    try {
      // For now, open a print dialog or download the current page as PDF
      // In production, you'd call your PDF generation API
      const response = await fetch(`/api/certificate/pdf/${certificateId}`);
      const data = await response.json();
      
      if (data.success) {
        // Open print dialog for now (browser will offer "Save as PDF")
        window.print();
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error("Download error:", error);
      // Fallback to print dialog
      window.print();
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <Button 
      size="sm" 
      onClick={handleDownload}
      disabled={isDownloading}
    >
      {isDownloading ? (
        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
      ) : (
        <Download className="h-4 w-4 mr-2" />
      )}
      {isDownloading ? "Generating..." : "Download PDF"}
    </Button>
  );
}