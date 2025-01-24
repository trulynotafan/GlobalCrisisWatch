import { create } from 'zustand';
import axios from 'axios';

interface DisasterStats {
  activeDisasters: number;
  peopleAffected: number;
  responseTeams: number;
  resourcesDeployed: number;
  avgResponseTime: number;
  lastUpdate: Date;
}

interface RegionalData {
  region: string;
  activeIncidents: number;
  riskLevel: 'low' | 'medium' | 'high' | 'severe';
  resourceAvailability: number;
  responseTeams: number;
}

interface StatisticsStore {
  globalStats: DisasterStats;
  regionalData: RegionalData[];
  recentAlerts: Alert[];
  isLoading: boolean;
  error: string | null;
  fetchGlobalStats: () => Promise<void>;
  fetchRegionalData: () => Promise<void>;
  updateStats: (newStats: Partial<DisasterStats>) => void;
}

// Using ReliefWeb API for real disaster data
const RELIEFWEB_API = 'https://api.reliefweb.int/v1/disasters';
const GDACS_API = 'https://www.gdacs.org/xml/rss.xml';

export const useStatisticsStore = create<StatisticsStore>((set, get) => ({
  globalStats: {
    activeDisasters: 0,
    peopleAffected: 0,
    responseTeams: 0,
    resourcesDeployed: 0,
    avgResponseTime: 0,
    lastUpdate: new Date(),
  },
  regionalData: [],
  recentAlerts: [],
  isLoading: false,
  error: null,

  fetchGlobalStats: async () => {
    set({ isLoading: true });
    try {
      // Fetch real disaster data from ReliefWeb
      const response = await axios.get(`${RELIEFWEB_API}?limit=1000&status=current`);
      const disasters = response.data.data;

      // Process and aggregate the data
      const stats = disasters.reduce((acc: DisasterStats, disaster: any) => {
        acc.activeDisasters++;
        acc.peopleAffected += parseInt(disaster.fields.people_affected) || 0;
        return acc;
      }, {
        activeDisasters: 0,
        peopleAffected: 0,
        responseTeams: Math.floor(Math.random() * 1000) + 500, // TODO: Replace with real data
        resourcesDeployed: Math.floor(Math.random() * 10000) + 5000,
        avgResponseTime: Math.floor(Math.random() * 30) + 10,
        lastUpdate: new Date(),
      });

      set({ globalStats: stats, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to fetch global statistics', isLoading: false });
    }
  },

  fetchRegionalData: async () => {
    // Implementation for regional data fetching
  },

  updateStats: (newStats) => {
    set((state) => ({
      globalStats: { ...state.globalStats, ...newStats }
    }));
  },
})); 