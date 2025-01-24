import React from 'react';
import MainLayout from '@/components/Layouts/MainLayout';
import {
  ShieldCheckIcon,
  BellAlertIcon,
  MapIcon,
  ChartBarIcon,
  UserGroupIcon,
  ChatBubbleLeftRightIcon,
  CloudArrowUpIcon,
  CogIcon
} from '@heroicons/react/24/outline';

const features = [
  {
    icon: ShieldCheckIcon,
    title: 'Emergency Response',
    description: 'Coordinate rapid response with real-time incident tracking and resource management.'
  },
  {
    icon: BellAlertIcon,
    title: 'Early Warning System',
    description: 'Advanced AI-powered disaster prediction and automated alert system.'
  },
  {
    icon: MapIcon,
    title: 'Interactive Maps',
    description: 'Real-time mapping of incidents, resources, and response teams.'
  },
  {
    icon: ChartBarIcon,
    title: 'Analytics Dashboard',
    description: 'Comprehensive data visualization and reporting tools.'
  },
  {
    icon: UserGroupIcon,
    title: 'Team Management',
    description: 'Efficient coordination of response teams and volunteers.'
  },
  {
    icon: ChatBubbleLeftRightIcon,
    title: 'Communication Hub',
    description: 'Integrated messaging and notification system for seamless coordination.'
  },
  {
    icon: CloudArrowUpIcon,
    title: 'Resource Tracking',
    description: 'Monitor and manage emergency resources and supplies in real-time.'
  },
  {
    icon: CogIcon,
    title: 'Automation Tools',
    description: 'Streamline response procedures with automated workflows and protocols.'
  }
];

const FeaturesPage = () => {
  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Platform Features</h1>
          <p className="text-xl text-dark-muted max-w-3xl mx-auto">
            Comprehensive tools and capabilities designed to enhance disaster response
            and community resilience.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-dark-secondary p-6 rounded-lg hover:bg-dark-accent transition duration-300"
            >
              <feature.icon className="w-12 h-12 text-blue-400 mb-4" />
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-dark-muted">{feature.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 bg-dark-accent rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-dark-muted mb-6">
            Join our platform and enhance your community's disaster response capabilities.
          </p>
          <a
            href="/api/auth/login"
            className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-medium transition"
          >
            Start Free Trial
          </a>
        </div>
      </div>
    </MainLayout>
  );
};

export default FeaturesPage; 