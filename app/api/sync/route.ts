import { NextResponse } from 'next/server';
import { ServerDB, getServerSession } from '@/backend';

export async function GET(req: Request) {
  try {
    const session = await getServerSession(req);
    const sanitizedState = ServerDB.getSanitizedStateForUser(session);
    return NextResponse.json({ success: true, data: sanitizedState });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
