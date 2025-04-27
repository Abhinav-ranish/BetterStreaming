// app/api/auth/login/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { compare } from 'bcryptjs';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const { email, password }: { email: string; password: string } = await req.json();

    // Fetch the user from the database
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !(await compare(password, user.password))) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // Return the user data (without password)
    return NextResponse.json({
      user: { id: user.id, email: user.email, isAdmin: user.isAdmin },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Auto-create admin account if it doesn't exist
async function initAdmin() {
  try {
    const existingAdmin = await prisma.user.findUnique({ where: { email: 'admin@admin.com' } });
    if (!existingAdmin) {
      // It's better to use environment variables for sensitive data like passwords
      const hashed = await import('@/lib/auth').then(mod => mod.hashPassword(process.env.ADMIN_PASSWORD || 'admin123'));
      await prisma.user.create({
        data: {
          email: 'admin@admin.com',
          password: hashed,
          isAdmin: true,
        },
      });
      console.log('✅ Default admin created');
    }
  } catch (error) {
    console.error('Error during admin initialization:', error);
  }
}

// Run the admin initialization once during startup
if (process.env.NODE_ENV === 'development') {
  initAdmin().catch(console.error);
}
