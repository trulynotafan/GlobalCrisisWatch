import React, { useState } from 'react';
import MainLayout from '@/components/Layout/MainLayout';
import dynamic from 'next/dynamic';
import { Incident, Resource } from '@/types';
import { Dialog } from '@headlessui/react';
import LoadingSpinner from '@/components/Common/LoadingSpinner';

const Map = dynamic(() => import('@/components/Map/Map'), { 
  ssr: false,
  loading: () => (
    <div className="w-full h-[700px] bg-dark-secondary rounded-lg flex items-center justify-center">
      <LoadingSpinner size="lg" />
    </div>
  )
});

const MapPage: React.FC = () => {
  const [selectedLayer, setSelectedLayer] = useState<'all' | 'incidents' | 'resources'>('all');
  const [showLegend, setShowLegend] = useState(true);
  const [selectedItem, setSelectedItem] = useState<Incident | Resource | null>(null);

  // Mock data
  const incidents: Incident[] = [
    {
      id: '1',
      title: 'Flood Warning',
      description: 'Severe flooding in downtown area',
      location: { lat: 40.7128, lng: -74.006 },
      status: 'active',
      priority: 'high',
      createdAt: new Date(),
      reportedBy: 'Emergency Services'
    },
    {
      id: '2',
      title: 'Power Outage',
      description: 'Multiple blocks affected',
      location: { lat: 40.7200, lng: -73.98 },
      status: 'active',
      priority: 'medium',
      createdAt: new Date(),
      reportedBy: 'Utility Company'
    }
  ];

  const resources: Resource[] = [
    {
      id: '1',
      type: 'medical',
      quantity: 100,
      location: { lat: 40.7300, lng: -74.01 },
      status: 'available',
      providedBy: 'City Hospital'
    },
    {
      id: '2',
      type: 'shelter',
      quantity: 50,
      location: { lat: 40.7150, lng: -73.99 },
      status: 'available',
      providedBy: 'Red Cross'
    }
  ];

  return (
    <MainLayout>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Live Map</h1>
            <p className="text-dark-muted mt-1">Track incidents and resources in real-time</p>
          </div>
          <div className="flex space-x-4">
            <div className="bg-dark-secondary rounded-lg p-2">
              <select
                value={selectedLayer}
                onChange={(e) => setSelectedLayer(e.target.value as typeof selectedLayer)}
                className="bg-transparent text-dark-text"
              >
                <option value="all">All Layers</option>
                <option value="incidents">Incidents Only</option>
                <option value="resources">Resources Only</option>
              </select>
            </div>
            <button
              onClick={() => setShowLegend(!showLegend)}
              className="bg-dark-secondary px-4 py-2 rounded-lg hover:bg-dark-accent transition"
            >
              {showLegend ? 'Hide Legend' : 'Show Legend'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Map */}
          <div className="lg:col-span-3">
            <div className="bg-dark-secondary rounded-lg p-4">
              <Map
                incidents={selectedLayer === 'resources' ? [] : incidents}
                resources={selectedLayer === 'incidents' ? [] : resources}
                onMarkerClick={setSelectedItem}
              />
            </div>
          </div>

          {/* Legend and Info */}
          <div className="space-y-4">
            {showLegend && (
              <div className="bg-dark-secondary rounded-lg p-4">
                <h3 className="font-semibold mb-3">Legend</h3>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 rounded-full bg-red-500" />
                    <span>High Priority Incident</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 rounded-full bg-yellow-500" />
                    <span>Medium Priority Incident</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 rounded-full bg-blue-500" />
                    <span>Available Resources</span>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-dark-secondary rounded-lg p-4">
              <h3 className="font-semibold mb-3">Statistics</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Active Incidents:</span>
                  <span className="text-red-400">{incidents.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Available Resources:</span>
                  <span className="text-blue-400">{resources.length}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Details Modal */}
        <Dialog
          open={!!selectedItem}
          onClose={() => setSelectedItem(null)}
          className="relative z-50"
        >
          <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Dialog.Panel className="bg-dark-secondary rounded-lg p-6 max-w-md w-full">
              <Dialog.Title className="text-xl font-semibold mb-4">
                {selectedItem && 'title' in selectedItem ? selectedItem.title : 'Resource Details'}
              </Dialog.Title>
              
              <div className="space-y-4">
                {selectedItem && 'description' in selectedItem ? (
                  // Incident details
                  <>
                    <p>{selectedItem.description}</p>
                    <div className="flex justify-between text-sm">
                      <span className="text-dark-muted">Status: {selectedItem.status}</span>
                      <span className="text-dark-muted">Priority: {selectedItem.priority}</span>
                    </div>
                    <p className="text-sm text-dark-muted">
                      Reported by: {selectedItem.reportedBy}
                    </p>
                  </>
                ) : selectedItem && (
                  // Resource details
                  <>
                    <div className="flex justify-between">
                      <span>Type: {selectedItem.type}</span>
                      <span>Quantity: {selectedItem.quantity}</span>
                    </div>
                    <p className="text-sm text-dark-muted">
                      Provided by: {selectedItem.providedBy}
                    </p>
                    <p className="text-sm text-dark-muted">
                      Status: {selectedItem.status}
                    </p>
                  </>
                )}
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setSelectedItem(null)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition"
                >
                  Close
                </button>
              </div>
            </Dialog.Panel>
          </div>
        </Dialog>
      </div>
    </MainLayout>
  );
};

export default MapPage; 