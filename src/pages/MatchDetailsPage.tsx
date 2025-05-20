
import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { MatchDetails } from "@/components/MatchDetails";
import { Sidebar } from "@/components/Sidebar";
import { ChevronLeft } from "lucide-react";
import { getMatchDetails, getTopLeagues } from "@/utils/api";
import { useToast } from "@/hooks/use-toast";
import { MatchDetails as MatchDetailsType, TopLeague } from "@/types/football";
import { MobileNavigation } from "@/components/MobileNavigation";
import { useLocalStorage } from "@/hooks/use-local-storage";

const MatchDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [match, setMatch] = useState<MatchDetailsType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [topLeagues, setTopLeagues] = useState<TopLeague[]>([]);
  const [isMobile, setIsMobile] = useState(false);
  const { toast } = useToast();
  const [favoriteMatches] = useLocalStorage<number[]>("favoriteMatches", []);
  const isFavorite = id ? favoriteMatches.includes(parseInt(id)) : false;

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

  // Fetch top leagues for the sidebar
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

  // Fetch match details
  useEffect(() => {
    const fetchMatchDetails = async () => {
      if (!id) {
        setError("No match ID provided");
        setLoading(false);
        return;
      }
      
      setLoading(true);
      setError(null);
      
      try {
        console.log("Fetching match details for ID:", id);
        const matchId = parseInt(id);
        const matchDetails = await getMatchDetails(matchId);
        console.log("Match details received:", matchDetails);
        
        if (!matchDetails) {
          console.error("Match details is undefined");
          setError("Failed to load match details");
          setMatch(null);
        } else {
          setMatch(matchDetails);
        }
      } catch (error) {
        console.error("Error fetching match details:", error);
        setError("Error loading match details. Please try again later.");
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
  }, [id, toast]); // Removed match from dependencies to avoid refresh issues

  if (isMobile) {
    return (
      <div className="livescore-mobile min-h-screen bg-[#121212] pb-16">
        <div className="sticky top-0 z-30 bg-[#0a111a] border-b border-gray-800 p-4 flex items-center justify-between">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center text-white"
          >
            <ChevronLeft className="h-5 w-5 mr-1" />
            Back
          </button>
          
          <div className="text-lg font-bold text-white">
            Match Details
          </div>
          
          <div className="w-5"></div> {/* Empty div for balanced layout */}
        </div>
        
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
          ) : match ? (
            <MatchDetails match={match} isFavorite={isFavorite} />
          ) : (
            <div className="p-12 bg-[#1a1a1a] rounded-lg text-center">
              <h2 className="text-2xl font-bold mb-3">Match not found</h2>
              <p className="text-gray-400 mb-6">
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
              {/* Desktop Back Button */}
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
              ) : error ? (
                <div className="p-12 bg-gray-800/50 rounded-lg text-center">
                  <h2 className="text-xl font-bold mb-3">Error</h2>
                  <p className="text-muted-foreground mb-6">{error}</p>
                  <Link 
                    to="/"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
                  >
                    View all matches
                  </Link>
                </div>
              ) : match ? (
                <MatchDetails match={match} isFavorite={isFavorite} />
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

export default MatchDetailsPage;
