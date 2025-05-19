
import { useState } from "react";
import { Star } from "lucide-react";
import { MobileNavigation } from "@/components/MobileNavigation";

const FavoritesPage = () => {
  const [hasFavorites] = useState(false);
  
  return (
    <div className="livescore-mobile min-h-screen pb-16">
      <div className="livescore-header flex items-center justify-between">
        <div className="text-xl font-bold text-white flex items-center">
          <span className="text-blue-500">LIVE</span>
          <span className="text-white">SCORE</span>
          <span className="text-xs align-top">™</span>
        </div>
        
        <div className="text-lg font-bold">
          Favorites
        </div>
        
        <div className="w-9"></div> {/* Empty div for balanced layout */}
      </div>
      
      {hasFavorites ? (
        <div className="p-4">
          {/* Favorites content would go here */}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-[60vh] p-4 text-center">
          <Star className="h-16 w-16 text-gray-600 mb-4" />
          <h2 className="text-lg font-bold mb-2">No favorites yet</h2>
          <p className="text-gray-400 max-w-xs">
            Add your favorite teams and competitions by tapping the star icon next to them.
          </p>
        </div>
      )}
      
      <MobileNavigation />
    </div>
  );
};

export default FavoritesPage;
