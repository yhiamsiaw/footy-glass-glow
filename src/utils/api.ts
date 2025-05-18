import { ApiResponse, Match, MatchDetails, TopLeague, FixtureStatus } from "../types/football";
import { toast } from "@/hooks/use-toast";
import { ApiCache } from "./apiCache";

const BASE_URL = "https://v3.football.api-sports.io";
const API_KEY = "3ce4814889a3a7f737acd626e6271630";

/**
 * Base fetch function with API headers
 */
const fetchFromApi = async <T>(endpoint: string, endpointType: string = 'default'): Promise<T> => {
  try {
    // Check if we can make this request based on rate limits
    if (!ApiCache.canMakeRequest(endpointType)) {
      console.warn(`API rate limit reached for ${endpointType}`);
      throw new Error(`API rate limit reached. Please try again later.`);
    }
    
    // Track this request
    ApiCache.trackRequest(endpointType);
    
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: "GET",
      headers: {
        "x-apisports-key": API_KEY,
      },
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("API request error:", error);
    toast({
      title: "Error fetching data",
      description: "Please try again later",
      variant: "destructive",
    });
    throw error;
  }
};

/**
 * Get live matches
 */
export const getLiveMatches = async (): Promise<Match[]> => {
  const data = await fetchFromApi<ApiResponse<Match[]>>("/fixtures?live=all", "live");
  return data.response;
};

/**
 * Get fixtures by date (YYYY-MM-DD format)
 */
export const getFixturesByDate = async (date: string): Promise<Match[]> => {
  const data = await fetchFromApi<ApiResponse<Match[]>>(`/fixtures?date=${date}`, "fixtures");
  return data.response;
};

/**
 * Get match details by ID
 */
export const getMatchDetails = async (fixtureId: number): Promise<MatchDetails> => {
  // Check cache first
  const cacheKey = `match_${fixtureId}`;
  const cachedData = ApiCache.get(cacheKey);
  
  if (cachedData && Date.now() - ApiCache.getTimestamp(cacheKey) < 60000) { // 1 minute cache
    return cachedData as MatchDetails;
  }
  
  const [fixtureData, lineups, events, stats] = await Promise.all([
    fetchFromApi<ApiResponse<Match[]>>(`/fixtures?id=${fixtureId}`, "fixtures"),
    fetchFromApi<ApiResponse<any[]>>(`/fixtures/lineups?fixture=${fixtureId}`, "fixtures"),
    fetchFromApi<ApiResponse<any[]>>(`/fixtures/events?fixture=${fixtureId}`, "fixtures"),
    fetchFromApi<ApiResponse<any[]>>(`/fixtures/statistics?fixture=${fixtureId}`, "fixtures"),
  ]);

  // Merge all the data into a single MatchDetails object
  const matchDetails: MatchDetails = {
    ...fixtureData.response[0],
    lineups: lineups.response,
    events: events.response,
    statistics: stats.response,
  };
  
  // Cache the result
  ApiCache.set(cacheKey, matchDetails, 60000); // Cache for 1 minute
  
  return matchDetails;
};

/**
 * Get top leagues data
 */
export const getTopLeagues = async (): Promise<TopLeague[]> => {
  // These are the IDs for the top leagues we want to display
  const leagueIds = [
    39, // Premier League
    140, // La Liga
    78, // Bundesliga
    135, // Serie A
    61, // Ligue 1
    2, // Champions League
  ];
  
  const cacheKey = 'topLeagues';
  const cachedData = ApiCache.get(cacheKey);
  
  if (cachedData && Date.now() - ApiCache.getTimestamp(cacheKey) < 24 * 60 * 60 * 1000) { // 24 hour cache
    return cachedData as TopLeague[];
  }
  
  const data = await fetchFromApi<ApiResponse<any[]>>(`/leagues?id=${leagueIds.join(',')}`, "leagues");
  
  const leagues: TopLeague[] = data.response.map(item => ({
    id: item.league.id,
    name: item.league.name,
    logo: item.league.logo,
    country: item.country.name,
    flag: item.country.flag,
  }));
  
  // Cache the result
  ApiCache.set(cacheKey, leagues, 24 * 60 * 60 * 1000); // Cache for 24 hours
  
  return leagues;
};

/**
 * Search matches by team name
 */
export const searchMatchesByTeam = async (teamName: string): Promise<Match[]> => {
  const data = await fetchFromApi<ApiResponse<Match[]>>(`/fixtures?team=${teamName}`, "fixtures");
  return data.response;
};

/**
 * Get league standings
 */
export const getLeagueStandings = async (leagueId: number, season: number = 2024): Promise<any> => {
  const cacheKey = `standings_${leagueId}_${season}`;
  const cachedData = ApiCache.get(cacheKey);
  
  if (cachedData && Date.now() - ApiCache.getTimestamp(cacheKey) < 6 * 60 * 60 * 1000) { // 6 hour cache
    return cachedData;
  }
  
  const data = await fetchFromApi<ApiResponse<any[]>>(
    `/standings?league=${leagueId}&season=${season}`, 
    "leagues"
  );
  
  // Cache the result
  ApiCache.set(cacheKey, data.response, 6 * 60 * 60 * 1000); // Cache for 6 hours
  
  return data.response;
};

/**
 * Format match date to local time
 */
export const formatMatchTime = (timestamp: number): string => {
  return new Date(timestamp * 1000).toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit' 
  });
};

/**
 * Get today's date in YYYY-MM-DD format
 */
export const getTodayDate = (): string => {
  const today = new Date();
  return today.toISOString().split('T')[0];
};

/**
 * Helper to determine match status badge type
 */
export const getMatchStatusType = (status: string, elapsed?: number): FixtureStatus => {
  const shortStatus = status.toUpperCase();
  
  if (shortStatus === "NS" || shortStatus === "TBD" || shortStatus === "SUSP") return "UPCOMING";
  if (shortStatus === "FT" || shortStatus === "AET" || shortStatus === "PEN") return "FT";
  if ((shortStatus === "1H" || shortStatus === "2H") && elapsed) return "LIVE";
  if (shortStatus === "HT") return "HT";
  
  return "UPCOMING";
};
