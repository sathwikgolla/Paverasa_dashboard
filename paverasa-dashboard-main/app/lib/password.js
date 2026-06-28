import bcrypt from "bcryptjs";

const SALT_ROUNDS = 12;

export async function hashPassword(password) {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function verifyPassword(password, storedHash) {
  if (!storedHash || !password) {
    return false;
  }

  return bcrypt.compare(password, storedHash);
}
