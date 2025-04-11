import { PrismaClient } from '@prisma/client';
import { fetchFromStremio } from '../lib/stremio';

const prisma = new PrismaClient();

async function fetchTPBTitles() {
  const data = await fetchFromStremio('/catalog/movie/top.json');
  const titles = data.metas;

  const service = await prisma.streamingService.upsert({
    where: { name: 'PirateBay+' },
    update: {},
    create: { name: 'PirateBay+' },
  });

  for (const t of titles.slice(0, 50)) {
    await prisma.title.upsert({
      where: { id: t.id },
      update: {},
      create: {
        id: t.id,
        name: t.name || 'Untitled',
        imageUrl: t.poster,
        serviceId: service.id,
      },
    });
  }

  console.log(`✅ Stored ${titles.length} titles from Stremio`);
}

fetchTPBTitles();
