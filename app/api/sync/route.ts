import { NextResponse } from 'next/server';
import { ServerDB } from '@/lib/server-db';

export async function GET() {
  try {
    const fullState = ServerDB.getFullState();
    return NextResponse.json({ success: true, data: fullState });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

