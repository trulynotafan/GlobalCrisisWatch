import React from 'react';
import Link from 'next/link';
import UserProfile from '@/components/Auth/UserProfile';

const Navbar: React.FC = () => {
  return (
    <nav className="bg-dark-secondary shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <svg 
                className="w-8 h-8 text-blue-500" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="text-xl font-bold text-dark-text">CDRP</span>
            </Link>
          </div>
          <div className="flex items-center space-x-6">
            <Link 
              href="/incidents" 
              className="text-dark-text hover:text-blue-400 transition"
            >
              Incidents
            </Link>
            <Link 
              href="/resources" 
              className="text-dark-text hover:text-blue-400 transition"
            >
              Resources
            </Link>
            <Link 
              href="/tasks" 
              className="text-dark-text hover:text-blue-400 transition"
            >
              Tasks
            </Link>
            <UserProfile />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 