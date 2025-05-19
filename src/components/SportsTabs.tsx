
import { useState } from 'react';

const sportsOptions = [
  { id: 'football', name: 'Football' },
  { id: 'hockey', name: 'Hockey' },
  { id: 'basketball', name: 'Basketball' },
  { id: 'tennis', name: 'Tennis' },
  { id: 'cricket', name: 'Cricket' },
  { id: 'rugby', name: 'Rugby' },
  { id: 'baseball', name: 'Baseball' }
];

interface SportsTabsProps {
  onSportChange?: (sportId: string) => void;
}

export const SportsTabs = ({ onSportChange }: SportsTabsProps) => {
  const [activeSport, setActiveSport] = useState('football');
  
  const handleSportChange = (sportId: string) => {
    setActiveSport(sportId);
    if (onSportChange) {
      onSportChange(sportId);
    }
  };
  
  return (
    <div className="sports-tabs">
      {sportsOptions.map((sport) => (
        <button
          key={sport.id}
          className={`sports-tab ${activeSport === sport.id ? 'active' : ''}`}
          onClick={() => handleSportChange(sport.id)}
        >
          {sport.name}
        </button>
      ))}
    </div>
  );
};
