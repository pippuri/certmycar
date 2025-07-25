"use client";

interface CertificatePageClientProps {
  children: React.ReactNode;
}

export default function CertificatePageClient({ 
  children 
}: CertificatePageClientProps) {
  // Server-side verification handles payment processing
  // This wrapper is kept for potential future client-side features
  return <>{children}</>;
}