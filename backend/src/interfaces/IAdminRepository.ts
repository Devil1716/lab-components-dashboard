import { AdminUser } from '../../models/types';

export interface IAdminRepository {
  createAdmin(admin: Omit<AdminUser, 'id' | 'created_at'>): Promise<AdminUser>;
  getAdminByEmail(email: string): Promise<AdminUser | null>;
  getAllAdmins(): Promise<AdminUser[]>;
}
