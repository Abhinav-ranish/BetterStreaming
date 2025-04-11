// app/api/auth/login/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { compare } from 'bcryptjs';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !(await compare(password, user.password))) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  return NextResponse.json({ user: { id: user.id, email: user.email, isAdmin: user.isAdmin } });
}

// Auto-create admin account if not exists
async function initAdmin() {
  const existingAdmin = await prisma.user.findUnique({ where: { email: 'admin@admin.com' } });
  if (!existingAdmin) {
    const hashed = await import('@/lib/auth').then(mod => mod.hashPassword('admin123'));
    await prisma.user.create({
      data: {
        email: 'admin@admin.com',
        password: hashed,
        isAdmin: true,
      },
    });
    console.log('✅ Default admin created');
  }
}

initAdmin().catch(console.error);