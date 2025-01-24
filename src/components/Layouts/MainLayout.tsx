import React from 'react';
import Link from 'next/link';
import { useUser } from '@auth0/nextjs-auth0/client';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { user } = useUser();

  return (
    <div className="min-h-screen bg-dark-primary text-white">
      {/* Header */}
      <header className="bg-dark-secondary">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="text-xl font-bold">
              CDRP
            </Link>
            <div className="flex items-center space-x-6">
              <Link href="/features" className="hover:text-blue-400">Features</Link>
              <Link href="/pricing" className="hover:text-blue-400">Pricing</Link>
              <Link href="/about" className="hover:text-blue-400">About</Link>
              {user ? (
                <Link
                  href="/dashboard"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition"
                >
                  Dashboard
                </Link>
              ) : (
                <a
                  href="/api/auth/login"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition"
                >
                  Sign In
                </a>
              )}
            </div>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main>{children}</main>

      {/* Footer */}
      <footer className="bg-dark-secondary py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Platform</h3>
              <ul className="space-y-2 text-dark-muted">
                <li><Link href="/features">Features</Link></li>
                <li><Link href="/pricing">Pricing</Link></li>
                <li><Link href="/about">About Us</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Resources</h3>
              <ul className="space-y-2 text-dark-muted">
                <li><Link href="/docs">Documentation</Link></li>
                <li><Link href="/api-docs">API</Link></li>
                <li><Link href="/blog">Blog</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-dark-muted">
                <li><Link href="/privacy">Privacy Policy</Link></li>
                <li><Link href="/terms">Terms of Service</Link></li>
                <li><Link href="/security">Security</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Connect</h3>
              <ul className="space-y-2 text-dark-muted">
                <li><Link href="/contact">Contact Us</Link></li>
                <li><Link href="/support">Support</Link></li>
                <li><Link href="/community">Community</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-dark-border text-center text-dark-muted">
            <p>© 2024 Community Disaster Response Platform. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout; 