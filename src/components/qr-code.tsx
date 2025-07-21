interface QRCodeProps {
  url: string
  size?: number
  className?: string
}

export function QRCode({ url, size = 80, className = "" }: QRCodeProps) {
  // Generate QR code URL using a QR code service
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(url)}&format=png&margin=10`

  return (
    <div className={`bg-white p-2 rounded-lg shadow-sm border ${className}`}>
      <img
        src={qrCodeUrl || "/placeholder.svg"}
        alt={`QR Code for ${url}`}
        width={size}
        height={size}
        className="w-full h-full"
      />
    </div>
  )
}
