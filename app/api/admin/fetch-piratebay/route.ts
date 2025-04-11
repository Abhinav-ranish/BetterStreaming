// app/api/admin/fetch-piratebay/route.ts
import { NextResponse } from 'next/server';
import { fetchFromStremio } from '@/lib/stremio';
import { prisma } from '@/lib/prisma';

export async function GET() {
    await prisma.streamingService.upsert({
        where: { name: 'PirateBay+' },
        update: {},
        create: { name: 'PirateBay+' },
      });
    try {
        const catalog = await fetchFromStremio('/catalog/movie/top.json');

        const titles = catalog.metas || [];
        let count = 0;

        for (const t of titles.slice(0, 50)) {
        await prisma.title.upsert({
            where: { id: t.id },
            update: { name: t.name, imageUrl: t.poster },
            create: {
            id: t.id,
            name: t.name,
            imageUrl: t.poster,
            service: { connect: { name: 'PirateBay+' } },
            },
        });
        count++;
        }

        return NextResponse.json({ ok: true, added: count });
    } catch (err: any) {
        console.error(err);
        return NextResponse.json({ error: err.message || 'Failed' }, { status: 500 });
    }
}
