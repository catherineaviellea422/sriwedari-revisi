import { NextResponse } from 'next/server';
import { ServerDB } from '@/lib/server-db';

export async function GET() {
  try {
    const summary = ServerDB.getAnalytics();
    return NextResponse.json({ success: true, data: summary });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

