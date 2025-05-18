
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { MatchDetails } from "@/components/MatchDetails";
import { ChevronLeft } from "lucide-react";
import { getMatchDetails } from "@/utils/api";
import { useToast } from "@/hooks/use-toast";

const MatchDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const [match, setMatch] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchMatchDetails = async () => {
      if (!id) return;
      
      setLoading(true);
      try {
        const matchId = parseInt(id);
        const matchDetails = await getMatchDetails(matchId);
        setMatch(matchDetails);
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
    const interval = setInterval(() => {
      if (match && 
          (match.fixture.status.short === "1H" || 
           match.fixture.status.short === "2H" || 
           match.fixture.status.short === "HT")) {
        fetchMatchDetails();
      }
    }, 60000); // Update every minute for live matches
    
    return () => clearInterval(interval);
  }, [id, toast]);
  
  // Auto-refresh when match is in progress
  useEffect(() => {
    let refreshInterval: number | undefined;
    
    if (match && 
        (match.fixture.status.short === "1H" || 
         match.fixture.status.short === "2H" || 
         match.fixture.status.short === "HT")) {
      refreshInterval = window.setInterval(() => {
        getMatchDetails(parseInt(id!)).then(setMatch);
      }, 60000); // Refresh every minute
    }
    
    return () => {
      if (refreshInterval) clearInterval(refreshInterval);
    };
  }, [match, id]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-football-dark to-football-darker">
      <div className="container mx-auto py-8">
        <div className="mb-6">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 glass px-4 py-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to matches
          </Link>
        </div>
        
        {loading ? (
          <div className="glass animate-pulse rounded-lg h-96"></div>
        ) : match ? (
          <MatchDetails match={match} />
        ) : (
          <div className="glass p-12 rounded-lg text-center">
            <h2 className="text-2xl font-bold mb-3">Match not found</h2>
            <p className="text-muted-foreground mb-6">
              The match you are looking for doesn't exist or has been removed.
            </p>
            <Link 
              to="/"
              className="bg-football-blue hover:bg-football-blue/80 text-white px-6 py-2 rounded-lg transition-colors"
            >
              View all matches
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default MatchDetailsPage;
