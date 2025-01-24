import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const count = await prisma.team.count();
    res.status(200).json({ count });
  } catch (error) {
    console.error('Error fetching team count:', error);
    res.status(500).json({ message: 'Error fetching statistics' });
  }
} 