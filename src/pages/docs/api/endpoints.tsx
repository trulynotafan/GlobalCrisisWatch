import React from 'react';
import DocsLayout from '@/components/Layouts/DocsLayout';

const endpoints = [
  {
    method: 'GET',
    path: '/incidents',
    description: 'List all incidents',
    example: {
      request: 'GET /api/v1/incidents',
      response: `{
  "incidents": [
    {
      "id": "inc_123",
      "type": "natural_disaster",
      "status": "active",
      "location": {
        "lat": 34.0522,
        "lng": -118.2437
      },
      "created_at": "2024-01-20T08:00:00Z"
    }
  ]
}`
    }
  },
  {
    method: 'POST',
    path: '/incidents',
    description: 'Create a new incident',
    example: {
      request: `POST /api/v1/incidents
Content-Type: application/json

{
  "type": "natural_disaster",
  "location": {
    "lat": 34.0522,
    "lng": -118.2437
  },
  "description": "Wildfire in progress"
}`,
      response: `{
  "id": "inc_123",
  "type": "natural_disaster",
  "status": "active",
  "location": {
    "lat": 34.0522,
    "lng": -118.2437
  },
  "created_at": "2024-01-20T08:00:00Z"
}`
    }
  }
];

const ApiEndpointsPage = () => {
  return (
    <DocsLayout>
      <h1>API Endpoints</h1>

      <h2>Base URL</h2>
      <p className="mb-8">
        All API requests should be made to:
        <br />
        <code className="bg-dark-secondary px-2 py-1 rounded">
          https://api.cdrp.com/v1
        </code>
      </p>

      <h2>Available Endpoints</h2>
      <div className="space-y-8">
        {endpoints.map((endpoint, index) => (
          <div key={index} className="border border-dark-border rounded-lg p-6">
            <div className="flex items-center gap-4 mb-4">
              <span className={`px-2 py-1 rounded text-sm font-mono
                ${endpoint.method === 'GET' ? 'bg-green-600' : 'bg-blue-600'}`}>
                {endpoint.method}
              </span>
              <code className="text-lg">{endpoint.path}</code>
            </div>
            <p className="text-dark-muted mb-4">{endpoint.description}</p>
            <div className="bg-dark-secondary p-4 rounded-lg font-mono text-sm">
              <p className="text-green-400 mb-4">// Request</p>
              <pre>{endpoint.example.request}</pre>
              <p className="text-green-400 mt-6 mb-4">// Response</p>
              <pre>{endpoint.example.response}</pre>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-dark-accent p-4 rounded-lg mt-8">
        <h4 className="text-lg font-semibold mb-2">Need More Examples?</h4>
        <p>
          Check out our API Examples section for more detailed usage examples and
          code snippets in various programming languages.
        </p>
      </div>
    </DocsLayout>
  );
};

export default ApiEndpointsPage; 