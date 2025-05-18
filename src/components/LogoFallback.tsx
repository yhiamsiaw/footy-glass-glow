
import React from 'react';
import { Shield } from 'lucide-react';

interface LogoFallbackProps {
  className?: string;
  teamName?: string;
}

export const LogoFallback = ({ className, teamName }: LogoFallbackProps) => {
  return (
    <div className={`bg-gray-800 flex items-center justify-center rounded-full ${className}`}>
      <Shield className="text-gray-500 w-4 h-4" />
      {teamName && <span className="sr-only">{teamName}</span>}
    </div>
  );
};
