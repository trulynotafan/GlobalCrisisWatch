import React, { useState, useEffect } from 'react';
import { optimizationService } from '@/services/optimizationService';
import { Resource, Task, Incident } from '@/types';
import LoadingSpinner from '@/components/Common/LoadingSpinner';
import {
  ChartPieIcon,
  TruckIcon,
  ExclamationTriangleIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';

interface ResourceOptimizationPanelProps {
  resources: Resource[];
  tasks: Task[];
  incidents: Incident[];
  onAllocationUpdate?: (allocations: any[]) => void;
}

const ResourceOptimizationPanel: React.FC<ResourceOptimizationPanelProps> = ({
  resources,
  tasks,
  incidents,
  onAllocationUpdate
}) => {
  const [optimizationResult, setOptimizationResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const runOptimization = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const result = await optimizationService.optimizeResourceAllocation(
        resources,
        tasks,
        incidents,
        {
          maxDistance: 100, // km
          timeWindow: 4, // hours
          capacityThreshold: 0.2 // 20%
        }
      );

      setOptimizationResult(result);
      onAllocationUpdate?.(result.allocations);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Optimization failed');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    runOptimization();
  }, [resources, tasks, incidents]);

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
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-dark-secondary rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <ChartPieIcon className="h-5 w-5 text-blue-400" />
            <h3 className="font-medium">Coverage</h3>
          </div>
          <div className="mt-2">
            <span className="text-2xl font-bold">
              {(optimizationResult?.coverage * 100).toFixed(1)}%
            </span>
          </div>
        </div>

        <div className="bg-dark-secondary rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <TruckIcon className="h-5 w-5 text-green-400" />
            <h3 className="font-medium">Allocated Resources</h3>
          </div>
          <div className="mt-2">
            <span className="text-2xl font-bold">
              {optimizationResult?.allocations.length}
            </span>
            <span className="text-sm text-dark-muted ml-2">
              of {resources.length}
            </span>
          </div>
        </div>

        <div className="bg-dark-secondary rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <ExclamationTriangleIcon className="h-5 w-5 text-yellow-400" />
            <h3 className="font-medium">Unmet Needs</h3>
          </div>
          <div className="mt-2">
            <span className="text-2xl font-bold">
              {optimizationResult?.unmetNeeds.length}
            </span>
            <span className="text-sm text-dark-muted ml-2">
              tasks
            </span>
          </div>
        </div>
      </div>

      {/* Allocations List */}
      <div className="bg-dark-secondary rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Resource Allocations</h3>
          <button
            onClick={runOptimization}
            className="flex items-center space-x-2 px-3 py-1 bg-blue-600/20 text-blue-400 rounded hover:bg-blue-600/30 transition"
          >
            <ArrowPathIcon className="h-4 w-4" />
            <span>Reoptimize</span>
          </button>
        </div>

        <div className="space-y-4">
          {optimizationResult?.allocations.map((allocation: any) => {
            const resource = resources.find(r => r.id === allocation.resourceId);
            const task = tasks.find(t => t.id === allocation.taskId);

            return (
              <div
                key={`${allocation.resourceId}-${allocation.taskId}`}
                className="bg-dark-accent rounded-lg p-4"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium">{resource?.type}</h4>
                    <p className="text-sm text-dark-muted">
                      Assigned to: {task?.title}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-sm text-dark-muted">
                      {allocation.distance.toFixed(1)} km away
                    </span>
                    <p className="text-sm text-dark-muted">
                      ETA: {allocation.timeToArrive.toFixed(1)} hours
                    </p>
                  </div>
                </div>

                <div className="mt-2 flex items-center space-x-4 text-sm">
                  <span className="text-dark-muted">
                    Priority: {allocation.priority.toFixed(1)}
                  </span>
                  <span className="text-dark-muted">
                    Impact: {allocation.estimatedImpact.toFixed(1)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Unmet Needs */}
      {optimizationResult?.unmetNeeds.length > 0 && (
        <div className="bg-dark-secondary rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Unmet Needs</h3>
          <div className="space-y-4">
            {optimizationResult.unmetNeeds.map((task: Task) => (
              <div
                key={task.id}
                className="bg-red-500/20 border border-red-500/50 rounded-lg p-4"
              >
                <h4 className="font-medium">{task.title}</h4>
                <p className="text-sm text-dark-muted mt-1">
                  {task.description}
                </p>
                <div className="mt-2">
                  <span className="text-sm font-medium">Resources Needed:</span>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {task.resourcesNeeded?.map((resource, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-dark-accent rounded-full text-xs"
                      >
                        {resource.type} ({resource.quantity})
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ResourceOptimizationPanel; 