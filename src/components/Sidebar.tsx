
import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, Home, Info, List } from "lucide-react";
import { TopLeague } from "@/types/football";
import { cn } from "@/lib/utils";

interface SidebarProps {
  leagues: TopLeague[];
  loading: boolean;
}

export const Sidebar = ({ leagues, loading }: SidebarProps) => {
  const [collapsed, setCollapsed] = useState(false);

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const menuItems = [
    { name: "Home", icon: <Home className="h-5 w-5" />, path: "/" },
    { name: "About Us", icon: <Info className="h-5 w-5" />, path: "/about" },
    { name: "Contact Us", icon: <List className="h-5 w-5" />, path: "/contact" },
  ];

  return (
    <div className={cn(
      "glass-sidebar h-screen fixed left-0 top-0 z-40 flex flex-col transition-all duration-300",
      collapsed ? "w-16" : "w-64"
    )}>
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        {!collapsed && (
          <h1 className="text-xl font-bold text-primary">
            <Link to="/">LiveScore</Link>
          </h1>
        )}
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-full hover:bg-white/10 transition-colors"
        >
          {collapsed ? (
            <ChevronRight className="h-5 w-5" />
          ) : (
            <ChevronLeft className="h-5 w-5" />
          )}
        </button>
      </div>

      <div className="flex flex-col gap-2 p-3">
        {menuItems.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            className={cn(
              "flex items-center gap-3 p-3 rounded-lg hover:bg-white/10 transition-all",
              collapsed ? "justify-center" : ""
            )}
          >
            {item.icon}
            {!collapsed && <span>{item.name}</span>}
          </Link>
        ))}
      </div>

      <div className="mt-6 border-t border-white/10 pt-4">
        <h2 className={cn(
          "text-sm uppercase text-muted-foreground mb-2",
          collapsed ? "text-center" : "px-4"
        )}>
          {!collapsed && "Top Leagues"}
        </h2>

        <div className="flex flex-col gap-1 p-2">
          {loading ? (
            <div className="flex flex-col gap-2 p-2">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-12 bg-white/5 animate-pulse rounded-lg"></div>
              ))}
            </div>
          ) : (
            leagues.map((league) => (
              <Link
                key={league.id}
                to={`/league/${league.id}`}
                className={cn(
                  "flex items-center gap-3 p-2 rounded-lg hover:bg-white/10 transition-all",
                  collapsed ? "justify-center" : ""
                )}
              >
                <img
                  src={league.logo}
                  alt={league.name}
                  className="h-6 w-6 object-contain"
                />
                {!collapsed && (
                  <span className="text-sm whitespace-nowrap overflow-hidden text-ellipsis">
                    {league.name}
                  </span>
                )}
              </Link>
            ))
          )}
        </div>
      </div>

      <div className="mt-auto p-4 text-center text-xs text-muted-foreground">
        {!collapsed && "© 2025 LiveScore"}
      </div>
    </div>
  );
};
