import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import { validateApiKey, rateLimit } from '@/utils/apiMiddleware';
import { prisma } from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Validate authentication
    const session = await getServerSession(req, res, authOptions);
    const apiKey = req.headers['x-api-key'];

    if (!session && !await validateApiKey(apiKey as string)) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Apply rate limiting
    const rateLimitResult = await rateLimit(req);
    if (!rateLimitResult.success) {
      return res.status(429).json({ error: 'Too many requests' });
    }

    switch (req.method) {
      case 'GET':
        return handleGet(req, res);
      case 'POST':
        return handlePost(req, res);
      case 'PUT':
        return handlePut(req, res);
      default:
        res.setHeader('Allow', ['GET', 'POST', 'PUT']);
        return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
    }
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

async function handleGet(req: NextApiRequest, res: NextApiResponse) {
  const { id, status, type, limit = '10', offset = '0' } = req.query;

  if (id) {
    const incident = await prisma.incident.findUnique({
      where: { id: id as string }
    });
    return res.status(200).json(incident);
  }

  const where = {
    ...(status && { status: status as string }),
    ...(type && { type: type as string })
  };

  const [incidents, total] = await Promise.all([
    prisma.incident.findMany({
      where,
      take: parseInt(limit as string),
      skip: parseInt(offset as string),
      orderBy: { createdAt: 'desc' }
    }),
    prisma.incident.count({ where })
  ]);

  return res.status(200).json({
    data: incidents,
    pagination: {
      total,
      limit: parseInt(limit as string),
      offset: parseInt(offset as string)
    }
  });
}

async function handlePost(req: NextApiRequest, res: NextApiResponse) {
  const { title, description, location, type, severity } = req.body;

  // Validate required fields
  if (!title || !description || !location || !type || !severity) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const incident = await prisma.incident.create({
    data: {
      title,
      description,
      location,
      type,
      severity,
      status: 'active'
    }
  });

  return res.status(201).json(incident);
}

async function handlePut(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  const updates = req.body;

  if (!id) {
    return res.status(400).json({ error: 'Missing incident ID' });
  }

  const incident = await prisma.incident.update({
    where: { id: id as string },
    data: updates
  });

  return res.status(200).json(incident);
} 