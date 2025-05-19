
import { useState } from 'react';
import { Circle, CirclePlay, Check, Clock } from 'lucide-react';
import { FixtureStatus } from '@/types/football';

interface MobileFilterTabsProps {
  onFilterChange: (filter: string) => void;
}

export const MobileFilterTabs = ({ onFilterChange }: MobileFilterTabsProps) => {
  const [activeTab, setActiveTab] = useState<string>('all');
  
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    onFilterChange(tab);
  };
  
  return (
    <div className="flex justify-between px-4 py-3 bg-[#0a111a] border-b border-gray-800">
      <button 
        className={`flex flex-col items-center justify-center w-[23%] py-2 rounded-lg ${
          activeTab === 'all' ? 'bg-blue-500/20 text-blue-400' : 'bg-gray-800/50 text-gray-400'
        }`}
        onClick={() => handleTabChange('all')}
      >
        <Circle className="h-4 w-4 mb-1" />
        <span className="text-xs font-medium">All</span>
      </button>
      
      <button 
        className={`flex flex-col items-center justify-center w-[23%] py-2 rounded-lg ${
          activeTab === 'live' ? 'bg-red-500/20 text-red-400' : 'bg-gray-800/50 text-gray-400'
        }`}
        onClick={() => handleTabChange('live')}
      >
        <CirclePlay className="h-4 w-4 mb-1" />
        <span className="text-xs font-medium">Live</span>
      </button>
      
      <button 
        className={`flex flex-col items-center justify-center w-[23%] py-2 rounded-lg ${
          activeTab === 'finished' ? 'bg-gray-500/20 text-gray-300' : 'bg-gray-800/50 text-gray-400'
        }`}
        onClick={() => handleTabChange('finished')}
      >
        <Check className="h-4 w-4 mb-1" />
        <span className="text-xs font-medium">Finished</span>
      </button>
      
      <button 
        className={`flex flex-col items-center justify-center w-[23%] py-2 rounded-lg ${
          activeTab === 'scheduled' ? 'bg-blue-700/20 text-blue-300' : 'bg-gray-800/50 text-gray-400'
        }`}
        onClick={() => handleTabChange('scheduled')}
      >
        <Clock className="h-4 w-4 mb-1" />
        <span className="text-xs font-medium">Soon</span>
      </button>
    </div>
  );
};
