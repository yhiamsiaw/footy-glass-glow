
import { Link } from "react-router-dom";
import { useState } from "react";
import { Match } from "@/types/football";
import { MatchStatusBadge } from "@/components/MatchStatusBadge";
import { getMatchStatusType } from "@/utils/api";
import { cn } from "@/lib/utils";
import { LogoFallback } from "@/components/LogoFallback";
import { Star } from "lucide-react";

interface MatchCardProps {
  match: Match;
  className?: string;
  isMobile?: boolean;
}

export const MatchCard = ({ match, className, isMobile = false }: MatchCardProps) => {
  const { fixture, teams, goals, league } = match;
  const [homeLogoError, setHomeLogoError] = useState(false);
  const [awayLogoError, setAwayLogoError] = useState(false);
  
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

  if (isMobile) {
    return (
      <Link
        to={`/match/${fixture.id}`}
        className="match-item flex items-center justify-between"
      >
        <div className="flex items-center">
          <div className="mr-3 w-12 text-center text-xs">
            {statusType === "UPCOMING" ? (
              matchTime
            ) : (
              <MatchStatusBadge 
                status={statusType}
                elapsed={fixture.status.elapsed}
              />
            )}
          </div>
          
          <div className="flex flex-col">
            <div className="flex items-center mb-2">
              {homeLogoError ? (
                <LogoFallback className="h-5 w-5 mr-2" teamName={teams.home.name} />
              ) : (
                <img
                  src={teams.home.logo}
                  alt=""
                  className="h-5 w-5 mr-2 object-contain"
                  loading="lazy"
                  onError={() => setHomeLogoError(true)}
                />
              )}
              <span className={teams.home.winner ? "font-bold" : ""}>
                {teams.home.name}
              </span>
            </div>
            
            <div className="flex items-center">
              {awayLogoError ? (
                <LogoFallback className="h-5 w-5 mr-2" teamName={teams.away.name} />
              ) : (
                <img
                  src={teams.away.logo}
                  alt=""
                  className="h-5 w-5 mr-2 object-contain"
                  loading="lazy"
                  onError={() => setAwayLogoError(true)}
                />
              )}
              <span className={teams.away.winner ? "font-bold" : ""}>
                {teams.away.name}
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center">
          {statusType !== "UPCOMING" && (
            <div className="text-center mr-4">
              <div className="text-lg font-bold">{goals.home}</div>
              <div className="text-lg font-bold">{goals.away}</div>
            </div>
          )}
          <Star className="h-5 w-5 text-gray-600" />
        </div>
      </Link>
    );
  }

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
            {homeLogoError ? (
              <LogoFallback className="h-5 w-5" teamName={teams.home.name} />
            ) : (
              <img
                src={teams.home.logo}
                alt=""
                className="h-5 w-5 object-contain"
                loading="lazy"
                onError={() => setHomeLogoError(true)}
              />
            )}
            <span className={cn(
              "text-sm", 
              teams.home.winner ? "font-bold text-white" : "text-gray-300"
            )}>
              {teams.home.name}
            </span>
          </div>
          <div className="flex items-center gap-3">
            {awayLogoError ? (
              <LogoFallback className="h-5 w-5" teamName={teams.away.name} />
            ) : (
              <img
                src={teams.away.logo}
                alt=""
                className="h-5 w-5 object-contain"
                loading="lazy"
                onError={() => setAwayLogoError(true)}
              />
            )}
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
