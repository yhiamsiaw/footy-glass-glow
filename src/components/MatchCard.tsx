
import { Link } from "react-router-dom";
import { Match } from "@/types/football";
import { MatchStatusBadge } from "@/components/MatchStatusBadge";
import { getMatchStatusType } from "@/utils/api";
import { cn } from "@/lib/utils";

interface MatchCardProps {
  match: Match;
  className?: string;
}

export const MatchCard = ({ match, className }: MatchCardProps) => {
  const { fixture, teams, goals, league } = match;
  
  // Get match status
  const statusType = getMatchStatusType(
    fixture.status.short,
    fixture.status.elapsed
  );
  
  // Format match time
  const matchTime = new Date(fixture.date).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
  
  // Determine if this is a live match for styling
  const isLive = statusType === "LIVE";

  return (
    <Link
      to={`/match/${fixture.id}`}
      className={cn(
        "flex items-center hover:bg-white/5 transition-colors py-3 px-2 border-b border-gray-800",
        isLive ? "border-l-2 border-l-red-500" : "",
        className
      )}
    >
      <div className="w-12 text-center text-xs text-gray-400">
        {statusType === "UPCOMING" ? (
          matchTime
        ) : (
          <MatchStatusBadge 
            status={statusType}
            elapsed={fixture.status.elapsed}
          />
        )}
      </div>
      
      <div className="flex flex-1 items-center px-3">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2.5">
            <img
              src={teams.home.logo}
              alt={teams.home.name}
              className="h-5 w-5 object-contain"
              loading="lazy"
            />
            <span className={cn(
              "text-sm", 
              teams.home.winner ? "font-bold text-white" : "text-gray-300"
            )}>
              {teams.home.name}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <img
              src={teams.away.logo}
              alt={teams.away.name}
              className="h-5 w-5 object-contain"
              loading="lazy"
            />
            <span className={cn(
              "text-sm", 
              teams.away.winner ? "font-bold text-white" : "text-gray-300"
            )}>
              {teams.away.name}
            </span>
          </div>
        </div>
        
        <div className="w-8 text-center font-medium">
          {statusType !== "UPCOMING" && (
            <>
              <div className="text-sm mb-2.5">{goals.home}</div>
              <div className="text-sm">{goals.away}</div>
            </>
          )}
        </div>
      </div>
    </Link>
  );
};
