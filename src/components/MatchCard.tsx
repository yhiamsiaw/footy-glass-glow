
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
        "flex items-center hover:bg-white/5 border-b border-gray-800 transition-colors py-2",
        isLive ? "border-l-2 border-l-red-500" : "",
        className
      )}
    >
      {/* Star/favorite icon could go here */}
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
      
      <div className="flex flex-1 items-center">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <img
              src={teams.home.logo}
              alt={teams.home.name}
              className="h-4 w-4 object-contain"
              loading="lazy"
            />
            <span className={cn(
              "text-sm", 
              teams.home.winner ? "font-bold text-white" : "text-gray-300"
            )}>
              {teams.home.name}
            </span>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <img
              src={teams.away.logo}
              alt={teams.away.name}
              className="h-4 w-4 object-contain"
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
        
        <div className="w-8 text-center font-bold">
          {statusType !== "UPCOMING" && (
            <>
              <div className="text-sm">{goals.home}</div>
              <div className="text-sm">{goals.away}</div>
            </>
          )}
        </div>
        
        <div className="w-12 flex justify-center">
          <div className="flex flex-col items-center gap-1">
            {/* Match actions - could be stats, details buttons */}
            <button className="text-gray-400 hover:text-white">
              <span className="sr-only">Match details</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect width="18" height="18" x="3" y="3" rx="2" />
                <path d="M7 7h.01M12 7h.01M17 7h.01M7 12h.01M12 12h.01M17 12h.01M7 17h.01M12 17h.01M17 17h.01" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
};
