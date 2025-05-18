
import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, Facebook, Twitter, Instagram } from "lucide-react";
import { FixtureStatus, getMatchStatusType } from "@/utils/api";

interface MainHeaderProps {
  onSearch: (query: string) => void;
  onStatusFilter: (status: FixtureStatus | null) => void;
}

export const MainHeader = ({ onSearch, onStatusFilter }: MainHeaderProps) => {
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
    <div className="bg-[#0a111a] border-b border-gray-800 py-3 px-4">
      <div className="flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <Link to="/" className="text-xl font-bold text-white flex items-center">
            <span className="text-blue-500">LIVE</span>
            <span className="text-white">SCORE</span>
          </Link>
        </div>

        {/* Search */}
        <div className="max-w-md flex-1 mx-6">
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              placeholder="Search for team or competition..."
              className="w-full bg-gray-800 border border-gray-700 text-sm rounded-full pl-10 pr-4 py-1.5 focus:outline-none focus:border-blue-500 transition-colors"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          </form>
        </div>

        {/* Filters */}
        <div className="hidden md:flex space-x-2">
          <button 
            className={`px-3 py-1.5 text-xs font-medium rounded-full transition-colors ${
              activeFilter === null ? "bg-blue-600/30 text-blue-300" : "bg-gray-800 text-gray-400 hover:bg-gray-700"
            }`}
            onClick={() => setFilter(null)}
          >
            ALL
          </button>
          <button 
            className={`px-3 py-1.5 text-xs font-medium rounded-full transition-colors ${
              activeFilter === "LIVE" ? "bg-red-600/30 text-red-300" : "bg-gray-800 text-gray-400 hover:bg-gray-700"
            }`}
            onClick={() => setFilter("LIVE")}
          >
            LIVE
          </button>
          <button 
            className={`px-3 py-1.5 text-xs font-medium rounded-full transition-colors ${
              activeFilter === "UPCOMING" ? "bg-blue-600/30 text-blue-300" : "bg-gray-800 text-gray-400 hover:bg-gray-700"
            }`}
            onClick={() => setFilter("UPCOMING")}
          >
            UPCOMING
          </button>
          <button 
            className={`px-3 py-1.5 text-xs font-medium rounded-full transition-colors ${
              activeFilter === "FT" ? "bg-gray-600/30 text-gray-300" : "bg-gray-800 text-gray-400 hover:bg-gray-700"
            }`}
            onClick={() => setFilter("FT")}
          >
            FINISHED
          </button>
        </div>

        {/* Social Icons */}
        <div className="hidden lg:flex items-center space-x-4 ml-4">
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-500 transition-colors">
            <Facebook size={18} />
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-400 transition-colors">
            <Twitter size={18} />
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-pink-500 transition-colors">
            <Instagram size={18} />
          </a>
        </div>
      </div>
    </div>
  );
};
