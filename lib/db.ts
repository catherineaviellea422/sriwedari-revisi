import {
  GalleryItem, CategoryItem, CostumeItem, OrderItem, EventItem, TicketItem,
  UserItem, CouponItem, AuditLogItem, ReviewItem, SettingsItem
} from './types';
import {
  INITIAL_GALLERIES, INITIAL_CATEGORIES, INITIAL_COSTUMES, INITIAL_ORDERS,
  INITIAL_EVENTS, INITIAL_TICKETS, INITIAL_USERS, INITIAL_COUPONS,
  INITIAL_AUDIT_LOGS, INITIAL_SETTINGS, INITIAL_REVIEWS
} from './seed-data';

const STORAGE_KEY = 'SRIWEDARI_APP_DB_V2';
const WISHLIST_KEY = 'SRIWEDARI_WISHLIST_V2';
const CURRENT_USER_KEY = 'SRIWEDARI_CURRENT_USER_V2';

interface DBState {
  galleries: GalleryItem[];
  categories: CategoryItem[];
  costumes: CostumeItem[];
  orders: OrderItem[];
  events: EventItem[];
  tickets: TicketItem[];
  users: UserItem[];
  coupons: CouponItem[];
  auditLogs: AuditLogItem[];
  reviews: ReviewItem[];
  settings: SettingsItem;
}

function getInitialState(): DBState {
  return {
    galleries: JSON.parse(JSON.stringify(INITIAL_GALLERIES)),
    categories: JSON.parse(JSON.stringify(INITIAL_CATEGORIES)),
    costumes: JSON.parse(JSON.stringify(INITIAL_COSTUMES)),
    orders: JSON.parse(JSON.stringify(INITIAL_ORDERS)),
    events: JSON.parse(JSON.stringify(INITIAL_EVENTS)),
    tickets: JSON.parse(JSON.stringify(INITIAL_TICKETS)),
    users: JSON.parse(JSON.stringify(INITIAL_USERS)),
    coupons: JSON.parse(JSON.stringify(INITIAL_COUPONS)),
    auditLogs: JSON.parse(JSON.stringify(INITIAL_AUDIT_LOGS)),
    reviews: JSON.parse(JSON.stringify(INITIAL_REVIEWS)),
    settings: JSON.parse(JSON.stringify(INITIAL_SETTINGS)),
  };
}

class SriwedariDBService {
  private inMemoryState: DBState | null = null;
  private syncChannel: BroadcastChannel | null = null;
  private hasHydratedFromServer = false;

  constructor() {
    if (this.isBrowser()) {
      // Cross-tab real-time sync channel
      if ('BroadcastChannel' in window) {
        this.syncChannel = new BroadcastChannel('sriwedari_realtime_sync');
        this.syncChannel.onmessage = (event) => {
          if (event.data?.type === 'SYNC_STATE' && event.data?.state) {
            this.inMemoryState = event.data.state;
            try {
              localStorage.setItem(STORAGE_KEY, JSON.stringify(this.inMemoryState));
            } catch {}
            window.dispatchEvent(new CustomEvent('sriwedari_db_updated', { detail: this.inMemoryState }));
          }
        };
      }

      // Initial background sync with server-truth
      this.syncFromServer();
    }
  }

  private isBrowser(): boolean {
    return typeof window !== 'undefined';
  }

  public async syncFromServer(): Promise<void> {
    if (!this.isBrowser()) return;
    try {
      const res = await fetch('/api/sync');
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          this.inMemoryState = json.data;
          this.hasHydratedFromServer = true;
          try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(json.data));
          } catch {}
          window.dispatchEvent(new CustomEvent('sriwedari_db_updated', { detail: json.data }));
        }
      }
    } catch {
      // Fallback to local
    }
  }

  private loadDB(): DBState {
    if (this.inMemoryState) {
      return this.inMemoryState;
    }

    if (!this.isBrowser()) return getInitialState();

    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        const initial = getInitialState();
        localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
        this.inMemoryState = initial;
        return initial;
      }
      this.inMemoryState = JSON.parse(raw);
      return this.inMemoryState!;
    } catch {
      const fallback = getInitialState();
      this.inMemoryState = fallback;
      return fallback;
    }
  }

  private saveDB(data: DBState): void {
    this.inMemoryState = data;
    if (!this.isBrowser()) return;

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      window.dispatchEvent(new CustomEvent('sriwedari_db_updated', { detail: data }));
      if (this.syncChannel) {
        this.syncChannel.postMessage({ type: 'SYNC_STATE', state: data });
      }
    } catch (e) {
      console.error('Failed to save to localStorage', e);
    }
  }

  // ==========================================
  // SESSION
  // ==========================================
  getCurrentUser(): UserItem | null {
    if (!this.isBrowser()) return null;
    try {
      const raw = localStorage.getItem(CURRENT_USER_KEY);
      if (!raw) {
        const defaultUser = INITIAL_USERS.find(u => u.role === 'user') || null;
        if (defaultUser) localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(defaultUser));
        return defaultUser;
      }
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }

  setCurrentUser(user: UserItem | null): void {
    if (!this.isBrowser()) return;
    if (!user) {
      localStorage.removeItem(CURRENT_USER_KEY);
    } else {
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    }
    window.dispatchEvent(new CustomEvent('sriwedari_user_changed', { detail: user }));
  }

  // ==========================================
  // RESET
  // ==========================================
  resetDB(): void {
    const initial = getInitialState();
    this.saveDB(initial);
    if (this.isBrowser()) {
      localStorage.removeItem(WISHLIST_KEY);
    }
    this.logAudit('RESET_DB', 'Sistem mengembalikan seluruh basis data ke kondisi awal pementasan', 'warning');
    // Background server reset
    fetch('/api/settings', { method: 'PUT' }).catch(() => {});
  }

  // ==========================================
  // GALLERIES
  // ==========================================
  getGalleries(): GalleryItem[] {
    return this.loadDB().galleries;
  }

  getGalleryById(id: string): GalleryItem | undefined {
    return this.getGalleries().find(g => g.id === id);
  }

  saveGallery(gallery: GalleryItem): void {
    const db = this.loadDB();
    const idx = db.galleries.findIndex(g => g.id === gallery.id);
    if (idx >= 0) {
      db.galleries[idx] = gallery;
    } else {
      if (!gallery.id) gallery.id = 'gal-' + Date.now();
      db.galleries.unshift(gallery);
    }
    this.saveDB(db);

    // Sync to server
    fetch('/api/galleries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(gallery),
    }).catch(() => {});
  }

  deleteGallery(id: string): void {
    const db = this.loadDB();
    db.galleries = db.galleries.filter(g => g.id !== id);
    this.saveDB(db);

    // Sync to server
    fetch(`/api/galleries?id=${encodeURIComponent(id)}`, { method: 'DELETE' }).catch(() => {});
  }

  toggleLike(galleryId: string): boolean {
    const db = this.loadDB();
    const item = db.galleries.find(g => g.id === galleryId);
    if (!item) return false;
    item.isLiked = !item.isLiked;
    item.likes = Math.max(0, (item.likes || 0) + (item.isLiked ? 1 : -1));
    this.saveDB(db);

    // Sync to server
    fetch('/api/galleries', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: galleryId }),
    }).catch(() => {});

    return !!item.isLiked;
  }

  // ==========================================
  // WISHLIST
  // ==========================================
  getWishlist(): string[] {
    if (!this.isBrowser()) return [];
    try {
      const raw = localStorage.getItem(WISHLIST_KEY);
      return raw ? JSON.parse(raw) : ['gal-1', 'gal-3'];
    } catch {
      return [];
    }
  }

  toggleWishlist(itemId: string): boolean {
    if (!this.isBrowser()) return false;
    const list = this.getWishlist();
    const exists = list.includes(itemId);
    const updated = exists ? list.filter(id => id !== itemId) : [...list, itemId];
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('sriwedari_wishlist_updated', { detail: updated }));
    return !exists;
  }

  // ==========================================
  // CATEGORIES
  // ==========================================
  getCategories(): CategoryItem[] {
    return this.loadDB().categories;
  }

  saveCategory(cat: CategoryItem): void {
    const db = this.loadDB();
    const idx = db.categories.findIndex(c => c.id === cat.id);
    if (idx >= 0) {
      db.categories[idx] = cat;
    } else {
      if (!cat.id) cat.id = 'cat-' + Date.now();
      db.categories.push(cat);
    }
    this.saveDB(db);

    fetch('/api/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cat),
    }).catch(() => {});
  }

  deleteCategory(id: string): void {
    const db = this.loadDB();
    db.categories = db.categories.filter(c => c.id !== id);
    this.saveDB(db);

    fetch(`/api/categories?id=${encodeURIComponent(id)}`, { method: 'DELETE' }).catch(() => {});
  }

  // ==========================================
  // COSTUMES
  // ==========================================
  getCostumes(): CostumeItem[] {
    return this.loadDB().costumes;
  }

  getCostumeById(id: string): CostumeItem | undefined {
    return this.getCostumes().find(c => c.id === id);
  }

  saveCostume(costume: CostumeItem): void {
    const db = this.loadDB();
    const idx = db.costumes.findIndex(c => c.id === costume.id);
    if (idx >= 0) {
      db.costumes[idx] = costume;
    } else {
      if (!costume.id) costume.id = 'costume-' + Date.now();
      db.costumes.push(costume);
    }
    this.saveDB(db);

    fetch('/api/costumes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(costume),
    }).catch(() => {});
  }

  deleteCostume(id: string): void {
    const db = this.loadDB();
    db.costumes = db.costumes.filter(c => c.id !== id);
    this.saveDB(db);

    fetch(`/api/costumes?id=${encodeURIComponent(id)}`, { method: 'DELETE' }).catch(() => {});
  }

  // ==========================================
  // ORDERS & QC
  // ==========================================
  getOrders(): OrderItem[] {
    return this.loadDB().orders;
  }

  getOrderById(id: string): OrderItem | undefined {
    return this.getOrders().find(o => o.id === id);
  }

  createOrder(order: Omit<OrderItem, 'id' | 'createdAt'>): OrderItem {
    const db = this.loadDB();
    const newId = 'ORD-' + new Date().getFullYear() + '-' + Math.floor(1000 + Math.random() * 9000);
    const newOrder: OrderItem = {
      ...order,
      id: newId,
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
    };
    db.orders.unshift(newOrder);

    // Decrement local costume stock
    const costume = db.costumes.find(c => c.id === order.costumeId);
    if (costume && costume.stock > 0) {
      costume.stock -= 1;
    }

    this.saveDB(db);
    this.logAudit('CREATE_ORDER', `Pesanan sewa ${newId} senilai Rp ${newOrder.totalPrice.toLocaleString('id-ID')} dibuat`, 'info');

    // Server-sync
    fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(order),
    }).catch(() => {});

    return newOrder;
  }

  updateOrderStatus(orderId: string, status: OrderItem['status']): void {
    const db = this.loadDB();
    const item = db.orders.find(o => o.id === orderId);
    if (!item) return;
    item.status = status;
    this.saveDB(db);
    this.logAudit('VERIFY_PAYMENT', `Pesanan ${orderId} diubah status menjadi "${status}"`, 'info');

    fetch('/api/orders', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderId, status }),
    }).catch(() => {});
  }

  updateOrderQc(orderId: string, qcStatus: OrderItem['qcStatus'], refundAmount: number, note?: string): void {
    const db = this.loadDB();
    const item = db.orders.find(o => o.id === orderId);
    if (!item) return;
    item.qcStatus = qcStatus;
    item.refundAmount = refundAmount;
    item.deductionNote = note;
    if (qcStatus && qcStatus !== 'Pending') {
      item.status = 'Selesai';
      const costume = db.costumes.find(c => c.id === item.costumeId);
      if (costume) costume.stock += 1;
    }
    this.saveDB(db);
    this.logAudit('QC_RETURN', `Inspeksi QC untuk pesanan ${orderId}: ${qcStatus}, Refund Rp ${refundAmount.toLocaleString('id-ID')}`, 'info');

    fetch('/api/orders', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderId, qcStatus, refundAmount, deductionNote: note }),
    }).catch(() => {});
  }

  attachPaymentProof(orderId: string, proofUrl: string): void {
    const db = this.loadDB();
    const item = db.orders.find(o => o.id === orderId);
    if (!item) return;
    item.paymentProof = proofUrl;
    this.saveDB(db);
    this.logAudit('VERIFY_PAYMENT', `Penyewa mengunggah slip transfer untuk pesanan ${orderId}`, 'info');

    fetch('/api/orders', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderId, paymentProof: proofUrl }),
    }).catch(() => {});
  }

  // ==========================================
  // EVENTS
  // ==========================================
  getEvents(): EventItem[] {
    return this.loadDB().events;
  }

  getEventById(id: string): EventItem | undefined {
    return this.getEvents().find(e => e.id === id);
  }

  saveEvent(event: EventItem): void {
    const db = this.loadDB();
    const idx = db.events.findIndex(e => e.id === event.id);
    if (idx >= 0) {
      db.events[idx] = event;
    } else {
      if (!event.id) event.id = 'evt-' + Date.now();
      db.events.push(event);
    }
    this.saveDB(db);
    this.logAudit('UPDATE_SETTINGS', `Jadwal pementasan "${event.title}" disimpan`, 'info');

    fetch('/api/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(event),
    }).catch(() => {});
  }

  deleteEvent(id: string): void {
    const db = this.loadDB();
    db.events = db.events.filter(e => e.id !== id);
    this.saveDB(db);
    this.logAudit('UPDATE_SETTINGS', `Jadwal pementasan ID ${id} dihapus`, 'warning');

    fetch(`/api/events?id=${encodeURIComponent(id)}`, { method: 'DELETE' }).catch(() => {});
  }

  // ==========================================
  // TICKETS & GATE CHECKIN
  // ==========================================
  getTickets(): TicketItem[] {
    return this.loadDB().tickets;
  }

  getBookedSeats(eventId: string): string[] {
    const tickets = this.getTickets().filter(t => t.eventId === eventId && t.status !== 'Kedaluwarsa');
    const seats: string[] = [];
    tickets.forEach(t => {
      if (t.seats && Array.isArray(t.seats)) {
        seats.push(...t.seats);
      }
    });
    return seats;
  }

  bookTicket(ticket: Omit<TicketItem, 'id' | 'bookingCode' | 'createdAt'>): TicketItem {
    const db = this.loadDB();
    const newId = 'TCK-' + new Date().getFullYear() + '-' + Math.floor(100 + Math.random() * 900);
    const bookingCode = 'SWD-' + Math.random().toString(36).substring(2, 7).toUpperCase();
    const newTicket: TicketItem = {
      ...ticket,
      id: newId,
      bookingCode,
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
    };
    db.tickets.unshift(newTicket);

    const evt = db.events.find(e => e.id === ticket.eventId);
    if (evt) {
      evt.booked = Math.min(evt.quota, (evt.booked || 0) + ticket.quantity);
    }

    this.saveDB(db);
    this.logAudit('BOOK_TICKET', `Reservasi tiket ${newTicket.bookingCode} (${ticket.quantity} kursi) di acara ${ticket.eventTitle}`, 'info');

    fetch('/api/tickets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(ticket),
    }).catch(() => {});

    return newTicket;
  }

  validateGateTicket(codeOrId: string): { success: boolean; message: string; ticket?: TicketItem } {
    const db = this.loadDB();
    const clean = codeOrId.trim().toUpperCase();
    const ticket = db.tickets.find(
      t => t.bookingCode.toUpperCase() === clean || t.id.toUpperCase() === clean
    );

    if (!ticket) {
      return { success: false, message: 'Tiket tidak ditemukan di sistem loket pementasan!' };
    }
    if (ticket.status === 'Check-in') {
      return { success: false, message: `Tiket ini sudah pernah digunakan check-in pada sistem gerbang!` };
    }
    if (ticket.status === 'Kedaluwarsa') {
      return { success: false, message: 'Tiket ini telah kedaluwarsa!' };
    }

    ticket.status = 'Check-in';
    this.saveDB(db);
    this.logAudit('GATE_CHECKIN', `Gate scanner mengonfirmasi masuk tiket ${ticket.bookingCode} (${ticket.userName})`, 'info');

    fetch('/api/tickets', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ codeOrId }),
    }).catch(() => {});

    return { success: true, message: `Check-in Berhasil! Silakan masuk pintu pementasan.`, ticket };
  }

  // ==========================================
  // USERS
  // ==========================================
  getUsers(): UserItem[] {
    return this.loadDB().users;
  }

  saveUser(user: UserItem): void {
    const db = this.loadDB();
    const idx = db.users.findIndex(u => u.id === user.id);
    if (idx >= 0) {
      db.users[idx] = user;
    } else {
      if (!user.id) user.id = 'usr-' + Date.now();
      db.users.push(user);
    }
    this.saveDB(db);

    fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user),
    }).catch(() => {});
  }

  deleteUser(id: string): void {
    const db = this.loadDB();
    db.users = db.users.filter(u => u.id !== id);
    this.saveDB(db);
    this.logAudit('DELETE_USER', `Pengguna ID ${id} dihapus dari sistem`, 'warning');

    fetch(`/api/users?id=${encodeURIComponent(id)}`, { method: 'DELETE' }).catch(() => {});
  }

  // ==========================================
  // COUPONS
  // ==========================================
  getCoupons(): CouponItem[] {
    return this.loadDB().coupons;
  }

  saveCoupon(coupon: CouponItem): void {
    const db = this.loadDB();
    const idx = db.coupons.findIndex(c => c.id === coupon.id);
    if (idx >= 0) {
      db.coupons[idx] = coupon;
    } else {
      if (!coupon.id) coupon.id = 'coup-' + Date.now();
      db.coupons.push(coupon);
    }
    this.saveDB(db);

    fetch('/api/coupons', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(coupon),
    }).catch(() => {});
  }

  deleteCoupon(id: string): void {
    const db = this.loadDB();
    db.coupons = db.coupons.filter(c => c.id !== id);
    this.saveDB(db);

    fetch(`/api/coupons?id=${encodeURIComponent(id)}`, { method: 'DELETE' }).catch(() => {});
  }

  validateCoupon(code: string, totalAmount: number): { valid: boolean; discount: number; message: string; coupon?: CouponItem } {
    const coupons = this.getCoupons();
    const match = coupons.find(c => c.code.toUpperCase() === code.trim().toUpperCase() && c.isActive);
    if (!match) {
      return { valid: false, discount: 0, message: 'Kode kupon tidak valid atau sudah nonaktif!' };
    }
    if (totalAmount < match.minOrder) {
      return {
        valid: false,
        discount: 0,
        message: `Minimal transaksi untuk kupon ini adalah Rp ${match.minOrder.toLocaleString('id-ID')}`
      };
    }
    let discount = 0;
    if (match.type === 'PERCENTAGE') {
      discount = Math.round((totalAmount * match.value) / 100);
    } else {
      discount = match.value;
    }
    return { valid: true, discount, message: `Kupon ${match.code} berhasil diterapkan!`, coupon: match };
  }

  // ==========================================
  // AUDIT LOGS
  // ==========================================
  getAuditLogs(): AuditLogItem[] {
    return this.loadDB().auditLogs;
  }

  logAudit(action: AuditLogItem['action'], details: string, severity: AuditLogItem['severity'] = 'info'): void {
    const db = this.loadDB();
    const currentUser = this.getCurrentUser();
    const newLog: AuditLogItem = {
      id: 'aud-' + Date.now(),
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      action,
      actorName: currentUser ? currentUser.name : 'Sistem / Anonim',
      actorRole: currentUser ? (currentUser.role === 'admin' ? 'Admin' : 'User') : 'Sistem',
      details,
      ipAddress: '127.0.0.1 (Client)',
      severity,
    };
    db.auditLogs.unshift(newLog);
    this.saveDB(db);
  }

  exportAuditLogsCsv(): string {
    const logs = this.getAuditLogs();
    const headers = ['ID', 'Waktu', 'Aksi', 'Aktor', 'Peran', 'Rincian', 'IP', 'Tingkat Keparahan'];
    const rows = logs.map(l => [
      l.id,
      `"${l.timestamp}"`,
      `"${l.action}"`,
      `"${l.actorName.replace(/"/g, '""')}"`,
      `"${l.actorRole}"`,
      `"${l.details.replace(/"/g, '""')}"`,
      `"${l.ipAddress}"`,
      `"${l.severity}"`
    ]);
    return '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  }

  // ==========================================
  // SETTINGS
  // ==========================================
  getSettings(): SettingsItem {
    return this.loadDB().settings;
  }

  saveSettings(settings: SettingsItem): void {
    const db = this.loadDB();
    db.settings = settings;
    this.saveDB(db);
    this.logAudit('UPDATE_SETTINGS', 'Pengaturan sistem sanggar diperbarui', 'info');

    fetch('/api/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings),
    }).catch(() => {});
  }

  // ==========================================
  // REVIEWS
  // ==========================================
  getReviews(targetId?: string): ReviewItem[] {
    const all = this.loadDB().reviews || [];
    if (!targetId) return all;
    return all.filter(r => r.targetId === targetId);
  }

  addReview(review: Omit<ReviewItem, 'id' | 'createdAt'>): ReviewItem {
    const db = this.loadDB();
    if (!db.reviews) db.reviews = [];
    const newId = 'rev-' + Date.now();
    const newReview: ReviewItem = {
      ...review,
      id: newId,
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 10),
    };
    db.reviews.unshift(newReview);
    this.saveDB(db);

    fetch('/api/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(review),
    }).catch(() => {});

    return newReview;
  }
}

export const SriwedariDB = new SriwedariDBService();

