import { NextResponse } from 'next/server';
import { ServerDB } from '@/lib/server-db';
import { requireAuth } from '@/lib/session';

export async function GET(req: Request) {
  const auth = await requireAuth(req, 'admin');
  if ('errorResponse' in auth) return auth.errorResponse;

  const { searchParams } = new URL(req.url);
  const costumeId = searchParams.get('costumeId') || undefined;

  const movements = ServerDB.getStockMovements(costumeId);
  return NextResponse.json({ success: true, data: movements });
}

export async function POST(req: Request) {
  const auth = await requireAuth(req, 'admin');
  if ('errorResponse' in auth) return auth.errorResponse;

  try {
    const body = await req.json();
    if (!body.costumeId || body.delta === undefined) {
      return NextResponse.json({ success: false, error: 'Data mutasi stok tidak lengkap' }, { status: 400 });
    }

    const costume = ServerDB.getCostumeById(body.costumeId);
    if (!costume) {
      return NextResponse.json({ success: false, error: 'Busana tidak ditemukan' }, { status: 404 });
    }

    const delta = Number(body.delta) || 0;
    costume.stock = Math.max(0, costume.stock + delta);
    ServerDB.saveCostume(costume);

    const movement = ServerDB.recordStockMovement({
      costumeId: costume.id,
      costumeName: costume.name,
      size: body.size || 'All Size',
      delta,
      stockAfter: costume.stock,
      reason: body.reason || 'koreksi',
      note: body.note || 'Penyesuaian manual oleh Kurator Admin',
      actorName: auth.session.name,
      orderId: body.orderId,
    });

    return NextResponse.json({ success: true, data: movement, costume });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

