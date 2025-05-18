
import { ImageOff } from "lucide-react";

interface LogoFallbackProps {
  className?: string;
}

export const LogoFallback = ({ className }: LogoFallbackProps) => {
  return (
    <div className={`flex items-center justify-center bg-gray-800 rounded-full ${className}`}>
      <ImageOff className="w-3 h-3 text-gray-500" />
    </div>
  );
};
