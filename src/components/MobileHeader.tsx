
import React from 'react';
import { Search, Menu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Sidebar } from "@/components/Sidebar";

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
        
        <div className="flex items-center space-x-2">
          <button 
            onClick={() => navigate('/search')} 
            className="p-2 rounded-full bg-gray-800"
          >
            <Search className="h-5 w-5" />
          </button>
          
          <Sheet>
            <SheetTrigger asChild>
              <button className="p-2 rounded-full bg-gray-800">
                <Menu className="h-5 w-5" />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[80%] bg-[#0a111a] border-l border-gray-800 p-0">
              <Sidebar leagues={[]} loading={true} isMobile={true} />
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </div>
  );
};
