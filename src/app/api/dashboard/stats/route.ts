import { NextRequest, NextResponse } from 'next/server';
import { getDashboardStats } from '@/lib/database';
import { verifyToken, extractTokenFromHeader } from '@/lib/auth';

// GET /api/dashboard/stats - Get dashboard statistics for authenticated provider
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const token = extractTokenFromHeader(authHeader || '');
    
    if (!token) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload || payload.role !== 'provider') {
      return NextResponse.json({ error: 'Invalid token or insufficient permissions' }, { status: 403 });
    }

    const stats = await getDashboardStats(payload.userId);
    return NextResponse.json({ stats });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}