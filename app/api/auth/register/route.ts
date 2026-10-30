import { NextResponse } from 'next/server';
import { ServerDB } from '@/lib/server-db';
import { createSessionToken } from '@/lib/session';
import { UserItem, Role } from '@/lib/types';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, phone, password, role } = body;

    const cleanName = (name || '').trim();
    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanPhone = (phone || '').trim();
    const cleanPassword = (password || '').trim();
    const targetRole: Role = role === 'admin' ? 'admin' : 'user';

    // 1. Validations
    if (!cleanName) {
      return NextResponse.json(
        { success: false, error: 'Nama lengkap wajib diisi.' },
        { status: 400 }
      );
    }

    if (!cleanEmail || !cleanEmail.includes('@')) {
      return NextResponse.json(
        { success: false, error: 'Alamat email valid wajib diisi.' },
        { status: 400 }
      );
    }

    if (!cleanPassword || cleanPassword.length < 6) {
      return NextResponse.json(
        { success: false, error: 'Kata sandi minimal 6 karakter.' },
        { status: 400 }
      );
    }

    // 2. Check duplicate email in ServerDB
    const existingUsers = ServerDB.getUsers();
    const emailExists = existingUsers.some(
      (u) => u.email.toLowerCase() === cleanEmail
    );

    if (emailExists) {
      return NextResponse.json(
        {
          success: false,
          error: 'Alamat email ini sudah terdaftar. Silakan gunakan email lain atau masuk ke akun Anda.',
        },
        { status: 409 }
      );
    }

    // 3. Create new persistent UserItem
    const newUserId = 'usr-' + Date.now();
    const newUser: UserItem = {
      id: newUserId,
      name: cleanName,
      email: cleanEmail,
      phone: cleanPhone || '-',
      password: cleanPassword,
      role: targetRole,
      status: 'active',
      points: targetRole === 'admin' ? 1000 : 250,
      registeredAt: new Date().toISOString().split('T')[0],
    };

    // Save permanently to server database
    ServerDB.saveUser(newUser);

    // 4. Generate cryptographically verified session token
    const token = await createSessionToken(newUser);

    // 5. Strip sensitive password before response
    const safeUser = { ...newUser };
    delete safeUser.password;

    const res = NextResponse.json({
      success: true,
      user: safeUser,
      token,
      message: `Pendaftaran berhasil! Sugeng rawuh, ${safeUser.name}.`,
    });

    // 6. Set HTTP-Only Cookie
    res.cookies.set({
      name: 'sriwedari_session',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    // 7. Audit Log
    ServerDB.logAudit(
      'UPDATE_SETTINGS',
      `Pendaftaran akun baru: ${newUser.name} (${newUser.email}) sebagai ${newUser.role.toUpperCase()}`,
      'info',
      newUser.name,
      newUser.role === 'admin' ? 'Admin' : 'User'
    );

    return res;
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Terjadi kesalahan pada server saat pendaftaran.' },
      { status: 500 }
    );
  }
}

