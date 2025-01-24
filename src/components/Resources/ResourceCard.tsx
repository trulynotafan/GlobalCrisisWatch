import React from 'react';
import { Resource } from '@/types';

interface ResourceCardProps {
  resource: Resource;
  onViewDetails: (resource: Resource) => void;
  onRequest: (resource: Resource) => void;
}

const resourceTypeIcons: Record<Resource['type'], string> = {
  medical: '🏥',
  food: '🍲',
  water: '💧',
  shelter: '🏠',
  transport: '🚗'
};

const ResourceCard: React.FC<ResourceCardProps> = ({ resource, onViewDetails, onRequest }) => {
  return (
    <div className="bg-dark-secondary rounded-lg p-4">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-2xl">{resourceTypeIcons[resource.type]}</span>
            <h3 className="text-lg font-semibold capitalize">{resource.type}</h3>
          </div>
          <p className="text-dark-muted mt-1">Quantity: {resource.quantity}</p>
        </div>
        <span className={`px-2 py-1 text-xs rounded-full ${
          resource.status === 'available' 
            ? 'bg-green-500/20 text-green-400'
            : resource.status === 'allocated'
            ? 'bg-yellow-500/20 text-yellow-400'
            : 'bg-red-500/20 text-red-400'
        }`}>
          {resource.status}
        </span>
      </div>
      <div className="mt-4">
        <p className="text-sm text-dark-muted">Provided by: {resource.providedBy}</p>
        <div className="mt-4 flex space-x-2">
          <button 
            onClick={() => onViewDetails(resource)}
            className="px-3 py-1 bg-blue-600/20 text-blue-400 rounded hover:bg-blue-600/30 transition"
          >
            View Details
          </button>
          <button 
            onClick={() => onRequest(resource)}
            className="px-3 py-1 bg-green-600/20 text-green-400 rounded hover:bg-green-600/30 transition"
          >
            Request
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResourceCard; 