import { NextResponse } from 'next/server';
import { ServerDB } from '@/lib/server-db';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  if (id) {
    const item = ServerDB.getGalleryById(id);
    if (!item) {
      return NextResponse.json({ success: false, error: 'Karya tidak ditemukan' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: item });
  }

  const galleries = ServerDB.getGalleries();
  return NextResponse.json({ success: true, data: galleries });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (!body.title) {
      return NextResponse.json({ success: false, error: 'Judul karya wajib diisi' }, { status: 400 });
    }
    const saved = ServerDB.saveGallery(body);
    return NextResponse.json({ success: true, data: saved }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ success: false, error: 'ID karya wajib disertakan' }, { status: 400 });
    }
    const ok = ServerDB.deleteGallery(id);
    return NextResponse.json({ success: ok });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const { id } = await req.json();
    if (!id) {
      return NextResponse.json({ success: false, error: 'ID karya wajib diisi' }, { status: 400 });
    }
    const res = ServerDB.toggleLike(id);
    return NextResponse.json({ success: true, data: res });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

