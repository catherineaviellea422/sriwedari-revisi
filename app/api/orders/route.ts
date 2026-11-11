import { NextResponse } from 'next/server';
import { ServerDB, getServerSession, requireAuth } from '@/backend';

export async function GET(req: Request) {
  const session = await getServerSession(req);
  if (!session) {
    return NextResponse.json({ success: false, error: 'Sesi diperlukan untuk melihat daftar pesanan' }, { status: 401 });
  }

  const allOrders = ServerDB.getOrders();
  if (session.role === 'admin') {
    return NextResponse.json({ success: true, data: allOrders });
  }

  // Filter to user's own orders
  const userOrders = allOrders.filter(
    o => o.userEmail?.toLowerCase() === session.email.toLowerCase() || o.userName === session.name
  );
  return NextResponse.json({ success: true, data: userOrders });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (!body.costumeId || !body.userName) {
      return NextResponse.json({ success: false, error: 'Data pesanan tidak lengkap' }, { status: 400 });
    }

    // Server-side price calculation to avoid client tampering
    const costume = ServerDB.getCostumeById(body.costumeId);
    if (!costume) {
      return NextResponse.json({ success: false, error: 'Busana tidak ditemukan dalam database' }, { status: 404 });
    }

    const duration = Math.max(1, Number(body.duration) || 1);
    const settings = ServerDB.getSettings();
    const depositFee = settings.depositFee || 100000;
    const subtotal = costume.price * duration;

    let discount = 0;
    let validCouponCode = undefined;
    if (body.couponCode) {
      const couponRes = ServerDB.validateCoupon(body.couponCode, subtotal);
      if (couponRes.valid) {
        discount = couponRes.discount;
        validCouponCode = body.couponCode.toUpperCase();
      }
    }

    const calculatedTotal = Math.max(0, subtotal - discount) + depositFee;

    const orderData = {
      ...body,
      duration,
      depositFee,
      discountAmount: discount,
      couponCode: validCouponCode,
      totalPrice: calculatedTotal,
      status: 'Menunggu' as const,
    };

    const newOrder = ServerDB.createOrder(orderData);
    return NextResponse.json({ success: true, data: newOrder });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || 'Gagal membuat pesanan' }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { orderId, status, paymentProof, qcStatus, refundAmount, deductionNote } = body;

    if (!orderId) {
      return NextResponse.json({ success: false, error: 'Order ID wajib disertakan' }, { status: 400 });
    }

    // Attaching payment proof can be done by user or admin
    if (paymentProof) {
      const updated = ServerDB.attachPaymentProof(orderId, paymentProof);
      return NextResponse.json({ success: true, data: updated });
    }

    // Updating QC status or order status (except cancellation) requires Admin
    const auth = await requireAuth(req, 'admin');
    if ('errorResponse' in auth) {
      // If user wants to cancel their own pending order, allow it
      const session = await getServerSession(req);
      if (session && status === 'Dibatalkan') {
        const order = ServerDB.getOrderById(orderId);
        if (order && (order.userEmail?.toLowerCase() === session.email.toLowerCase() || order.userName === session.name)) {
          const updated = ServerDB.updateOrderStatus(orderId, 'Dibatalkan');
          return NextResponse.json({ success: true, data: updated });
        }
      }
      return auth.errorResponse;
    }

    if (qcStatus) {
      const updated = ServerDB.updateOrderQc(orderId, qcStatus, refundAmount || 0, deductionNote);
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
