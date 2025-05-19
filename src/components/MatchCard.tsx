
import { Link } from "react-router-dom";
import { useState } from "react";
import { Match } from "@/types/football";
import { MatchStatusBadge } from "@/components/MatchStatusBadge";
import { getMatchStatusType } from "@/utils/api";
import { cn } from "@/lib/utils";
import { LogoFallback } from "@/components/LogoFallback";
import { Star } from "lucide-react";
import { useLocalStorage } from "@/hooks/use-local-storage";

interface MatchCardProps {
  match: Match;
  className?: string;
  isMobile?: boolean;
}

export const MatchCard = ({ match, className, isMobile = false }: MatchCardProps) => {
  const { fixture, teams, goals, league } = match;
  const [homeLogoError, setHomeLogoError] = useState(false);
  const [awayLogoError, setAwayLogoError] = useState(false);
  const [leagueLogoError, setLeagueLogoError] = useState(false);
  
  const [favoriteMatches, setFavoriteMatches] = useLocalStorage<number[]>("favoriteMatches", []);
  const isFavorite = favoriteMatches.includes(fixture.id);
  
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

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isFavorite) {
      setFavoriteMatches(favoriteMatches.filter(id => id !== fixture.id));
    } else {
      setFavoriteMatches([...favoriteMatches, fixture.id]);
    }
  };

  if (isMobile) {
    return (
      <Link
        to={`/match/${fixture.id}`}
        className={cn(
          "flex items-center bg-[#121212] border-b border-gray-800 p-3 relative",
          isLive && "bg-gradient-to-r from-orange-900/20 to-[#121212]"
        )}
      >
        {/* Status indicator */}
        {isLive && (
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-orange-500 animate-pulse"></div>
        )}
        
        <div className="flex items-center flex-1">
          {/* Match time or status */}
          <div className="w-14 text-center mr-2">
            {statusType === "UPCOMING" ? (
              <div className="text-xs text-gray-400">{matchTime}</div>
            ) : (
              <MatchStatusBadge 
                status={statusType}
                elapsed={fixture.status.elapsed}
              />
            )}
          </div>
          
          {/* Teams */}
          <div className="flex-1 flex flex-col min-w-0">
            {/* Home team */}
            <div className="flex items-center mb-2">
              <div className="w-6 h-6 mr-2 flex-shrink-0">
                {homeLogoError ? (
                  <LogoFallback className="h-6 w-6" teamName={teams.home.name} />
                ) : (
                  <img
                    src={teams.home.logo}
                    alt=""
                    className="h-6 w-6 object-contain"
                    loading="lazy"
                    onError={() => setHomeLogoError(true)}
                  />
                )}
              </div>
              <div className="truncate">
                <span className={cn(
                  "text-sm", 
                  teams.home.winner ? "font-bold text-white" : "text-gray-300"
                )}>
                  {teams.home.name}
                </span>
              </div>
            </div>
            
            {/* Away team */}
            <div className="flex items-center">
              <div className="w-6 h-6 mr-2 flex-shrink-0">
                {awayLogoError ? (
                  <LogoFallback className="h-6 w-6" teamName={teams.away.name} />
                ) : (
                  <img
                    src={teams.away.logo}
                    alt=""
                    className="h-6 w-6 object-contain"
                    loading="lazy"
                    onError={() => setAwayLogoError(true)}
                  />
                )}
              </div>
              <div className="truncate">
                <span className={cn(
                  "text-sm", 
                  teams.away.winner ? "font-bold text-white" : "text-gray-300"
                )}>
                  {teams.away.name}
                </span>
              </div>
            </div>
          </div>
          
          {/* Score */}
          {statusType !== "UPCOMING" && (
            <div className="w-8 flex flex-col items-center">
              <div className={`text-base ${teams.home.winner ? "font-bold" : ""}`}>
                {goals.home}
              </div>
              <div className={`text-base ${teams.away.winner ? "font-bold" : ""}`}>
                {goals.away}
              </div>
            </div>
          )}
          
          {/* Favorite icon */}
          <div className="ml-2">
            <Star 
              onClick={toggleFavorite}
              className={`h-5 w-5 ${isFavorite ? "text-yellow-500 fill-yellow-500" : "text-gray-700"}`} 
            />
          </div>
        </div>
      </Link>
    );
  }

  // For desktop view
  return (
    <Link
      to={`/match/${fixture.id}`}
      className={cn(
        "flex items-center hover:bg-white/5 transition-colors py-3 px-2 border-b border-gray-800",
        isLive && "border-l-2 border-l-orange-500 bg-gradient-to-r from-orange-900/10 to-transparent",
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
        
        {/* Favorite star for desktop */}
        <div className="pl-3">
          <Star 
            onClick={toggleFavorite}
            className={`h-5 w-5 cursor-pointer ${isFavorite ? "text-yellow-500 fill-yellow-500" : "text-gray-700 hover:text-gray-400"}`} 
          />
        </div>
      </div>
    </Link>
  );
};
