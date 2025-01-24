import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import MainLayout from './MainLayout';

interface DocsLayoutProps {
  children: React.ReactNode;
}

const sidebarLinks = [
  {
    section: 'Getting Started',
    links: [
      { title: 'Quick Start Guide', href: '/docs/quick-start' },
      { title: 'Platform Overview', href: '/docs/overview' },
      { title: 'Basic Concepts', href: '/docs/concepts' }
    ]
  },
  {
    section: 'API Reference',
    links: [
      { title: 'Authentication', href: '/docs/api/auth' },
      { title: 'Endpoints', href: '/docs/api/endpoints' },
      { title: 'Examples', href: '/docs/api/examples' }
    ]
  },
  {
    section: 'Integration Guides',
    links: [
      { title: 'Webhooks', href: '/docs/integrations/webhooks' },
      { title: 'Third-party Services', href: '/docs/integrations/services' },
      { title: 'Custom Solutions', href: '/docs/integrations/custom' }
    ]
  },
  {
    section: 'Advanced Features',
    links: [
      { title: 'Resource Management', href: '/docs/advanced/resources' },
      { title: 'Analytics', href: '/docs/advanced/analytics' },
      { title: 'Automation', href: '/docs/advanced/automation' }
    ]
  }
];

const DocsLayout: React.FC<DocsLayoutProps> = ({ children }) => {
  const router = useRouter();

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <div className="w-full md:w-64 flex-shrink-0">
            <div className="sticky top-4">
              <nav className="space-y-8">
                {sidebarLinks.map((section, index) => (
                  <div key={index}>
                    <h5 className="text-sm font-semibold text-dark-muted mb-4">
                      {section.section}
                    </h5>
                    <ul className="space-y-2">
                      {section.links.map((link, linkIndex) => (
                        <li key={linkIndex}>
                          <Link
                            href={link.href}
                            className={`block px-3 py-2 rounded-lg transition ${
                              router.pathname === link.href
                                ? 'bg-dark-accent text-white'
                                : 'text-dark-muted hover:text-white hover:bg-dark-accent/50'
                            }`}
                          >
                            {link.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="prose prose-invert max-w-none">
              {children}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default DocsLayout; 