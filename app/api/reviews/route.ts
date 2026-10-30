import { NextResponse } from 'next/server';
import { ServerDB } from '@/lib/server-db';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const targetId = searchParams.get('targetId') || undefined;
  const reviews = ServerDB.getReviews(targetId);
  return NextResponse.json({ success: true, data: reviews });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (!body.targetId || !body.comment) {
      return NextResponse.json({ success: false, error: 'Data ulasan tidak lengkap' }, { status: 400 });
    }

    const review = ServerDB.addReview(body);
    return NextResponse.json({ success: true, data: review });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
