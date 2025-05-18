
import { useState, useEffect } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import { Sidebar } from "@/components/Sidebar";
import { LeagueStandings } from "@/components/LeagueStandings";
import { getTopLeagues, getFixturesByDate, getTodayDate } from "@/utils/api";
import { Match, TopLeague } from "@/types/football";
import { Calendar, ChevronLeft, Table } from "lucide-react";
import { MatchCard } from "@/components/MatchCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { ApiCache } from "@/utils/apiCache";

const LeaguePage = () => {
  const { id, section } = useParams<{ id: string, section?: string }>();
  const location = useLocation();
  const [league, setLeague] = useState<TopLeague | null>(null);
  const [matches, setMatches] = useState<Match[]>([]);
  const [topLeagues, setTopLeagues] = useState<TopLeague[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Determine active tab based on URL
  const activeTab = section === "standings" ? "standings" : "matches";
  
  // Get league info
  useEffect(() => {
    const fetchLeagueInfo = async () => {
      if (!id) return;
      
      try {
        // First check if this league is in the top leagues
        const cachedTopLeagues = ApiCache.get('topLeagues');
        let leaguesData: TopLeague[] = [];
        
        if (!cachedTopLeagues) {
          leaguesData = await getTopLeagues();
          setTopLeagues(leaguesData);
        } else {
          leaguesData = cachedTopLeagues as TopLeague[];
          setTopLeagues(leaguesData);
        }
        
        const foundLeague = leaguesData.find(league => league.id === parseInt(id));
        if (foundLeague) {
          setLeague(foundLeague);
        }
      } catch (error) {
        console.error("Error fetching league info:", error);
        toast({
          title: "Error fetching league information",
          description: "Please try again later",
          variant: "destructive",
        });
      }
    };

    fetchLeagueInfo();
  }, [id, toast]);

  // Get league matches
  useEffect(() => {
    const fetchLeagueMatches = async () => {
      if (!id) return;
      
      setLoading(true);
      try {
        const leagueId = parseInt(id);
        const todayDate = getTodayDate();
        
        // Check cache first
        const cacheKey = `league_matches_${leagueId}_${todayDate}`;
        const cachedMatches = ApiCache.get(cacheKey);
        
        if (cachedMatches) {
          setMatches(cachedMatches as Match[]);
          setLoading(false);
          return;
        }
        
        const allMatches = await getFixturesByDate(todayDate);
        const leagueMatches = allMatches.filter(match => match.league.id === leagueId);
        
        setMatches(leagueMatches);
        
        // Cache the result
        ApiCache.set(cacheKey, leagueMatches, 5 * 60 * 1000); // Cache for 5 minutes
      } catch (error) {
        console.error("Error fetching league matches:", error);
        toast({
          title: "Error fetching matches",
          description: "Please try again later",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    if (activeTab === "matches") {
      fetchLeagueMatches();
    } else {
      setLoading(false);
    }
  }, [id, activeTab, toast]);

  return (
    <div className="min-h-screen bg-[#0c1218] text-white flex">
      {/* Left Column - Navigation */}
      <Sidebar leagues={topLeagues} loading={topLeagues.length === 0} />
      
      {/* Middle Column - Content */}
      <div className="flex-1 ml-60 mr-60">
        <div className="p-4">
          <div className="mb-4 flex items-center justify-between">
            <Link 
              to="/" 
              className="inline-flex items-center gap-2 px-4 py-2 bg-gray-800/50 rounded-lg hover:bg-gray-800 transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
              Back to all matches
            </Link>
            
            {league && (
              <div className="flex items-center gap-3">
                <img 
                  src={league.logo} 
                  alt={league.name} 
                  className="h-8 w-8 object-contain"
                />
                <div>
                  <h1 className="text-lg font-bold">{league.name}</h1>
                  <p className="text-xs text-gray-400">{league.country}</p>
                </div>
              </div>
            )}
          </div>
          
          <Tabs value={activeTab} className="w-full">
            <TabsList className="w-full grid grid-cols-2 rounded-none mb-4 bg-gray-900">
              <TabsTrigger 
                value="matches" 
                asChild
                className="data-[state=active]:bg-blue-600/20"
              >
                <Link to={`/league/${id}`} className="flex items-center gap-2 py-2">
                  <Calendar className="h-4 w-4" />
                  <span>Matches</span>
                </Link>
              </TabsTrigger>
              <TabsTrigger 
                value="standings" 
                asChild 
                className="data-[state=active]:bg-blue-600/20"
              >
                <Link to={`/league/${id}/standings`} className="flex items-center gap-2 py-2">
                  <Table className="h-4 w-4" />
                  <span>Standings</span>
                </Link>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="matches" className="bg-gray-900/50 rounded-lg">
              {loading ? (
                <div className="p-4 space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-16 bg-gray-800 animate-pulse rounded-lg"></div>
                  ))}
                </div>
              ) : matches.length > 0 ? (
                <div className="p-3">
                  {matches.map((match) => (
                    <MatchCard key={match.fixture.id} match={match} />
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center">
                  <h2 className="text-lg font-bold mb-2">No matches today</h2>
                  <p className="text-gray-400">
                    There are no matches scheduled for this league today.
                  </p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="standings" className="bg-gray-900/50 rounded-lg">
              {id && <LeagueStandings leagueId={parseInt(id)} />}
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      {/* Right Column - Ads */}
      <div className="w-60 bg-[#0a111a] border-l border-gray-800 min-h-screen fixed right-0 top-0">
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
  );
};

export default LeaguePage;
