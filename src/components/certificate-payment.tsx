'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { AlertTriangle, CreditCard, Loader2 } from 'lucide-react';
import { getPricingForLocale } from '@/lib/stripe';

interface CertificatePaymentProps {
  certificateId: string;
  locale: string;
  vehicleName?: string;
}

export function CertificatePayment({ certificateId, locale, vehicleName }: CertificatePaymentProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const pricing = getPricingForLocale(locale);
  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(price / 100);
  };

  const handlePayment = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          certificateId,
          locale,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Payment failed');
      }

      const { url } = await response.json();
      
      if (url) {
        window.location.href = url;
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (err) {
      console.error('Payment error:', err);
      setError(err instanceof Error ? err.message : 'Payment failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="mb-8 border-yellow-200 bg-yellow-50">
      <CardContent className="p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
            <AlertTriangle className="h-5 w-5 text-yellow-600" />
          </div>
          <h3 className="font-semibold text-yellow-800">
            Payment Required
          </h3>
        </div>
        
        <div className="mb-4">
          <p className="text-yellow-700 text-sm mb-2">
            This certificate requires payment to unlock the full verified report.
          </p>
          <p className="text-yellow-700 text-sm mb-4">
            Get your official Tesla battery health certificate {vehicleName ? `for ${vehicleName}` : ''} 
            with verification QR code and fraud protection.
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-yellow-600 mb-1">Certificate Price</p>
            <p className="text-2xl font-bold text-yellow-800">
              {formatPrice(pricing.price, pricing.currency)}
            </p>
          </div>
          
          <Button 
            onClick={handlePayment}
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <CreditCard className="h-4 w-4 mr-2" />
                Complete Payment
              </>
            )}
          </Button>
        </div>

        <div className="mt-4 pt-4 border-t border-yellow-200">
          <p className="text-xs text-yellow-600">
            Secure payment powered by Stripe • Instant access after payment • Email receipt included
          </p>
        </div>
      </CardContent>
    </Card>
  );
}