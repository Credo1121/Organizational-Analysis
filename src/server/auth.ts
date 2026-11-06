import { randomBytes, scryptSync, timingSafeEqual, createHash } from 'node:crypto';
import { cookies } from 'next/headers';
import { database, meta, setMeta } from './store';
export const cookieName = 'orglens_session';
export function configurePassword(password: string) {
  if (password.length < 12) throw new Error('Bitte mindestens 12 Zeichen verwenden.');
  const salt = randomBytes(16).toString('hex');
  setMeta('password', salt + ':' + scryptSync(password, salt, 64).toString('hex'));
  database().exec('DELETE FROM sessions');
}
const hash = (s: string) => createHash('sha256').update(s).digest('hex');
export function checkPassword(password: string) {
  const saved = meta('password');
  if (!saved) return false;
  const [salt, value] = saved.split(':');
  const candidate = scryptSync(password, salt, 64),
    expected = Buffer.from(value, 'hex');
  return expected.length === candidate.length && timingSafeEqual(expected, candidate);
}
export function createSession() {
  const token = randomBytes(32).toString('hex');
  database().prepare('DELETE FROM sessions WHERE expires < ?').run(Date.now());
  database()
    .prepare('INSERT INTO sessions VALUES(?,?)')
    .run(hash(token), Date.now() + 8 * 60 * 60 * 1000);
  return token;
}
export async function authenticated() {
  const value = (await cookies()).get(cookieName)?.value;
  if (!value) return false;
  const row = database().prepare('SELECT expires FROM sessions WHERE token=?').get(hash(value)) as
    { expires: number } | undefined;
  return !!row && row.expires > Date.now();
}
export async function endSession() {
  const value = (await cookies()).get(cookieName)?.value;
  if (value) database().prepare('DELETE FROM sessions WHERE token=?').run(hash(value));
}
