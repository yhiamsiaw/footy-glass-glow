
import axios from "axios";
import { ApiResponse, Match, MatchDetails, TopLeague } from "@/types/football";

const API_KEY = "483ba1cf5072a6dbf7d1d7ca6e2ffc56"; // Updated API key
const API_BASE_URL = "https://v3.football.api-sports.io";

// Configure axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "x-apisports-key": API_KEY,
  },
});

// Get today's date in YYYY-MM-DD format
export const getTodayDate = () => {
  const today = new Date();
  return today.toISOString().split("T")[0];
};

// Get match status type from API status
export const getMatchStatusType = (
  status: string,
  elapsed?: number
): "LIVE" | "FT" | "UPCOMING" | "HT" => {
  switch (status) {
    case "1H":
    case "2H":
    case "ET":
    case "P":
    case "BT":
    case "SUSP":
    case "INT":
    case "LIVE":
      return "LIVE";
    case "HT":
    case "BREAK":
      return "HT";
    case "FT":
    case "AET":
    case "PEN":
    case "CANC":
    case "ABD":
    case "AWD":
    case "WO":
      return "FT";
    default:
      return "UPCOMING";
  }
};

// Get live matches
export const getLiveMatches = async (): Promise<Match[]> => {
  try {
    const response = await apiClient.get<ApiResponse<Match[]>>("/fixtures", {
      params: {
        live: "all",
      },
    });
    return response.data.response;
  } catch (error) {
    console.error("Error fetching live matches:", error);
    return [];
  }
};

// Get fixtures by date
export const getFixturesByDate = async (date: string): Promise<Match[]> => {
  try {
    const response = await apiClient.get<ApiResponse<Match[]>>("/fixtures", {
      params: {
        date,
      },
    });
    return response.data.response;
  } catch (error) {
    console.error("Error fetching fixtures by date:", error);
    return [];
  }
};

// Get match details
export const getMatchDetails = async (
  fixtureId: number
): Promise<MatchDetails> => {
  try {
    // Fetch fixture details
    const fixtureResponse = await apiClient.get<ApiResponse<Match[]>>(
      "/fixtures",
      {
        params: {
          id: fixtureId,
        },
      }
    );
    
    // Fetch fixture events
    const eventsResponse = await apiClient.get<ApiResponse<any[]>>(
      "/fixtures/events",
      {
        params: {
          fixture: fixtureId,
        },
      }
    );
    
    // Fetch lineups
    const lineupsResponse = await apiClient.get<ApiResponse<any[]>>(
      "/fixtures/lineups",
      {
        params: {
          fixture: fixtureId,
        },
      }
    );
    
    // Fetch statistics
    const statisticsResponse = await apiClient.get<ApiResponse<any[]>>(
      "/fixtures/statistics",
      {
        params: {
          fixture: fixtureId,
        },
      }
    );
    
    // Combine all data into a MatchDetails object
    const fixtureData = fixtureResponse.data.response[0];
    const matchDetails: MatchDetails = {
      ...fixtureData,
      events: eventsResponse.data.response,
      lineups: lineupsResponse.data.response,
      statistics: statisticsResponse.data.response,
    };
    
    return matchDetails;
  } catch (error) {
    console.error("Error fetching match details:", error);
    throw error;
  }
};

// Get top leagues
export const getTopLeagues = async (): Promise<TopLeague[]> => {
  try {
    const topLeagueIds = [39, 140, 78, 135, 61, 2, 3, 848]; // Top leagues IDs
    
    const response = await apiClient.get<ApiResponse<any[]>>("/leagues", {
      params: {
        current: true,
      },
    });
    
    const leagues = response.data.response
      .filter((league) => topLeagueIds.includes(league.league.id))
      .map((league) => ({
        id: league.league.id,
        name: league.league.name,
        logo: league.league.logo,
        country: league.country.name,
        flag: league.country.flag
      }));
    
    return leagues;
  } catch (error) {
    console.error("Error fetching top leagues:", error);
    return [];
  }
};
