import { NextResponse } from 'next/server';
import { ServerDB, getServerSession, requireAuth } from '@/backend';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const eventId = searchParams.get('eventId');

  // Public endpoint for seating chart booked seats
  if (eventId) {
    const bookedSeats = ServerDB.getBookedSeats(eventId);
    return NextResponse.json({ success: true, bookedSeats });
  }

  const session = await getServerSession(req);
  if (!session) {
    return NextResponse.json({ success: false, error: 'Sesi diperlukan untuk melihat daftar tiket' }, { status: 401 });
  }

  const allTickets = ServerDB.getTickets();
  if (session.role === 'admin') {
    return NextResponse.json({ success: true, data: allTickets });
  }

  const userTickets = allTickets.filter(t => t.userName === session.name);
  return NextResponse.json({ success: true, data: userTickets });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!body.eventId || !body.seats || !Array.isArray(body.seats) || body.seats.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Pilih minimal satu nomor kursi pementasan!' },
        { status: 400 }
      );
    }

    // Atomic Booking with Collision Protection
    const result = ServerDB.bookTicketAtomic(body);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 409 } // 409 Conflict
      );
    }

    return NextResponse.json({ success: true, data: result.ticket }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Gagal memproses tiket pementasan' },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  const auth = await requireAuth(req, 'admin');
  if ('errorResponse' in auth) return auth.errorResponse;

  try {
    const { codeOrId } = await req.json();
    if (!codeOrId) {
      return NextResponse.json(
        { success: false, error: 'Kode tiket atau QR wajib disertakan' },
        { status: 400 }
      );
    }

    const result = ServerDB.validateGateTicket(codeOrId);
    return NextResponse.json(result, { status: result.success ? 200 : 400 });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Gagal memvalidasi tiket' },
      { status: 500 }
    );
  }
}
