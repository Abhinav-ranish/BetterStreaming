import axios from 'axios';

const STREMIO_HOSTS = [
  'https://thepiratebay-plus.strem.fun/'
  'https://torrentio.strem.fun',
  'https://v3-cinemeta.strem.io',
];

export async function fetchFromStremio(path: string) {
  let lastError = null;

  for (const host of STREMIO_HOSTS) {
    const url = `${host}${path}`;
    console.log(`🌍 Trying: ${url}`);
    try {
      const res = await axios.get(url, { timeout: 8000 });
      console.log(`✅ Success: ${url}`);
      return res.data;
    } catch (err) {
      console.warn(`❌ Failed: ${url}`);
      lastError = err;
    }
  }

  throw new Error(`All Stremio hosts failed. Last error: ${lastError}`);
}
