import type { VercelRequest, VercelResponse } from '@vercel/node';

const API_URL = process.env.VITE_API_URL || 'http://81.200.155.237:8000';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const { path } = req.query;
    const targetUrl = `${API_URL}/${path || ''}`;

    const response = await fetch(targetUrl, {
      method: req.method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: req.method !== 'GET' ? JSON.stringify(req.body) : undefined,
    });

    const data = await response.json();

    res.status(response.status).json(data);
  } catch (error) {
    res.status(500).json({ message: 'Error proxying the request' });
  }
}
