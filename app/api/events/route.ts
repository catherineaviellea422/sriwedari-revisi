import { NextResponse } from 'next/server';
import { ServerDB } from '@/lib/server-db';
import { requireAuth } from '@/lib/session';

export async function GET() {
  const events = ServerDB.getEvents();
  return NextResponse.json({ success: true, data: events });
}

export async function POST(req: Request) {
  const auth = await requireAuth(req, 'admin');
  if ('errorResponse' in auth) return auth.errorResponse;

  try {
    const body = await req.json();
    if (!body.title || !body.date) {
      return NextResponse.json({ success: false, error: 'Data lakon acara belum lengkap' }, { status: 400 });
    }

    const saved = ServerDB.saveEvent(body);
    return NextResponse.json({ success: true, data: saved });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const auth = await requireAuth(req, 'admin');
  if ('errorResponse' in auth) return auth.errorResponse;

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ success: false, error: 'ID jadwal pementasan diperlukan' }, { status: 400 });
    }

    const deleted = ServerDB.deleteEvent(id);
    return NextResponse.json({ success: deleted });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
