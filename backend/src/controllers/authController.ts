import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { SQLiteAdminRepository } from '../repositories/sqlite/SQLiteAdminRepository';

const adminRepo = new SQLiteAdminRepository();
const JWT_SECRET = process.env.JWT_SECRET || 'amity-super-secret-key';

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const admin = await adminRepo.getAdminByEmail(email);

    if (!admin) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, admin.password_hash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: admin.id, email: admin.email, role: admin.role },
      JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({ token, user: { email: admin.email, role: admin.role } });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error });
  }
};

export const seedAdmin = async (req: Request, res: Response) => {
  try {
    const existing = await adminRepo.getAdminByEmail('admin@amity.edu');
    if (existing) {
      return res.json({ message: 'Admin already exists' });
    }
    const password_hash = await bcrypt.hash('admin123', 10);
    await adminRepo.createAdmin({
      email: 'admin@amity.edu',
      password_hash,
      role: 'superadmin'
    });
    res.json({ message: 'Default admin seeded (admin@amity.edu / admin123)' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to seed admin', error });
  }
};
