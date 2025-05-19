
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Search, X } from "lucide-react";
import { searchMatchesByTeam } from "@/utils/api";
import { Match } from "@/types/football";
import { MatchCard } from "@/components/MatchCard";
import { MobileNavigation } from "@/components/MobileNavigation";
import { useToast } from "@/hooks/use-toast";

const SearchPage = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Match[]>([]);
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);
  const { toast } = useToast();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!query.trim() || query.trim().length < 3) {
      toast({
        title: "Search query too short",
        description: "Please enter at least 3 characters",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    setSearching(true);
    
    try {
      const matches = await searchMatchesByTeam(query);
      setResults(matches);
    } catch (error) {
      console.error("Error searching matches:", error);
      toast({
        title: "Error searching matches",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  const clearSearch = () => {
    setQuery("");
    setResults([]);
    setSearching(false);
  };

  return (
    <div className="livescore-mobile min-h-screen pb-16">
      <div className="livescore-header flex items-center justify-between p-2">
        <button 
          onClick={() => navigate(-1)}
          className="p-2"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        
        <div className="text-lg font-bold flex-1 text-center">
          Search
        </div>
        
        <div className="w-9"></div> {/* Empty div for balanced layout */}
      </div>
      
      <div className="p-4">
        <form onSubmit={handleSearch} className="relative mb-6">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for team or competition"
            className="w-full bg-[#1a1a1a] border border-gray-700 text-sm rounded-full pl-10 pr-10 py-3 focus:outline-none focus:border-blue-500 transition-colors"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          
          {query && (
            <button 
              type="button" 
              onClick={clearSearch}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </form>
        
        <div className="mobile-content-area">
          {loading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-16 bg-[#1a1a1a] rounded-md"></div>
                </div>
              ))}
            </div>
          ) : searching ? (
            results.length > 0 ? (
              <div>
                <h2 className="text-sm text-gray-400 mb-2">Search results for "{query}":</h2>
                {results.map((match) => (
                  <MatchCard key={match.fixture.id} match={match} isMobile={true} />
                ))}
              </div>
            ) : (
              <div className="text-center p-8">
                <h2 className="text-lg font-bold mb-2">No matches found</h2>
                <p className="text-gray-400">
                  No results found for "{query}"
                </p>
              </div>
            )
          ) : (
            <div className="text-center py-12">
              <Search className="h-12 w-12 text-gray-500 mx-auto mb-4" />
              <p className="text-gray-400">
                Search for teams, competitions or countries
              </p>
            </div>
          )}
        </div>
      </div>
      
      <MobileNavigation />
    </div>
  );
};

export default SearchPage;
