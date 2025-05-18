
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { MatchDetails } from "@/components/MatchDetails";
import { Sidebar } from "@/components/Sidebar";
import { ChevronLeft } from "lucide-react";
import { getMatchDetails, getTopLeagues } from "@/utils/api";
import { useToast } from "@/hooks/use-toast";
import { ApiCache } from "@/utils/apiCache";

const MatchDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const [match, setMatch] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [topLeagues, setTopLeagues] = useState<any[]>([]);
  const { toast } = useToast();

  // Fetch top leagues for the sidebar
  useEffect(() => {
    const fetchTopLeagues = async () => {
      try {
        // Check cache first
        const cachedLeagues = ApiCache.get('topLeagues');
        if (cachedLeagues) {
          setTopLeagues(cachedLeagues);
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

  // Fetch match details
  useEffect(() => {
    const fetchMatchDetails = async () => {
      if (!id) return;
      
      setLoading(true);
      try {
        const matchId = parseInt(id);
        const cacheKey = `match_${matchId}`;
        
        // Check cache first
        const cachedMatch = ApiCache.get(cacheKey);
        if (cachedMatch && Date.now() - ApiCache.getTimestamp(cacheKey) < 60000) { // 1 minute cache for match details
          setMatch(cachedMatch);
          setLoading(false);
          return;
        }
        
        const matchDetails = await getMatchDetails(matchId);
        setMatch(matchDetails);
        
        // Cache the result
        ApiCache.set(cacheKey, matchDetails, 60000); // Cache for 1 minute
      } catch (error) {
        console.error("Error fetching match details:", error);
        toast({
          title: "Error fetching match details",
          description: "Please try again later",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchMatchDetails();
    
    // Auto-refresh for live matches
    const refreshInterval = setInterval(() => {
      if (match && 
          (match.fixture.status.short === "1H" || 
           match.fixture.status.short === "2H" || 
           match.fixture.status.short === "HT")) {
        fetchMatchDetails();
      }
    }, 60000); // Update every minute for live matches
    
    return () => clearInterval(refreshInterval);
  }, [id, toast]);

  return (
    <div className="min-h-screen bg-[#0c1218] text-white flex">
      {/* Left Column - Navigation */}
      <Sidebar leagues={topLeagues} loading={topLeagues.length === 0} />
      
      {/* Middle Column - Content */}
      <div className="flex-1 ml-60 mr-60">
        <div className="p-4">
          <div className="mb-4">
            <Link 
              to="/" 
              className="inline-flex items-center gap-2 px-4 py-2 bg-gray-800/50 rounded-lg hover:bg-gray-800 transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
              Back to matches
            </Link>
          </div>
          
          {loading ? (
            <div className="animate-pulse rounded-lg">
              <div className="bg-gray-800 h-40 rounded-t-lg"></div>
              <div className="p-6 bg-gray-800/50 rounded-b-lg space-y-4">
                <div className="h-6 bg-gray-700 rounded w-1/3"></div>
                <div className="h-4 bg-gray-700 rounded w-1/2"></div>
                <div className="h-24 bg-gray-700 rounded"></div>
              </div>
            </div>
          ) : match ? (
            <MatchDetails match={match} />
          ) : (
            <div className="p-12 bg-gray-800/50 rounded-lg text-center">
              <h2 className="text-2xl font-bold mb-3">Match not found</h2>
              <p className="text-muted-foreground mb-6">
                The match you are looking for doesn't exist or has been removed.
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

export default MatchDetailsPage;
