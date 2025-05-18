
import { useState } from "react";
import { Search, Calendar, Clock } from "lucide-react";
import { FixtureStatus, getMatchStatusType } from "@/utils/api";

interface SearchBarProps {
  onSearch: (query: string) => void;
  onStatusFilter: (status: FixtureStatus | null) => void;
}

export const SearchBar = ({ onSearch, onStatusFilter }: SearchBarProps) => {
  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<FixtureStatus | null>(null);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };
  
  const setFilter = (filter: FixtureStatus | null) => {
    setActiveFilter(filter);
    onStatusFilter(filter);
  };

  return (
    <div className="glass p-3 rounded-lg mb-6 animate-fade-in">
      <form onSubmit={handleSearch} className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search for team or competition..."
            className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-1 focus:ring-football-blue"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <button type="submit" className="bg-football-blue hover:bg-football-blue/80 text-white px-4 py-2 rounded-lg transition-colors">
          Search
        </button>
      </form>
      
      <div className="flex items-center gap-2 mt-3 overflow-x-auto pb-1">
        <span className="text-sm text-muted-foreground">Filter:</span>
        <button 
          className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm transition-colors ${
            activeFilter === null ? "bg-white/20" : "bg-white/5 hover:bg-white/10"
          }`}
          onClick={() => setFilter(null)}
        >
          <Calendar className="h-3 w-3" />
          All
        </button>
        <button 
          className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm transition-colors ${
            activeFilter === "LIVE" ? "bg-football-status-live/30" : "bg-white/5 hover:bg-white/10"
          }`}
          onClick={() => setFilter("LIVE")}
        >
          <Clock className="h-3 w-3 animate-pulse" />
          Live
        </button>
        <button 
          className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm transition-colors ${
            activeFilter === "UPCOMING" ? "bg-football-status-upcoming/30" : "bg-white/5 hover:bg-white/10"
          }`}
          onClick={() => setFilter("UPCOMING")}
        >
          <Calendar className="h-3 w-3" />
          Upcoming
        </button>
        <button 
          className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm transition-colors ${
            activeFilter === "FT" ? "bg-football-status-finished/30" : "bg-white/5 hover:bg-white/10"
          }`}
          onClick={() => setFilter("FT")}
        >
          <Calendar className="h-3 w-3" />
          Finished
        </button>
      </div>
    </div>
  );
};
