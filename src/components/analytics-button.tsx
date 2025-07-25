"use client";

import { analytics } from '@/lib/analytics';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

interface AnalyticsButtonProps {
  href: string;
  children: React.ReactNode;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
  eventName: string;
  eventData?: Record<string, any>;
}

export function AnalyticsButton({ 
  href, 
  children, 
  variant = "default", 
  size = "default", 
  className = "",
  eventName,
  eventData = {}
}: AnalyticsButtonProps) {
  const handleClick = () => {
    // Track the conversion event - never break navigation if analytics fails
    try {
      switch (eventName) {
        case 'hero_cta_click':
          analytics.trackHeroCTAClick();
          break;
        case 'sample_certificate_view':
          analytics.trackSampleCertificateView();
          break;
        case 'cta_section_click':
          analytics.trackCustomConversion('cta_section_click', {
            event_label: 'bottom_cta_clicked',
            funnel_step: 'landing_to_check',
            ...eventData
          });
          break;
        default:
          analytics.trackCustomConversion(eventName, eventData);
      }
    } catch (error) {
      // Analytics failed, but navigation should continue normally
      console.warn('Analytics tracking failed:', error);
    }
  };

  return (
    <Button 
      size={size} 
      variant={variant}
      className={className} 
      asChild
    >
      <Link href={href} onClick={handleClick}>
        {children}
      </Link>
    </Button>
  );
}

export function HeroCTAButton({ 
  href, 
  children, 
  className = "text-lg px-8 py-6" 
}: { 
  href: string; 
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <AnalyticsButton
      href={href}
      size="lg"
      className={className}
      eventName="hero_cta_click"
    >
      {children}
      <ArrowRight className="ml-2 h-5 w-5" />
    </AnalyticsButton>
  );
}

export function SampleCertificateButton({ 
  href, 
  children,
  variant = "outline",
  className = "text-lg px-8 py-6"
}: { 
  href: string; 
  children: React.ReactNode;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  className?: string;
}) {
  return (
    <AnalyticsButton
      href={href}
      variant={variant}
      size="lg"
      className={className}
      eventName="sample_certificate_view"
    >
      {children}
    </AnalyticsButton>
  );
}

export default AnalyticsButton;