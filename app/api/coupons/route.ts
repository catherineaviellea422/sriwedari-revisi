import { NextResponse } from 'next/server';
import { ServerDB, requireAuth } from '@/backend';

export async function GET(req: Request) {
  const auth = await requireAuth(req, 'admin');
  if ('errorResponse' in auth) return auth.errorResponse;

  const coupons = ServerDB.getCoupons();
  return NextResponse.json({ success: true, data: coupons });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Check if validating coupon during checkout (allowed for visitors/users)
    if (body.action === 'validate' || (body.code && body.totalAmount !== undefined && !body.type)) {
      const res = ServerDB.validateCoupon(body.code, body.totalAmount || 0);
      return NextResponse.json({ success: res.valid, ...res });
    }

    // Creating/updating a coupon requires Admin
    const auth = await requireAuth(req, 'admin');
    if ('errorResponse' in auth) return auth.errorResponse;

    if (!body.code) {
      return NextResponse.json({ success: false, error: 'Kode kupon wajib diisi' }, { status: 400 });
    }

    const saved = ServerDB.saveCoupon(body);
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
      return NextResponse.json({ success: false, error: 'ID kupon wajib disertakan' }, { status: 400 });
    }
    const ok = ServerDB.deleteCoupon(id);
    return NextResponse.json({ success: ok });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
