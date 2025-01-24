import React, { useEffect } from 'react';
import { format } from 'date-fns';
import { useStatisticsStore } from '@/store/statisticsStore';
import { Line, Bar, Doughnut } from '@/components/Charts/DynamicChart';
import LoadingSpinner from '@/components/Common/LoadingSpinner';
import dynamic from 'next/dynamic';

// Chart.js setup is now only imported on the client side
const ChartSetup = dynamic(
  () => import('@/utils/chartSetup'),
  { ssr: false }
);

const AdvancedAnalytics: React.FC = () => {
  const { globalStats, regionalData, fetchGlobalStats, isLoading } = useStatisticsStore();

  useEffect(() => {
    fetchGlobalStats();
  }, [fetchGlobalStats]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: '#ffffff',
          font: {
            size: 12
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        ticks: {
          color: '#ffffff'
        }
      },
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        ticks: {
          color: '#ffffff'
        }
      }
    }
  };

  const responseTimeData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [{
      label: 'Average Response Time (minutes)',
      data: [45, 39, 35, 31, 28, 25],
      borderColor: 'rgb(75, 192, 192)',
      backgroundColor: 'rgba(75, 192, 192, 0.5)',
      tension: 0.4,
      fill: true
    }]
  };

  const resourceAllocationData = {
    labels: ['Medical', 'Food', 'Water', 'Shelter', 'Transport', 'Communication'],
    datasets: [{
      label: 'Resources Allocated',
      data: [4500, 3800, 5200, 2900, 1800, 2200],
      backgroundColor: [
        'rgba(255, 99, 132, 0.7)',
        'rgba(54, 162, 235, 0.7)',
        'rgba(255, 206, 86, 0.7)',
        'rgba(75, 192, 192, 0.7)',
        'rgba(153, 102, 255, 0.7)',
        'rgba(255, 159, 64, 0.7)',
      ],
      borderColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)',
      ],
      borderWidth: 1
    }]
  };

  const incidentTrendsData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [{
      label: 'Incidents',
      data: [65, 59, 80, 81, 56, 55],
      backgroundColor: 'rgba(54, 162, 235, 0.5)',
      borderColor: 'rgb(54, 162, 235)',
      borderWidth: 2
    }]
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-6 rounded-lg shadow-lg">
          <h3 className="text-lg font-semibold">Active Disasters</h3>
          <div className="mt-2">
            <span className="text-3xl font-bold">{globalStats.activeDisasters}</span>
            <span className="text-sm ml-2 opacity-75">worldwide</span>
          </div>
          <div className="mt-2 text-sm opacity-75">
            <span className="text-green-300">↑ 12%</span> vs last month
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-600 to-green-700 p-6 rounded-lg">
          <h3 className="text-lg font-semibold">People Affected</h3>
          <div className="mt-2">
            <span className="text-3xl font-bold">
              {(globalStats.peopleAffected / 1000000).toFixed(1)}M
            </span>
            <span className="text-sm ml-2">people</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-600 to-purple-700 p-6 rounded-lg">
          <h3 className="text-lg font-semibold">Response Teams</h3>
          <div className="mt-2">
            <span className="text-3xl font-bold">{globalStats.responseTeams}</span>
            <span className="text-sm ml-2">deployed</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-600 to-orange-700 p-6 rounded-lg">
          <h3 className="text-lg font-semibold">Resources</h3>
          <div className="mt-2">
            <span className="text-3xl font-bold">
              {(globalStats.resourcesDeployed / 1000).toFixed(1)}K
            </span>
            <span className="text-sm ml-2">units</span>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-dark-secondary p-6 rounded-lg shadow-lg">
          <h3 className="text-lg font-semibold mb-4">Response Time Trends</h3>
          <div className="h-[300px] relative">
            <Line data={responseTimeData} options={chartOptions} />
          </div>
        </div>

        <div className="bg-dark-secondary p-6 rounded-lg shadow-lg">
          <h3 className="text-lg font-semibold mb-4">Resource Allocation</h3>
          <div className="h-[300px] relative">
            <Doughnut 
              data={resourceAllocationData} 
              options={{
                ...chartOptions,
                cutout: '60%'
              }} 
            />
          </div>
        </div>

        <div className="bg-dark-secondary p-6 rounded-lg shadow-lg lg:col-span-2">
          <h3 className="text-lg font-semibold mb-4">Incident Trends</h3>
          <div className="h-[300px] relative">
            <Bar data={incidentTrendsData} options={chartOptions} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedAnalytics; 