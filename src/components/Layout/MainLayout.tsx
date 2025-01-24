import React from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { useUser } from '@auth0/nextjs-auth0/client';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { user, isLoading } = useUser();

  return (
    <div className="min-h-screen bg-dark-primary text-dark-text">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">
          {!isLoading && !user && (
            <div className="mb-6 bg-dark-secondary p-4 rounded-lg">
              <h2 className="text-xl font-semibold mb-2">Welcome to CDRP</h2>
              <p className="text-dark-muted mb-4">
                Please log in to access all features and contribute to disaster response efforts.
              </p>
              <a 
                href="/api/auth/login"
                className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
              >
                Log In / Sign Up
              </a>
            </div>
          )}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <div className="bg-dark-secondary p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">Active Incidents</h3>
              <div className="text-3xl font-bold text-red-500">12</div>
              <p className="text-dark-muted">3 high priority</p>
            </div>
            <div className="bg-dark-secondary p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">Available Resources</h3>
              <div className="text-3xl font-bold text-green-500">45</div>
              <p className="text-dark-muted">8 medical, 12 food, 25 shelter</p>
            </div>
            <div className="bg-dark-secondary p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">Active Volunteers</h3>
              <div className="text-3xl font-bold text-blue-500">28</div>
              <p className="text-dark-muted">15 on-site, 13 remote</p>
            </div>
          </div>
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout; 