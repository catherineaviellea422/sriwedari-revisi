import { NextResponse } from 'next/server';
import { ServerDB } from '@/lib/server-db';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const eventId = searchParams.get('eventId');

  if (eventId) {
    const bookedSeats = ServerDB.getBookedSeats(eventId);
    return NextResponse.json({ success: true, bookedSeats });
  }

  const tickets = ServerDB.getTickets();
  return NextResponse.json({ success: true, data: tickets });
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
