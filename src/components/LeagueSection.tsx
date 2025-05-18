
import { Match, League } from "@/types/football";
import { MatchCard } from "./MatchCard";
import { ChevronDown } from "lucide-react";

interface LeagueSectionProps {
  league: League;
  matches: Match[];
}

export const LeagueSection = ({ league, matches }: LeagueSectionProps) => {
  return (
    <div className="mb-2">
      <div className="bg-gray-900 flex items-center justify-between px-3 py-2 cursor-pointer hover:bg-gray-800 transition-colors">
        <div className="flex items-center gap-2">
          <img
            src={league.flag}
            alt={league.country}
            className="h-4 w-auto object-contain"
          />
          <span className="uppercase text-xs text-gray-400">{league.country}:</span>
          <div className="flex items-center gap-1">
            <img
              src={league.logo}
              alt={league.name}
              className="h-4 w-4 object-contain"
            />
            <span className="text-sm font-medium">{league.name}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="text-xs text-blue-400 hover:underline">
            Standings
          </button>
          <ChevronDown className="h-4 w-4 text-gray-400" />
        </div>
      </div>

      <div>
        {matches.map((match) => (
          <MatchCard key={match.fixture.id} match={match} />
        ))}
      </div>
    </div>
  );
};
