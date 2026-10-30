import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifySessionToken } from '@/lib/session';
import { ServerDB } from '@/lib/server-db';

export async function GET() {
  const cookieStore = cookies();
  const sessionCookie = cookieStore.get('sriwedari_session');

  if (!sessionCookie?.value) {
    return NextResponse.json({ success: false, user: null }, { status: 401 });
  }

  const payload = await verifySessionToken(sessionCookie.value);
  if (!payload) {
    return NextResponse.json({ success: false, user: null, error: 'Sesi kedaluwarsa atau tidak valid' }, { status: 401 });
  }

  const user = ServerDB.getUsers().find(u => u.id === payload.id) || null;
  if (!user) {
    return NextResponse.json({ success: false, user: null }, { status: 404 });
  }

  const safeUser = { ...user };
  delete safeUser.password;
  return NextResponse.json({ success: true, user: safeUser });
}
