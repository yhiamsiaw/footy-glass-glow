
import { useState } from "react";
import { Link } from "react-router-dom";
import { Match, League } from "@/types/football";
import { MatchCard } from "./MatchCard";
import { ChevronDown, ChevronUp } from "lucide-react";

interface LeagueSectionProps {
  league: League;
  matches: Match[];
  isPriority?: boolean;
}

export const LeagueSection = ({ league, matches, isPriority = false }: LeagueSectionProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className={`mb-4 ${isPriority ? "order-first" : ""}`}>
      <div 
        className="bg-gray-900 flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-gray-800 transition-colors rounded-t-sm"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <div className="flex items-center gap-3">
          <img
            src={league.flag}
            alt={league.country}
            className="h-5 w-auto object-contain"
          />
          <span className="uppercase text-xs text-gray-400">{league.country}:</span>
          <div className="flex items-center gap-2">
            <img
              src={league.logo}
              alt={league.name}
              className="h-5 w-5 object-contain"
            />
            <span className="text-sm font-medium">{league.name}</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link 
            to={`/league/${league.id}/standings`} 
            className="text-xs text-blue-400 hover:underline hover:text-blue-300 transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            Standings
          </Link>
          {isCollapsed ? (
            <ChevronUp className="h-4 w-4 text-gray-400" />
          ) : (
            <ChevronDown className="h-4 w-4 text-gray-400" />
          )}
        </div>
      </div>

      {!isCollapsed && (
        <div className="space-y-1 bg-gray-900/30">
          {matches.map((match) => (
            <MatchCard key={match.fixture.id} match={match} />
          ))}
        </div>
      )}
    </div>
  );
};
