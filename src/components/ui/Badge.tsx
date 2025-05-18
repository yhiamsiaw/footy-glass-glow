
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

  let text = status;
  if (status === "LIVE" && elapsed) {
    text = `${elapsed}'`;
  }

  return (
    <span className={badgeClass}>
      {text}
    </span>
  );
};
