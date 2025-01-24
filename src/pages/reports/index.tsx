import React, { useState } from 'react';
import MainLayout from '@/components/Layout/MainLayout';
import { Line, Bar } from 'react-chartjs-2';
import { format, subDays } from 'date-fns';

interface Report {
  id: string;
  title: string;
  type: 'incident' | 'resource' | 'response';
  status: 'draft' | 'published';
  createdAt: Date;
  summary: string;
  author: string;
}

const ReportsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'reports'>('overview');
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('7d');

  // Mock data
  const reports: Report[] = [
    {
      id: '1',
      title: 'Weekly Incident Summary',
      type: 'incident',
      status: 'published',
      createdAt: new Date(),
      summary: 'Overview of all incidents from the past week',
      author: 'John Doe'
    },
    {
      id: '2',
      title: 'Resource Allocation Report',
      type: 'resource',
      status: 'published',
      createdAt: subDays(new Date(), 1),
      summary: 'Analysis of resource distribution and usage',
      author: 'Jane Smith'
    }
  ];

  // Mock chart data
  const incidentData = {
    labels: Array.from({ length: 7 }, (_, i) => 
      format(subDays(new Date(), 6 - i), 'MMM dd')
    ),
    datasets: [
      {
        label: 'Incidents',
        data: [5, 8, 12, 7, 9, 15, 10],
        borderColor: 'rgb(59, 130, 246)',
        tension: 0.1,
        fill: false
      }
    ]
  };

  const resourceData = {
    labels: ['Medical', 'Food', 'Water', 'Shelter', 'Transport'],
    datasets: [
      {
        label: 'Available',
        data: [42, 35, 50, 25, 15],
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
      },
      {
        label: 'Used',
        data: [28, 20, 35, 15, 10],
        backgroundColor: 'rgba(239, 68, 68, 0.5)',
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
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
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Reports</h1>
            <p className="text-dark-muted mt-1">Analytics and reporting dashboard</p>
          </div>
          <div className="flex space-x-4">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value as typeof timeRange)}
              className="bg-dark-secondary rounded-lg px-4 py-2"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
            </select>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
              Generate Report
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-4 border-b border-dark-accent">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 border-b-2 transition ${
              activeTab === 'overview'
                ? 'border-blue-500 text-blue-500'
                : 'border-transparent hover:border-dark-muted'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('reports')}
            className={`px-4 py-2 border-b-2 transition ${
              activeTab === 'reports'
                ? 'border-blue-500 text-blue-500'
                : 'border-transparent hover:border-dark-muted'
            }`}
          >
            Reports List
          </button>
        </div>

        {activeTab === 'overview' ? (
          <div className="space-y-6">
            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-dark-secondary p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-4">Incident Trends</h3>
                <Line data={incidentData} options={chartOptions} />
              </div>
              <div className="bg-dark-secondary p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-4">Resource Distribution</h3>
                <Bar data={resourceData} options={chartOptions} />
              </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-dark-secondary p-4 rounded-lg">
                <h3 className="text-lg font-semibold">Total Incidents</h3>
                <div className="mt-2">
                  <span className="text-3xl font-bold">67</span>
                  <span className="text-green-400 ml-2">+12%</span>
                </div>
                <p className="text-dark-muted mt-1">vs previous period</p>
              </div>
              <div className="bg-dark-secondary p-4 rounded-lg">
                <h3 className="text-lg font-semibold">Response Time</h3>
                <div className="mt-2">
                  <span className="text-3xl font-bold">24m</span>
                  <span className="text-red-400 ml-2">+5m</span>
                </div>
                <p className="text-dark-muted mt-1">average response time</p>
              </div>
              <div className="bg-dark-secondary p-4 rounded-lg">
                <h3 className="text-lg font-semibold">Resource Usage</h3>
                <div className="mt-2">
                  <span className="text-3xl font-bold">78%</span>
                  <span className="text-green-400 ml-2">+5%</span>
                </div>
                <p className="text-dark-muted mt-1">efficiency rate</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {reports.map(report => (
              <div
                key={report.id}
                className="bg-dark-secondary p-4 rounded-lg hover:bg-dark-accent transition"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold">{report.title}</h3>
                    <p className="text-dark-muted mt-1">{report.summary}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    report.status === 'published'
                      ? 'bg-green-500/20 text-green-400'
                      : 'bg-yellow-500/20 text-yellow-400'
                  }`}>
                    {report.status}
                  </span>
                </div>
                <div className="mt-4 flex justify-between items-center text-sm text-dark-muted">
                  <div className="flex space-x-4">
                    <span>By: {report.author}</span>
                    <span>Type: {report.type}</span>
                  </div>
                  <span>{format(report.createdAt, 'MMM dd, yyyy')}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default ReportsPage; 