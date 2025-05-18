
import { useState, useEffect } from "react";
import { Sidebar } from "@/components/Sidebar";
import { SearchBar } from "@/components/SearchBar";
import { LeagueSection } from "@/components/LeagueSection";
import { Match, League } from "@/types/football";
import { FixtureStatus, getLiveMatches, getTopLeagues, getTodayDate, getFixturesByDate, getMatchStatusType } from "@/utils/api";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [leagues, setLeagues] = useState<League[]>([]);
  const [topLeagues, setTopLeagues] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"live" | "today" | "finished">("live");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<FixtureStatus | null>(null);

  const { toast } = useToast();

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

  // Fetch matches based on active tab
  useEffect(() => {
    const fetchMatches = async () => {
      setLoading(true);
      try {
        let matchesData: Match[];

        if (activeTab === "live") {
          matchesData = await getLiveMatches();
        } else if (activeTab === "today" || activeTab === "finished") {
          const todayDate = getTodayDate();
          matchesData = await getFixturesByDate(todayDate);
          
          // Filter based on the active tab
          if (activeTab === "finished") {
            matchesData = matchesData.filter((match) => 
              getMatchStatusType(match.fixture.status.short) === "FT"
            );
          } else {
            matchesData = matchesData.filter((match) => 
              getMatchStatusType(match.fixture.status.short) !== "FT"
            );
          }
        } else {
          matchesData = [];
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
    return {
      league,
      matches: matches.filter(match => match.league.id === league.id)
    };
  });

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleStatusFilter = (status: FixtureStatus | null) => {
    setStatusFilter(status);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-football-dark to-football-darker">
      <div className="flex">
        <Sidebar leagues={topLeagues} loading={!topLeagues.length} />
        
        <div className="flex-1 pl-64 p-8">
          <h1 className="text-3xl font-bold mb-6 text-football-orange">LiveScore Football</h1>
          
          <div className="flex items-center mb-6 glass p-2 rounded-lg">
            <button 
              className={`flex-1 py-2 px-3 rounded-md transition-colors ${activeTab === "live" ? "bg-football-blue text-white" : "hover:bg-white/10"}`}
              onClick={() => setActiveTab("live")}
            >
              ⚽ Live Matches
            </button>
            <button 
              className={`flex-1 py-2 px-3 rounded-md transition-colors ${activeTab === "today" ? "bg-football-blue text-white" : "hover:bg-white/10"}`}
              onClick={() => setActiveTab("today")}
            >
              🗓️ Today's Fixtures
            </button>
            <button 
              className={`flex-1 py-2 px-3 rounded-md transition-colors ${activeTab === "finished" ? "bg-football-blue text-white" : "hover:bg-white/10"}`}
              onClick={() => setActiveTab("finished")}
            >
              🏁 Finished Matches
            </button>
          </div>
          
          <SearchBar onSearch={handleSearch} onStatusFilter={handleStatusFilter} />
          
          {loading ? (
            <div className="space-y-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-12 bg-white/5 rounded-lg mb-3"></div>
                  <div className="space-y-2">
                    {[...Array(3)].map((_, j) => (
                      <div key={j} className="h-16 bg-white/5 rounded-lg"></div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : matches.length > 0 ? (
            matchesByLeague.map(({ league, matches }) => (
              <LeagueSection key={league.id} league={league} matches={matches} />
            ))
          ) : (
            <div className="glass p-12 rounded-lg text-center animate-fade-in">
              <h2 className="text-2xl font-bold mb-3">No matches found</h2>
              <p className="text-muted-foreground">
                {activeTab === "live" ? "There are no live matches currently in progress." : 
                 activeTab === "today" ? "There are no upcoming matches today." :
                 "There are no finished matches for today."}
              </p>
              {searchQuery && (
                <p className="mt-2 text-football-orange">
                  No results found for "{searchQuery}"
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
