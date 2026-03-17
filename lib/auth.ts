import { SignJWT } from 'jose';

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'anish-portfolio-secret-key-2024');
const ADMIN_USER = process.env.ADMIN_USER || 'anish';
const ADMIN_PASS = process.env.ADMIN_PASS || '';

export async function getJwtSecret() {
  return SECRET;
}

export async function createToken() {
  return new SignJWT({ role: 'admin' })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('24h')
    .setIssuedAt()
    .sign(SECRET);
}

export function validateCredentials(username: string, password: string) {
  return username === ADMIN_USER && password === ADMIN_PASS;
}
