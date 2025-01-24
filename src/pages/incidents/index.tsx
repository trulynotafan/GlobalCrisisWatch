import React, { useState } from 'react';
import MainLayout from '@/components/Layout/MainLayout';
import { useUser } from '@auth0/nextjs-auth0/client';
import { Incident } from '@/types';
import Modal from '@/components/Common/Modal';
import IncidentForm from '@/components/Incidents/IncidentForm';

const IncidentsPage: React.FC = () => {
  const { user, isLoading } = useUser();
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCreateIncident = (incidentData: Omit<Incident, 'id' | 'createdAt' | 'reportedBy'>) => {
    // TODO: Implement API call to create incident
    console.log('Creating incident:', incidentData);
    setIsModalOpen(false);
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div>Loading...</div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Incidents</h1>
          {user && (
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              onClick={() => setIsModalOpen(true)}
            >
              Report Incident
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {incidents.map((incident) => (
            <div
              key={incident.id}
              className="bg-white p-6 rounded-lg shadow-md"
            >
              <h3 className="text-xl font-semibold">{incident.title}</h3>
              <p className="text-gray-600 mt-2">{incident.description}</p>
              <div className="mt-4 flex justify-between items-center">
                <span className={`px-2 py-1 rounded text-sm ${
                  incident.priority === 'high' 
                    ? 'bg-red-100 text-red-800'
                    : incident.priority === 'medium'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-green-100 text-green-800'
                }`}>
                  {incident.priority}
                </span>
                <span className="text-gray-500 text-sm">
                  {new Date(incident.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
        </div>

        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Report New Incident"
        >
          <IncidentForm
            onSubmit={handleCreateIncident}
            onCancel={() => setIsModalOpen(false)}
          />
        </Modal>
      </div>
    </MainLayout>
  );
};

export default IncidentsPage; 