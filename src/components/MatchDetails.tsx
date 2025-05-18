import { useState } from "react";
import { Link } from "react-router-dom";
import { MatchDetails as MatchDetailsType, EventType } from "@/types/football";
import { MatchStatusBadge } from "@/components/MatchStatusBadge";
import { getMatchStatusType } from "@/utils/api";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, Home, Info, User } from "lucide-react";
import { LogoFallback } from "@/components/LogoFallback";

interface MatchDetailsProps {
  match: MatchDetailsType;
}

export const MatchDetails = ({ match }: MatchDetailsProps) => {
  const { fixture, teams, goals, score, events, lineups, statistics } = match;
  const [homeLogoError, setHomeLogoError] = useState(false);
  const [awayLogoError, setAwayLogoError] = useState(false);
  
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
  
  // Field positions for lineup visualization - HOME TEAM
  const getHomePositionClass = (pos: string) => {
    const baseClass = "absolute transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center";
    
    switch (pos) {
      // Goalkeeper
      case "G":
        return `${baseClass} bottom-[5%] left-[50%]`;
      
      // Defenders
      case "D":
      case "RB":
      case "CB":
      case "LB":
        return `${baseClass} bottom-[25%] left-[${getHorizontalPosition(pos)}%]`;
      
      // Midfielders
      case "M":
      case "CM":
      case "RM":
      case "LM":
      case "CDM":
      case "CAM":
        return `${baseClass} bottom-[45%] left-[${getHorizontalPosition(pos)}%]`;
      
      // Forwards
      case "F":
      case "ST":
      case "CF":
      case "RW":
      case "LW":
        return `${baseClass} bottom-[65%] left-[${getHorizontalPosition(pos)}%]`;
      
      default:
        return `${baseClass} bottom-[45%] left-[50%]`;
    }
  };
  
  // Field positions for lineup visualization - AWAY TEAM
  const getAwayPositionClass = (pos: string) => {
    const baseClass = "absolute transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center";
    
    switch (pos) {
      // Goalkeeper
      case "G":
        return `${baseClass} top-[5%] left-[50%]`;
      
      // Defenders
      case "D":
      case "RB":
      case "CB":
      case "LB":
        return `${baseClass} top-[25%] left-[${getHorizontalPosition(pos)}%]`;
      
      // Midfielders
      case "M":
      case "CM":
      case "RM":
      case "LM":
      case "CDM":
      case "CAM":
        return `${baseClass} top-[45%] left-[${getHorizontalPosition(pos)}%]`;
      
      // Forwards
      case "F":
      case "ST":
      case "CF":
      case "RW":
      case "LW":
        return `${baseClass} top-[65%] left-[${getHorizontalPosition(pos)}%]`;
      
      default:
        return `${baseClass} top-[45%] left-[50%]`;
    }
  };

  // Helper function to determine horizontal position based on player role
  const getHorizontalPosition = (pos: string) => {
    switch (pos) {
      case "RB":
      case "RM":
      case "RW":
        return 80;
      case "CB":
      case "CM":
      case "CF":
      case "ST":
        return 50;
      case "LB":
      case "LM":
      case "LW":
        return 20;
      case "CDM":
        return 35;
      case "CAM":
        return 65;
      default:
        return 50;
    }
  };

  const renderEvents = () => {
    if (!events || events.length === 0) {
      return <p className="text-center py-8 text-muted-foreground">No events available for this match</p>;
    }

    // Sort events by time
    const sortedEvents = [...events].sort((a, b) => a.time.elapsed - b.time.elapsed);

    return (
      <div className="space-y-3 p-4">
        {sortedEvents.map((event, index) => (
          <div key={index} className="bg-gray-800/50 p-4 rounded-lg flex items-center gap-3 hover:bg-gray-800 transition-colors">
            <div className="min-w-[50px] text-center font-bold">
              <span className="text-lg">{event.time.elapsed}'</span>
              {event.time.extra && <span className="text-xs text-gray-400">+{event.time.extra}</span>}
            </div>

            <div className="flex-1 flex items-center gap-4">
              <div className="flex-1">
                <p className={`font-medium text-sm ${event.team.name === teams.home.name ? "text-left" : "text-right"}`}>
                  {event.player.name}
                </p>
                {event.assist && event.assist.name && (
                  <p className={`text-xs text-gray-400 ${event.team.name === teams.home.name ? "text-left" : "text-right"}`}>
                    Assist: {event.assist.name}
                  </p>
                )}
              </div>
              
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-gray-700">
                {event.type === "Goal" && (
                  <span className="text-2xl" role="img" aria-label="Goal">⚽</span>
                )}
                {event.type === "Card" && (
                  <span className="text-2xl" role="img" aria-label={event.detail}>
                    {event.detail === "Yellow Card" ? "🟨" : "🟥"}
                  </span>
                )}
                {event.type === "Subst" && (
                  <span className="text-2xl" role="img" aria-label="Substitution">🔄</span>
                )}
              </div>
              
              <div className="flex-1">
                <p className="font-medium text-sm">
                  {event.type === "Goal" && (
                    <span className="text-yellow-400">{event.detail}</span>
                  )}
                  {event.type === "Card" && (
                    <span>{event.detail}</span>
                  )}
                  {event.type === "Subst" && (
                    <span className="text-blue-400">Substitution</span>
                  )}
                </p>
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
      <div className="space-y-6 p-4">
        {commonStats.map((statName, index) => {
          const homeStat = homeStats.find((s) => s.type === statName);
          const awayStat = awayStats.find((s) => s.type === statName);

          if (!homeStat && !awayStat) return null;

          // Calculate percentages for the bar chart
          const homeValue = parseFloat(homeStat?.value?.toString() || "0");
          const awayValue = parseFloat(awayStat?.value?.toString() || "0");
          const total = homeValue + awayValue;
          const homePercentage = total > 0 ? (homeValue / total) * 100 : 50;
          const awayPercentage = total > 0 ? (awayValue / total) * 100 : 50;

          return (
            <div key={index} className="bg-gray-800/50 p-4 rounded-lg hover:bg-gray-800 transition-colors">
              <div className="text-sm text-center mb-3 text-gray-300">{statName}</div>
              
              <div className="flex items-center justify-between mb-2">
                <div className="w-[45%] text-right font-medium">{homeStat?.value || "0"}</div>
                <div className="w-[10%] text-center text-xs text-gray-400">vs</div>
                <div className="w-[45%] text-left font-medium">{awayStat?.value || "0"}</div>
              </div>
              
              {/* Bar chart */}
              <div className="h-2 w-full flex rounded-full overflow-hidden">
                <div 
                  className="bg-blue-500" 
                  style={{ width: `${homePercentage}%` }}
                ></div>
                <div 
                  className="bg-red-500" 
                  style={{ width: `${awayPercentage}%` }}
                ></div>
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

    const TabContent = () => (
      <>
        <div className="flex justify-between items-center gap-4 mb-6">
          <div className="text-center flex-1">
            <h3 className="font-bold text-lg">{teams.home.name}</h3>
            <p className="text-sm text-gray-400">
              Formation: {homeLineup?.formation || "N/A"}
            </p>
          </div>
          <div className="text-center flex-1">
            <h3 className="font-bold text-lg">{teams.away.name}</h3>
            <p className="text-sm text-gray-400">
              Formation: {awayLineup?.formation || "N/A"}
            </p>
          </div>
        </div>

        {/* Field visualization */}
        <div className="relative w-full h-[500px] bg-green-800 rounded-xl mb-8 overflow-hidden">
          {/* Field markings */}
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="absolute top-1/2 left-0 w-full h-[2px] bg-white/70 transform -translate-y-1/2"></div>
            <div className="absolute top-1/2 left-1/2 w-[120px] h-[120px] border-2 border-white/70 rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute top-0 left-0 w-full h-[100px] border-b-2 border-white/70"></div>
            <div className="absolute bottom-0 left-0 w-full h-[100px] border-t-2 border-white/70"></div>
          </div>
          
          {/* Home team section indicator */}
          <div className="absolute bottom-0 left-0 w-full h-1/2 bg-blue-900/10 border-t-2 border-white/30"></div>
          
          {/* Away team section indicator */}
          <div className="absolute top-0 left-0 w-full h-1/2 bg-red-900/10 border-b-2 border-white/30"></div>
          
          {/* Home team players */}
          {homeLineup?.startXI.map((player, idx) => {
            const posClass = getHomePositionClass(player.player.pos);
            
            return (
              <div 
                key={`home-${idx}`} 
                className={posClass}
              >
                <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center">
                  <span className="text-xs font-bold">{player.player.number}</span>
                </div>
                <span className="text-xs font-medium mt-1 bg-black/50 px-1 py-0.5 rounded max-w-20 truncate">
                  {player.player.name.split(' ').pop()}
                </span>
              </div>
            );
          })}
          
          {/* Away team players */}
          {awayLineup?.startXI.map((player, idx) => {
            const posClass = getAwayPositionClass(player.player.pos);
            
            return (
              <div 
                key={`away-${idx}`} 
                className={posClass}
              >
                <div className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center">
                  <span className="text-xs font-bold">{player.player.number}</span>
                </div>
                <span className="text-xs font-medium mt-1 bg-black/50 px-1 py-0.5 rounded max-w-20 truncate">
                  {player.player.name.split(' ').pop()}
                </span>
              </div>
            );
          })}
        </div>
        
        {/* Traditional lineup lists */}
        <div className="bg-gray-800/50 p-4 rounded-lg mb-6">
          <h4 className="text-center mb-3 font-medium">Starting XI</h4>
          <div className="flex flex-col md:flex-row">
            <div className="flex-1 border-b md:border-b-0 md:border-r border-white/10 pr-0 md:pr-4 pb-4 md:pb-0">
              {homeLineup?.startXI.map((player, idx) => (
                <div key={idx} className="text-sm py-1.5 flex items-center gap-2">
                  <span className="w-6 text-center text-xs text-gray-400 font-medium">
                    {player.player.number}
                  </span>
                  <span className="flex-1">{player.player.name}</span>
                  <span className="text-xs px-1.5 py-0.5 bg-gray-700 rounded text-gray-300">{player.player.pos}</span>
                </div>
              ))}
            </div>
            <div className="flex-1 pt-4 md:pt-0 md:pl-4">
              {awayLineup?.startXI.map((player, idx) => (
                <div key={idx} className="text-sm py-1.5 flex items-center gap-2">
                  <span className="text-xs px-1.5 py-0.5 bg-gray-700 rounded text-gray-300">{player.player.pos}</span>
                  <span className="flex-1 text-right">{player.player.name}</span>
                  <span className="w-6 text-center text-xs text-gray-400 font-medium">
                    {player.player.number}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-gray-800/50 p-4 rounded-lg">
          <h4 className="text-center mb-3 font-medium">Substitutes</h4>
          <div className="flex flex-col md:flex-row">
            <div className="flex-1 border-b md:border-b-0 md:border-r border-white/10 pr-0 md:pr-4 pb-4 md:pb-0">
              {homeLineup?.substitutes.map((player, idx) => (
                <div key={idx} className="text-sm py-1.5 flex items-center gap-2">
                  <span className="w-6 text-center text-xs text-gray-400 font-medium">
                    {player.player.number}
                  </span>
                  <span className="flex-1">{player.player.name}</span>
                  <span className="text-xs px-1.5 py-0.5 bg-gray-700 rounded text-gray-300">{player.player.pos}</span>
                </div>
              ))}
            </div>
            <div className="flex-1 pt-4 md:pt-0 md:pl-4">
              {awayLineup?.substitutes.map((player, idx) => (
                <div key={idx} className="text-sm py-1.5 flex items-center gap-2">
                  <span className="text-xs px-1.5 py-0.5 bg-gray-700 rounded text-gray-300">{player.player.pos}</span>
                  <span className="flex-1 text-right">{player.player.name}</span>
                  <span className="w-6 text-center text-xs text-gray-400 font-medium">
                    {player.player.number}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </>
    );

    return (
      <div className="p-4">
        {TabContent()}
      </div>
    );
  };

  return (
    <div className="rounded-lg overflow-hidden bg-gray-900/50 shadow-xl animate-fade-in">
      <div className="p-4 md:p-6 border-b border-white/10">
        <div className="flex justify-between items-center mb-4">
          <Link 
            to={`/league/${match.league.id}`}
            className="flex items-center gap-2 hover:bg-gray-800/50 px-3 py-1.5 rounded-lg transition-colors"
          >
            <img
              src={match.league.logo}
              alt={match.league.name}
              className="h-6 w-6 object-contain"
              onError={(e) => (e.currentTarget.style.display = 'none')}
            />
            <div className="flex flex-col">
              <span className="text-sm font-medium">{match.league.name}</span>
              <span className="text-xs text-gray-400">{match.league.country}</span>
            </div>
          </Link>
          
          <MatchStatusBadge 
            status={statusType}
            elapsed={fixture.status.elapsed}
            className="ml-auto text-sm px-2 py-1"
          />
        </div>
        
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8 gap-4">
          <div className="flex flex-col items-center text-center md:w-1/3">
            {homeLogoError ? (
              <LogoFallback className="h-20 w-20 mb-3" teamName={teams.home.name} />
            ) : (
              <img
                src={teams.home.logo}
                alt={teams.home.name}
                className="h-20 w-20 object-contain mb-3"
                onError={() => setHomeLogoError(true)}
              />
            )}
            <h3 className="font-bold text-xl">{teams.home.name}</h3>
          </div>
          
          <div className="flex flex-col items-center justify-center md:w-1/3">
            <div className="text-4xl md:text-5xl font-bold mb-2 flex items-center gap-3">
              <span className={teams.home.winner ? "text-white" : "text-gray-300"}>{goals.home ?? 0}</span>
              <span className="text-muted-foreground">-</span>
              <span className={teams.away.winner ? "text-white" : "text-gray-300"}>{goals.away ?? 0}</span>
            </div>
            
            <div className="text-sm text-gray-400">
              {statusType === "HT" && "Half-Time"}
              {statusType === "FT" && "Full-Time"}
              {statusType === "LIVE" && (
                <span className="font-medium text-red-400 animate-pulse">{`${fixture.status.elapsed}' In Progress`}</span>
              )}
              {statusType === "UPCOMING" && matchTime}
            </div>
          </div>
          
          <div className="flex flex-col items-center text-center md:w-1/3">
            {awayLogoError ? (
              <LogoFallback className="h-20 w-20 mb-3" teamName={teams.away.name} />
            ) : (
              <img
                src={teams.away.logo}
                alt={teams.away.name}
                className="h-20 w-20 object-contain mb-3"
                onError={() => setAwayLogoError(true)}
              />
            )}
            <h3 className="font-bold text-xl">{teams.away.name}</h3>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center justify-center gap-3 md:gap-6 text-xs text-gray-400">
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
              <User className="h-3 w-3" />
              <span>Referee: {fixture.referee}</span>
            </div>
          )}
        </div>
      </div>
      
      {/* Match details tabs */}
      <Tabs defaultValue="events" className="w-full">
        <TabsList className="w-full grid grid-cols-3 rounded-none border-b border-white/10">
          <TabsTrigger value="events" className="text-sm">Events</TabsTrigger>
          <TabsTrigger value="stats" className="text-sm">Statistics</TabsTrigger>
          <TabsTrigger value="lineup" className="text-sm">Lineups</TabsTrigger>
        </TabsList>
        <TabsContent value="events">{renderEvents()}</TabsContent>
        <TabsContent value="stats">{renderStats()}</TabsContent>
        <TabsContent value="lineup">{renderLineups()}</TabsContent>
      </Tabs>
    </div>
  );
};
