import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  res.status(200).json({
    version: '1.0.0',
    endpoints: {
      incidents: '/api/v1/incidents',
      alerts: '/api/v1/alerts',
      resources: '/api/v1/resources',
      predictions: '/api/v1/predictions',
      statistics: '/api/v1/statistics'
    }
  });
} 