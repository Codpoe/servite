import crypto from 'crypto';

export function randomString() {
  return crypto.randomBytes(20).toString('hex');
}
