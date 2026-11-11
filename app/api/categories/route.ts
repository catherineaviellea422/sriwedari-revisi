import { NextResponse } from 'next/server';
import { ServerDB, requireAuth } from '@/backend';

export async function GET() {
  const categories = ServerDB.getCategories();
  return NextResponse.json({ success: true, data: categories });
}

export async function POST(req: Request) {
  const auth = await requireAuth(req, 'admin');
  if ('errorResponse' in auth) return auth.errorResponse;

  try {
    const body = await req.json();
    if (!body.name) {
      return NextResponse.json({ success: false, error: 'Nama kategori wajib diisi' }, { status: 400 });
    }
    const saved = ServerDB.saveCategory(body);
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
      return NextResponse.json({ success: false, error: 'ID kategori wajib disertakan' }, { status: 400 });
    }
    const ok = ServerDB.deleteCategory(id);
    return NextResponse.json({ success: ok });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
