
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronLeft, ChevronRight, Home, Info, Mail } from "lucide-react";
import { TopLeague } from "@/types/football";
import { cn } from "@/lib/utils";
import { LogoFallback } from "@/components/LogoFallback";

interface SidebarProps {
  leagues: TopLeague[];
  loading: boolean;
}

export const Sidebar = ({ leagues, loading }: SidebarProps) => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const menuItems = [
    { name: "Home", icon: <Home className="h-5 w-5" />, path: "/" },
    { name: "About Us", icon: <Info className="h-5 w-5" />, path: "/about" },
    { name: "Contact Us", icon: <Mail className="h-5 w-5" />, path: "/contact" },
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between p-4 border-b border-gray-800">
        {!collapsed && (
          <div className="text-lg font-bold">
            <span className="text-gray-300">Top</span>
            <span className="text-blue-500"> Leagues</span>
          </div>
        )}
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-full hover:bg-white/10 transition-colors ml-auto"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <ChevronRight className="h-5 w-5" />
          ) : (
            <ChevronLeft className="h-5 w-5" />
          )}
        </button>
      </div>

      <div className="flex flex-col gap-1 p-3">
        {menuItems.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            className={cn(
              "flex items-center gap-3 p-3 rounded-lg transition-all",
              isActive(item.path) 
                ? "bg-blue-600/20 text-blue-400" 
                : "hover:bg-white/10 text-gray-300 hover:text-white",
              collapsed ? "justify-center" : ""
            )}
          >
            {item.icon}
            {!collapsed && <span>{item.name}</span>}
          </Link>
        ))}
      </div>

      <div className="mt-6 border-t border-gray-800 pt-4 flex-1 overflow-y-auto">
        {!collapsed && (
          <h2 className="text-xs uppercase font-medium text-gray-400 mb-2 px-4">
            Top Leagues
          </h2>
        )}

        <div className="flex flex-col gap-1 p-2">
          {loading ? (
            <div className="flex flex-col gap-2 p-2">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-10 bg-gray-800 animate-pulse rounded-lg"></div>
              ))}
            </div>
          ) : (
            leagues.map((league) => {
              const [logoError, setLogoError] = useState(false);
              return (
                <Link
                  key={league.id}
                  to={`/league/${league.id}`}
                  className={cn(
                    "flex items-center gap-3 p-3 rounded-lg transition-all",
                    location.pathname.includes(`/league/${league.id}`) 
                      ? "bg-blue-600/20 text-blue-400" 
                      : "hover:bg-white/10 text-gray-300 hover:text-white",
                    collapsed ? "justify-center" : ""
                  )}
                >
                  {logoError ? (
                    <LogoFallback className="h-6 w-6" teamName={league.name} />
                  ) : (
                    <img
                      src={league.logo}
                      alt={league.name}
                      className="h-6 w-6 object-contain"
                      onError={() => setLogoError(true)}
                    />
                  )}
                  {!collapsed && (
                    <div className="overflow-hidden">
                      <p className="text-sm whitespace-nowrap overflow-hidden text-ellipsis">
                        {league.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {league.country}
                      </p>
                    </div>
                  )}
                </Link>
              );
            })
          )}
        </div>
      </div>

      <div className="mt-auto p-4 text-center text-xs text-gray-500 border-t border-gray-800">
        {!collapsed && "© 2025 LiveScore"}
      </div>
    </div>
  );
};
