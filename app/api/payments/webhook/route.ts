import { NextResponse } from 'next/server';
import { ServerDB } from '@/backend';

export async function POST(req: Request) {
  try {
    const payload = await req.json();
    const { orderId, transactionStatus, paymentType, grossAmount } = payload;

    if (!orderId) {
      return NextResponse.json({ success: false, error: 'orderId is required' }, { status: 400 });
    }

    const order = ServerDB.getOrderById(orderId);
    if (!order) {
      return NextResponse.json({ success: false, error: `Order ${orderId} not found` }, { status: 404 });
    }

    // Process automated payment confirmation
    if (transactionStatus === 'settlement' || transactionStatus === 'capture' || transactionStatus === 'paid') {
      ServerDB.updateOrderStatus(orderId, 'Dikonfirmasi');
      ServerDB.logAudit(
        'VERIFY_PAYMENT',
        `Payment Gateway Callback (${paymentType || 'QRIS'}) mengonfirmasi pembayaran lunas Rp ${(grossAmount || order.totalPrice).toLocaleString('id-ID')} untuk invoice ${orderId}`,
        'info',
        'Payment Gateway (Midtrans/Xendit)',
        'Sistem Otomatis'
      );

      return NextResponse.json({
        success: true,
        message: `Pembayaran pesanan ${orderId} berhasil diverifikasi otomatis oleh Gateway`,
        orderId,
        status: 'Dikonfirmasi',
      });
    }

    if (transactionStatus === 'expire' || transactionStatus === 'cancel') {
      ServerDB.updateOrderStatus(orderId, 'Dibatalkan');
      ServerDB.logAudit(
        'VERIFY_PAYMENT',
        `Payment Gateway membatalkan tagihan ${orderId} karena kedaluwarsa`,
        'warning',
        'Payment Gateway',
        'Sistem'
      );
      return NextResponse.json({ success: true, status: 'Dibatalkan' });
    }

    return NextResponse.json({ success: true, status: order.status });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
