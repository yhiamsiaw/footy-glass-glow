
import { useState, useEffect } from "react";
import { Star } from "lucide-react";
import { MobileNavigation } from "@/components/MobileNavigation";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { getMatchDetails } from "@/utils/api";
import { Match } from "@/types/football";
import { MatchCard } from "@/components/MatchCard";
import { useToast } from "@/hooks/use-toast";

const FavoritesPage = () => {
  const [favoriteMatches] = useLocalStorage<number[]>("favoriteMatches", []);
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  
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
        setMatches(matchResults);
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
  
  return (
    <div className="livescore-mobile min-h-screen pb-16">
      <div className="livescore-header flex items-center justify-between">
        <div className="text-xl font-bold text-white flex items-center">
          <span className="text-blue-500">LIVE</span>
          <span className="text-white">SCORE</span>
          <span className="text-xs align-top">™</span>
        </div>
        
        <div className="text-lg font-bold">
          Favorites
        </div>
        
        <div className="w-9"></div> {/* Empty div for balanced layout */}
      </div>
      
      <div className="p-2">
        {loading ? (
          <div className="space-y-3 p-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse bg-[#1a1a1a] h-16 rounded-md"></div>
            ))}
          </div>
        ) : matches.length > 0 ? (
          <div>
            {matches.map((match) => (
              <MatchCard key={match.fixture.id} match={match} isMobile={true} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-[60vh] p-4 text-center">
            <Star className="h-16 w-16 text-gray-600 mb-4" />
            <h2 className="text-lg font-bold mb-2">No favorites yet</h2>
            <p className="text-gray-400 max-w-xs">
              Add your favorite matches by tapping the star icon next to them.
            </p>
          </div>
        )}
      </div>
      
      <MobileNavigation />
    </div>
  );
};

export default FavoritesPage;
