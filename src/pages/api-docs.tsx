import React from 'react';
import { GetStaticProps } from 'next';
import { MDXRemote } from 'next-mdx-remote';
import { serialize } from 'next-mdx-remote/serialize';
import { CodeBlock } from '@/components/Common/CodeBlock';

interface ApiDocsProps {
  documentation: any;
}

const ApiDocs: React.FC<ApiDocsProps> = ({ documentation }) => {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-8">API Documentation</h1>
      <div className="prose prose-invert max-w-none">
        <MDXRemote {...documentation} components={{ code: CodeBlock }} />
      </div>
    </div>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const documentation = await serialize(`
# Disaster Response Platform API

## Authentication

All API requests must include either:
- A valid session cookie (for browser-based access)
- An API key in the \`X-API-Key\` header

## Rate Limiting

- API key requests: 1000 requests per hour
- Unauthenticated requests: 100 requests per hour

## Endpoints

### Incidents

\`\`\`typescript
GET /api/v1/incidents
POST /api/v1/incidents
PUT /api/v1/incidents/:id

// Query Parameters
{
  status?: 'active' | 'resolved'
  type?: string
  limit?: number
  offset?: number
}

// Response
{
  data: Incident[]
  pagination: {
    total: number
    limit: number
    offset: number
  }
}
\`\`\`

### Alerts

\`\`\`typescript
GET /api/v1/alerts
POST /api/v1/alerts
PUT /api/v1/alerts/:id

// Query Parameters
{
  type?: 'warning' | 'danger' | 'info' | 'success'
  status?: 'active' | 'resolved' | 'monitoring'
  limit?: number
  offset?: number
}
\`\`\`

### Resources

\`\`\`typescript
GET /api/v1/resources
POST /api/v1/resources
PUT /api/v1/resources/:id

// Query Parameters
{
  type?: string
  status?: 'available' | 'deployed' | 'maintenance'
  limit?: number
  offset?: number
}
\`\`\`

### Predictions

\`\`\`typescript
GET /api/v1/predictions
POST /api/v1/predictions

// Query Parameters
{
  type?: string
  probability?: number
  timeframe?: string
  limit?: number
  offset?: number
}
\`\`\`

### Statistics

\`\`\`typescript
GET /api/v1/statistics

// Query Parameters
{
  timeframe?: '24h' | '7d' | '30d' | '1y'
  type?: string
  region?: string
}
\`\`\`

## Error Handling

All errors follow this format:

\`\`\`typescript
{
  error: string
  details?: any
}
\`\`\`

Common HTTP status codes:
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 429: Too Many Requests
- 500: Internal Server Error
`);

  return {
    props: {
      documentation
    }
  };
};

export default ApiDocs; 