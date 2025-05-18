
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
        "glass-card p-3 flex items-center gap-2 hover:scale-[1.01] transition-all",
        isLive ? "border-l-2 border-l-football-status-live" : "",
        className
      )}
    >
      <div className="flex flex-1 items-center gap-3">
        <div className="flex flex-col items-center justify-center w-10">
          <img
            src={teams.home.logo}
            alt={teams.home.name}
            className="h-8 w-8 object-contain"
            loading="lazy"
          />
        </div>
        <div className="flex-1 text-left truncate">
          <span className={cn(
            "font-medium", 
            teams.home.winner ? "text-football-blue" : ""
          )}>
            {teams.home.name}
          </span>
        </div>
      </div>
      
      <div className="min-w-[80px] flex flex-col items-center justify-center gap-1">
        {statusType === "UPCOMING" ? (
          <div className="text-sm font-medium">{matchTime}</div>
        ) : (
          <div className="flex items-center justify-center gap-2 font-bold">
            <span>{goals.home ?? 0}</span>
            <span>-</span>
            <span>{goals.away ?? 0}</span>
          </div>
        )}
        
        <MatchStatusBadge 
          status={statusType}
          elapsed={fixture.status.elapsed}
        />
      </div>
      
      <div className="flex flex-1 items-center gap-3 justify-end">
        <div className="flex-1 text-right truncate">
          <span className={cn(
            "font-medium", 
            teams.away.winner ? "text-football-blue" : ""
          )}>
            {teams.away.name}
          </span>
        </div>
        <div className="flex flex-col items-center justify-center w-10">
          <img
            src={teams.away.logo}
            alt={teams.away.name}
            className="h-8 w-8 object-contain"
            loading="lazy"
          />
        </div>
      </div>
    </Link>
  );
};
