interface CertificateIconProps {
  className?: string
}

export function CertificateIcon({ className = "w-6 h-6" }: CertificateIconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2">
      {/* Certificate/Award shape */}
      <path d="M12 2L15.09 8.26L22 9L17 14L18.18 21L12 17.77L5.82 21L7 14L2 9L8.91 8.26L12 2Z" />
      {/* Ribbon tails */}
      <path d="M12 17.77L8 20V24L12 21L16 24V20L12 17.77Z" strokeLinecap="round" strokeLinejoin="round" />
      {/* Inner checkmark */}
      <path d="M9 12L11 14L15 10" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
