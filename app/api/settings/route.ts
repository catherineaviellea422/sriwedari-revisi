import { NextResponse } from 'next/server';
import { ServerDB, requireAuth } from '@/backend';

export async function GET() {
  const settings = ServerDB.getSettings();
  return NextResponse.json({ success: true, data: settings });
}

export async function POST(req: Request) {
  const auth = await requireAuth(req, 'admin');
  if ('errorResponse' in auth) return auth.errorResponse;

  try {
    const body = await req.json();
    const saved = ServerDB.saveSettings(body);
    return NextResponse.json({ success: true, data: saved });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  const auth = await requireAuth(req, 'admin');
  if ('errorResponse' in auth) return auth.errorResponse;

  try {
    const initial = ServerDB.resetDB();
    return NextResponse.json({
      success: true,
      message: 'Basis data berhasil dikembalikan ke kondisi awal.',
      data: initial,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
