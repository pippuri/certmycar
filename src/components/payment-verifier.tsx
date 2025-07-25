"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

interface PaymentVerifierProps {
  certificateId: string;
  onPaymentVerified: () => void;
}

export function PaymentVerifier({ certificateId, onPaymentVerified }: PaymentVerifierProps) {
  const searchParams = useSearchParams();
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const payment = searchParams.get("payment");
    const sessionId = searchParams.get("session_id");

    // Only verify if we have payment=success and a session_id
    if (payment === "success" && sessionId && !isVerifying) {
      setIsVerifying(true);
      verifyPayment(sessionId, certificateId);
    }
  }, [searchParams, certificateId, isVerifying]);

  const verifyPayment = async (sessionId: string, certificateId: string) => {
    try {
      const response = await fetch("/api/verify-payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sessionId,
          certificateId,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Clean up URL parameters first
        const url = new URL(window.location.href);
        url.searchParams.delete("payment");
        url.searchParams.delete("session_id");
        window.history.replaceState({}, "", url.toString());
        
        // Payment verified successfully, trigger refresh
        onPaymentVerified();
      } else {
        console.error("Payment verification failed:", data.error);
        setError(data.error || "Payment verification failed");
      }
    } catch (error) {
      console.error("Payment verification error:", error);
      setError("Failed to verify payment");
    } finally {
      setIsVerifying(false);
    }
  };

  // Show loading state only if we're actively verifying
  if (isVerifying) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-xl">
          <div className="flex items-center space-x-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <span>Verifying payment...</span>
          </div>
        </div>
      </div>
    );
  }

  // Show error if verification failed
  if (error) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-xl max-w-md">
          <h3 className="text-lg font-semibold text-red-600 mb-2">Payment Verification Failed</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return null;
}