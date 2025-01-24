import { Resource, Task, Incident } from '@/types';

interface ResourceAllocation {
  resourceId: string;
  taskId: string;
  priority: number;
  estimatedImpact: number;
  distance: number;
  timeToArrive: number;
}

interface OptimizationResult {
  allocations: ResourceAllocation[];
  coverage: number;
  efficiency: number;
  unmetNeeds: Task[];
}

interface ResourceConstraints {
  maxDistance: number;
  timeWindow: number;
  capacityThreshold: number;
}

class OptimizationService {
  private calculateDistance(point1: { lat: number; lng: number }, point2: { lat: number; lng: number }): number {
    const R = 6371; // Earth's radius in km
    const dLat = this.toRad(point2.lat - point1.lat);
    const dLon = this.toRad(point2.lng - point1.lng);
    const lat1 = this.toRad(point1.lat);
    const lat2 = this.toRad(point2.lat);

    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  private toRad(value: number): number {
    return value * Math.PI / 180;
  }

  private calculatePriority(task: Task, incident: Incident): number {
    const priorityWeights = {
      high: 3,
      medium: 2,
      low: 1
    };

    const taskPriority = priorityWeights[task.priority];
    const incidentPriority = priorityWeights[incident.priority];
    
    return (taskPriority + incidentPriority) / 2;
  }

  private estimateTimeToArrive(distance: number, resourceType: Resource['type']): number {
    const averageSpeeds = {
      medical: 60, // km/h
      food: 40,
      water: 40,
      shelter: 30,
      transport: 50
    };

    return distance / averageSpeeds[resourceType];
  }

  async optimizeResourceAllocation(
    resources: Resource[],
    tasks: Task[],
    incidents: Incident[],
    constraints: ResourceConstraints
  ): Promise<OptimizationResult> {
    const allocations: ResourceAllocation[] = [];
    const unmetNeeds: Task[] = [];
    let totalCoverage = 0;
    let totalEfficiency = 0;

    // Sort tasks by priority and urgency
    const prioritizedTasks = [...tasks].sort((a, b) => {
      const incidentA = incidents.find(i => i.id === a.id);
      const incidentB = incidents.find(i => i.id === b.id);
      if (!incidentA || !incidentB) return 0;
      
      return this.calculatePriority(b, incidentB) - this.calculatePriority(a, incidentA);
    });

    // Available resources pool
    const availableResources = resources.filter(r => r.status === 'available');

    // Optimize allocations
    for (const task of prioritizedTasks) {
      const neededResources = task.resourcesNeeded || [];
      let taskCovered = true;

      for (const neededResource of neededResources) {
        // Find best matching resource
        const matchingResources = availableResources.filter(r => 
          r.type === neededResource.type && 
          r.quantity >= neededResource.quantity
        );

        if (matchingResources.length === 0) {
          taskCovered = false;
          continue;
        }

        // Find optimal resource based on distance and capacity
        const bestResource = matchingResources.reduce((best, current) => {
          const distance = this.calculateDistance(current.location, task.location);
          const timeToArrive = this.estimateTimeToArrive(distance, current.type);

          if (distance > constraints.maxDistance || timeToArrive > constraints.timeWindow) {
            return best;
          }

          const currentScore = this.calculateResourceScore(current, distance, timeToArrive);
          const bestScore = best ? this.calculateResourceScore(best, 
            this.calculateDistance(best.location, task.location),
            this.estimateTimeToArrive(distance, best.type)
          ) : -1;

          return currentScore > bestScore ? current : best;
        }, null as Resource | null);

        if (bestResource) {
          const distance = this.calculateDistance(bestResource.location, task.location);
          const timeToArrive = this.estimateTimeToArrive(distance, bestResource.type);

          allocations.push({
            resourceId: bestResource.id,
            taskId: task.id,
            priority: this.calculatePriority(task, incidents.find(i => i.id === task.id)!),
            estimatedImpact: this.calculateImpact(task, bestResource),
            distance,
            timeToArrive
          });

          // Update resource availability
          const resourceIndex = availableResources.findIndex(r => r.id === bestResource.id);
          if (resourceIndex !== -1) {
            availableResources.splice(resourceIndex, 1);
          }
        } else {
          taskCovered = false;
        }
      }

      if (!taskCovered) {
        unmetNeeds.push(task);
      }

      totalCoverage = (tasks.length - unmetNeeds.length) / tasks.length;
      totalEfficiency = this.calculateOverallEfficiency(allocations);
    }

    return {
      allocations,
      coverage: totalCoverage,
      efficiency: totalEfficiency,
      unmetNeeds
    };
  }

  private calculateResourceScore(
    resource: Resource,
    distance: number,
    timeToArrive: number
  ): number {
    const distanceScore = 1 / (1 + distance);
    const timeScore = 1 / (1 + timeToArrive);
    const quantityScore = resource.quantity / 100; // Normalize quantity

    return (distanceScore * 0.4) + (timeScore * 0.4) + (quantityScore * 0.2);
  }

  private calculateImpact(task: Task, resource: Resource): number {
    // Calculate the potential impact of allocating this resource to this task
    const priorityWeights = { high: 1, medium: 0.6, low: 0.3 };
    const baseImpact = priorityWeights[task.priority];
    
    // Consider resource quantity relative to need
    const neededResource = task.resourcesNeeded?.find(r => r.type === resource.type);
    const quantityRatio = neededResource 
      ? Math.min(resource.quantity / neededResource.quantity, 1)
      : 0;

    return baseImpact * quantityRatio;
  }

  private calculateOverallEfficiency(allocations: ResourceAllocation[]): number {
    if (allocations.length === 0) return 0;

    const totalScore = allocations.reduce((sum, allocation) => {
      const distanceScore = 1 / (1 + allocation.distance);
      const timeScore = 1 / (1 + allocation.timeToArrive);
      const priorityScore = allocation.priority / 3; // Normalize priority

      return sum + (distanceScore + timeScore + priorityScore) / 3;
    }, 0);

    return totalScore / allocations.length;
  }
}

export const optimizationService = new OptimizationService(); 