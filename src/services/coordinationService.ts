import { User, Task, Incident, Resource, Team } from '@/types';
import { socketService } from './socketService';

interface CoordinationPlan {
  id: string;
  incidentId: string;
  teams: {
    teamId: string;
    tasks: string[];
    resources: string[];
    zone: {
      lat: number;
      lng: number;
      radius: number;
    };
  }[];
  timeline: {
    phase: string;
    startTime: Date;
    endTime: Date;
    objectives: string[];
  }[];
  status: 'draft' | 'active' | 'completed' | 'suspended';
  lastUpdated: Date;
}

interface TeamAssignment {
  teamId: string;
  tasks: Task[];
  resources: Resource[];
  coordinator: User;
}

class CoordinationService {
  private activePlans: Map<string, CoordinationPlan> = new Map();
  private teamAssignments: Map<string, TeamAssignment> = new Map();

  async createCoordinationPlan(incident: Incident, teams: Team[]): Promise<CoordinationPlan> {
    const plan: CoordinationPlan = {
      id: crypto.randomUUID(),
      incidentId: incident.id,
      teams: teams.map(team => ({
        teamId: team.id,
        tasks: [],
        resources: [],
        zone: this.calculateOperationalZone(incident, team)
      })),
      timeline: this.generateTimeline(incident),
      status: 'draft',
      lastUpdated: new Date()
    };

    this.activePlans.set(plan.id, plan);
    await this.notifyTeams(plan);
    return plan;
  }

  private calculateOperationalZone(incident: Incident, team: Team) {
    // Calculate optimal operational zone based on incident type and team capabilities
    const baseRadius = this.getBaseRadius(incident.type);
    const zoneSize = this.adjustZoneSize(baseRadius, team.capabilities);

    return {
      lat: incident.location.lat,
      lng: incident.location.lng,
      radius: zoneSize
    };
  }

  private getBaseRadius(incidentType: string): number {
    const radiusMap: Record<string, number> = {
      'fire': 2,
      'flood': 5,
      'earthquake': 10,
      'medical': 1,
      'rescue': 3
    };
    return radiusMap[incidentType] || 3;
  }

  private adjustZoneSize(baseRadius: number, capabilities: string[]): number {
    let multiplier = 1;
    
    if (capabilities.includes('aerial')) multiplier *= 1.5;
    if (capabilities.includes('heavy_equipment')) multiplier *= 1.3;
    if (capabilities.includes('medical')) multiplier *= 0.8;
    
    return baseRadius * multiplier;
  }

  private generateTimeline(incident: Incident) {
    const now = new Date();
    const phases = this.getPhases(incident.type);
    let currentTime = now;

    return phases.map(phase => {
      const startTime = new Date(currentTime);
      const duration = phase.estimatedDuration;
      currentTime = new Date(currentTime.getTime() + duration * 60 * 60 * 1000);

      return {
        phase: phase.name,
        startTime,
        endTime: new Date(currentTime),
        objectives: phase.objectives
      };
    });
  }

  private getPhases(incidentType: string) {
    const basePhases = [
      {
        name: 'Initial Response',
        estimatedDuration: 2, // hours
        objectives: [
          'Assess situation',
          'Establish command post',
          'Deploy first responders'
        ]
      },
      {
        name: 'Rescue & Treatment',
        estimatedDuration: 6,
        objectives: [
          'Search and rescue operations',
          'Provide emergency medical care',
          'Evacuate critical areas'
        ]
      },
      {
        name: 'Containment',
        estimatedDuration: 8,
        objectives: [
          'Contain hazards',
          'Secure perimeter',
          'Establish support facilities'
        ]
      },
      {
        name: 'Recovery',
        estimatedDuration: 24,
        objectives: [
          'Restore essential services',
          'Begin cleanup operations',
          'Assess damage'
        ]
      }
    ];

    // Customize phases based on incident type
    switch (incidentType) {
      case 'fire':
        return this.customizeFirePhases(basePhases);
      case 'flood':
        return this.customizeFloodPhases(basePhases);
      default:
        return basePhases;
    }
  }

  private customizeFirePhases(basePhases: any[]) {
    return basePhases.map(phase => {
      if (phase.name === 'Containment') {
        return {
          ...phase,
          objectives: [
            'Establish fire lines',
            'Protect structures',
            'Control spread'
          ]
        };
      }
      return phase;
    });
  }

  private customizeFloodPhases(basePhases: any[]) {
    return basePhases.map(phase => {
      if (phase.name === 'Initial Response') {
        return {
          ...phase,
          objectives: [
            'Monitor water levels',
            'Establish evacuation routes',
            'Deploy flood barriers'
          ]
        };
      }
      return phase;
    });
  }

  async assignTeam(teamId: string, tasks: Task[], resources: Resource[], coordinator: User) {
    const assignment: TeamAssignment = {
      teamId,
      tasks,
      resources,
      coordinator
    };

    this.teamAssignments.set(teamId, assignment);
    await this.notifyTeamAssignment(assignment);
    return assignment;
  }

  private async notifyTeams(plan: CoordinationPlan) {
    // Notify all involved teams through WebSocket
    plan.teams.forEach(team => {
      socketService.emit('team:plan-update', {
        teamId: team.teamId,
        plan: {
          id: plan.id,
          zone: team.zone,
          tasks: team.tasks,
          timeline: plan.timeline
        }
      });
    });
  }

  private async notifyTeamAssignment(assignment: TeamAssignment) {
    socketService.emit('team:assignment', {
      teamId: assignment.teamId,
      assignment: {
        tasks: assignment.tasks,
        resources: assignment.resources,
        coordinator: assignment.coordinator
      }
    });
  }

  async updatePlanStatus(planId: string, status: CoordinationPlan['status']) {
    const plan = this.activePlans.get(planId);
    if (!plan) throw new Error('Plan not found');

    plan.status = status;
    plan.lastUpdated = new Date();
    
    this.activePlans.set(planId, plan);
    await this.notifyPlanUpdate(plan);
    return plan;
  }

  private async notifyPlanUpdate(plan: CoordinationPlan) {
    socketService.emit('plan:update', { plan });
  }

  async getActivePlans(): Promise<CoordinationPlan[]> {
    return Array.from(this.activePlans.values())
      .filter(plan => plan.status === 'active');
  }

  async getTeamAssignment(teamId: string): Promise<TeamAssignment | undefined> {
    return this.teamAssignments.get(teamId);
  }
}

export const coordinationService = new CoordinationService(); 