import React from 'react';
import DocsLayout from '@/components/Layouts/DocsLayout';

const OverviewPage = () => {
  return (
    <DocsLayout>
      <h1>Platform Overview</h1>

      <h2>What is CDRP?</h2>
      <p>
        The Community Disaster Response Platform (CDRP) is a comprehensive solution
        designed to help communities prepare for, respond to, and recover from
        disasters effectively.
      </p>

      <h2>Core Components</h2>
      
      <h3>1. Incident Management</h3>
      <p>
        Track and manage emergency situations in real-time with our advanced
        incident management system.
      </p>

      <h3>2. Resource Coordination</h3>
      <p>
        Efficiently allocate and track resources, including personnel, equipment,
        and supplies.
      </p>

      <h3>3. Communication Hub</h3>
      <p>
        Maintain clear communication channels between all stakeholders during
        emergency situations.
      </p>

      <h3>4. Analytics & Reporting</h3>
      <p>
        Make data-driven decisions with comprehensive analytics and reporting
        tools.
      </p>

      <h2>Platform Architecture</h2>
      <p>
        CDRP is built on a modern, scalable architecture that ensures reliability
        and performance during critical situations.
      </p>

      <div className="bg-dark-accent p-4 rounded-lg mt-8">
        <h4 className="text-lg font-semibold mb-2">Next Steps</h4>
        <p>
          Ready to dive deeper? Check out our Basic Concepts guide or jump straight
          into the Quick Start Guide.
        </p>
      </div>
    </DocsLayout>
  );
};

export default OverviewPage; 