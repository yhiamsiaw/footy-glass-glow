import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Match, League, TopLeague, FixtureStatus } from "@/types/football";
import { LeagueSection } from "@/components/LeagueSection";
import { MainHeader } from "@/components/MainHeader";
import { Sidebar } from "@/components/Sidebar";
import { getLiveMatches, getTopLeagues, getTodayDate, getFixturesByDate, getMatchStatusType } from "@/utils/api";
import { useToast } from "@/hooks/use-toast";
import { ApiCache } from "@/utils/apiCache";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const Index = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [leagues, setLeagues] = useState<League[]>([]);
  const [topLeagues, setTopLeagues] = useState<TopLeague[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"all" | "live" | "finished" | "scheduled">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<FixtureStatus | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  const { toast } = useToast();

  // Check for mobile viewport
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

  // Priority leagues IDs (top leagues - should match the IDs from getTopLeagues)
  const priorityLeagueIds = [39, 140, 78, 135, 61, 2];

  // Fetch top leagues
  useEffect(() => {
    const fetchTopLeagues = async () => {
      try {
        // Check cache first
        const cachedLeagues = ApiCache.get('topLeagues');
        if (cachedLeagues) {
          setTopLeagues(cachedLeagues as TopLeague[]);
          return;
        }

        const leagues = await getTopLeagues();
        setTopLeagues(leagues);
        
        // Cache the result
        ApiCache.set('topLeagues', leagues, 24 * 60 * 60 * 1000); // Cache for 24 hours
      } catch (error) {
        console.error("Error fetching top leagues:", error);
      }
    };

    fetchTopLeagues();
  }, []);

  // Fetch matches based on active tab
  useEffect(() => {
    const fetchMatches = async () => {
      setLoading(true);
      try {
        let matchesData: Match[] = [];
        let cacheKey = '';

        if (activeTab === "live") {
          cacheKey = 'liveMatches';
          const cachedMatches = ApiCache.get(cacheKey);
          
          if (cachedMatches && Date.now() - ApiCache.getTimestamp(cacheKey) < 60000) { // 1 minute cache for live
            matchesData = cachedMatches as Match[];
          } else {
            matchesData = await getLiveMatches();
            ApiCache.set(cacheKey, matchesData, 60000); // Cache for 1 minute
          }
        } else {
          const todayDate = getTodayDate();
          cacheKey = `fixtures_${todayDate}_${activeTab}`;
          const cachedMatches = ApiCache.get(cacheKey);
          
          if (cachedMatches && Date.now() - ApiCache.getTimestamp(cacheKey) < 300000) { // 5 minutes cache
            matchesData = cachedMatches as Match[];
          } else {
            matchesData = await getFixturesByDate(todayDate);
            ApiCache.set(cacheKey, matchesData, 300000); // Cache for 5 minutes
            
            // Filter based on the active tab
            if (activeTab === "finished") {
              matchesData = matchesData.filter((match) => 
                getMatchStatusType(match.fixture.status.short) === "FT"
              );
            } else if (activeTab === "scheduled") {
              matchesData = matchesData.filter((match) => 
                getMatchStatusType(match.fixture.status.short) === "UPCOMING"
              );
            }
          }
        }

        // Apply status filter if any
        if (statusFilter) {
          matchesData = matchesData.filter((match) => 
            getMatchStatusType(match.fixture.status.short, match.fixture.status.elapsed) === statusFilter
          );
        }

        // Apply search query if any
        if (searchQuery) {
          const query = searchQuery.toLowerCase();
          matchesData = matchesData.filter((match) => 
            match.teams.home.name.toLowerCase().includes(query) || 
            match.teams.away.name.toLowerCase().includes(query) ||
            match.league.name.toLowerCase().includes(query) ||
            match.league.country.toLowerCase().includes(query)
          );
        }

        setMatches(matchesData);

        // Group matches by league
        const uniqueLeagues: Map<number, League> = new Map();
        matchesData.forEach((match) => {
          if (!uniqueLeagues.has(match.league.id)) {
            uniqueLeagues.set(match.league.id, match.league);
          }
        });
        setLeagues(Array.from(uniqueLeagues.values()));

        setLoading(false);
      } catch (error) {
        console.error("Error fetching matches:", error);
        toast({
          title: "Error fetching matches",
          description: "Please try again later",
          variant: "destructive",
        });
        setLoading(false);
      }
    };

    fetchMatches();

    // Set up auto-refresh for live matches
    let interval: number | undefined;
    if (activeTab === "live") {
      interval = window.setInterval(fetchMatches, 60000); // Refresh every minute
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [activeTab, searchQuery, statusFilter, toast]);

  // Group matches by league
  const matchesByLeague = leagues.map(league => {
    const isPriority = priorityLeagueIds.includes(league.id);
    return {
      league,
      matches: matches.filter(match => match.league.id === league.id),
      isPriority
    };
  });

  // Sort leagues to show priority leagues first
  const sortedMatchesByLeague = [...matchesByLeague].sort((a, b) => {
    if (a.isPriority && !b.isPriority) return -1;
    if (!a.isPriority && b.isPriority) return 1;
    return 0;
  });

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleStatusFilter = (status: FixtureStatus | null) => {
    setStatusFilter(status);
  };

  const currentDate = new Date().toLocaleDateString('en-US', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit'
  });

  return (
    <div className="min-h-screen bg-[#0c1218] text-white">
      {/* Header for all sizes */}
      <MainHeader onSearch={handleSearch} onStatusFilter={handleStatusFilter} />
      
      <div className="flex flex-col md:flex-row max-w-6xl mx-auto">
        {/* Left Column - Navigation (hidden on mobile) */}
        {!isMobile && (
          <div className="hidden md:block md:w-60 bg-[#0a111a] border-r border-gray-800 min-h-screen">
            <Sidebar leagues={topLeagues} loading={topLeagues.length === 0} />
          </div>
        )}

        {/* Mobile Navigation */}
        <div className="md:hidden sticky top-0 z-20 bg-[#0a111a] border-b border-gray-800">
          <div className="flex justify-between items-center p-2">
            <Sheet>
              <SheetTrigger asChild>
                <button className="p-2 rounded-md bg-gray-800 hover:bg-gray-700">
                  <Menu className="h-6 w-6" />
                </button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[250px] bg-[#0a111a] border-r border-gray-800 p-0">
                <div className="h-full overflow-auto">
                  <Sidebar leagues={topLeagues} loading={topLeagues.length === 0} />
                </div>
              </SheetContent>
            </Sheet>

            <div className="flex items-center px-2">
              <span className="text-xs text-gray-400">{currentDate}</span>
            </div>
          </div>
          
          {/* Tab navigation for mobile */}
          <div className="flex border-b border-gray-800 overflow-x-auto">
            <button 
              className={`px-4 py-2.5 text-xs font-medium whitespace-nowrap ${activeTab === 'all' ? 'text-white border-b-2 border-blue-500' : 'text-gray-400'}`}
              onClick={() => setActiveTab("all")}
            >
              ALL
            </button>
            <button 
              className={`px-4 py-2.5 text-xs font-medium whitespace-nowrap ${activeTab === 'live' ? 'text-white border-b-2 border-blue-500' : 'text-gray-400'}`}
              onClick={() => setActiveTab("live")}
            >
              LIVE
            </button>
            <button 
              className={`px-4 py-2.5 text-xs font-medium whitespace-nowrap ${activeTab === 'finished' ? 'text-white border-b-2 border-blue-500' : 'text-gray-400'}`}
              onClick={() => setActiveTab("finished")}
            >
              FINISHED
            </button>
            <button 
              className={`px-4 py-2.5 text-xs font-medium whitespace-nowrap ${activeTab === 'scheduled' ? 'text-white border-b-2 border-blue-500' : 'text-gray-400'}`}
              onClick={() => setActiveTab("scheduled")}
            >
              SCHEDULED
            </button>
          </div>
        </div>
        
        {/* Middle Column - Content */}
        <div className="flex-1">
          {/* Tab navigation for desktop */}
          <div className="hidden md:block sticky top-0 z-10 bg-[#0c1218] border-b border-gray-800">
            <div className="flex border-b border-gray-800">
              <button 
                className={`px-4 py-2.5 text-xs font-medium ${activeTab === 'all' ? 'text-white border-b-2 border-blue-500' : 'text-gray-400'}`}
                onClick={() => setActiveTab("all")}
              >
                ALL
              </button>
              <button 
                className={`px-4 py-2.5 text-xs font-medium ${activeTab === 'live' ? 'text-white border-b-2 border-blue-500' : 'text-gray-400'}`}
                onClick={() => setActiveTab("live")}
              >
                LIVE
              </button>
              <button 
                className={`px-4 py-2.5 text-xs font-medium ${activeTab === 'finished' ? 'text-white border-b-2 border-blue-500' : 'text-gray-400'}`}
                onClick={() => setActiveTab("finished")}
              >
                FINISHED
              </button>
              <button 
                className={`px-4 py-2.5 text-xs font-medium ${activeTab === 'scheduled' ? 'text-white border-b-2 border-blue-500' : 'text-gray-400'}`}
                onClick={() => setActiveTab("scheduled")}
              >
                SCHEDULED
              </button>
              
              <div className="ml-auto px-4 py-2 flex items-center">
                <span className="text-xs text-gray-400">{currentDate}</span>
              </div>
            </div>
          </div>
          
          {/* Match content */}
          <div className="py-4 px-2">
            {loading ? (
              <div className="space-y-4 p-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-8 bg-gray-800 rounded mb-2"></div>
                    <div className="space-y-2">
                      {[...Array(3)].map((_, j) => (
                        <div key={j} className="h-12 bg-gray-800 rounded"></div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : matches.length > 0 ? (
              sortedMatchesByLeague.map(({ league, matches, isPriority }) => (
                <LeagueSection 
                  key={league.id} 
                  league={league} 
                  matches={matches} 
                  isPriority={isPriority}
                />
              ))
            ) : (
              <div className="p-8 text-center">
                <h2 className="text-lg font-bold mb-2">No matches found</h2>
                <p className="text-gray-400">
                  {activeTab === "live" ? "There are no live matches currently in progress." : 
                   activeTab === "scheduled" ? "There are no upcoming matches today." :
                   activeTab === "finished" ? "There are no finished matches for today." :
                   "There are no matches available."}
                </p>
                {searchQuery && (
                  <p className="mt-2 text-blue-400">
                    No results found for "{searchQuery}"
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
        
        {/* Right Column - Ads (hidden on mobile) */}
        <div className="hidden md:block md:w-60 bg-[#0a111a] border-l border-gray-800">
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
  );
};

export default Index;
