
import { cn } from "@/lib/utils";
import { FixtureStatus } from "@/utils/api";

interface BadgeProps {
  status: FixtureStatus;
  elapsed?: number;
  className?: string;
}

export const MatchStatusBadge = ({ status, elapsed, className }: BadgeProps) => {
  const badgeClass = cn({
    "badge-live": status === "LIVE",
    "badge-finished": status === "FT",
    "badge-upcoming": status === "UPCOMING" || status === "HT",
  }, className);

  // Display status text, show elapsed minutes for LIVE matches
  const displayText = status === "LIVE" && elapsed ? `${elapsed}'` : status;

  return (
    <span className={badgeClass}>
      {displayText}
    </span>
  );
};
