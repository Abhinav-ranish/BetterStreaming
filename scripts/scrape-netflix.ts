import { chromium } from 'playwright';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function scrapeNetflix() {
  const netflixAccount = await prisma.streamingAccount.findFirst({
    where: {
      service: {
        name: 'Netflix',
      },
    },
    include: {
      service: true,
    },
  });

  if (!netflixAccount) {
    console.error('No Netflix account found.');
    return;
  }

  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    console.log(`Logging in as ${netflixAccount.email}`);

    await page.goto('https://www.netflix.com/login');

    await page.fill('input[name="userLoginId"]', netflixAccount.email);
    await page.fill('input[name="password"]', netflixAccount.password);
    await page.click('button[type="submit"]');

    // Wait and click profile avatar if it shows up
    try {
        await page.waitForSelector('.profile-icon', { timeout: 5000 });
        await page.click('.profile-icon');
        console.log('👤 Selected default profile');
    } catch {
        console.log('👍 No profile selection screen');
    }

    await page.goto('https://www.netflix.com/browse');

    // TODO: Navigate to home or choose a profile if needed

    console.log('✅ Login success, now scraping titles...');

    // Try to wait for at least one title to appear
    await page.waitForSelector('.title-card-container', { timeout: 10000 });

    const titles = await page.$$eval('.title-card-container', (cards) =>
      cards.slice(0, 10).map((card) => {
        const img = card.querySelector('img');
        return {
          name: img?.alt || 'Untitled',
          imageUrl: img?.src || '',
        };
      })
    );

    // Save to DB
    for (const t of titles) {
      await prisma.title.create({
        data: {
          name: t.name,
          imageUrl: t.imageUrl,
          serviceId: netflixAccount.service.id,
        },
      });
    }

    console.log(`✅ Saved ${titles.length} titles to DB`);
  } catch (err) {
    console.error('❌ Scrape failed:', err);
  } finally {
    await browser.close();
  }
}

scrapeNetflix();
