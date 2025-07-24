"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, X, Check, Loader2 } from "lucide-react";
import { useState } from "react";

interface EmailCaptureProps {
  context: "certificate_view" | "homepage" | "download";
  certificateId?: string;
}

export function EmailCapture({ context, certificateId }: EmailCaptureProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  if (isDismissed || !isVisible) return null;

  const getContextMessage = () => {
    switch (context) {
      case "certificate_view":
        return {
          title: "Get Certificate Updates",
          subtitle: "Optional: Receive important updates about this certificate or new Tesla battery insights.",
          cta: "Get Updates"
        };
      case "download":
        return {
          title: "Save Your Certificate",
          subtitle: "Get a copy of this certificate emailed to you for safekeeping.",
          cta: "Email Certificate"
        };
      default:
        return {
          title: "Stay Updated",
          subtitle: "Get Tesla battery health tips and important updates (optional).",
          cta: "Subscribe"
        };
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Use the same PDF generation endpoint to email the certificate
      const response = await fetch(`/api/certificate/pdf/${certificateId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          action: "email_pdf",
          context,
          source: "certificate_page"
        })
      });

      const data = await response.json();
      
      if (data.success) {
        setIsSuccess(true);
        setTimeout(() => {
          setIsVisible(false);
        }, 2000);
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error("Email PDF error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDismiss = () => {
    setIsDismissed(true);
  };

  const contextData = getContextMessage();

  if (isSuccess) {
    return (
      <Card className="border-green-200 bg-green-50 mb-6">
        <CardContent className="p-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <Check className="h-5 w-5 text-green-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-green-800">
                Thanks! You&apos;ll receive updates at {email}
              </p>
              <p className="text-xs text-green-600 mt-1">
                You can unsubscribe anytime
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-blue-200 bg-blue-50 mb-6">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3 flex-1">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mt-1">
              <Mail className="h-5 w-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-medium text-blue-800 mb-1">
                {contextData.title}
              </h3>
              <p className="text-xs text-blue-600 mb-3">
                {contextData.subtitle}
              </p>
              
              <form onSubmit={handleSubmit} className="flex gap-2">
                <div className="flex-1">
                  <Label htmlFor="email" className="sr-only">
                    Email address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-8 text-sm bg-white border-blue-200"
                    required
                  />
                </div>
                <Button 
                  type="submit" 
                  size="sm" 
                  className="h-8 px-3 text-xs"
                  disabled={isSubmitting || !email}
                >
                  {isSubmitting ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  ) : (
                    contextData.cta
                  )}
                </Button>
              </form>
            </div>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDismiss}
            className="h-6 w-6 p-0 text-blue-400 hover:text-blue-600"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}