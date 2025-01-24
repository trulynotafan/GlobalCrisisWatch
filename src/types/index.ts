export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'volunteer' | 'affected';
  location?: {
    lat: number;
    lng: number;
  };
}

export interface Incident {
  id: string;
  title: string;
  description: string;
  location: {
    lat: number;
    lng: number;
  };
  status: 'active' | 'resolved';
  priority: 'high' | 'medium' | 'low';
  createdAt: Date;
  reportedBy: string;
  images?: string[];
}

export interface Resource {
  id: string;
  type: 'food' | 'water' | 'transport' | 'shelter' | 'medical';
  quantity: number;
  location: {
    lat: number;
    lng: number;
  };
  status: 'available' | 'allocated' | 'depleted';
  providedBy: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed';
  priority: 'high' | 'medium' | 'low';
  assignedTo?: string;
  location: {
    lat: number;
    lng: number;
  };
  resourcesNeeded?: Resource[];
  deadline?: Date;
}

export interface Alert {
  id: string;
  type: 'warning' | 'danger' | 'info' | 'success';
  title: string;
  message: string;
  timestamp: Date;
  location?: {
    lat: number;
    lng: number;
  };
  source: string;
  severity: 1 | 2 | 3 | 4 | 5; // 1 being lowest, 5 highest
  status: 'active' | 'resolved' | 'monitoring';
}

export interface DisasterPrediction {
  id: string;
  type: string;
  probability: number;
  location: {
    lat: number;
    lng: number;
  };
  estimatedImpact: {
    severity: 1 | 2 | 3 | 4 | 5;
    peopleAtRisk: number;
    infrastructureAtRisk: string[];
  };
  timeframe: {
    start: Date;
    end: Date;
  };
}

export interface DisasterEvent {
  type: string;
  location: string;
  coordinates?: [number, number];
  severity?: string;
  source: string;
  timestamp?: string;
  description?: string;
  url?: string;
  impact?: {
    deaths?: number;
    injured?: number;
    displaced?: number;
    affected?: number;
    magnitude?: number;
    intensity?: string;
  };
} 