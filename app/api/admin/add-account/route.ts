import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  const { serviceName, email, password, maxUsers = 5 } = await req.json();

  // Find or create the streaming service
  let service = await prisma.streamingService.findUnique({ where: { name: serviceName } });

  if (!service) {
    service = await prisma.streamingService.create({
      data: { name: serviceName },
    });
  }

  const account = await prisma.streamingAccount.create({
    data: {
      email,
      password,
      maxUsers,
      serviceId: service.id,
    },
  });

  return NextResponse.json({ account });
}
