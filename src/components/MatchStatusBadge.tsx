
import { cn } from "@/lib/utils";
import { FixtureStatus } from "@/utils/api";

interface BadgeProps {
  status: FixtureStatus;
  elapsed?: number;
  className?: string;
}

export const MatchStatusBadge = ({ status, elapsed, className }: BadgeProps) => {
  // Determine badge style based on status
  const badgeClass = cn(
    "text-xs font-medium px-1.5 rounded text-center min-w-[32px] inline-block",
    {
      "bg-red-600/20 text-red-500": status === "LIVE",
      "bg-gray-600/20 text-gray-500": status === "FT",
      "bg-blue-600/20 text-blue-500": status === "UPCOMING" || status === "HT",
    },
    className
  );

  // Display status text, show elapsed minutes for LIVE matches
  const displayText = status === "LIVE" && elapsed ? `${elapsed}'` : status;

  return (
    <span className={badgeClass}>
      {displayText}
    </span>
  );
};
