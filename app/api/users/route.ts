import { NextResponse } from 'next/server';
import { ServerDB } from '@/lib/server-db';
import { requireAuth, hashPassword } from '@/lib/session';

export async function GET(req: Request) {
  const auth = await requireAuth(req, 'admin');
  if ('errorResponse' in auth) return auth.errorResponse;

  const users = ServerDB.getUsers().map(u => {
    const safe = { ...u };
    delete safe.password;
    return safe;
  });
  return NextResponse.json({ success: true, data: users });
}

export async function POST(req: Request) {
  const auth = await requireAuth(req, 'admin');
  if ('errorResponse' in auth) return auth.errorResponse;

  try {
    const body = await req.json();
    if (!body.name || !body.email) {
      return NextResponse.json({ success: false, error: 'Nama dan email wajib diisi' }, { status: 400 });
    }

    if (body.password) {
      body.password = await hashPassword(body.password.trim());
      body.passwordChangedAt = new Date().toISOString();
    }

    const saved = ServerDB.saveUser(body);
    const safe = { ...saved };
    delete safe.password;
    return NextResponse.json({ success: true, data: safe }, { status: 201 });
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
      return NextResponse.json({ success: false, error: 'ID pengguna wajib disertakan' }, { status: 400 });
    }
    const ok = ServerDB.deleteUser(id);
    return NextResponse.json({ success: ok });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
