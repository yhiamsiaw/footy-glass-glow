
export interface League {
  id: number;
  name: string;
  country: string;
  logo: string;
  flag: string;
  season: number;
  round?: string;
}

export interface Team {
  id: number;
  name: string;
  logo: string;
  winner?: boolean;
}

export interface Goals {
  home: number | null;
  away: number | null;
}

export interface Score {
  halftime: Goals;
  fulltime: Goals;
  extratime: Goals;
  penalty: Goals;
}

export interface Status {
  long: string;
  short: string;
  elapsed?: number;
}

export type FixtureStatus = 'LIVE' | 'HT' | 'FT' | 'UPCOMING' | 'CANCELED';

export interface Fixture {
  id: number;
  referee: string | null;
  timezone: string;
  date: string;
  timestamp: number;
  venue: {
    id: number | null;
    name: string | null;
    city: string | null;
  };
  status: Status;
}

export interface Match {
  fixture: Fixture;
  league: League;
  teams: {
    home: Team;
    away: Team;
  };
  goals: Goals;
  score: Score;
}

export interface Player {
  id: number;
  name: string;
  number: number;
  pos: string;
  grid: string | null;
}

export interface Lineup {
  team: Team;
  formation: string;
  startXI: Array<{ player: Player }>;
  substitutes: Array<{ player: Player }>;
  coach: {
    id: number;
    name: string;
    photo: string;
  };
}

export interface MatchStatistic {
  team: Team;
  statistics: Array<{
    type: string;
    value: number | string | null;
  }>;
}

export type EventType = 'Goal' | 'Card' | 'Subst';

export interface MatchEvent {
  time: {
    elapsed: number;
    extra: number | null;
  };
  team: Team;
  player: {
    id: number;
    name: string;
  };
  assist: {
    id: number | null;
    name: string | null;
  };
  type: EventType;
  detail: string;
  comments: string | null;
}

export interface MatchDetails {
  fixture: Fixture;
  league: League;
  teams: {
    home: Team;
    away: Team;
  };
  goals: Goals;
  score: Score;
  events: MatchEvent[];
  lineups: Lineup[];
  statistics: MatchStatistic[];
}

export interface ApiResponse<T> {
  get: string;
  parameters: Record<string, string>;
  errors: string[];
  results: number;
  paging: {
    current: number;
    total: number;
  };
  response: T;
}

export interface TopLeague {
  id: number;
  name: string;
  logo: string;
  country: string;
}
