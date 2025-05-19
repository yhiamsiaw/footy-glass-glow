
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Match, League, TopLeague, FixtureStatus } from "@/types/football";
import { LeagueSection } from "@/components/LeagueSection";
import { MobileHeader } from "@/components/MobileHeader";
import { MobileFilterTabs } from "@/components/MobileFilterTabs";
import { MobileNavigation } from "@/components/MobileNavigation";
import { Sidebar } from "@/components/Sidebar";
import { MatchCard } from "@/components/MatchCard";
import { getLiveMatches, getTopLeagues, getTodayDate, getFixturesByDate, getMatchStatusType } from "@/utils/api";
import { useToast } from "@/hooks/use-toast";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { LogoFallback } from "@/components/LogoFallback";

const Index = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [leagues, setLeagues] = useState<League[]>([]);
  const [topLeagues, setTopLeagues] = useState<TopLeague[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"all" | "live" | "finished" | "scheduled">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<FixtureStatus | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [selectedDate, setSelectedDate] = useState(getTodayDate());
  const [favoriteMatches] = useLocalStorage<number[]>("favoriteMatches", []);

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
  const priorityLeagueIds = [39, 140, 78, 135, 61, 2, 3, 848];

  // Fetch top leagues
  useEffect(() => {
    const fetchTopLeagues = async () => {
      try {
        const leagues = await getTopLeagues();
        setTopLeagues(leagues);
      } catch (error) {
        console.error("Error fetching top leagues:", error);
      }
    };

    fetchTopLeagues();
  }, []);

  // Fetch matches based on active tab and date
  useEffect(() => {
    const fetchMatches = async () => {
      setLoading(true);
      try {
        let matchesData: Match[] = [];

        if (activeTab === "live") {
          matchesData = await getLiveMatches();
        } else {
          matchesData = await getFixturesByDate(selectedDate);
            
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
  }, [activeTab, searchQuery, statusFilter, selectedDate, toast]);

  // Filter for favorite matches
  const favoriteMatchesList = matches.filter(match => 
    favoriteMatches.includes(match.fixture.id)
  );

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

  const handleDateChange = (date: string) => {
    setSelectedDate(date);
    setActiveTab("all"); // Reset active tab when changing date
  };

  const handleMobileFilterChange = (filter: string) => {
    if (filter === 'all') {
      setActiveTab("all");
      setStatusFilter(null);
    } else if (filter === 'live') {
      setActiveTab("live");
      setStatusFilter("LIVE");
    } else if (filter === 'finished') {
      setActiveTab("finished");
      setStatusFilter("FT");
    } else if (filter === 'scheduled') {
      setActiveTab("scheduled");
      setStatusFilter("UPCOMING");
    }
  };

  // Function to create a league section component for favorites
  const renderFavoritesSection = () => {
    if (favoriteMatchesList.length === 0) return null;
    
    return (
      <div className="mb-4">
        <div className="league-header flex items-center p-3 bg-[#1a1a1a] border-l-2 border-blue-500">
          <div className="w-5 h-5 mr-2 flex items-center justify-center">
            <span className="text-blue-500">★</span>
          </div>
          <div>
            <div className="text-sm font-semibold text-blue-500">Favorites</div>
            <div className="text-xs text-gray-400">Your favorite matches</div>
          </div>
        </div>
        
        {favoriteMatchesList.map((match) => (
          <MatchCard key={`fav-${match.fixture.id}`} match={match} isMobile={isMobile} />
        ))}
      </div>
    );
  };

  const renderDesktopLayout = () => (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row">
        {/* Left Column - Navigation */}
        <div className="md:w-60 bg-[#0a111a] border-r border-gray-800 min-h-screen">
          <Sidebar leagues={topLeagues} loading={topLeagues.length === 0} />
        </div>

        {/* Middle Column - Content */}
        <div className="flex-1">
          {/* Tab navigation for desktop */}
          <div className="sticky top-0 z-10 bg-[#0c1218] border-b border-gray-800">
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
                <span className="text-xs text-gray-400">
                  {new Date(selectedDate).toLocaleDateString('en-US', {
                    day: '2-digit',
                    month: '2-digit',
                    year: '2-digit'
                  })}
                </span>
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
              <>
                {/* Show favorites section first if we have any */}
                {favoriteMatchesList.length > 0 && (
                  <div className="mb-4">
                    <div className="league-header flex items-center p-3 bg-gray-900 hover:bg-gray-800 border-l-2 border-blue-500">
                      <div className="w-5 h-5 mr-2 flex items-center justify-center">
                        <span className="text-yellow-500 fill-yellow-500">★</span>
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-blue-500">Favorites</div>
                        <div className="text-xs text-gray-400">Your favorite matches</div>
                      </div>
                    </div>
                    
                    {favoriteMatchesList.map((match) => (
                      <MatchCard key={`fav-${match.fixture.id}`} match={match} />
                    ))}
                  </div>
                )}
                
                {sortedMatchesByLeague.map(({ league, matches, isPriority }) => (
                  <LeagueSection 
                    key={league.id} 
                    league={league} 
                    matches={matches} 
                    isPriority={isPriority} 
                  />
                ))}
              </>
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
  );

  const renderMobileLayout = () => (
    <div className="livescore-mobile min-h-screen pb-16">
      <MobileHeader onSearch={handleSearch} />
      <MobileFilterTabs onFilterChange={handleMobileFilterChange} />
      
      <div className="mobile-content-area">
        {loading ? (
          <div className="space-y-2 p-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-8 bg-[#1a1a1a] rounded-md mb-1"></div>
                <div className="space-y-2">
                  {[...Array(2)].map((_, j) => (
                    <div key={j} className="h-16 bg-[#1a1a1a] rounded-md"></div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : matches.length > 0 ? (
          <div>
            {/* Show favorites section first if we have any */}
            {renderFavoritesSection()}
            
            {sortedMatchesByLeague.map(({ league, matches }) => (
              <div key={league.id} className="mb-2">
                <div className="league-header flex items-center p-3 bg-[#1a1a1a]">
                  {league.logo ? (
                    <img 
                      src={league.logo} 
                      alt=""
                      className="w-5 h-5 mr-2 object-contain"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        const parent = e.currentTarget.parentElement;
                        if (parent) {
                          const fallback = document.createElement('div');
                          fallback.className = "w-5 h-5 mr-2 bg-gray-800 rounded-full flex items-center justify-center";
                          const icon = document.createElement('span');
                          icon.className = "text-gray-500 text-xs";
                          icon.textContent = league.name.substring(0, 1);
                          fallback.appendChild(icon);
                          parent.insertBefore(fallback, parent.firstChild);
                        }
                      }} 
                    />
                  ) : (
                    <LogoFallback className="w-5 h-5 mr-2" isLeague={true} />
                  )}
                  <div>
                    <div className="text-sm font-semibold">{league.name}</div>
                    <div className="text-xs text-gray-400">{league.country}</div>
                  </div>
                </div>
                
                {matches.map((match) => (
                  <MatchCard key={match.fixture.id} match={match} isMobile={true} />
                ))}
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center">
            <h2 className="text-lg font-bold mb-2">No matches found</h2>
            <p className="text-gray-400">
              {activeTab === "live" ? "There are no live matches currently in progress." : 
               activeTab === "scheduled" ? "There are no upcoming matches for this date." :
               activeTab === "finished" ? "There are no finished matches for this date." :
               "There are no matches available for this date."}
            </p>
            {searchQuery && (
              <p className="mt-2 text-blue-400">
                No results found for "{searchQuery}"
              </p>
            )}
          </div>
        )}
      </div>
      
      <MobileNavigation />
    </div>
  );

  return (
    <>
      {/* Use the right layout based on screen size */}
      {isMobile ? renderMobileLayout() : renderDesktopLayout()}
    </>
  );
};

export default Index;
