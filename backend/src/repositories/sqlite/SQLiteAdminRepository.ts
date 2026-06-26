import { IAdminRepository } from '../../interfaces/IAdminRepository';
import { AdminUser } from '../../models/types';
import { db } from './db';
import { v4 as uuidv4 } from 'uuid';

export class SQLiteAdminRepository implements IAdminRepository {
  async createAdmin(admin: Omit<AdminUser, 'id' | 'created_at'>): Promise<AdminUser> {
    const id = uuidv4();
    const created_at = new Date().toISOString();
    await db.run(
      `INSERT INTO admin_users (id, email, password_hash, role, created_at)
       VALUES (?, ?, ?, ?, ?)`,
      [id, admin.email, admin.password_hash, admin.role, created_at]
    );
    return { ...admin, id, created_at };
  }

  async getAdminByEmail(email: string): Promise<AdminUser | null> {
    const row = await db.get(`SELECT * FROM admin_users WHERE email = ?`, [email]);
    return row as AdminUser || null;
  }

  async getAllAdmins(): Promise<AdminUser[]> {
    const rows = await db.all(`SELECT * FROM admin_users`);
    return rows as AdminUser[];
  }
}
