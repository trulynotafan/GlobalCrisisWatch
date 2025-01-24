import React from 'react';
import Link from 'next/link';
import {
  MapIcon,
  ChartBarIcon,
  BellIcon
} from '@heroicons/react/24/outline';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-dark-primary text-white">
      <main>
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold mb-4">
              Global Crisis Watch
            </h1>
            <p className="text-xl text-dark-muted max-w-2xl mx-auto mb-6">
              Advanced monitoring system for natural disasters, humanitarian emergencies, and global crises. 
              Providing real-time intelligence from authoritative sources worldwide.
            </p>
            <p className="text-sm text-dark-muted mb-8">
              Powered by USGS, international news networks, and emergency response agencies
            </p>
            <div className="text-sm text-dark-muted mb-8 flex items-center justify-center gap-2">
              <span className="inline-flex items-center px-2 py-1 rounded-full bg-green-500/10 text-green-400">
                <span className="w-2 h-2 rounded-full bg-green-400 mr-2 animate-pulse"></span>
                Live Updates
              </span>
              <span className="text-dark-muted">•</span>
              <span>Updated every 5 minutes</span>
            </div>
            <div className="flex justify-center gap-4">
              <Link
                href="/dashboard"
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition"
              >
                View Dashboard
              </Link>
              <a
                href="https://github.com/afaanbayes/cdrp"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-dark-accent hover:bg-dark-accent/80 rounded-lg transition"
              >
                View on GitHub
              </a>
            </div>
          </div>

          {/* Key Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-dark-secondary p-6 rounded-lg">
              <MapIcon className="w-8 h-8 text-blue-400 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Intelligent Monitoring</h3>
              <p className="text-dark-muted">
                Real-time crisis detection and tracking with advanced geospatial analysis
              </p>
            </div>
            <div className="bg-dark-secondary p-6 rounded-lg">
              <ChartBarIcon className="w-8 h-8 text-blue-400 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Impact Assessment</h3>
              <p className="text-dark-muted">
                Comprehensive analysis of crisis severity and humanitarian impact
              </p>
            </div>
            <div className="bg-dark-secondary p-6 rounded-lg">
              <BellIcon className="w-8 h-8 text-blue-400 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Global Intelligence</h3>
              <p className="text-dark-muted">
                Verified information from international sources and local agencies
              </p>
            </div>
          </div>

          {/* Add Quick Stats */}
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-dark-secondary p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-blue-400">24/7</div>
              <div className="text-sm text-dark-muted">Monitoring</div>
            </div>
            <div className="bg-dark-secondary p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-blue-400">200+</div>
              <div className="text-sm text-dark-muted">Countries</div>
            </div>
            <div className="bg-dark-secondary p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-blue-400">15+</div>
              <div className="text-sm text-dark-muted">Event Types</div>
            </div>
            <div className="bg-dark-secondary p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-blue-400">5min</div>
              <div className="text-sm text-dark-muted">Update Frequency</div>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-dark-secondary py-8 text-center text-dark-muted">
        <div className="max-w-2xl mx-auto px-4">
          <p className="mb-2">
            Built with advanced technologies for real-time crisis monitoring
          </p>
          <p className="text-sm">
            Developed by{' '}
            <a
              href="https://github.com/afaanbayes"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300"
            >
              Afaan
            </a>
            {' '}• Open source project
          </p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage; 