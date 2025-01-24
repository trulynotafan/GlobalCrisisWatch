import React from 'react';

interface EventsFilterProps {
  selectedTypes: string[];
  onTypeToggle: (type: string) => void;
}

const EventsFilter: React.FC<EventsFilterProps> = ({ selectedTypes, onTypeToggle }) => {
  const disasterTypes = [
    { type: 'Earthquake', emoji: '🌋' },
    { type: 'Tsunami', emoji: '🌊' },
    { type: 'Hurricane', emoji: '🌪️' },
    { type: 'Flood', emoji: '💧' },
    { type: 'Wildfire', emoji: '🔥' },
    { type: 'Drought', emoji: '☀️' },
    { type: 'Volcano', emoji: '🗻' },
    { type: 'Disease', emoji: '🦠' },
    { type: 'Landslide', emoji: '⛰️' },
    { type: 'News Report', emoji: '📰' }
  ];

  return (
    <div className="mb-6">
      <h3 className="text-sm font-medium mb-3">Filter by Type</h3>
      <div className="flex flex-wrap gap-2">
        {disasterTypes.map(({ type, emoji }) => (
          <button
            key={type}
            onClick={() => onTypeToggle(type)}
            className={`px-3 py-1.5 rounded-full text-sm flex items-center gap-1.5 transition
              ${selectedTypes.includes(type) 
                ? 'bg-blue-500/20 text-blue-400' 
                : 'bg-dark-accent/50 text-dark-muted hover:text-white'
              }`}
          >
            <span>{emoji}</span>
            <span>{type}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default EventsFilter; 