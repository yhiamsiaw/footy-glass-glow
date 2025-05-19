
import { useState } from "react";
import { Link } from "react-router-dom";
import { MatchDetails as MatchDetailsType, EventType } from "@/types/football";
import { MatchStatusBadge } from "@/components/MatchStatusBadge";
import { getMatchStatusType } from "@/utils/api";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, Home, Info, User, Star } from "lucide-react";
import { LogoFallback } from "@/components/LogoFallback";
import { useLocalStorage } from "@/hooks/use-local-storage";

interface MatchDetailsProps {
  match: MatchDetailsType;
  isFavorite?: boolean;
}

export const MatchDetails = ({ match, isFavorite: initialIsFavorite = false }: MatchDetailsProps) => {
  const { fixture, teams, goals, score, events, lineups, statistics } = match;
  const [homeLogoError, setHomeLogoError] = useState(false);
  const [awayLogoError, setAwayLogoError] = useState(false);
  const [leagueLogoError, setLeagueLogoError] = useState(false);
  
  const [favoriteMatches, setFavoriteMatches] = useLocalStorage<number[]>("favoriteMatches", []);
  const [isFavorite, setIsFavorite] = useState(initialIsFavorite);
  
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

  // Toggle favorite status
  const toggleFavorite = () => {
    if (isFavorite) {
      setFavoriteMatches(favoriteMatches.filter(id => id !== fixture.id));
    } else {
      setFavoriteMatches([...favoriteMatches, fixture.id]);
    }
    setIsFavorite(!isFavorite);
  };

  return (
    <div className="bg-[#121212] rounded-lg overflow-hidden shadow-lg">
      {/* Match Header - Similar to the reference image */}
      <div className="relative overflow-hidden">
        {/* Background with diagonal stripes */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a111a] to-[#121212]">
          <div className="absolute inset-0" style={{
            backgroundImage: "repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.03) 10px, rgba(255,255,255,0.03) 20px)",
          }}></div>
        </div>
        
        {/* League info */}
        <div className="relative pt-4 px-4">
          <Link 
            to={`/league/${match.league.id}`}
            className="flex items-center gap-2 hover:bg-black/20 px-3 py-1.5 rounded-lg transition-colors w-fit"
          >
            {leagueLogoError ? (
              <LogoFallback className="h-4 w-4" isLeague={true} />
            ) : (
              <img
                src={match.league.logo}
                alt=""
                className="h-4 w-4 object-contain"
                onError={() => setLeagueLogoError(true)}
              />
            )}
            <div className="flex flex-col">
              <span className="text-xs font-medium">{match.league.name}</span>
              <span className="text-[10px] text-gray-400">{match.league.country}</span>
            </div>
          </Link>
        </div>
        
        {/* Team logos and score */}
        <div className="relative pt-5 pb-8 px-5 flex items-center justify-between">
          {/* Home Team */}
          <div className="flex flex-col items-center text-center flex-1">
            {homeLogoError ? (
              <LogoFallback className="h-16 w-16 mb-2" teamName={teams.home.name} />
            ) : (
              <img
                src={teams.home.logo}
                alt=""
                className="h-16 w-16 object-contain mb-2"
                onError={() => setHomeLogoError(true)}
              />
            )}
            <h3 className="font-bold text-sm max-w-[100px] truncate">{teams.home.name}</h3>
            
            {/* Form dots (placeholder) */}
            <div className="flex gap-1 mt-2">
              {[...Array(5)].map((_, idx) => (
                <div key={idx} className={`w-2 h-2 rounded-full ${
                  idx === 0 ? "bg-gray-400" : 
                  idx === 1 ? "bg-red-500" : 
                  idx === 2 || idx === 3 ? "bg-green-500" : 
                  "bg-gray-400"
                }`}></div>
              ))}
            </div>
          </div>
          
          {/* Score/Time */}
          <div className="flex flex-col items-center mx-4">
            {/* Match Time/Status */}
            <div className="text-center mb-2">
              {statusType === "UPCOMING" ? (
                <>
                  <div className="text-2xl font-bold">{matchTime.split(':')[0]}:{matchTime.split(':')[1]}</div>
                  <div className="text-xs text-gray-400">Today</div>
                </>
              ) : (
                <>
                  <div className="flex items-center justify-center">
                    <div className="text-3xl font-bold mr-1">{goals.home ?? 0}</div>
                    <div className="text-2xl font-bold text-gray-500">-</div>
                    <div className="text-3xl font-bold ml-1">{goals.away ?? 0}</div>
                  </div>
                  <div className="mt-1">
                    <MatchStatusBadge 
                      status={statusType}
                      elapsed={fixture.status.elapsed}
                    />
                  </div>
                </>
              )}
            </div>
            
            {/* Favorite button */}
            <button 
              onClick={toggleFavorite}
              className="mt-2 p-1.5 rounded-full hover:bg-gray-800 transition-colors"
            >
              <Star className={`h-5 w-5 ${isFavorite ? "text-yellow-500 fill-yellow-500" : "text-gray-400"}`} />
            </button>
          </div>
          
          {/* Away Team */}
          <div className="flex flex-col items-center text-center flex-1">
            {awayLogoError ? (
              <LogoFallback className="h-16 w-16 mb-2" teamName={teams.away.name} />
            ) : (
              <img
                src={teams.away.logo}
                alt=""
                className="h-16 w-16 object-contain mb-2"
                onError={() => setAwayLogoError(true)}
              />
            )}
            <h3 className="font-bold text-sm max-w-[100px] truncate">{teams.away.name}</h3>
            
            {/* Form dots (placeholder) */}
            <div className="flex gap-1 mt-2">
              {[...Array(5)].map((_, idx) => (
                <div key={idx} className={`w-2 h-2 rounded-full ${
                  idx === 0 || idx === 1 || idx === 2 ? "bg-green-500" : 
                  idx === 3 ? "bg-red-500" : 
                  "bg-gray-400"
                }`}></div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Navigation tabs */}
      <div className="border-t border-gray-800">
        <Tabs defaultValue="lineups" className="w-full">
          <div className="overflow-x-auto">
            <TabsList className="w-full rounded-none border-b border-gray-800 bg-transparent">
              <TabsTrigger 
                value="lineups" 
                className="flex-1 data-[state=active]:border-b-2 data-[state=active]:border-blue-500 rounded-none bg-transparent data-[state=active]:bg-transparent text-sm py-3"
              >
                Lineups
              </TabsTrigger>
              <TabsTrigger 
                value="stats" 
                className="flex-1 data-[state=active]:border-b-2 data-[state=active]:border-blue-500 rounded-none bg-transparent data-[state=active]:bg-transparent text-sm py-3"
              >
                Stats
              </TabsTrigger>
              <TabsTrigger 
                value="info" 
                className="flex-1 data-[state=active]:border-b-2 data-[state=active]:border-blue-500 rounded-none bg-transparent data-[state=active]:bg-transparent text-sm py-3"
              >
                Info
              </TabsTrigger>
            </TabsList>
          </div>
          
          {/* Lineups Tab */}
          <TabsContent value="lineups" className="p-0 pt-2 border-0">
            {renderLineups()}
          </TabsContent>
          
          {/* Stats Tab */}
          <TabsContent value="stats" className="p-0 pt-2 border-0">
            {renderStats()}
          </TabsContent>
          
          {/* Info Tab */}
          <TabsContent value="info" className="p-0 pt-2 border-0">
            {renderInfo()}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );

  function renderLineups() {
    if (!lineups || lineups.length === 0) {
      return <p className="text-center py-8 text-gray-400">No lineup information available for this match</p>;
    }

    const homeLineup = lineups.find(l => l.team.id === teams.home.id);
    const awayLineup = lineups.find(l => l.team.id === teams.away.id);

    return (
      <div className="p-4">
        <div className="flex justify-between items-center gap-4 mb-6">
          <div className="text-center flex-1">
            <h3 className="font-bold text-sm">{teams.home.name}</h3>
            <p className="text-xs text-gray-400">
              Formation: {homeLineup?.formation || "N/A"}
            </p>
          </div>
          <div className="text-center flex-1">
            <h3 className="font-bold text-sm">{teams.away.name}</h3>
            <p className="text-xs text-gray-400">
              Formation: {awayLineup?.formation || "N/A"}
            </p>
          </div>
        </div>

        {/* Field visualization */}
        <div className="relative w-full h-[400px] bg-green-800 rounded-xl mb-6 overflow-hidden">
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
                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                  <span className="text-xs font-bold">{player.player.number}</span>
                </div>
                <span className="text-xs font-medium mt-1 bg-black/50 px-1 py-0.5 rounded max-w-16 truncate text-center">
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
                <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center">
                  <span className="text-xs font-bold">{player.player.number}</span>
                </div>
                <span className="text-xs font-medium mt-1 bg-black/50 px-1 py-0.5 rounded max-w-16 truncate text-center">
                  {player.player.name.split(' ').pop()}
                </span>
              </div>
            );
          })}
        </div>
        
        {/* Starting XI Lists */}
        <div className="bg-[#1a1a1a] rounded-lg p-4 mb-4">
          <h4 className="text-center mb-3 font-medium text-sm border-b border-gray-800 pb-2">Starting XI</h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              {homeLineup?.startXI.map((player, idx) => (
                <div key={idx} className="text-xs py-1 flex items-center gap-2">
                  <span className="w-5 text-center text-gray-400 font-medium">
                    {player.player.number}
                  </span>
                  <span className="flex-1 truncate">{player.player.name}</span>
                  <span className="text-[10px] px-1 py-0.5 bg-gray-700 rounded text-gray-300">{player.player.pos}</span>
                </div>
              ))}
            </div>
            <div className="space-y-1">
              {awayLineup?.startXI.map((player, idx) => (
                <div key={idx} className="text-xs py-1 flex items-center gap-2">
                  <span className="text-[10px] px-1 py-0.5 bg-gray-700 rounded text-gray-300">{player.player.pos}</span>
                  <span className="flex-1 text-right truncate">{player.player.name}</span>
                  <span className="w-5 text-center text-gray-400 font-medium">
                    {player.player.number}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Substitutes */}
        <div className="bg-[#1a1a1a] rounded-lg p-4">
          <h4 className="text-center mb-3 font-medium text-sm border-b border-gray-800 pb-2">Substitutes</h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              {homeLineup?.substitutes.map((player, idx) => (
                <div key={idx} className="text-xs py-1 flex items-center gap-2">
                  <span className="w-5 text-center text-gray-400 font-medium">
                    {player.player.number}
                  </span>
                  <span className="flex-1 truncate">{player.player.name}</span>
                  <span className="text-[10px] px-1 py-0.5 bg-gray-700 rounded text-gray-300">{player.player.pos}</span>
                </div>
              ))}
            </div>
            <div className="space-y-1">
              {awayLineup?.substitutes.map((player, idx) => (
                <div key={idx} className="text-xs py-1 flex items-center gap-2">
                  <span className="text-[10px] px-1 py-0.5 bg-gray-700 rounded text-gray-300">{player.player.pos}</span>
                  <span className="flex-1 text-right truncate">{player.player.name}</span>
                  <span className="w-5 text-center text-gray-400 font-medium">
                    {player.player.number}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  function renderStats() {
    if (!statistics || statistics.length === 0) {
      return <p className="text-center py-8 text-gray-400">No statistics available for this match</p>;
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
      <div className="p-4">
        <div className="bg-[#1a1a1a] rounded-lg p-4 mb-4">
          <div className="flex items-center justify-center mb-3">
            <div className="w-8 h-8 rounded-full bg-blue-900/50 flex items-center justify-center text-xs font-bold">
              {goals.home ?? 0}
            </div>
            <div className="mx-2 text-xs text-gray-500">FT</div>
            <div className="w-8 h-8 rounded-full bg-red-900/50 flex items-center justify-center text-xs font-bold">
              {goals.away ?? 0}
            </div>
          </div>
          
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
              <div key={index} className="mb-4">
                <div className="flex items-center justify-between mb-1">
                  <div className="text-xs font-medium">{homeValue}</div>
                  <div className="text-xs text-gray-400">{statName}</div>
                  <div className="text-xs font-medium">{awayValue}</div>
                </div>
                
                {/* Bar chart */}
                <div className="h-1.5 w-full flex rounded-full overflow-hidden">
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
        
        {/* Events section */}
        {events && events.length > 0 && (
          <div className="bg-[#1a1a1a] rounded-lg p-4">
            <h4 className="text-center mb-3 font-medium text-sm border-b border-gray-800 pb-2">Match Events</h4>
            <div className="space-y-2">
              {events
                .sort((a, b) => a.time.elapsed - b.time.elapsed)
                .map((event, index) => {
                  const isHomeTeam = event.team.id === teams.home.id;
                  
                  return (
                    <div key={index} className="flex items-center text-xs">
                      {/* Home team event */}
                      <div className={`flex-1 text-right ${!isHomeTeam && "opacity-0"}`}>
                        {isHomeTeam && (
                          <div className="inline-flex items-center">
                            <span className="mr-2">{event.player.name}</span>
                            {event.type === "Goal" && <span className="text-sm">⚽</span>}
                            {event.type === "Card" && (
                              <span className="text-sm">
                                {event.detail === "Yellow Card" ? "🟨" : "🟥"}
                              </span>
                            )}
                            {event.type === "Subst" && <span className="text-sm">🔄</span>}
                          </div>
                        )}
                      </div>
                      
                      {/* Time */}
                      <div className="w-12 text-center font-bold text-gray-400">
                        {event.time.elapsed}'
                        {event.time.extra && <span className="text-[10px]">+{event.time.extra}</span>}
                      </div>
                      
                      {/* Away team event */}
                      <div className={`flex-1 ${isHomeTeam && "opacity-0"}`}>
                        {!isHomeTeam && (
                          <div className="inline-flex items-center">
                            {event.type === "Goal" && <span className="text-sm mr-2">⚽</span>}
                            {event.type === "Card" && (
                              <span className="text-sm mr-2">
                                {event.detail === "Yellow Card" ? "🟨" : "🟥"}
                              </span>
                            )}
                            {event.type === "Subst" && <span className="text-sm mr-2">🔄</span>}
                            <span>{event.player.name}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
              })}
            </div>
          </div>
        )}
      </div>
    );
  }

  function renderInfo() {
    return (
      <div className="p-4 space-y-4">
        {/* Match Details Card */}
        <div className="bg-[#1a1a1a] rounded-lg p-4">
          <h4 className="font-medium text-sm mb-3 pb-2 border-b border-gray-800">Match Details</h4>
          
          <div className="space-y-2">
            <div className="flex items-center text-xs">
              <Calendar className="h-3.5 w-3.5 mr-2 text-gray-400" />
              <div className="text-gray-300">{matchDate}</div>
            </div>
            
            <div className="flex items-center text-xs">
              <Clock className="h-3.5 w-3.5 mr-2 text-gray-400" />
              <div className="text-gray-300">{matchTime}</div>
            </div>
            
            {fixture.venue.name && (
              <div className="flex items-center text-xs">
                <Home className="h-3.5 w-3.5 mr-2 text-gray-400" />
                <div className="text-gray-300">{fixture.venue.name}</div>
              </div>
            )}
            
            {fixture.referee && (
              <div className="flex items-center text-xs">
                <User className="h-3.5 w-3.5 mr-2 text-gray-400" />
                <div className="text-gray-300">Referee: {fixture.referee}</div>
              </div>
            )}
          </div>
        </div>
        
        {/* Scores by period */}
        <div className="bg-[#1a1a1a] rounded-lg p-4">
          <h4 className="font-medium text-sm mb-3 pb-2 border-b border-gray-800">Score by Period</h4>
          
          <div className="space-y-3">
            {/* First Half */}
            <div className="grid grid-cols-3 items-center text-xs">
              <div>{teams.home.name}</div>
              <div className="text-center text-gray-400">First Half</div>
              <div className="text-right">{teams.away.name}</div>
              <div className="font-bold">{score.halftime.home ?? 0}</div>
              <div className="text-center">-</div>
              <div className="text-right font-bold">{score.halftime.away ?? 0}</div>
            </div>
            
            {/* Second Half */}
            {score.fulltime.home !== null && (
              <div className="grid grid-cols-3 items-center text-xs">
                <div>{teams.home.name}</div>
                <div className="text-center text-gray-400">Second Half</div>
                <div className="text-right">{teams.away.name}</div>
                <div className="font-bold">{(score.fulltime.home ?? 0) - (score.halftime.home ?? 0)}</div>
                <div className="text-center">-</div>
                <div className="text-right font-bold">{(score.fulltime.away ?? 0) - (score.halftime.away ?? 0)}</div>
              </div>
            )}
            
            {/* Extra Time */}
            {score.extratime.home !== null && (
              <div className="grid grid-cols-3 items-center text-xs">
                <div>{teams.home.name}</div>
                <div className="text-center text-gray-400">Extra Time</div>
                <div className="text-right">{teams.away.name}</div>
                <div className="font-bold">{score.extratime.home ?? 0}</div>
                <div className="text-center">-</div>
                <div className="text-right font-bold">{score.extratime.away ?? 0}</div>
              </div>
            )}
            
            {/* Penalty */}
            {score.penalty.home !== null && (
              <div className="grid grid-cols-3 items-center text-xs">
                <div>{teams.home.name}</div>
                <div className="text-center text-gray-400">Penalty</div>
                <div className="text-right">{teams.away.name}</div>
                <div className="font-bold">{score.penalty.home ?? 0}</div>
                <div className="text-center">-</div>
                <div className="text-right font-bold">{score.penalty.away ?? 0}</div>
              </div>
            )}
          </div>
        </div>
        
        {/* League Info */}
        <div className="bg-[#1a1a1a] rounded-lg p-4">
          <h4 className="font-medium text-sm mb-3 pb-2 border-b border-gray-800">Competition</h4>
          
          <div className="flex items-center">
            {leagueLogoError ? (
              <LogoFallback className="h-10 w-10 mr-3" isLeague={true} />
            ) : (
              <img
                src={match.league.logo}
                alt=""
                className="h-10 w-10 object-contain mr-3"
                onError={() => setLeagueLogoError(true)}
              />
            )}
            <div>
              <div className="font-medium text-sm">{match.league.name}</div>
              <div className="text-xs text-gray-400">
                {match.league.country} • Season {match.league.season}
                {match.league.round && ` • ${match.league.round}`}
              </div>
            </div>
          </div>
          
          <div className="mt-3">
            <Link to={`/league/${match.league.id}`} className="w-full bg-gray-800 hover:bg-gray-700 text-center py-2 rounded text-xs font-medium block">
              View Competition
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Field positions for lineup visualization - HOME TEAM
  function getHomePositionClass(pos: string) {
    const baseClass = "absolute transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center";
    
    switch (pos) {
      // Goalkeeper
      case "G":
        return `${baseClass} bottom-[5%] left-[50%]`;
      
      // Defenders
      case "D":
      case "RB":
        return `${baseClass} bottom-[25%] left-[80%]`;
      case "CB":
        return `${baseClass} bottom-[25%] left-[50%]`;
      case "LB":
        return `${baseClass} bottom-[25%] left-[20%]`;
      
      // Midfielders
      case "M":
      case "CM":
        return `${baseClass} bottom-[45%] left-[50%]`;
      case "RM":
        return `${baseClass} bottom-[45%] left-[80%]`;
      case "LM":
        return `${baseClass} bottom-[45%] left-[20%]`;
      case "CDM":
        return `${baseClass} bottom-[35%] left-[50%]`;
      case "CAM":
        return `${baseClass} bottom-[55%] left-[50%]`;
      
      // Forwards
      case "F":
      case "CF":
      case "ST":
        return `${baseClass} bottom-[70%] left-[50%]`;
      case "RW":
        return `${baseClass} bottom-[65%] left-[75%]`;
      case "LW":
        return `${baseClass} bottom-[65%] left-[25%]`;
      
      default:
        return `${baseClass} bottom-[45%] left-[50%]`;
    }
  }
  
  // Field positions for lineup visualization - AWAY TEAM
  function getAwayPositionClass(pos: string) {
    const baseClass = "absolute transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center";
    
    switch (pos) {
      // Goalkeeper
      case "G":
        return `${baseClass} top-[5%] left-[50%]`;
      
      // Defenders
      case "D":
      case "RB":
        return `${baseClass} top-[25%] left-[20%]`;
      case "CB":
        return `${baseClass} top-[25%] left-[50%]`;
      case "LB":
        return `${baseClass} top-[25%] left-[80%]`;
      
      // Midfielders
      case "M":
      case "CM":
        return `${baseClass} top-[45%] left-[50%]`;
      case "RM":
        return `${baseClass} top-[45%] left-[20%]`;
      case "LM":
        return `${baseClass} top-[45%] left-[80%]`;
      case "CDM":
        return `${baseClass} top-[35%] left-[50%]`;
      case "CAM":
        return `${baseClass} top-[55%] left-[50%]`;
      
      // Forwards
      case "F":
      case "CF":
      case "ST":
        return `${baseClass} top-[70%] left-[50%]`;
      case "RW":
        return `${baseClass} top-[65%] left-[25%]`;
      case "LW":
        return `${baseClass} top-[65%] left-[75%]`;
      
      default:
        return `${baseClass} top-[45%] left-[50%]`;
    }
  }
};

