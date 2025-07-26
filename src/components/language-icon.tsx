"use client";

import { Languages } from "lucide-react";

export function LanguageIcon() {
  const scrollToLanguageSection = () => {
    const footer = document.querySelector('footer');
    if (footer) {
      footer.scrollIntoView({ 
        behavior: 'smooth',
        block: 'end'
      });
    }
  };

  return (
    <button
      onClick={scrollToLanguageSection}
      className="flex items-center space-x-1 text-gray-600 hover:text-gray-900 transition-colors p-2 rounded-md hover:bg-gray-100"
      title="Change Language"
      aria-label="Scroll to language selection"
    >
      <Languages className="h-4 w-4" />
      <span className="text-sm hidden sm:inline">Language</span>
    </button>
  );
}