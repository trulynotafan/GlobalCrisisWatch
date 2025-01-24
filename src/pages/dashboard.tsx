import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';
import dynamic from 'next/dynamic';
import { useStatistics } from '@/hooks/useStatistics';
import {
  ChartBarIcon,
  MapIcon,
  ChatBubbleLeftRightIcon,
  BellIcon,
  UserGroupIcon,
  UsersIcon
} from '@heroicons/react/24/outline';
import type { DisasterEvent } from '@/hooks/useStatistics';
import { FixedSizeList as List } from 'react-window';
import { format } from 'date-fns';
import EventsFilter from '@/components/EventsFilter';

// Load map component dynamically
const DisasterMap = dynamic(
  () => import('@/components/DisasterMap/DisasterMap'),
  { ssr: false }
);

const EventItem = ({ index, style, data }: any) => {
  const event = data.events[index];
  return (
    <div style={style}>
      <div
        className="p-3 bg-dark-accent/50 rounded-lg cursor-pointer hover:bg-dark-accent transition mx-2"
        onClick={() => data.onSelect(event)}
      >
        <div className="flex justify-between items-start">
          <div>
            <span className={`inline-block px-2 py-1 rounded text-sm mb-2 ${
              event.type === 'Earthquake' ? 'bg-red-500/20 text-red-400' :
              event.type === 'News Report' ? 'bg-blue-500/20 text-blue-400' :
              'bg-green-500/20 text-green-400'
            }`}>
              {event.type}
            </span>
            <div className="font-semibold">{event.location}</div>
            {event.severity && (
              <div className="text-sm text-dark-muted">
                {event.severity}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const EventsList = ({ events, onSelect, loading, loadMore, hasMore }) => {
  const [showAll, setShowAll] = useState(false);
  const displayEvents = showAll ? events : events.slice(0, 5);

  return (
    <div className="bg-dark-secondary rounded-lg p-4">
      <h2 className="text-xl font-bold mb-4">Recent Events</h2>
      {!events.length && loading ? (
        <div className="text-center py-8 text-dark-muted">
          <div className="animate-pulse">Loading events...</div>
        </div>
      ) : (
        <>
          <div className="space-y-4 mb-4">
            {displayEvents.map((event, index) => (
              <div
                key={event.timestamp || index}
                className="p-3 bg-dark-accent/50 rounded-lg cursor-pointer hover:bg-dark-accent transition"
                onClick={() => onSelect(event)}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <span className={`inline-block px-2 py-1 rounded text-sm mb-2 ${
                      event.type === 'Earthquake' ? 'bg-red-500/20 text-red-400' :
                      event.type === 'News Report' ? 'bg-blue-500/20 text-blue-400' :
                      'bg-green-500/20 text-green-400'
                    }`}>
                      {event.type}
                    </span>
                    <div className="font-semibold">{event.location}</div>
                    {event.severity && (
                      <div className="text-sm text-dark-muted">
                        {event.severity}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          {events.length > 5 && (
            <button
              onClick={() => setShowAll(!showAll)}
              className="w-full py-2 text-sm text-blue-400 hover:text-blue-300 transition"
            >
              {showAll ? 'Show Less' : `Show More (${events.length - 5} more)`}
            </button>
          )}
        </>
      )}
    </div>
  );
};

const Dashboard = () => {
  const { user, isLoading: authLoading } = useUser();
  const { 
    activeIncidents, 
    responseTeams, 
    volunteers, 
    recentEvents, 
    loading: statsLoading,
    loadingMessage,
    loadMore,
    hasMore 
  } = useStatistics();
  const [selectedEvent, setSelectedEvent] = useState<DisasterEvent | null>(null);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);

  // Add intersection observer for infinite scrolling
  const observerTarget = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && !statsLoading && hasMore && loadMore) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [statsLoading, hasMore, loadMore]);

  // Filter events based on selected types
  const filteredEvents = useMemo(() => {
    if (selectedTypes.length === 0) return recentEvents;
    return recentEvents.filter(event => selectedTypes.includes(event.type));
  }, [recentEvents, selectedTypes]);

  const handleTypeToggle = (type: string) => {
    setSelectedTypes(prev => 
      prev.includes(type) 
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  const handleEventSelect = (event: DisasterEvent) => {
    setSelectedEvent(event);
  };

  const handleViewFullReport = (event: DisasterEvent) => {
    // For earthquakes, link to USGS event page
    if (event.type === 'Earthquake') {
      window.open(`https://earthquake.usgs.gov/earthquakes/eventpage/${event.id}/executive`, '_blank');
    } 
    // For news reports, open the article URL
    else if (event.type === 'News Report' && event.url) {
      window.open(event.url, '_blank');
    }
  };

  if (authLoading) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-dark-primary text-white">
      {/* Header */}
      <header className="bg-dark-secondary py-4 border-b border-dark-accent/10">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center gap-6">
            <h1 className="text-2xl font-bold">Crisis Monitoring Dashboard</h1>
            <span className="text-xs px-2 py-1 rounded-full bg-green-500/10 text-green-400 font-medium">
              Live
            </span>
          </div>
          <div className="flex items-center gap-4 text-sm text-dark-muted">
            <span>Last updated: {new Date().toLocaleString()}</span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Loading Message */}
        {statsLoading && loadingMessage && (
          <div className="bg-blue-500/20 text-blue-400 px-4 py-2 rounded-lg mb-8 animate-pulse">
            {loadingMessage}
          </div>
        )}

        {/* Stats Overview with better descriptions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-dark-secondary p-6 rounded-lg">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-red-500/10 rounded-lg">
                <MapIcon className="w-6 h-6 text-red-500" />
              </div>
              <div>
                <div className="text-2xl font-bold">
                  {statsLoading ? (
                    <span className="animate-pulse">Loading...</span>
                  ) : activeIncidents}
                </div>
                <div className="text-dark-muted">Active Incidents Worldwide</div>
              </div>
            </div>
          </div>
          <div className="bg-dark-secondary p-6 rounded-lg">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-500/10 rounded-lg">
                <UserGroupIcon className="w-6 h-6 text-blue-500" />
              </div>
              <div>
                <div className="text-2xl font-bold">
                  {statsLoading ? (
                    <span className="animate-pulse">Loading...</span>
                  ) : responseTeams}
                </div>
                <div className="text-dark-muted">Emergency Response Units</div>
              </div>
            </div>
          </div>
          <div className="bg-dark-secondary p-6 rounded-lg">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-500/10 rounded-lg">
                <UsersIcon className="w-6 h-6 text-green-500" />
              </div>
              <div>
                <div className="text-2xl font-bold">
                  {statsLoading ? (
                    <span className="animate-pulse">Loading...</span>
                  ) : volunteers}
                </div>
                <div className="text-dark-muted">Aid Personnel Deployed</div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Map Section */}
          <div className="lg:col-span-2">
            <div className="bg-dark-secondary rounded-lg p-4">
              <h2 className="text-xl font-bold mb-4">Live Incident Map</h2>
              <EventsFilter 
                selectedTypes={selectedTypes}
                onTypeToggle={handleTypeToggle}
              />
              {statsLoading && !recentEvents.length ? (
                <div className="h-[600px] flex items-center justify-center bg-dark-accent/20 rounded-lg">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p>{loadingMessage}</p>
                  </div>
                </div>
              ) : (
                <DisasterMap 
                  events={filteredEvents} 
                  onMarkerClick={setSelectedEvent}
                />
              )}
            </div>
          </div>

          {/* Event Details Sidebar */}
          <div className="space-y-8">
            {/* Selected Event Details */}
            {selectedEvent && (
              <div className="bg-dark-secondary rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold">Selected Incident</h2>
                  <button 
                    onClick={() => setSelectedEvent(null)}
                    className="text-dark-muted hover:text-white"
                  >
                    ×
                  </button>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">
                      {selectedEvent.type === 'Earthquake' ? '🌋' :
                       selectedEvent.type === 'Wildfire' ? '🔥' :
                       selectedEvent.type === 'Flood' ? '🌊' :
                       selectedEvent.type === 'Storm' ? '🌪️' :
                       selectedEvent.type === 'Volcano' ? '🗻' :
                       selectedEvent.type === 'Drought' ? '☀️' :
                       selectedEvent.type === 'Conflict' ? '⚔️' :
                       selectedEvent.type === 'Disease' ? '🦠' :
                       selectedEvent.type === 'News Report' ? '📰' : '⚠️'}
                    </span>
                    <div>
                      <h3 className="font-semibold text-lg">{selectedEvent.type}</h3>
                      <p className="text-dark-muted text-sm">
                        {selectedEvent.timestamp && format(new Date(selectedEvent.timestamp), 'PPp')}
                      </p>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm text-dark-muted mb-1">Location</h4>
                    <p className="font-medium">{selectedEvent.location}</p>
                  </div>

                  {selectedEvent.severity && (
                    <div>
                      <h4 className="text-sm text-dark-muted mb-1">Severity</h4>
                      <p className="text-red-400 font-medium">{selectedEvent.severity}</p>
                    </div>
                  )}

                  {selectedEvent.description && (
                    <div>
                      <h4 className="text-sm text-dark-muted mb-1">Details</h4>
                      <p className="text-sm">{selectedEvent.description}</p>
                    </div>
                  )}

                  {selectedEvent.coordinates && (
                    <div>
                      <h4 className="text-sm text-dark-muted mb-1">Coordinates</h4>
                      <p className="text-sm font-mono">
                        {selectedEvent.coordinates[0].toFixed(4)}, {selectedEvent.coordinates[1].toFixed(4)}
                      </p>
                    </div>
                  )}

                  <div className="pt-4 border-t border-dark-accent">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-dark-muted">Source: {selectedEvent.source}</span>
                      {(selectedEvent.type === 'Earthquake' || (selectedEvent.type === 'News Report' && selectedEvent.url)) && (
                        <button 
                          onClick={() => handleViewFullReport(selectedEvent)}
                          className="text-sm text-blue-400 hover:text-blue-300"
                        >
                          View Full Report →
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Recent Events List */}
            <EventsList
              events={filteredEvents}
              onSelect={setSelectedEvent}
              loading={statsLoading}
              loadMore={loadMore}
              hasMore={hasMore}
            />

            {/* Loading indicator */}
            {statsLoading && (
              <div className="text-center py-4 text-dark-muted">
                <div className="animate-pulse">{loadingMessage}</div>
              </div>
            )}

            {/* Intersection observer target */}
            <div ref={observerTarget} className="h-4" />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard; 