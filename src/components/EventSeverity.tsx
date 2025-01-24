import React from 'react';

interface EventSeverityProps {
  type: string;
  severity?: string;
  impact?: {
    affected?: number;
    deaths?: number;
    injured?: number;
    missing?: number;
  };
}

const EventSeverity: React.FC<EventSeverityProps> = ({ type, severity, impact }) => {
  const getSeverityColor = () => {
    if (type === 'Earthquake') {
      const magnitude = parseFloat(severity?.replace('Magnitude ', '') || '0');
      if (magnitude >= 7) return 'text-red-500';
      if (magnitude >= 5) return 'text-orange-500';
      return 'text-yellow-500';
    }
    return 'text-blue-500';
  };

  return (
    <div className="space-y-2">
      <div className={`font-semibold ${getSeverityColor()}`}>
        {severity}
      </div>
      {impact && (
        <div className="grid grid-cols-2 gap-2 text-sm">
          {impact.affected && (
            <div className="bg-dark-accent/30 p-2 rounded">
              <div className="text-dark-muted">Affected</div>
              <div className="font-medium">{impact.affected.toLocaleString()}</div>
            </div>
          )}
          {impact.deaths && (
            <div className="bg-dark-accent/30 p-2 rounded">
              <div className="text-dark-muted">Deaths</div>
              <div className="font-medium text-red-400">{impact.deaths.toLocaleString()}</div>
            </div>
          )}
          {/* Add more impact metrics as needed */}
        </div>
      )}
    </div>
  );
};

export default EventSeverity; 