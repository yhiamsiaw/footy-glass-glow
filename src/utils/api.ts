
import { ApiResponse, Match, MatchDetails, TopLeague } from "../types/football";
import { toast } from "@/hooks/use-toast";

const BASE_URL = "https://v3.football.api-sports.io";
const API_KEY = "3ce4814889a3a7f737acd626e6271630";

/**
 * Base fetch function with API headers
 */
const fetchFromApi = async <T>(endpoint: string): Promise<T> => {
  try {
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
  const data = await fetchFromApi<ApiResponse<Match[]>>("/fixtures?live=all");
  return data.response;
};

/**
 * Get fixtures by date (YYYY-MM-DD format)
 */
export const getFixturesByDate = async (date: string): Promise<Match[]> => {
  const data = await fetchFromApi<ApiResponse<Match[]>>(`/fixtures?date=${date}`);
  return data.response;
};

/**
 * Get match details by ID
 */
export const getMatchDetails = async (fixtureId: number): Promise<MatchDetails> => {
  const [fixtureData, lineups, events, stats] = await Promise.all([
    fetchFromApi<ApiResponse<Match[]>>(`/fixtures?id=${fixtureId}`),
    fetchFromApi<ApiResponse<any[]>>(`/fixtures/lineups?fixture=${fixtureId}`),
    fetchFromApi<ApiResponse<any[]>>(`/fixtures/events?fixture=${fixtureId}`),
    fetchFromApi<ApiResponse<any[]>>(`/fixtures/statistics?fixture=${fixtureId}`),
  ]);

  // Merge all the data into a single MatchDetails object
  return {
    ...fixtureData.response[0],
    lineups: lineups.response,
    events: events.response,
    statistics: stats.response,
  };
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
  
  const data = await fetchFromApi<ApiResponse<any[]>>(`/leagues?id=${leagueIds.join(',')}`);
  
  return data.response.map(item => ({
    id: item.league.id,
    name: item.league.name,
    logo: item.league.logo,
    country: item.country.name,
  }));
};

/**
 * Search matches by team name
 */
export const searchMatchesByTeam = async (teamName: string): Promise<Match[]> => {
  const data = await fetchFromApi<ApiResponse<Match[]>>(`/fixtures?team=${teamName}`);
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

// This type wasn't declared above, define it here
export type FixtureStatus = "LIVE" | "HT" | "FT" | "UPCOMING" | "CANCELED";
