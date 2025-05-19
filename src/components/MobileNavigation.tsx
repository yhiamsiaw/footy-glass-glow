
import { Home, Star, Search } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export const MobileNavigation = () => {
  const location = useLocation();
  const path = location.pathname;
  
  return (
    <nav className="mobile-bottom-nav">
      <Link to="/" className={`nav-item ${path === '/' ? 'active' : ''}`}>
        <Home className="h-5 w-5" />
        <span>Scores</span>
      </Link>
      
      <Link to="/favorites" className={`nav-item ${path === '/favorites' ? 'active' : ''}`}>
        <Star className="h-5 w-5" />
        <span>Favorites</span>
      </Link>
      
      <Link to="/search" className={`nav-item ${path === '/search' ? 'active' : ''}`}>
        <Search className="h-5 w-5" />
        <span>Search</span>
      </Link>
    </nav>
  );
};
