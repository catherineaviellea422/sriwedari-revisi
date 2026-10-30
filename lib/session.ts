import { Role, UserItem } from './types';

export interface SessionPayload {
  id: string;
  name: string;
  email: string;
  role: Role;
  expiresAt: number;
}

const SESSION_SECRET = process.env.SESSION_SECRET || 'sriwedari-keraton-surakarta-secret-2026-production-grade';

function base64UrlEncode(bytes: Uint8Array): string {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

function base64UrlDecode(str: string): Uint8Array {
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) {
    base64 += '=';
  }
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder();

async function getHmacKey(): Promise<CryptoKey> {
  return await crypto.subtle.importKey(
    'raw',
    textEncoder.encode(SESSION_SECRET),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify']
  );
}

export async function createSessionToken(user: UserItem): Promise<string> {
  const expiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000; // 7 days
  const payload: SessionPayload = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    expiresAt,
  };

  const jsonStr = JSON.stringify(payload);
  const payloadBytes = textEncoder.encode(jsonStr);
  const base64Payload = base64UrlEncode(payloadBytes);

  const key = await getHmacKey();
  const signatureBytes = await crypto.subtle.sign('HMAC', key, textEncoder.encode(base64Payload));
  const base64Signature = base64UrlEncode(new Uint8Array(signatureBytes));

  return `${base64Payload}.${base64Signature}`;
}

export async function verifySessionToken(token: string): Promise<SessionPayload | null> {
  try {
    if (!token || typeof token !== 'string') return null;
    const parts = token.split('.');
    if (parts.length !== 2) return null;

    const [base64Payload, sigPart] = parts;
    const key = await getHmacKey();
    const sigBytes = base64UrlDecode(sigPart);

    const isValid = await crypto.subtle.verify(
      'HMAC',
      key,
      sigBytes as unknown as BufferSource,
      textEncoder.encode(base64Payload)
    );

    if (!isValid) return null;

    const payloadBytes = base64UrlDecode(base64Payload);
    const jsonStr = textDecoder.decode(payloadBytes);
    const payload: SessionPayload = JSON.parse(jsonStr);

    if (!payload.expiresAt || Date.now() > payload.expiresAt) return null;

    return payload;
  } catch {
    return null;
  }
}
