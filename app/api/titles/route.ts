// app/api/titles/route.ts
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const titles = await prisma.title.findMany({
      include: {
        service: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({ titles });
  } catch (error) {
    console.error('❌ Error fetching titles:', error);
    return NextResponse.json({ error: 'Failed to fetch titles' }, { status: 500 });
  }
}
