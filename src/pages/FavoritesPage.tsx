
import { useState, useEffect } from "react";
import { Star } from "lucide-react";
import { MobileNavigation } from "@/components/MobileNavigation";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { getMatchDetails } from "@/utils/api";
import { Match } from "@/types/football";
import { MatchCard } from "@/components/MatchCard";
import { useToast } from "@/hooks/use-toast";
import { MobileHeader } from "@/components/MobileHeader";
import { Sidebar } from "@/components/Sidebar";
import { Skeleton } from "@/components/ui/skeleton";

const FavoritesPage = () => {
  const [favoriteMatches] = useLocalStorage<number[]>("favoriteMatches", []);
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
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
  
  useEffect(() => {
    const fetchFavoriteMatches = async () => {
      if (favoriteMatches.length === 0) {
        setLoading(false);
        return;
      }
      
      setLoading(true);
      try {
        const matchPromises = favoriteMatches.map(id => getMatchDetails(id));
        const matchResults = await Promise.all(matchPromises);
        setMatches(matchResults.filter(Boolean)); // Filter out any null values
        console.log("Fetched favorite matches:", matchResults);
      } catch (error) {
        console.error("Error fetching favorite matches:", error);
        toast({
          title: "Error fetching favorite matches",
          description: "Please try again later",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchFavoriteMatches();
  }, [favoriteMatches, toast]);

  // Mobile view
  if (isMobile) {
    return (
      <div className="livescore-mobile min-h-screen pb-16">
        <MobileHeader />
        
        <div className="p-4">
          <div className="mb-4">
            <h1 className="text-xl font-bold mb-2 text-white">Your Favorites</h1>
            <p className="text-sm text-gray-400">
              {matches.length > 0 
                ? `You have ${matches.length} favorite ${matches.length === 1 ? 'match' : 'matches'}`
                : 'Add matches to your favorites by tapping the star icon'}
            </p>
          </div>
          
          {loading ? (
            <div className="space-y-3 p-4">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-16" />
              ))}
            </div>
          ) : matches.length > 0 ? (
            <div className="space-y-2">
              {matches.map((match) => (
                <MatchCard key={match.fixture.id} match={match} isMobile={true} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-[60vh] p-4 text-center bg-[#1a1a1a] rounded-lg">
              <Star className="h-16 w-16 text-gray-600 mb-4" />
              <h2 className="text-lg font-bold mb-2 text-white">No favorites yet</h2>
              <p className="text-gray-400 max-w-xs">
                Add your favorite matches by tapping the star icon next to them.
              </p>
            </div>
          )}
        </div>
        
        <MobileNavigation />
      </div>
    );
  }

  // Desktop view
  return (
    <div className="min-h-screen bg-[#0c1218] text-white">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row">
          {/* Left Column - Navigation */}
          <div className="md:w-60 bg-[#0a111a] border-r border-gray-800 min-h-screen">
            <Sidebar leagues={[]} loading={loading} />
          </div>
          
          {/* Middle Column - Content */}
          <div className="flex-1 p-6">
            <div className="mb-6">
              <h1 className="text-2xl font-bold mb-2">Your Favorite Matches</h1>
              <p className="text-gray-400">
                {matches.length > 0 
                  ? `You have ${matches.length} favorite ${matches.length === 1 ? 'match' : 'matches'}`
                  : 'Add matches to your favorites by clicking the star icon'}
              </p>
            </div>
            
            {loading ? (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-20" />
                ))}
              </div>
            ) : matches.length > 0 ? (
              <div className="bg-[#1a1a1a] rounded-lg overflow-hidden">
                {matches.map((match, index) => (
                  <div key={match.fixture.id} className={index > 0 ? "border-t border-gray-800" : ""}>
                    <MatchCard match={match} isMobile={false} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-[40vh] p-8 text-center bg-[#1a1a1a] rounded-lg">
                <Star className="h-20 w-20 text-gray-600 mb-4" />
                <h2 className="text-xl font-bold mb-2">No favorites yet</h2>
                <p className="text-gray-400 max-w-md mb-6">
                  Add your favorite matches by clicking the star icon next to them to keep track of the games you care about most.
                </p>
                <a href="/" className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-md transition-colors">
                  Browse Matches
                </a>
              </div>
            )}
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

export default FavoritesPage;
