"use client";

import { useEffect } from "react";
import { analytics } from "@/lib/analytics";

interface CertificatePageClientProps {
  children: React.ReactNode;
  certificateId: string;
  isPaid: boolean;
  fromQR?: boolean;
}

export default function CertificatePageClient({ 
  children,
  certificateId,
  isPaid,
  fromQR = false
}: CertificatePageClientProps) {
  useEffect(() => {
    // Track certificate view
    analytics.trackCertificateView(certificateId, isPaid);
    
    // Track QR verification if accessed via QR code
    if (fromQR) {
      analytics.trackQRVerificationScan(certificateId, 'qr_code');
    }
    
    // Detect if user came from a QR scanner (common QR scanner referrers)
    const referrer = document.referrer.toLowerCase();
    const qrReferrers = ['qr', 'scanner', 'camera', 'scan'];
    const isFromQRScanner = qrReferrers.some(qr => referrer.includes(qr));
    
    if (isFromQRScanner) {
      analytics.trackQRVerificationScan(certificateId, 'qr_code');
    }
  }, [certificateId, isPaid, fromQR]);

  return <>{children}</>;
}