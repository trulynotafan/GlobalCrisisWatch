import React from 'react';
import DocsLayout from '@/components/Layouts/DocsLayout';

const examples = [
  {
    language: 'JavaScript',
    code: `const response = await fetch('https://api.cdrp.com/v1/incidents', {
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY'
  }
});

const data = await response.json();
console.log(data.incidents);`
  },
  {
    language: 'Python',
    code: `import requests

response = requests.get(
    'https://api.cdrp.com/v1/incidents',
    headers={'Authorization': 'Bearer YOUR_API_KEY'}
)

data = response.json()
print(data['incidents'])`
  },
  {
    language: 'curl',
    code: `curl -X GET \\
  https://api.cdrp.com/v1/incidents \\
  -H "Authorization: Bearer YOUR_API_KEY"`
  }
];

const ApiExamplesPage = () => {
  return (
    <DocsLayout>
      <h1>API Examples</h1>

      <h2>List Incidents</h2>
      <p className="mb-8">
        Here are examples of how to fetch incidents using different programming
        languages:
      </p>

      {examples.map((example, index) => (
        <div key={index} className="mb-8">
          <h3>{example.language}</h3>
          <div className="bg-dark-secondary p-4 rounded-lg my-4 font-mono text-sm">
            <pre>{example.code}</pre>
          </div>
        </div>
      ))}

      <div className="bg-dark-accent p-4 rounded-lg mt-8">
        <h4 className="text-lg font-semibold mb-2">SDK Libraries</h4>
        <p>
          We provide official SDK libraries for several programming languages.
          Check out our GitHub repository for more information.
        </p>
      </div>
    </DocsLayout>
  );
};

export default ApiExamplesPage; 