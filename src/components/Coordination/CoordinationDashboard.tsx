import React, { useState, useEffect } from 'react';
import { coordinationService } from '@/services/coordinationService';
import { Incident, Team, Task, Resource } from '@/types';
import LoadingSpinner from '@/components/Common/LoadingSpinner';
import {
  ClockIcon,
  UserGroupIcon,
  MapIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import { format } from 'date-fns';

interface CoordinationDashboardProps {
  incident: Incident;
  teams: Team[];
  availableTasks: Task[];
  availableResources: Resource[];
}

const CoordinationDashboard: React.FC<CoordinationDashboardProps> = ({
  incident,
  teams,
  availableTasks,
  availableResources
}) => {
  const [activePlan, setActivePlan] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializePlan = async () => {
      try {
        setIsLoading(true);
        const plan = await coordinationService.createCoordinationPlan(incident, teams);
        setActivePlan(plan);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to create coordination plan');
      } finally {
        setIsLoading(false);
      }
    };

    initializePlan();
  }, [incident, teams]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 text-center">
        <p className="text-red-400">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Timeline */}
      <div className="bg-dark-secondary rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Operation Timeline</h2>
        <div className="space-y-4">
          {activePlan?.timeline.map((phase: any, index: number) => (
            <div
              key={index}
              className="relative flex items-start space-x-4 pb-4"
            >
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-500/20 text-blue-400">
                <ClockIcon className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium">{phase.phase}</h3>
                <p className="text-sm text-dark-muted mt-1">
                  {format(new Date(phase.startTime), 'HH:mm')} - 
                  {format(new Date(phase.endTime), 'HH:mm')}
                </p>
                <ul className="mt-2 space-y-1">
                  {phase.objectives.map((objective: string, idx: number) => (
                    <li key={idx} className="text-sm text-dark-muted flex items-center space-x-2">
                      <CheckCircleIcon className="w-4 h-4 text-green-400" />
                      <span>{objective}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Team Assignments */}
      <div className="bg-dark-secondary rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Team Assignments</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {activePlan?.teams.map((team: any) => (
            <div
              key={team.teamId}
              className="bg-dark-accent rounded-lg p-4"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-2">
                  <UserGroupIcon className="w-5 h-5 text-blue-400" />
                  <h3 className="font-medium">
                    {teams.find(t => t.id === team.teamId)?.name}
                  </h3>
                </div>
                <span className="px-2 py-1 text-xs rounded-full bg-green-500/20 text-green-400">
                  Active
                </span>
              </div>

              <div className="mt-4 space-y-2">
                <div className="flex items-center space-x-2 text-sm text-dark-muted">
                  <MapIcon className="w-4 h-4" />
                  <span>
                    Zone: {team.zone.lat.toFixed(4)}, {team.zone.lng.toFixed(4)}
                  </span>
                </div>

                <div className="space-y-1">
                  <h4 className="text-sm font-medium">Assigned Tasks:</h4>
                  {team.tasks.map((taskId: string) => {
                    const task = availableTasks.find(t => t.id === taskId);
                    return (
                      <div
                        key={taskId}
                        className="text-sm text-dark-muted pl-4 border-l border-dark-border"
                      >
                        {task?.title}
                      </div>
                    );
                  })}
                </div>

                <div className="space-y-1">
                  <h4 className="text-sm font-medium">Allocated Resources:</h4>
                  {team.resources.map((resourceId: string) => {
                    const resource = availableResources.find(r => r.id === resourceId);
                    return (
                      <div
                        key={resourceId}
                        className="text-sm text-dark-muted pl-4 border-l border-dark-border"
                      >
                        {resource?.type} ({resource?.quantity})
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CoordinationDashboard; 