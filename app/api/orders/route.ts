import { NextResponse } from 'next/server';
import { ServerDB } from '@/lib/server-db';

export async function GET() {
  const orders = ServerDB.getOrders();
  return NextResponse.json({ success: true, data: orders });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (!body.costumeId || !body.userName) {
      return NextResponse.json({ success: false, error: 'Data pesanan tidak lengkap' }, { status: 400 });
    }

    const newOrder = ServerDB.createOrder(body);
    return NextResponse.json({ success: true, data: newOrder });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || 'Gagal membuat pesanan' }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { orderId, status, paymentProof } = body;

    if (!orderId) {
      return NextResponse.json({ success: false, error: 'Order ID wajib disertakan' }, { status: 400 });
    }

    if (body.qcStatus) {
      const updated = ServerDB.updateOrderQc(orderId, body.qcStatus, body.refundAmount || 0, body.deductionNote);
      return NextResponse.json({ success: true, data: updated });
    }

    if (paymentProof) {
      const updated = ServerDB.attachPaymentProof(orderId, paymentProof);
      return NextResponse.json({ success: true, data: updated });
    }

    if (status) {
      const updated = ServerDB.updateOrderStatus(orderId, status);
      return NextResponse.json({ success: true, data: updated });
    }

    return NextResponse.json({ success: false, error: 'Tidak ada perubahan diberikan' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || 'Gagal memperbarui pesanan' }, { status: 500 });
  }
}
