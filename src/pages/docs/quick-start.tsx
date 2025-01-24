import React from 'react';
import DocsLayout from '@/components/Layouts/DocsLayout';

const QuickStartPage = () => {
  return (
    <DocsLayout>
      <h1>Quick Start Guide</h1>
      
      <h2>Getting Started with CDRP</h2>
      <p>
        Welcome to the Community Disaster Response Platform. This guide will help you
        get up and running quickly with our platform.
      </p>

      <h3>1. Create Your Account</h3>
      <ul>
        <li>Sign up for a free account</li>
        <li>Verify your email address</li>
        <li>Complete your organization profile</li>
      </ul>

      <h3>2. Set Up Your First Project</h3>
      <ul>
        <li>Create a new response plan</li>
        <li>Add team members</li>
        <li>Configure alert settings</li>
      </ul>

      <h3>3. Explore Key Features</h3>
      <ul>
        <li>Interactive incident map</li>
        <li>Resource management tools</li>
        <li>Communication channels</li>
        <li>Analytics dashboard</li>
      </ul>

      <div className="bg-dark-accent p-4 rounded-lg mt-8">
        <h4 className="text-lg font-semibold mb-2">Need Help?</h4>
        <p>
          Our support team is available 24/7 to help you get started. Contact us
          anytime for assistance.
        </p>
      </div>
    </DocsLayout>
  );
};

export default QuickStartPage; 