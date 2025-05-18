
import { useState, useEffect } from "react";
import { getLeagueStandings } from "@/utils/api";
import { useToast } from "@/hooks/use-toast";
import { ApiCache } from "@/utils/apiCache";

interface LeagueStandingsProps {
  leagueId: number;
  season?: number;
}

export const LeagueStandings = ({ leagueId, season = 2024 }: LeagueStandingsProps) => {
  const [standings, setStandings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchStandings = async () => {
      try {
        setLoading(true);
        
        // Check cache first
        const cacheKey = `standings_${leagueId}_${season}`;
        const cachedStandings = ApiCache.get(cacheKey);
        
        if (cachedStandings) {
          setStandings(cachedStandings);
          setLoading(false);
          return;
        }
        
        const data = await getLeagueStandings(leagueId, season);
        setStandings(data);
        
        // Cache the result
        ApiCache.set(cacheKey, data, 6 * 60 * 60 * 1000); // Cache for 6 hours
      } catch (error) {
        console.error("Error fetching standings:", error);
        toast({
          title: "Error fetching standings",
          description: "Please try again later",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStandings();
  }, [leagueId, season, toast]);

  if (loading) {
    return (
      <div className="p-4 space-y-4">
        <div className="h-8 bg-gray-800 animate-pulse rounded-lg"></div>
        <table className="w-full">
          <tbody>
            {[...Array(10)].map((_, i) => (
              <tr key={i} className="animate-pulse">
                <td className="py-2"><div className="h-6 bg-gray-800 rounded-lg"></div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (!standings || standings.length === 0) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-lg font-bold mb-2">No standings available</h2>
        <p className="text-gray-400">
          Standings data is not available for this league at the moment.
        </p>
      </div>
    );
  }

  const leagueStandings = standings[0]?.league?.standings?.[0] || [];

  return (
    <div className="p-4">
      <div className="flex items-center gap-3 mb-4">
        <img 
          src={standings[0]?.league?.logo} 
          alt={standings[0]?.league?.name} 
          className="h-8 w-8 object-contain"
        />
        <div>
          <h2 className="font-bold">{standings[0]?.league?.name}</h2>
          <p className="text-xs text-gray-400">{standings[0]?.league?.country}</p>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-gray-400 border-b border-gray-800">
            <tr className="text-left">
              <th className="py-2 px-2">#</th>
              <th className="py-2 px-2">Team</th>
              <th className="py-2 px-2 text-center">MP</th>
              <th className="py-2 px-2 text-center">W</th>
              <th className="py-2 px-2 text-center">D</th>
              <th className="py-2 px-2 text-center">L</th>
              <th className="py-2 px-2 text-center">GF</th>
              <th className="py-2 px-2 text-center">GA</th>
              <th className="py-2 px-2 text-center">GD</th>
              <th className="py-2 px-2 text-center">Pts</th>
              <th className="py-2 px-2">Form</th>
            </tr>
          </thead>
          <tbody>
            {leagueStandings.map((team: any) => (
              <tr 
                key={team.team.id} 
                className="border-b border-gray-800 hover:bg-white/5 transition-colors"
              >
                <td className={`py-3 px-2 ${getPositionColor(team.rank, team.description)}`}>
                  {team.rank}
                </td>
                <td className="py-3 px-2">
                  <div className="flex items-center gap-2">
                    <img 
                      src={team.team.logo} 
                      alt={team.team.name} 
                      className="h-5 w-5 object-contain"
                    />
                    <span>{team.team.name}</span>
                  </div>
                </td>
                <td className="py-3 px-2 text-center">{team.all.played}</td>
                <td className="py-3 px-2 text-center">{team.all.win}</td>
                <td className="py-3 px-2 text-center">{team.all.draw}</td>
                <td className="py-3 px-2 text-center">{team.all.lose}</td>
                <td className="py-3 px-2 text-center">{team.all.goals.for}</td>
                <td className="py-3 px-2 text-center">{team.all.goals.against}</td>
                <td className="py-3 px-2 text-center">{team.goalsDiff}</td>
                <td className="py-3 px-2 text-center font-bold">{team.points}</td>
                <td className="py-3 px-2">
                  <div className="flex gap-1">
                    {team.form?.split('').map((result: string, index: number) => (
                      <span 
                        key={index} 
                        className={`w-5 h-5 flex items-center justify-center rounded-sm text-[10px] ${
                          result === 'W' ? 'bg-green-600' : 
                          result === 'L' ? 'bg-red-600' : 
                          result === 'D' ? 'bg-gray-600' : 'bg-gray-800'
                        }`}
                      >
                        {result}
                      </span>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Helper function to get color based on position and description
const getPositionColor = (position: number, description?: string): string => {
  if (description) {
    const desc = description.toLowerCase();
    if (desc.includes("champions league")) return "text-blue-400";
    if (desc.includes("europa")) return "text-orange-400";
    if (desc.includes("conference")) return "text-green-400";
    if (desc.includes("relegation")) return "text-red-400";
  }
  
  if (position <= 4) return "text-blue-400";
  if (position >= 18) return "text-red-400";
  return "";
};
