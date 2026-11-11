import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { getServerSession } from '@/backend';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(req);
    if (!session) {
      return NextResponse.json({ success: false, error: 'Sesi autentikasi diperlukan untuk mengunggah berkas' }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ success: false, error: 'Tidak ada berkas yang diunggah' }, { status: 400 });
    }

    // Validate MIME type
    const validMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg', 'image/gif'];
    if (!validMimes.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: 'Format berkas harus berupa gambar (JPG, PNG, WebP, atau GIF)' },
        { status: 400 }
      );
    }

    // Validate size (max 10MB)
    const MAX_SIZE = 10 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { success: false, error: 'Ukuran berkas maksimal 10 MB' },
        { status: 400 }
      );
    }

    // Target directory: public/uploads
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    // Create unique safe filename
    const ext = file.name.split('.').pop()?.toLowerCase() || 'png';
    const cleanExt = ext === 'jpeg' ? 'jpg' : ext;
    const rawPrefix = (formData.get('prefix') as string) || 'img';
    const cleanPrefix = rawPrefix.replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 20) || 'img';
    const filename = `${cleanPrefix}-${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${cleanExt}`;
    const filePath = path.join(uploadsDir, filename);

    // Write file to disk
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    fs.writeFileSync(filePath, buffer);

    const publicUrl = `/uploads/${filename}`;

    return NextResponse.json({
      success: true,
      url: publicUrl,
      filename,
      size: file.size,
      message: 'Berkas gambar berhasil disimpan ke penyimpanan server',
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || 'Gagal mengunggah berkas' }, { status: 500 });
  }
}
