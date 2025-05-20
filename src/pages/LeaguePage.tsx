import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getLeagueStandings, getTopLeagues } from "@/utils/api";
import { Sidebar } from "@/components/Sidebar";
import { MatchCard } from "@/components/MatchCard";
import { League, TopLeague } from "@/types/football";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { Calendar } from "lucide-react";
import { MobileNavigation } from "@/components/MobileNavigation";

interface LeagueParams {
  id?: string;
  section?: string;
}

const LeaguePage = () => {
  const { id, section = "standings" } = useParams<LeagueParams>();
  const navigate = useNavigate();
  const [league, setLeague] = useState<League | null>(null);
  const [standings, setStandings] = useState<any[]>([]);
  const [topLeagues, setTopLeagues] = useState<TopLeague[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    
    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, []);

  useEffect(() => {
    const fetchLeagueData = async () => {
      if (!id) {
        setError("League ID is missing.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const leagueId = parseInt(id);
        const currentYear = new Date().getFullYear();

        // Fetch top leagues for the sidebar
        try {
          const leagues = await getTopLeagues();
          setTopLeagues(leagues);
        } catch (err) {
          console.error("Error fetching top leagues:", err);
        }

        // Fetch league standings
        try {
          const standingsData = await getLeagueStandings(leagueId, currentYear);
          if (standingsData && standingsData.length > 0) {
            setLeague(standingsData[0].league);
            setStandings(standingsData[0].league.standings[0]);
          } else {
            setError("No standings available for this league.");
          }
        } catch (err) {
          console.error("Error fetching league standings:", err);
          setError("Failed to load league standings.");
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load league data.");
      } finally {
        setLoading(false);
      }
    };

    fetchLeagueData();
  }, [id]);

  if (isMobile) {
    return (
      <div className="livescore-mobile min-h-screen bg-[#121212] pb-16">
        {/* Header */}
        <div className="sticky top-0 z-30 bg-[#0a111a] border-b border-gray-800 p-4 flex items-center justify-between">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center text-white"
          >
            Back
          </button>
          
          <div className="text-lg font-bold text-white">
            {league ? league.name : "League Details"}
          </div>
          
          <div className="w-5"></div> {/* Empty div for balanced layout */}
        </div>
        
        {/* Content */}
        <div className="p-2">
          {loading ? (
            <div className="animate-pulse rounded-lg">
              <div className="bg-[#1a1a1a] h-40 rounded-md"></div>
              <div className="p-6 bg-[#1a1a1a] mt-2 rounded-md space-y-4">
                <div className="h-6 bg-[#222] rounded w-1/3"></div>
                <div className="h-4 bg-[#222] rounded w-1/2"></div>
                <div className="h-24 bg-[#222] rounded"></div>
              </div>
            </div>
          ) : error ? (
            <div className="p-12 bg-[#1a1a1a] rounded-lg text-center">
              <h2 className="text-xl font-bold mb-3">Error</h2>
              <p className="text-gray-400 mb-6">{error}</p>
              <Link 
                to="/"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
              >
                View all matches
              </Link>
            </div>
          ) : league ? (
            <>
              {/* League Standings */}
              <div className="bg-[#1a1a1a] rounded-lg overflow-hidden">
                <div className="p-4 border-b border-gray-800">
                  <h2 className="text-lg font-bold">Standings</h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="text-xs font-semibold uppercase text-gray-500 bg-[#222]">
                      <tr>
                        <th className="p-3">#</th>
                        <th className="p-3">Team</th>
                        <th className="p-3">MP</th>
                        <th className="p-3">W</th>
                        <th className="p-3">D</th>
                        <th className="p-3">L</th>
                        <th className="p-3">GF</th>
                        <th className="p-3">GA</th>
                        <th className="p-3">GD</th>
                        <th className="p-3">Pts</th>
                      </tr>
                    </thead>
                    <tbody>
                      {standings.map((team, index) => (
                        <tr key={team.team.id} className="hover:bg-gray-700/20 transition-colors">
                          <td className="p-3">{team.rank}</td>
                          <td className="p-3 flex items-center gap-2">
                            <img src={team.team.logo} alt={team.team.name} className="w-5 h-5 object-contain" />
                            {team.team.name}
                          </td>
                          <td className="p-3">{team.all.played}</td>
                          <td className="p-3">{team.all.win}</td>
                          <td className="p-3">{team.all.draw}</td>
                          <td className="p-3">{team.all.lose}</td>
                          <td className="p-3">{team.all.goals.for}</td>
                          <td className="p-3">{team.all.goals.against}</td>
                          <td className="p-3">{team.goalsDiff}</td>
                          <td className="p-3">{team.points}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              
              {/* Upcoming Matches */}
              <div className="bg-[#1a1a1a] rounded-lg mt-4">
                <div className="p-4 border-b border-gray-800">
                  <h2 className="text-lg font-bold">Upcoming Matches</h2>
                </div>
                <div className="p-4">
                  <p className="text-gray-400">No upcoming matches scheduled.</p>
                </div>
              </div>
            </>
          ) : (
            <div className="p-12 bg-[#1a1a1a] rounded-lg text-center">
              <h2 className="text-2xl font-bold mb-3">League not found</h2>
              <p className="text-gray-400 mb-6">
                The league you are looking for doesn't exist or has been removed.
              </p>
              <Link 
                to="/"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
              >
                View all matches
              </Link>
            </div>
          )}
        </div>
        
        <MobileNavigation />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0c1218] text-white">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row">
          {/* Left Column - Navigation */}
          <div className="md:w-60 bg-[#0a111a] border-r border-gray-800 min-h-screen">
            <Sidebar leagues={topLeagues} loading={topLeagues.length === 0} />
          </div>
          
          {/* Middle Column - Content */}
          <div className="flex-1">
            <div className="p-4">
              {/* League Header */}
              {loading ? (
                <div className="mb-4">
                  <Skeleton className="h-10 w-[200px]" />
                  <Skeleton className="h-6 w-[300px] mt-2" />
                </div>
              ) : error ? (
                <div className="rounded-lg text-center">
                  <h2 className="text-xl font-bold mb-3">Error</h2>
                  <p className="text-muted-foreground mb-6">{error}</p>
                  <Link 
                    to="/"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
                  >
                    View all matches
                  </Link>
                </div>
              ) : league ? (
                <div className="mb-4">
                  <h1 className="text-2xl font-bold">{league.name}</h1>
                  <p className="text-muted-foreground">
                    <Calendar className="inline-block h-4 w-4 mr-1" />
                    Season {league.season}
                  </p>
                </div>
              ) : null}
              
              {/* Navigation Tabs */}
              <Tabs defaultValue={section} className="w-full mb-4">
                <TabsList className="bg-transparent">
                  <TabsTrigger value="standings" className="data-[state=active]:bg-secondary data-[state=active]:text-secondary-foreground">Standings</TabsTrigger>
                  <TabsTrigger value="matches" className="data-[state=active]:bg-secondary data-[state=active]:text-secondary-foreground">Matches</TabsTrigger>
                </TabsList>
                
                {/* Standings Tab */}
                <TabsContent value="standings" className="p-0 pt-4 border-0">
                  {loading ? (
                    <div className="space-y-2">
                      {[...Array(10)].map((_, i) => (
                        <Skeleton key={i} className="h-10" />
                      ))}
                    </div>
                  ) : error ? (
                    <div className="rounded-lg text-center">
                      <h2 className="text-xl font-bold mb-3">Error</h2>
                      <p className="text-muted-foreground mb-6">{error}</p>
                      <Link 
                        to="/"
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
                      >
                        View all matches
                      </Link>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm text-left text-gray-500">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                          <tr>
                            <th className="py-3 px-6">#</th>
                            <th className="py-3 px-6">Team</th>
                            <th className="py-3 px-6">Matches Played</th>
                            <th className="py-3 px-6">Won</th>
                            <th className="py-3 px-6">Drawn</th>
                            <th className="py-3 px-6">Lost</th>
                            <th className="py-3 px-6">Goals For</th>
                            <th className="py-3 px-6">Goals Against</th>
                            <th className="py-3 px-6">Goal Difference</th>
                            <th className="py-3 px-6">Points</th>
                          </tr>
                        </thead>
                        <tbody>
                          {standings.map((team) => (
                            <tr key={team.team.id} className="bg-white border-b hover:bg-gray-100">
                              <td className="py-4 px-6">{team.rank}</td>
                              <td className="py-4 px-6 flex items-center gap-2">
                                <img src={team.team.logo} alt={team.team.name} className="w-6 h-6 object-contain" />
                                {team.team.name}
                              </td>
                              <td className="py-4 px-6">{team.all.played}</td>
                              <td className="py-4 px-6">{team.all.win}</td>
                              <td className="py-4 px-6">{team.all.draw}</td>
                              <td className="py-4 px-6">{team.all.lose}</td>
                              <td className="py-4 px-6">{team.all.goals.for}</td>
                              <td className="py-4 px-6">{team.all.goals.against}</td>
                              <td className="py-4 px-6">{team.goalsDiff}</td>
                              <td className="py-4 px-6">{team.points}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </TabsContent>
                
                {/* Matches Tab */}
                <TabsContent value="matches" className="p-0 pt-4 border-0">
                  <div>
                    <p>Matches content will be here.</p>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
          
          {/* Right Column - Ads */}
          <div className="md:w-60 bg-[#0a111a] border-l border-gray-800">
            <div className="p-4 text-center text-gray-400 text-sm">
              Advertisement
            </div>
            {/* Ad placeholders */}
            <div className="h-[300px] mx-4 mb-4 bg-gray-800 rounded flex items-center justify-center">
              <span className="text-gray-500">Ad Space</span>
            </div>
            <div className="h-[300px] mx-4 mb-4 bg-gray-800 rounded flex items-center justify-center">
              <span className="text-gray-500">Ad Space</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaguePage;
