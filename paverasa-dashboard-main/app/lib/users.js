import db from "./db";
import { hashPassword } from "./password";
import { ROLES } from "./roles";

export async function getUserByEmail(email) {
  const [rows] = await db.query(
    `
      SELECT id, name, email, role, hashed_password
      FROM users
      WHERE LOWER(email) = LOWER(?)
      LIMIT 1
    `,
    [email],
    "READ user by email",
  );

  return rows[0] || null;
}

export async function getUserById(id) {
  const [rows] = await db.query(
    "SELECT id, name, email, role, created_at FROM users WHERE id = ? LIMIT 1",
    [id],
    "READ user by id",
  );

  return rows[0] || null;
}

export async function emailExists(email) {
  const user = await getUserByEmail(email);

  return Boolean(user);
}

export async function createUser({ name, email, role, password }) {
  const hashedPassword = await hashPassword(password);

  const [result] = await db.query(
    `
      INSERT INTO users (name, email, role, hashed_password)
      VALUES (?, ?, ?, ?)
    `,
    [name, email, role, hashedPassword],
    "CREATE user",
  );

  return getUserById(result.insertId);
}

export const REGISTERABLE_ROLES = [ROLES.FINANCE_MANAGER, ROLES.EMPLOYEE];
