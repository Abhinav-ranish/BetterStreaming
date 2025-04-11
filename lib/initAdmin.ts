// lib/initAdmin.ts
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export async function ensureAdminExists() {
  const existing = await prisma.user.findUnique({
    where: { email: 'admin@admin.com' },
  });

  if (!existing) {
    const hashed = await bcrypt.hash('admin123', 10);
    await prisma.user.create({
      data: {
        email: 'admin@admin.com',
        password: hashed,
        isAdmin: true,
      },
    });
    console.log('✅ Default admin created: admin@admin.com / admin123');
  }
}

