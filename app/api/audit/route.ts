import { NextResponse } from 'next/server';
import { ServerDB } from '@/lib/server-db';
import { requireAuth } from '@/lib/session';

export async function GET(req: Request) {
  const auth = await requireAuth(req, 'admin');
  if ('errorResponse' in auth) return auth.errorResponse;

  const { searchParams } = new URL(req.url);
  const format = searchParams.get('format');

  if (format === 'csv') {
    const csvData = ServerDB.exportAuditLogsCsv();
    return new Response(csvData, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="sriwedari-audit-logs-${Date.now()}.csv"`,
      },
    });
  }

  const logs = ServerDB.getAuditLogs();
  return NextResponse.json({ success: true, data: logs });
}
