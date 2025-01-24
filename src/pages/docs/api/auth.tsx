import React from 'react';
import DocsLayout from '@/components/Layouts/DocsLayout';

const ApiAuthPage = () => {
  return (
    <DocsLayout>
      <h1>API Authentication</h1>

      <h2>Authentication Methods</h2>
      <p>
        CDRP API uses API keys for authentication. You can obtain your API key from
        your account dashboard.
      </p>

      <h3>Using API Keys</h3>
      <div className="bg-dark-secondary p-4 rounded-lg my-4 font-mono text-sm">
        <p>// Example API request with authentication header</p>
        <p className="text-blue-400">curl -X GET \</p>
        <p>https://api.cdrp.com/v1/incidents \</p>
        <p>-H "Authorization: Bearer YOUR_API_KEY"</p>
      </div>

      <h3>API Key Best Practices</h3>
      <ul>
        <li>Keep your API key secure and never share it publicly</li>
        <li>Use different API keys for development and production</li>
        <li>Rotate your API keys periodically</li>
        <li>Set appropriate permissions for each API key</li>
      </ul>

      <h2>Rate Limiting</h2>
      <p>
        API requests are limited to 1000 requests per hour per API key. Rate limit
        information is included in the response headers:
      </p>
      <div className="bg-dark-secondary p-4 rounded-lg my-4 font-mono text-sm">
        <p>X-RateLimit-Limit: 1000</p>
        <p>X-RateLimit-Remaining: 999</p>
        <p>X-RateLimit-Reset: 1640995200</p>
      </div>

      <h2>Error Handling</h2>
      <p>
        When authentication fails, the API will return a 401 Unauthorized response:
      </p>
      <div className="bg-dark-secondary p-4 rounded-lg my-4 font-mono text-sm">
        {`{
  "error": "unauthorized",
  "message": "Invalid API key provided",
  "status": 401
}`}
      </div>
    </DocsLayout>
  );
};

export default ApiAuthPage; 