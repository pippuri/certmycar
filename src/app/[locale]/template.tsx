"use client";

import { useParams } from "next/navigation";
import { useEffect } from "react";

export default function LocaleTemplate({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams();
  const locale = params?.locale as string;

  useEffect(() => {
    if (locale && typeof document !== "undefined") {
      document.documentElement.lang = locale;
    }
  }, [locale]);

  return <>{children}</>;
}