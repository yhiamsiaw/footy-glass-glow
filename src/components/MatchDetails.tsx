
import { useEffect, useState } from "react";
import { MatchDetails as MatchDetailsType } from "@/types/football";
import { MatchStatusBadge } from "@/components/ui/Badge";
import { getMatchStatusType } from "@/utils/api";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, Home, Info } from "lucide-react";

interface MatchDetailsProps {
  match: MatchDetailsType;
}

export const MatchDetails = ({ match }: MatchDetailsProps) => {
  const { fixture, teams, goals, score, events, lineups, statistics } = match;
  
  // Get match status
  const statusType = getMatchStatusType(
    fixture.status.short,
    fixture.status.elapsed
  );

  // Format date
  const matchDate = new Date(fixture.date).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Format time
  const matchTime = new Date(fixture.date).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  const renderEvents = () => {
    if (!events || events.length === 0) {
      return <p className="text-center py-8 text-muted-foreground">No events available for this match</p>;
    }

    // Sort events by time
    const sortedEvents = [...events].sort((a, b) => a.time.elapsed - b.time.elapsed);

    return (
      <div className="space-y-3 p-4">
        {sortedEvents.map((event, index) => (
          <div key={index} className="glass p-3 rounded-lg flex items-center gap-3">
            <div className="min-w-[40px] text-center font-bold">
              {event.time.elapsed}'
              {event.time.extra && <span className="text-xs">+{event.time.extra}</span>}
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <p className="font-medium">
                    {event.team.name === teams.home.name ? (
                      <span>{event.player.name}</span>
                    ) : (
                      <span className="text-right block">{event.player.name}</span>
                    )}
                  </p>
                  {event.assist && event.assist.name && (
                    <p className="text-xs text-muted-foreground">
                      Assist: {event.assist.name}
                    </p>
                  )}
                </div>
                <div>
                  {event.type === "Goal" && (
                    <div className="text-sm font-semibold text-football-orange">
                      ⚽ {event.detail}
                    </div>
                  )}
                  {event.type === "Card" && (
                    <div className="text-sm font-semibold">
                      {event.detail === "Yellow Card" ? "🟨" : "🟥"} {event.detail}
                    </div>
                  )}
                  {event.type === "Subst" && (
                    <div className="text-sm font-semibold text-football-blue">
                      🔄 Substitution
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderStats = () => {
    if (!statistics || statistics.length === 0) {
      return <p className="text-center py-8 text-muted-foreground">No statistics available for this match</p>;
    }

    // Get the statistics for each team
    const homeStats = statistics[0]?.statistics || [];
    const awayStats = statistics[1]?.statistics || [];

    // Common statistics to display
    const commonStats = [
      "Ball Possession",
      "Total Shots",
      "Shots on Goal",
      "Fouls",
      "Corner Kicks",
      "Offsides",
      "Yellow Cards",
      "Red Cards",
    ];

    return (
      <div className="space-y-4 p-4">
        {commonStats.map((statName, index) => {
          const homeStat = homeStats.find((s) => s.type === statName);
          const awayStat = awayStats.find((s) => s.type === statName);

          if (!homeStat && !awayStat) return null;

          return (
            <div key={index} className="glass p-3 rounded-lg">
              <div className="text-xs text-center mb-1 text-muted-foreground">{statName}</div>
              <div className="flex items-center justify-between">
                <div className="w-[45%] text-right font-medium">{homeStat?.value || "0"}</div>
                <div className="w-[10%] text-center text-xs text-muted-foreground">-</div>
                <div className="w-[45%] text-left font-medium">{awayStat?.value || "0"}</div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderLineups = () => {
    if (!lineups || lineups.length === 0) {
      return <p className="text-center py-8 text-muted-foreground">No lineup information available for this match</p>;
    }

    const homeLineup = lineups.find(l => l.team.id === teams.home.id);
    const awayLineup = lineups.find(l => l.team.id === teams.away.id);

    return (
      <div className="p-4">
        <div className="flex justify-between items-center gap-4 mb-6">
          <div className="text-center flex-1">
            <h3 className="font-bold">{teams.home.name}</h3>
            <p className="text-xs text-muted-foreground">
              Formation: {homeLineup?.formation || "N/A"}
            </p>
          </div>
          <div className="text-center flex-1">
            <h3 className="font-bold">{teams.away.name}</h3>
            <p className="text-xs text-muted-foreground">
              Formation: {awayLineup?.formation || "N/A"}
            </p>
          </div>
        </div>

        <div className="glass p-3 rounded-lg mb-6">
          <h4 className="text-center mb-3 font-medium">Starting XI</h4>
          <div className="flex">
            <div className="flex-1 border-r border-white/10 pr-2">
              {homeLineup?.startXI.map((player, idx) => (
                <div key={idx} className="text-sm py-1 flex items-center gap-2">
                  <span className="w-5 text-center text-xs text-muted-foreground">
                    {player.player.number}
                  </span>
                  <span className="flex-1">{player.player.name}</span>
                  <span className="text-xs text-muted-foreground">{player.player.pos}</span>
                </div>
              ))}
            </div>
            <div className="flex-1 pl-2">
              {awayLineup?.startXI.map((player, idx) => (
                <div key={idx} className="text-sm py-1 flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">{player.player.pos}</span>
                  <span className="flex-1 text-right">{player.player.name}</span>
                  <span className="w-5 text-center text-xs text-muted-foreground">
                    {player.player.number}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="glass p-3 rounded-lg">
          <h4 className="text-center mb-3 font-medium">Substitutes</h4>
          <div className="flex">
            <div className="flex-1 border-r border-white/10 pr-2">
              {homeLineup?.substitutes.map((player, idx) => (
                <div key={idx} className="text-sm py-1 flex items-center gap-2">
                  <span className="w-5 text-center text-xs text-muted-foreground">
                    {player.player.number}
                  </span>
                  <span className="flex-1">{player.player.name}</span>
                  <span className="text-xs text-muted-foreground">{player.player.pos}</span>
                </div>
              ))}
            </div>
            <div className="flex-1 pl-2">
              {awayLineup?.substitutes.map((player, idx) => (
                <div key={idx} className="text-sm py-1 flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">{player.player.pos}</span>
                  <span className="flex-1 text-right">{player.player.name}</span>
                  <span className="w-5 text-center text-xs text-muted-foreground">
                    {player.player.number}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="glass animate-fade-in rounded-lg overflow-hidden">
      <div className="p-5 border-b border-white/10">
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-2">
            <img
              src={match.league.logo}
              alt={match.league.name}
              className="h-6 w-6 object-contain"
            />
            <span className="text-sm font-medium">{match.league.name}</span>
          </div>
          <MatchStatusBadge 
            status={statusType}
            elapsed={fixture.status.elapsed}
            className="ml-auto"
          />
        </div>
        
        <div className="flex justify-between items-center">
          <div className="flex flex-col items-center text-center w-1/3">
            <img
              src={teams.home.logo}
              alt={teams.home.name}
              className="h-16 w-16 object-contain mb-2"
            />
            <h3 className="font-bold">{teams.home.name}</h3>
          </div>
          
          <div className="flex flex-col items-center justify-center w-1/3">
            <div className="text-3xl font-bold mb-1 flex items-center gap-2">
              <span>{goals.home ?? 0}</span>
              <span className="text-muted-foreground">:</span>
              <span>{goals.away ?? 0}</span>
            </div>
            
            <div className="text-sm text-muted-foreground">
              {statusType === "HT" && "Half-Time"}
              {statusType === "FT" && "Full-Time"}
              {statusType === "LIVE" && `${fixture.status.elapsed}' In Progress`}
              {statusType === "UPCOMING" && matchTime}
            </div>
          </div>
          
          <div className="flex flex-col items-center text-center w-1/3">
            <img
              src={teams.away.logo}
              alt={teams.away.name}
              className="h-16 w-16 object-contain mb-2"
            />
            <h3 className="font-bold">{teams.away.name}</h3>
          </div>
        </div>
        
        <div className="mt-4 flex items-center justify-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            <span>{matchDate}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>{matchTime}</span>
          </div>
          {fixture.venue.name && (
            <div className="flex items-center gap-1">
              <Home className="h-3 w-3" />
              <span>{fixture.venue.name}</span>
            </div>
          )}
          {fixture.referee && (
            <div className="flex items-center gap-1">
              <Info className="h-3 w-3" />
              <span>Referee: {fixture.referee}</span>
            </div>
          )}
        </div>
      </div>
      
      {/* Match details tabs */}
      <Tabs defaultValue="events">
        <TabsList className="w-full grid grid-cols-3 rounded-none border-b border-white/10">
          <TabsTrigger value="events">Events</TabsTrigger>
          <TabsTrigger value="stats">Statistics</TabsTrigger>
          <TabsTrigger value="lineup">Lineups</TabsTrigger>
        </TabsList>
        <TabsContent value="events">{renderEvents()}</TabsContent>
        <TabsContent value="stats">{renderStats()}</TabsContent>
        <TabsContent value="lineup">{renderLineups()}</TabsContent>
      </Tabs>
    </div>
  );
};
