import { NextResponse } from 'next/server';
import { ServerDB } from '@/lib/server-db';
import { requireAuth } from '@/lib/session';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  if (id) {
    const item = ServerDB.getCostumeById(id);
    if (!item) {
      return NextResponse.json({ success: false, error: 'Busana tidak ditemukan' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: item });
  }

  const costumes = ServerDB.getCostumes();
  return NextResponse.json({ success: true, data: costumes });
}

export async function POST(req: Request) {
  const auth = await requireAuth(req, 'admin');
  if ('errorResponse' in auth) return auth.errorResponse;

  try {
    const body = await req.json();
    if (!body.name) {
      return NextResponse.json({ success: false, error: 'Nama busana wajib diisi' }, { status: 400 });
    }
    const saved = ServerDB.saveCostume(body);
    return NextResponse.json({ success: true, data: saved }, { status: 201 });
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
      return NextResponse.json({ success: false, error: 'ID busana wajib disertakan' }, { status: 400 });
    }
    const ok = ServerDB.deleteCostume(id);
    return NextResponse.json({ success: ok });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
