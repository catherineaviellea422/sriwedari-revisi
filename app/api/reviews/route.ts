import { NextResponse } from 'next/server';
import { ServerDB, getServerSession, requireAuth } from '@/backend';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const targetId = searchParams.get('targetId') || undefined;
  const session = await getServerSession(req);

  const reviews = ServerDB.getReviews(targetId);
  // Admin sees all reviews; normal users and guests only see 'tampil'
  if (session && session.role === 'admin') {
    return NextResponse.json({ success: true, data: reviews });
  }

  const visibleReviews = reviews.filter(r => r.status !== 'disembunyikan');
  return NextResponse.json({ success: true, data: visibleReviews });
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(req);
    if (!session) {
      return NextResponse.json({ success: false, error: 'Sesi autentikasi diperlukan untuk menulis ulasan' }, { status: 401 });
    }

    const body = await req.json();
    if (!body.targetId || !body.comment) {
      return NextResponse.json({ success: false, error: 'Data ulasan tidak lengkap' }, { status: 400 });
    }

    const review = ServerDB.addReview({
      targetId: body.targetId,
      targetType: body.targetType || 'costume',
      userName: session.name || body.userName,
      rating: Math.min(5, Math.max(1, Number(body.rating) || 5)),
      comment: body.comment.trim(),
      verified: true,
      status: 'tampil',
    });
    return NextResponse.json({ success: true, data: review });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  const auth = await requireAuth(req, 'admin');
  if ('errorResponse' in auth) return auth.errorResponse;

  try {
    const { id, status } = await req.json();
    if (!id || (status !== 'tampil' && status !== 'disembunyikan')) {
      return NextResponse.json({ success: false, error: 'ID dan status ulasan (tampil/disembunyikan) diperlukan' }, { status: 400 });
    }

    const updated = ServerDB.updateReviewStatus(id, status);
    if (!updated) {
      return NextResponse.json({ success: false, error: 'Ulasan tidak ditemukan' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: updated });
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
      return NextResponse.json({ success: false, error: 'ID ulasan diperlukan' }, { status: 400 });
    }

    const deleted = ServerDB.deleteReview(id);
    return NextResponse.json({ success: deleted });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
