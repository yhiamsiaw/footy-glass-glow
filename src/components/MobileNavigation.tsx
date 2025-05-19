
import { Home, Star, Search } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export const MobileNavigation = () => {
  const location = useLocation();
  const path = location.pathname;
  
  return (
    <nav className="fixed bottom-0 left-0 right-0 flex items-center justify-around bg-[#0a111a] border-t border-gray-800 py-3 z-30">
      <Link to="/" className={`flex flex-col items-center ${path === '/' ? 'text-blue-500' : 'text-gray-400'}`}>
        <Home className="h-5 w-5 mb-1" />
        <span className="text-xs">Scores</span>
      </Link>
      
      <Link to="/favorites" className={`flex flex-col items-center ${path === '/favorites' ? 'text-blue-500' : 'text-gray-400'}`}>
        <Star className="h-5 w-5 mb-1" />
        <span className="text-xs">Favorites</span>
      </Link>
      
      <Link to="/search" className={`flex flex-col items-center ${path === '/search' ? 'text-blue-500' : 'text-gray-400'}`}>
        <Search className="h-5 w-5 mb-1" />
        <span className="text-xs">Search</span>
      </Link>
    </nav>
  );
};
