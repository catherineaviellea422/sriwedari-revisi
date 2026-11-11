import { NextResponse } from 'next/server';
import { ServerDB } from '@/lib/server-db';
import { requireAuth } from '@/lib/session';

export async function GET(req: Request) {
  const auth = await requireAuth(req, 'admin');
  if ('errorResponse' in auth) return auth.errorResponse;

  try {
    const summary = ServerDB.getAnalytics();
    return NextResponse.json({ success: true, data: summary });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
