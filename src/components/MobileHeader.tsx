
import React from 'react';
import { Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface MobileHeaderProps {
  onSearch?: (query: string) => void;
}

export const MobileHeader = ({ onSearch }: MobileHeaderProps) => {
  const navigate = useNavigate();
  
  return (
    <div className="sticky top-0 z-30 bg-[#0a111a] border-b border-gray-800">
      <div className="flex items-center justify-between py-4 px-4">
        <div className="text-xl font-bold text-white flex items-center">
          <span className="text-blue-500">LIVE</span>
          <span className="text-white">SCORE</span>
          <span className="text-xs align-top">™</span>
        </div>
        
        <button 
          onClick={() => navigate('/search')} 
          className="p-2 rounded-full bg-gray-800"
        >
          <Search className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};
