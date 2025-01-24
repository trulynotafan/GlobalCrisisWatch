import React, { useState } from 'react';
import MainLayout from '@/components/Layout/MainLayout';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Dialog } from '@headlessui/react';
import { useRouter } from 'next/router';
import { useUser } from '@auth0/nextjs-auth0/client';
import LoadingSpinner from '@/components/Common/LoadingSpinner';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// Add QuickAction components
import ReportIncidentModal from '@/components/Dashboard/ReportIncidentModal';
import AddResourceModal from '@/components/Dashboard/AddResourceModal';
import AssignTaskModal from '@/components/Dashboard/AssignTaskModal';
import RequestHelpModal from '@/components/Dashboard/RequestHelpModal';

const DashboardPage: React.FC = () => {
  const router = useRouter();
  const { user } = useUser();
  const [activeModal, setActiveModal] = useState<'incident' | 'resource' | 'task' | 'help' | null>(null);

  const recentIncidents = [
    { id: 1, title: 'Flood in Downtown', priority: 'high', status: 'active', time: '2 hours ago' },
    { id: 2, title: 'Fire on 5th Street', priority: 'high', status: 'active', time: '3 hours ago' },
    { id: 3, title: 'Power Outage', priority: 'medium', status: 'resolved', time: '5 hours ago' },
  ];

  const incidentData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Incidents',
        data: [12, 19, 15, 25, 22, 30],
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
    ],
  };

  const resourceData = {
    labels: ['Medical', 'Food', 'Water', 'Shelter', 'Transport'],
    datasets: [
      {
        label: 'Available Resources',
        data: [42, 35, 50, 25, 15],
        backgroundColor: [
          'rgba(255, 99, 132, 0.5)',
          'rgba(54, 162, 235, 0.5)',
          'rgba(255, 206, 86, 0.5)',
          'rgba(75, 192, 192, 0.5)',
          'rgba(153, 102, 255, 0.5)',
        ],
      },
    ],
  };

  const handleModalClose = () => {
    setActiveModal(null);
  };

  const handleQuickAction = (action: typeof activeModal) => {
    if (!user) {
      router.push('/api/auth/login');
      return;
    }
    setActiveModal(action);
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Incident Trends Chart */}
          <div className="bg-dark-secondary p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Incident Trends</h3>
            <Line data={incidentData} options={{ 
              responsive: true,
              plugins: {
                legend: {
                  labels: {
                    color: '#ffffff'
                  }
                }
              },
              scales: {
                y: {
                  ticks: { color: '#ffffff' }
                },
                x: {
                  ticks: { color: '#ffffff' }
                }
              }
            }} />
          </div>

          {/* Resource Distribution Chart */}
          <div className="bg-dark-secondary p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Resource Distribution</h3>
            <Bar data={resourceData} options={{ 
              responsive: true,
              plugins: {
                legend: {
                  labels: {
                    color: '#ffffff'
                  }
                }
              },
              scales: {
                y: {
                  ticks: { color: '#ffffff' }
                },
                x: {
                  ticks: { color: '#ffffff' }
                }
              }
            }} />
          </div>
        </div>

        {/* Recent Incidents */}
        <div className="bg-dark-secondary rounded-lg overflow-hidden">
          <div className="p-4 border-b border-dark-accent">
            <h3 className="text-lg font-semibold">Recent Incidents</h3>
          </div>
          <div className="divide-y divide-dark-accent">
            {recentIncidents.map((incident) => (
              <div key={incident.id} className="p-4 hover:bg-dark-accent transition">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">{incident.title}</h4>
                    <p className="text-sm text-dark-muted">{incident.time}</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      incident.priority === 'high' 
                        ? 'bg-red-500/20 text-red-400'
                        : 'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {incident.priority}
                    </span>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      incident.status === 'active'
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-gray-500/20 text-gray-400'
                    }`}>
                      {incident.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button
            onClick={() => handleQuickAction('incident')}
            className="group p-4 bg-blue-600 hover:bg-blue-700 rounded-lg transition relative overflow-hidden"
          >
            <div className="relative z-10">
              <span className="block font-medium">Report Incident</span>
              <span className="text-sm opacity-75">Create a new incident report</span>
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-blue-700 opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>

          <button
            onClick={() => handleQuickAction('resource')}
            className="group p-4 bg-green-600 hover:bg-green-700 rounded-lg transition relative overflow-hidden"
          >
            <div className="relative z-10">
              <span className="block font-medium">Add Resource</span>
              <span className="text-sm opacity-75">Register available resources</span>
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-green-700 opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>

          <button
            onClick={() => handleQuickAction('task')}
            className="group p-4 bg-purple-600 hover:bg-purple-700 rounded-lg transition relative overflow-hidden"
          >
            <div className="relative z-10">
              <span className="block font-medium">Assign Task</span>
              <span className="text-sm opacity-75">Create and assign new tasks</span>
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>

          <button
            onClick={() => handleQuickAction('help')}
            className="group p-4 bg-orange-600 hover:bg-orange-700 rounded-lg transition relative overflow-hidden"
          >
            <div className="relative z-10">
              <span className="block font-medium">Request Help</span>
              <span className="text-sm opacity-75">Request additional assistance</span>
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-orange-700 opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
        </div>

        {/* Modals */}
        <ReportIncidentModal
          isOpen={activeModal === 'incident'}
          onClose={handleModalClose}
        />

        <AddResourceModal
          isOpen={activeModal === 'resource'}
          onClose={handleModalClose}
        />

        <AssignTaskModal
          isOpen={activeModal === 'task'}
          onClose={handleModalClose}
        />

        <RequestHelpModal
          isOpen={activeModal === 'help'}
          onClose={handleModalClose}
        />
      </div>
    </MainLayout>
  );
};

export default DashboardPage; 