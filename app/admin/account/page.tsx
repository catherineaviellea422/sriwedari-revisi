'use client';

import React, { useEffect, useState } from 'react';
import { SriwedariDB } from '@/lib/db';
import { UserItem, Role } from '@/lib/types';
import { X } from 'lucide-react';

export default function AdminAccountPage() {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  
  // New User Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('rahasia123');
  const [role, setRole] = useState<Role>('user');

  useEffect(() => {
    loadUsers();
    const handleUpdate = () => loadUsers();
    window.addEventListener('sriwedari_db_updated', handleUpdate);
    return () => window.removeEventListener('sriwedari_db_updated', handleUpdate);
  }, []);

  const loadUsers = () => {
    setUsers(SriwedariDB.getUsers());
  };

  const handleToggleRole = (u: UserItem) => {
    const newRole: Role = u.role === 'admin' ? 'user' : 'admin';
    SriwedariDB.saveUser({ ...u, role: newRole });
    loadUsers();
  };

  const handleDeleteUser = (id: string) => {
    if (confirm('Yakin ingin menghapus pengguna ini dari sistem?')) {
      SriwedariDB.deleteUser(id);
      loadUsers();
    }
  };

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    const newUser: UserItem = {
      id: 'usr-' + Date.now(),
      name,
      email,
      phone,
      password: password.trim() || 'rahasia123',
      role,
      status: 'active',
      points: role === 'admin' ? 1000 : 100,
      registeredAt: new Date().toISOString().split('T')[0],
    };
    SriwedariDB.saveUser(newUser);
    setShowModal(false);
    setName('');
    setEmail('');
    setPhone('');
    setPassword('rahasia123');
    loadUsers();
  };

  const filtered = users.filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    u.phone.includes(search)
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-bold gold-gradient-text">
            Kelola Akun &amp; Pengguna (Admin &amp; User)
          </h1>
          <p className="text-xs text-canvas/70 mt-0.5">
            Manajemen hak akses kurator pementasan dan akun pengunjung terdaftar ({users.length} akun)
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="self-start sm:self-auto px-4 py-2.5 rounded-xl bg-brand-gold text-brand-green-dark font-semibold text-xs hover:brightness-110 transition flex items-center gap-1.5 shadow-md"
        >
          <span className="material-symbols-outlined text-base">person_add</span>
          <span>Tambah Akun Baru</span>
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <span className="material-symbols-outlined absolute left-3.5 top-3 text-brand-gold/70 text-lg">
          search
        </span>
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari berdasarkan nama pengguna, email, atau nomor telepon..."
          className="w-full h-11 pl-11 pr-4 bg-[#14382C]/90 border border-brand-gold/20 rounded-2xl text-xs text-white placeholder-canvas/40 focus:outline-none focus:border-brand-gold"
        />
      </div>

      {/* Table */}
      <div className="rounded-3xl bg-[#14382C]/80 border border-brand-gold/20 overflow-hidden shadow-sm">
        <table className="w-full text-left text-xs">
          <thead className="bg-black/40 text-canvas/60 uppercase text-[10px] tracking-wider border-b border-brand-gold/20">
            <tr>
              <th className="py-3.5 px-4">Pengguna</th>
              <th className="py-3.5 px-4">Kontak</th>
              <th className="py-3.5 px-4">Peran (Role)</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4">Poin</th>
              <th className="py-3.5 px-4 text-right">Tindakan</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filtered.map((u) => (
              <tr key={u.id} className="hover:bg-white/5 transition">
                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-brand-gold/20 border border-brand-gold/30 text-brand-gold flex items-center justify-center font-bold text-xs">
                      {u.name.charAt(0)}
                    </div>
                    <div>
                      <span className="font-semibold text-white block">{u.name}</span>
                      <span className="text-[10px] text-canvas/50">Daftar: {u.registeredAt}</span>
                    </div>
                  </div>
                </td>
                <td className="py-3.5 px-4">
                  <span className="text-canvas/90 block">{u.email}</span>
                  <span className="text-[10px] text-canvas/50">{u.phone}</span>
                </td>
                <td className="py-3.5 px-4">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${
                      u.role === 'admin'
                        ? 'bg-purple-950/60 text-purple-300 border-purple-500/40'
                        : 'bg-emerald-950/60 text-emerald-300 border-emerald-500/40'
                    }`}
                  >
                    {u.role === 'admin' ? 'Administrator' : 'Pengguna / Tamu'}
                  </span>
                </td>
                <td className="py-3.5 px-4">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-500/20 text-emerald-300">
                    {u.status}
                  </span>
                </td>
                <td className="py-3.5 px-4 font-mono font-bold text-brand-gold">{u.points}</td>
                <td className="py-3.5 px-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => handleToggleRole(u)}
                      className="px-2.5 py-1 rounded-lg bg-black/40 hover:bg-black/60 text-brand-gold border border-brand-gold/30 text-[11px] font-medium transition"
                      title="Ubah peran"
                    >
                      {u.role === 'admin' ? 'Set User' : 'Set Admin'}
                    </button>
                    <button
                      onClick={() => handleDeleteUser(u.id)}
                      className="w-7 h-7 rounded-lg bg-red-950/60 hover:bg-red-900 border border-red-500/30 text-red-300 flex items-center justify-center transition"
                      title="Hapus akun"
                    >
                      <span className="material-symbols-outlined text-sm">delete</span>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Add User */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#14382C] border border-brand-gold/40 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl relative text-canvas">
            <button
              aria-label="Tutup"
              onClick={() => setShowModal(false)}
              className="flex items-center justify-center absolute top-4 right-4 w-8 h-8 rounded-full bg-black/40 text-canvas hover:text-white"
            >
              <X className="w-4 h-4" strokeWidth={2.25} aria-hidden="true" />
            </button>

            <h3 className="font-serif text-lg font-bold gold-gradient-text">
              Tambah Pengguna / Kurator Baru
            </h3>

            <form onSubmit={handleCreateUser} className="space-y-3 text-xs">
              <div>
                <label className="block text-canvas/80 mb-1">Nama Lengkap:</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="misal: Raden Mas Bagus"
                  className="w-full h-10 px-3 rounded-xl bg-black/40 border border-brand-gold/20 text-white"
                />
              </div>

              <div>
                <label className="block text-canvas/80 mb-1">Email:</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="bagus@keraton.id"
                  className="w-full h-10 px-3 rounded-xl bg-black/40 border border-brand-gold/20 text-white"
                />
              </div>

              <div>
                <label className="block text-canvas/80 mb-1">Nomor WhatsApp:</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="081233445566"
                  className="w-full h-10 px-3 rounded-xl bg-black/40 border border-brand-gold/20 text-white"
                />
              </div>

              <div>
                <label className="block text-canvas/80 mb-1">Kata Sandi Akun:</label>
                <input
                  type="text"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="rahasia123"
                  className="w-full h-10 px-3 rounded-xl bg-black/40 border border-brand-gold/20 text-white"
                />
              </div>

              <div>
                <label className="block text-canvas/80 mb-1">Peran Akses:</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as Role)}
                  className="w-full h-10 px-3 rounded-xl bg-black/40 border border-brand-gold/20 text-white"
                >
                  <option value="user">Pengguna / Tamu</option>
                  <option value="admin">Administrator / Kurator</option>
                </select>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="submit"
                  className="flex-1 h-10 bg-brand-gold text-brand-green-dark font-bold text-xs rounded-xl shadow-md hover:brightness-110"
                >
                  Simpan Pengguna
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 h-10 bg-black/40 border border-brand-gold/20 text-canvas rounded-xl text-xs"
                >
                  Batal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
