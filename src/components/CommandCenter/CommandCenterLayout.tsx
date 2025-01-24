import React, { useState } from 'react';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import {
  Bars3Icon,
  XMarkIcon,
  MapIcon,
  ChartBarIcon,
  UserGroupIcon,
  BellIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';
import { Transition } from '@headlessui/react';
import DynamicMap from '@/components/Map/DynamicMap';
import ResourceOptimizationPanel from '@/components/Resources/ResourceOptimizationPanel';
import CoordinationDashboard from '@/components/Coordination/CoordinationDashboard';
import NotificationCenter from '@/components/Notifications/NotificationCenter';
import DisasterPredictionPanel from '@/components/Prediction/DisasterPredictionPanel';

interface CommandCenterLayoutProps {
  incident: any;
  teams: any[];
  resources: any[];
  tasks: any[];
}

const CommandCenterLayout: React.FC<CommandCenterLayoutProps> = ({
  incident,
  teams,
  resources,
  tasks
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activePanel, setActivePanel] = useState<string>('map');
  const isMobile = useMediaQuery('(max-width: 768px)');

  const navigationItems = [
    { id: 'map', name: 'Situation Map', icon: MapIcon },
    { id: 'resources', name: 'Resources', icon: ChartBarIcon },
    { id: 'teams', name: 'Teams', icon: UserGroupIcon },
    { id: 'alerts', name: 'Alerts', icon: BellIcon },
    { id: 'communication', name: 'Communication', icon: ChatBubbleLeftRightIcon }
  ];

  const renderPanel = () => {
    switch (activePanel) {
      case 'map':
        return (
          <div className="h-full">
            <DynamicMap
              alerts={incident.alerts}
              predictions={incident.predictions}
            />
          </div>
        );
      case 'resources':
        return (
          <ResourceOptimizationPanel
            resources={resources}
            tasks={tasks}
            incidents={[incident]}
          />
        );
      case 'teams':
        return (
          <CoordinationDashboard
            incident={incident}
            teams={teams}
            availableTasks={tasks}
            availableResources={resources}
          />
        );
      case 'alerts':
        return (
          <DisasterPredictionPanel
            location={incident.location}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen bg-dark-primary text-dark-text">
      {/* Mobile Sidebar Toggle */}
      <div className="lg:hidden">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="fixed top-4 left-4 z-50 p-2 rounded-lg bg-dark-secondary"
        >
          {sidebarOpen ? (
            <XMarkIcon className="h-6 w-6" />
          ) : (
            <Bars3Icon className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Sidebar */}
      <Transition
        show={!isMobile || sidebarOpen}
        enter="transition-transform duration-200"
        enterFrom="-translate-x-full"
        enterTo="translate-x-0"
        leave="transition-transform duration-200"
        leaveFrom="translate-x-0"
        leaveTo="-translate-x-full"
        className="fixed inset-y-0 left-0 w-64 bg-dark-secondary z-40"
      >
        <div className="h-full flex flex-col">
          <div className="p-4">
            <h1 className="text-xl font-bold">Command Center</h1>
            <p className="text-sm text-dark-muted mt-1">
              Incident: {incident.title}
            </p>
          </div>

          <nav className="flex-1 px-2 py-4 space-y-1">
            {navigationItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActivePanel(item.id);
                  if (isMobile) setSidebarOpen(false);
                }}
                className={`w-full flex items-center px-4 py-2 rounded-lg transition ${
                  activePanel === item.id
                    ? 'bg-dark-accent text-white'
                    : 'text-dark-muted hover:bg-dark-accent/50'
                }`}
              >
                <item.icon className="h-5 w-5 mr-3" />
                {item.name}
              </button>
            ))}
          </nav>

          <div className="p-4 border-t border-dark-border">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-dark-accent" />
              <div>
                <p className="text-sm font-medium">John Doe</p>
                <p className="text-xs text-dark-muted">Incident Commander</p>
              </div>
            </div>
          </div>
        </div>
      </Transition>

      {/* Main Content */}
      <main className={`flex-1 ${!isMobile ? 'ml-64' : ''} h-screen overflow-auto`}>
        <div className="p-4 h-full">
          {/* Top Bar */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">
              {navigationItems.find(item => item.id === activePanel)?.name}
            </h2>
            <div className="flex items-center space-x-4">
              <NotificationCenter />
              {/* Add more top bar items here */}
            </div>
          </div>

          {/* Content Panel */}
          <div className="h-[calc(100%-4rem)]">
            {renderPanel()}
          </div>
        </div>
      </main>
    </div>
  );
};

export default CommandCenterLayout; 