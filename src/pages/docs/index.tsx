import React from 'react';
import MainLayout from '@/components/Layouts/MainLayout';
import Link from 'next/link';
import {
  BookOpenIcon,
  CodeBracketIcon,
  CommandLineIcon,
  CpuChipIcon
} from '@heroicons/react/24/outline';

const sections = [
  {
    icon: BookOpenIcon,
    title: 'Getting Started',
    description: 'Learn the basics of using the platform',
    links: [
      { title: 'Quick Start Guide', href: '/docs/quick-start' },
      { title: 'Platform Overview', href: '/docs/overview' },
      { title: 'Basic Concepts', href: '/docs/concepts' }
    ]
  },
  {
    icon: CodeBracketIcon,
    title: 'API Reference',
    description: 'Comprehensive API documentation',
    links: [
      { title: 'Authentication', href: '/docs/api/auth' },
      { title: 'Endpoints', href: '/docs/api/endpoints' },
      { title: 'Examples', href: '/docs/api/examples' }
    ]
  },
  {
    icon: CommandLineIcon,
    title: 'Integration Guides',
    description: 'Connect with other services',
    links: [
      { title: 'Webhooks', href: '/docs/integrations/webhooks' },
      { title: 'Third-party Services', href: '/docs/integrations/services' },
      { title: 'Custom Solutions', href: '/docs/integrations/custom' }
    ]
  },
  {
    icon: CpuChipIcon,
    title: 'Advanced Features',
    description: 'Deep dive into platform capabilities',
    links: [
      { title: 'Resource Management', href: '/docs/advanced/resources' },
      { title: 'Analytics', href: '/docs/advanced/analytics' },
      { title: 'Automation', href: '/docs/advanced/automation' }
    ]
  }
];

const DocsPage = () => {
  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Documentation</h1>
          <p className="text-xl text-dark-muted max-w-3xl mx-auto">
            Everything you need to know about using the platform effectively
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {sections.map((section, index) => (
            <div
              key={index}
              className="bg-dark-secondary rounded-lg p-6"
            >
              <div className="flex items-center mb-4">
                <section.icon className="w-8 h-8 text-blue-400 mr-3" />
                <h2 className="text-2xl font-semibold">{section.title}</h2>
              </div>
              <p className="text-dark-muted mb-4">{section.description}</p>
              <ul className="space-y-2">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <Link
                      href={link.href}
                      className="text-blue-400 hover:text-blue-300 transition"
                    >
                      {link.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-dark-accent rounded-lg p-8">
          <h2 className="text-2xl font-bold mb-4">Need Help?</h2>
          <p className="text-dark-muted mb-6">
            Can't find what you're looking for? Our support team is here to help.
          </p>
          <Link
            href="/contact"
            className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-medium transition"
          >
            Contact Support
          </Link>
        </div>
      </div>
    </MainLayout>
  );
};

export default DocsPage; 