import { NextResponse } from 'next/server';
import { ServerDB, createSessionToken, verifyPassword, hashPassword } from '@/backend';

export async function POST(req: Request) {
  try {
    const { email, password, role } = await req.json();

    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanPassword = (password || '').trim();

    if (!cleanEmail) {
      return NextResponse.json(
        { success: false, error: 'Email atau ID pengguna wajib diisi.' },
        { status: 400 }
      );
    }

    if (!cleanPassword) {
      return NextResponse.json(
        { success: false, error: 'Kata sandi wajib diisi.' },
        { status: 400 }
      );
    }

    const users = ServerDB.getUsers();
    let user = users.find((u) => u.email.toLowerCase() === cleanEmail);

    // Support presentation quick aliases if matching known accounts
    if (!user) {
      if (
        cleanEmail === 'admin' ||
        cleanEmail === 'admin@sriwedari.id' ||
        cleanEmail === 'admin@galerisriwedari.id'
      ) {
        user = users.find((u) => u.role === 'admin');
      } else if (
        cleanEmail === 'tamu' ||
        cleanEmail === 'user' ||
        cleanEmail === 'tamu@sriwedari.id'
      ) {
        user = users.find((u) => u.role === 'user');
      }
    }

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: 'Kredensial tidak cocok. Pengguna dengan email ini tidak terdaftar dalam sistem.',
        },
        { status: 401 }
      );
    }

    // Role verification
    if (role && role === 'admin' && user.role !== 'admin') {
      return NextResponse.json(
        {
          success: false,
          error: 'Akun ini terdaftar sebagai Pengguna/Tamu dan tidak memiliki otorisasi akses Kurator/Administrator.',
        },
        { status: 403 }
      );
    }

    // Strict Password verification (supports PBKDF2 hash & graceful migration)
    if (!user.password) {
      return NextResponse.json(
        { success: false, error: 'Akun ini tidak memiliki kata sandi aktif. Silakan hubungi administrator.' },
        { status: 401 }
      );
    }

    const isMatch = await verifyPassword(cleanPassword, user.password);
    if (!isMatch) {
      return NextResponse.json(
        { success: false, error: 'Kata sandi salah. Silakan periksa kembali kata sandi Anda.' },
        { status: 401 }
      );
    }

    // Auto-migrate plaintext password to PBKDF2 hash on successful login
    if (!user.password.startsWith('pbkdf2:')) {
      user.password = await hashPassword(cleanPassword);
      user.passwordChangedAt = new Date().toISOString();
      ServerDB.saveUser(user);
    }

    // Account active status check
    if (user.status !== 'active') {
      return NextResponse.json(
        { success: false, error: 'Akun Anda dinonaktifkan oleh administrator.' },
        { status: 403 }
      );
    }

    // Generate tamper-proof session token
    const token = await createSessionToken(user);

    // Strip sensitive fields
    const safeUser = { ...user };
    delete safeUser.password;

    const res = NextResponse.json({
      success: true,
      user: safeUser,
      token,
      message: `Sugeng rawuh, ${user.name}! Sesi autentikasi berhasil dibuat.`,
    });

    res.cookies.set({
      name: 'sriwedari_session',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    ServerDB.logAudit(
      'UPDATE_SETTINGS',
      `Sesi login autentik berhasil untuk ${user.email} (${user.role.toUpperCase()})`,
      'info',
      user.name,
      user.role === 'admin' ? 'Admin' : 'User'
    );

    return res;
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
