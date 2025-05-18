
import { Match, League } from "@/types/football";
import { MatchCard } from "./MatchCard";

interface LeagueSectionProps {
  league: League;
  matches: Match[];
}

export const LeagueSection = ({ league, matches }: LeagueSectionProps) => {
  return (
    <div className="mb-8 animate-fade-in">
      <div className="glass p-4 mb-3 rounded-lg flex items-center gap-3 bg-gradient-to-r from-football-blue/20 to-football-orange/10">
        <img
          src={league.logo}
          alt={league.name}
          className="h-8 w-8 object-contain"
        />
        <div className="flex-1">
          <h2 className="font-bold text-lg">{league.name}</h2>
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            {league.country}
            {league.flag && (
              <img
                src={league.flag}
                alt={league.country}
                className="h-3 w-auto inline-block ml-1"
              />
            )}
          </p>
        </div>
        <div className="text-xs px-2 py-1 bg-white/10 rounded">
          {matches.length} {matches.length === 1 ? "match" : "matches"}
        </div>
      </div>

      <div className="space-y-2">
        {matches.map((match) => (
          <MatchCard key={match.fixture.id} match={match} />
        ))}
      </div>
    </div>
  );
};
