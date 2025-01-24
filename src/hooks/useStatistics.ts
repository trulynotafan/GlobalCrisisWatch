import { useState, useEffect, useCallback } from 'react';
import { geocodeLocation } from '@/services/geocoding';

interface DisasterEvent {
  type: string;
  location: string;
  severity?: string;
  source: string;
  coordinates?: [number, number];
  timestamp?: string;
  description?: string;
  id?: string;
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

const GDACS_FEED_URL = 'https://www.gdacs.org/xml/rss.xml';
const RELIEFWEB_URL = 'https://api.reliefweb.int/v1/disasters';
const WHO_EMERGENCIES_URL = 'https://www.who.int/emergencies/feed/rss.xml';

const NEWS_CATEGORIES = [
  'earthquake OR tsunami',
  'hurricane OR cyclone OR tornado',
  'wildfire OR forest fire',
  'flood OR flooding',
  'drought',
  'volcano OR volcanic',
  'landslide',
  'humanitarian crisis',
  'epidemic OR outbreak',
  'famine OR food crisis',
  'conflict OR war',
  'refugee OR displacement',
  'climate disaster',
  'environmental disaster'
];

const NEWS_SOURCES = [
  'reuters,bbc-news,al-jazeera-english,associated-press',
  'cnn,abc-news,cbs-news,nbc-news',
  'the-washington-post,the-guardian-uk,time'
].join(',');

export function useStatistics() {
  const [stats, setStats] = useState({
    activeIncidents: 0,
    responseTeams: 0,
    volunteers: 0,
    recentEvents: [] as DisasterEvent[],
    loading: true,
    loadingMessage: '',
    page: 1,
    hasMore: true
  });

  const formatEarthquakeData = (eq: any): DisasterEvent => {
    if (eq.properties.mag < 4.0) return null;
    
    return {
      id: eq.id,
      type: 'Earthquake',
      location: eq.properties.place,
      severity: `Magnitude ${eq.properties.mag}`,
      source: 'USGS',
      coordinates: [eq.geometry.coordinates[1], eq.geometry.coordinates[0]],
      timestamp: new Date(eq.properties.time).toISOString(),
      description: `${eq.properties.place}. Depth: ${eq.geometry.coordinates[2]} km. ${
        eq.properties.tsunami ? 'Tsunami warning issued.' : ''
      }`,
      url: `https://earthquake.usgs.gov/earthquakes/eventpage/${eq.id}/executive`
    };
  };

  const fetchNewsFromMultipleSources = async () => {
    try {
      const categoryPromises = NEWS_CATEGORIES.map(async (category) => {
        const response = await fetch(
          `https://newsapi.org/v2/everything?` +
          `q=${encodeURIComponent(category)}` +
          `&sources=${NEWS_SOURCES}` +
          `&language=en` +
          `&sortBy=publishedAt` +
          `&pageSize=10` +
          `&apiKey=${process.env.NEXT_PUBLIC_NEWS_API_KEY}`
        );
        const data = await response.json();
        return data.articles || [];
      });

      const categoryResults = await Promise.all(categoryPromises);

      const allNewsArticles = categoryResults
        .flat()
        .filter((article, index, self) => 
          index === self.findIndex(a => a.title === article.title)
        );

      return {
        newsApi: allNewsArticles,
        reliefWeb: [],
        gdacs: []
      };
    } catch (error) {
      console.error('Error fetching news:', error);
      return { newsApi: [], reliefWeb: [], gdacs: [] };
    }
  };

  const extractCoordinates = (text: string): [number, number] | undefined => {
    const patterns = [
      /(\-?\d+\.?\d*)[,\s]+(\-?\d+\.?\d*)/,
      /latitude[:\s]+(\-?\d+\.?\d*)[,\s]+longitude[:\s]+(\-?\d+\.?\d*)/i,
      /(\-?\d+°\d+'[NS])[,\s]+(\-?\d+°\d+'[EW])/
    ];

    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match) {
        const lat = parseFloat(match[1]);
        const lon = parseFloat(match[2]);
        if (!isNaN(lat) && !isNaN(lon) && Math.abs(lat) <= 90 && Math.abs(lon) <= 180) {
          return [lat, lon];
        }
      }
    }
    return undefined;
  };

  const extractLocation = (text: string): string | undefined => {
    // Common location patterns
    const patterns = [
      // City, Country/State
      /in ([A-Z][a-zA-Z\s]+(?:,\s*[A-Z][a-zA-Z\s]+)*)(?:\.|,|\s|$)/,
      // Country
      /in ([A-Z][a-zA-Z\s]+)(?:\.|,|\s|$)/,
      // Region
      /across ([A-Z][a-zA-Z\s]+)(?:\.|,|\s|$)/,
      // Near location
      /near ([A-Z][a-zA-Z\s]+)(?:\.|,|\s|$)/,
      // Location affected
      /([A-Z][a-zA-Z\s]+) (?:hit|struck|affected|devastated|impacted)/,
      // Location faces/battles
      /([A-Z][a-zA-Z\s]+) (?:faces|battles|fights|struggles)/
    ];

    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match?.[1]) {
        return match[1].trim();
      }
    }

    // Extract any capitalized location-like words
    const locationWords = text.match(/[A-Z][a-zA-Z]+(?:\s+[A-Z][a-zA-Z]+)*/g);
    return locationWords?.[0];
  };

  const formatNewsData = async (article: any, source: string): Promise<DisasterEvent> => {
    const combinedText = article.title + ' ' + (article.description || '');
    
    // Detect disaster type
    const type = detectDisasterType(combinedText.toLowerCase());
    
    // Extract location
    let location = extractLocation(combinedText) || 'Location Unknown';
    let coordinates: [number, number] | undefined = undefined;

    // Try to get coordinates
    if (location !== 'Location Unknown') {
      // Try geocoding the location
      coordinates = await geocodeLocation(location);
      
      // If geocoding fails, try extracting coordinates from text
      if (!coordinates) {
        coordinates = extractCoordinates(combinedText);
      }
    }

    // Extract severity and impact
    const impact = extractImpact(combinedText);
    const severity = formatSeverity(type, impact);

    return {
      type,
      location,
      coordinates,
      severity,
      source: source === 'NewsAPI' ? article.source?.name : source,
      timestamp: article.publishedAt || new Date().toISOString(),
      description: article.description,
      url: article.url,
      impact
    };
  };

  const getLocationCoordinates = (location: string): [number, number] | undefined => {
    const commonLocations: Record<string, [number, number]> = {
      'London': [51.5074, -0.1278],
      'New York': [40.7128, -74.0060],
      'Tokyo': [35.6762, 139.6503],
      'Paris': [48.8566, 2.3522],
      'Beijing': [39.9042, 116.4074],
      'Moscow': [55.7558, 37.6173],
      'Sydney': [-33.8688, 151.2093],
      'Delhi': [28.6139, 77.2090],
      'California': [36.7783, -119.4179],
      'Florida': [27.6648, -81.5158],
      'Texas': [31.9686, -99.9018],
      'Hawaii': [19.8968, -155.5828],
      'Indonesia': [-0.7893, 113.9213],
      'Japan': [36.2048, 138.2529],
    };

    for (const [commonLocation, coords] of Object.entries(commonLocations)) {
      if (location.includes(commonLocation)) {
        return coords;
      }
    }

    return undefined;
  };

  const loadMore = useCallback(async () => {
    if (stats.loading || !stats.hasMore) return;

    try {
      setStats(prev => ({
        ...prev,
        loading: true,
        loadingMessage: 'Loading more events...'
      }));

      const nextPage = stats.page + 1;
      
      const newsRes = await fetch(
        `https://newsapi.org/v2/everything?` +
        `q=${NEWS_CATEGORIES.join(' OR ')}` +
        `&language=en` +
        `&sortBy=publishedAt` +
        `&page=${nextPage}` +
        `&pageSize=20` +
        `&apiKey=${process.env.NEXT_PUBLIC_NEWS_API_KEY}`
      );
      const newsData = await newsRes.json();

      if (newsData.articles?.length) {
        // Process all news articles with Promise.all
        const newEventsPromises = newsData.articles
          .map(article => formatNewsData(article, 'NewsAPI'));
        
        const newEvents = (await Promise.all(newEventsPromises))
          .filter(event => 
            event && 
            (event.type === 'News Report' || event.coordinates)
          );

        setStats(prev => ({
          ...prev,
          recentEvents: [...prev.recentEvents, ...newEvents],
          page: nextPage,
          hasMore: newsData.articles.length === 20,
          loading: false,
          loadingMessage: ''
        }));
      } else {
        setStats(prev => ({
          ...prev,
          hasMore: false,
          loading: false,
          loadingMessage: ''
        }));
      }
    } catch (error) {
      console.error('Error loading more events:', error);
      setStats(prev => ({
        ...prev,
        loading: false,
        loadingMessage: 'Error loading more events',
        hasMore: false
      }));
    }
  }, [stats.loading, stats.hasMore, stats.page]);

  useEffect(() => {
    let mounted = true;
    const controller = new AbortController();

    async function fetchStatistics() {
      try {
        if (mounted) {
          setStats(prev => ({
            ...prev,
            loading: true,
            loadingMessage: 'Fetching earthquake data...'
          }));
        }

        // Fetch earthquake data
        const earthquakeRes = await fetch(
          'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson'
        );
        const earthquakeData = await earthquakeRes.json();

        if (!mounted) return;

        const earthquakeEvents = earthquakeData.features
          .map(formatEarthquakeData)
          .filter(Boolean)
          .slice(0, 50);

        setStats(prev => ({
          ...prev,
          loadingMessage: 'Fetching news data...'
        }));

        // Fetch and process news data
        const newsData = await fetchNewsFromMultipleSources();
        
        if (!mounted) return;

        // Process all news articles with Promise.all to handle async geocoding
        const newsEventsPromises = newsData.newsApi.map(article => 
          formatNewsData(article, 'NewsAPI')
        );
        
        const newsEvents = (await Promise.all(newsEventsPromises))
          .filter(event => 
            event && // Check if event exists
            (event.type === 'News Report' || event.coordinates) // Allow news reports without coordinates, require coordinates for others
          );

        // Combine and sort all events
        const allEvents = [...earthquakeEvents, ...newsEvents]
          .sort((a, b) => {
            return new Date(b.timestamp || 0).getTime() - new Date(a.timestamp || 0).getTime();
          });

        if (mounted) {
          setStats({
            activeIncidents: allEvents.length,
            responseTeams: Math.max(20, Math.floor(allEvents.length * 0.3)),
            volunteers: Math.max(100, allEvents.length * 3),
            recentEvents: allEvents,
            loading: false,
            loadingMessage: '',
            page: 1,
            hasMore: newsData.newsApi.length >= 100
          });
        }
      } catch (error) {
        console.error('Error fetching statistics:', error);
        if (mounted) {
          setStats(prev => ({
            ...prev,
            loading: false,
            loadingMessage: 'Error loading data',
            activeIncidents: 50,
            responseTeams: 20,
            volunteers: 240,
            recentEvents: []
          }));
        }
      }
    }

    fetchStatistics();
    const interval = setInterval(fetchStatistics, 5 * 60 * 1000);

    return () => {
      mounted = false;
      controller.abort();
      clearInterval(interval);
    };
  }, []);

  return { ...stats, loadMore };
}

// Add impact extraction
interface DisasterImpact {
  deaths?: number;
  injured?: number;
  displaced?: number;
  affected?: number;
  magnitude?: number;
  intensity?: string;
}

const extractImpact = (text: string): DisasterImpact => {
  const impact: DisasterImpact = {};
  
  // Extract numbers of casualties/affected
  const casualties = text.match(/(\d+)\s*(?:people\s*)?(killed|dead|deaths|fatalities)/i);
  if (casualties) impact.deaths = parseInt(casualties[1]);

  const injured = text.match(/(\d+)\s*(?:people\s*)?(injured|wounded)/i);
  if (injured) impact.injured = parseInt(injured[1]);

  const displaced = text.match(/(\d+)\s*(?:people\s*)?(displaced|evacuated|homeless)/i);
  if (displaced) impact.displaced = parseInt(displaced[1]);

  const affected = text.match(/(\d+)\s*(?:people\s*)?(affected|impacted)/i);
  if (affected) impact.affected = parseInt(affected[1]);

  // Extract magnitude for earthquakes
  const magnitude = text.match(/magnitude\s*(\d+\.?\d*)/i);
  if (magnitude) impact.magnitude = parseFloat(magnitude[1]);

  return impact;
};

const formatSeverity = (type: string, impact: DisasterImpact): string => {
  if (impact.magnitude) {
    return `Magnitude ${impact.magnitude}`;
  }
  
  const totalAffected = (impact.deaths || 0) + (impact.injured || 0) + (impact.displaced || 0);
  if (totalAffected > 1000) return 'Severe';
  if (totalAffected > 100) return 'Moderate';
  if (totalAffected > 0) return 'Minor';
  
  return 'Severity Unknown';
};

const detectDisasterType = (text: string): string => {
  // Order matters - more specific matches should come before general ones
  if (text.includes('earthquake') || text.includes('seismic')) {
    return 'Earthquake';
  }
  if (text.includes('tsunami')) {
    return 'Tsunami';
  }
  if (text.includes('hurricane') || text.includes('cyclone') || text.includes('typhoon')) {
    return 'Hurricane';
  }
  if (text.includes('tornado') || text.includes('twister')) {
    return 'Tornado';
  }
  if (text.includes('flood') || text.includes('inundation')) {
    return 'Flood';
  }
  if (text.includes('wildfire') || text.includes('forest fire') || text.includes('bush fire')) {
    return 'Wildfire';
  }
  if (text.includes('drought') || text.includes('water scarcity')) {
    return 'Drought';
  }
  if (text.includes('volcano') || text.includes('volcanic')) {
    return 'Volcano';
  }
  if (text.includes('landslide') || text.includes('mudslide')) {
    return 'Landslide';
  }
  if (text.includes('epidemic') || text.includes('outbreak') || text.includes('disease')) {
    return 'Disease';
  }
  if (text.includes('famine') || text.includes('food crisis')) {
    return 'Famine';
  }
  if (text.includes('refugee') || text.includes('displacement')) {
    return 'Displacement';
  }
  if (text.includes('conflict') || text.includes('war')) {
    return 'Conflict';
  }
  if (text.includes('avalanche') || text.includes('snow')) {
    return 'Avalanche';
  }
  if (text.includes('storm') || text.includes('blizzard')) {
    return 'Storm';
  }
  
  // Check for general disaster keywords
  if (text.includes('disaster') || 
      text.includes('emergency') || 
      text.includes('catastrophe') || 
      text.includes('crisis')) {
    return 'Disaster';
  }
  
  return 'News Report';
}; 