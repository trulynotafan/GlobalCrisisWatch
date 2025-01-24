import React from 'react';
import Link from 'next/link';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import MainLayout from '@/components/Layouts/MainLayout';

const AboutPage = () => {
  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link 
          href="/"
          className="inline-flex items-center text-blue-400 hover:text-blue-500 mb-8"
        >
          <ArrowLeftIcon className="w-4 h-4 mr-2" />
          Back to Home
        </Link>

        <h1 className="text-4xl font-bold mb-8">About Us</h1>
        
        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
            <p className="text-dark-muted">
              We're dedicated to empowering communities with advanced technology 
              for faster, more effective disaster response and recovery.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">What We Do</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-dark-secondary p-6 rounded-lg">
                <h3 className="text-xl font-medium mb-2">Emergency Response</h3>
                <p className="text-dark-muted">
                  Coordinate rapid response efforts with real-time data and 
                  communication tools.
                </p>
              </div>
              <div className="bg-dark-secondary p-6 rounded-lg">
                <h3 className="text-xl font-medium mb-2">Community Building</h3>
                <p className="text-dark-muted">
                  Connect local teams, volunteers, and resources for stronger 
                  community resilience.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Our Team</h2>
            <p className="text-dark-muted mb-6">
              We're a dedicated team of emergency response experts, technologists, 
              and community leaders working together to make a difference.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
            <div className="bg-dark-secondary p-6 rounded-lg">
              <p className="text-dark-muted mb-4">
                Have questions or want to learn more? We'd love to hear from you.
              </p>
              <Link
                href="/contact"
                className="inline-block px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white transition"
              >
                Get in Touch
              </Link>
            </div>
          </section>
        </div>
      </div>
    </MainLayout>
  );
};

export default AboutPage; 