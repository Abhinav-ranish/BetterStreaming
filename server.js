const express = require('express');
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
require('dotenv').config();
const fetch = require('node-fetch');



const app = express();
const PORT = 4000;
const OUTPUT_DIR = path.join(__dirname, 'tmp');

let currentProcess = null;
let currentFile = null;
let currentStreamUrl = null;
let lastHeartbeat = null;
let currentSubtitleFile = null;
let allSubtitles = [];
let subtitleDownloadStatus = 'pending'; // Can be 'pending', 'downloading', 'complete'


app.use(express.json());

// Middleware: CORS + logging
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  console.log(`📥 ${req.method} ${req.url}`);
  next();
});

  
// Start streaming a magnet
app.post('/start', async (req, res) => {
  const { magnet } = req.body;
  if (!magnet) return res.status(400).send('Missing magnet');

  const imdbIdMatch = magnet.match(/tt\d{7,}/);
  const imdbId = imdbIdMatch ? imdbIdMatch[0] : null;

  console.log('🚀 Received magnet:', magnet);

  if (fs.existsSync(OUTPUT_DIR)) fs.rmSync(OUTPUT_DIR, { recursive: true });
  fs.mkdirSync(OUTPUT_DIR);

  if (currentProcess) {
    console.log('🔪 Killing previous WebTorrent process');
    currentProcess.kill('SIGKILL');
  }

  currentStreamUrl = null;
  currentFile = null;

  currentProcess = spawn('webtorrent-hybrid', [magnet, '--out', 'tmp']);
  console.log('🎯 WebTorrent process started');

  currentProcess.stdout.on('data', async (data) => {  // 👈 make it async!
    const str = data.toString();
    // console.log(`[webtorrent] ${str}`);
  
    // Extract stream URL
    const match = str.match(/Server running at:(.*)/);
    if (match) {
      currentStreamUrl = match[1].trim();
    //   console.log(`🎯 Extracted stream URL: ${currentStreamUrl}`);
    }
  
    // Detect subtitle file
    if (allSubtitles.length === 0) {
      allSubtitles = findAllSubtitleFiles(OUTPUT_DIR);
      if (allSubtitles[0]) {
        subtitleDownloadStatus = 'complete'; // Set status to 'complete' once subtitles are ready
        currentSubtitleFile = allSubtitles[0].path;
        console.log(`📝 TBP+ subtitle: ${allSubtitles[0].filename}`);
      } else if (imdbId) {
        console.log("tried the thingy");
        await fetchFallbackSub(imdbId);  // ✅ now this will work properly
      }
    }
  
    // Detect MP4 file
    if (!currentFile) {
      const matchFile = str.match(/downloading:\s+(.*\.mp4)/i);
      if (matchFile) {
        currentFile = path.join(OUTPUT_DIR, path.basename(matchFile[1]));
        console.log(`🎥 Detected file: ${currentFile}`);
      }
    }
  });  

  currentProcess.stderr.on('data', (data) => {
    console.error(`[webtorrent error] ${data}`);
  });

  lastHeartbeat = Date.now();
  res.send({ status: 'starting' });
});

async function fetchFallbackSub(imdbId) {
  subtitleDownloadStatus = 'downloading'; // Set status to 'downloading' while fetching subtitles
    try {
      const osRes = await fetch(`https://api.opensubtitles.com/api/v1/subtitles?imdb_id=${imdbId}&languages=en`, {
        headers: {
          'Api-Key': process.env.OPENSUBTITLES_API_KEY
        }
      });
  
      const json = await osRes.json();
      const subtitleUrl = json?.data?.[0]?.attributes?.url;
  
      if (subtitleUrl) {
        const subtitlePath = path.join(OUTPUT_DIR, 'fallback_en.vtt');
        const subtitleRes = await fetch(subtitleUrl);
        const buffer = await subtitleRes.arrayBuffer();
        fs.writeFileSync(subtitlePath, Buffer.from(buffer));
  
        currentSubtitleFile = subtitlePath;
        allSubtitles.push({
          path: subtitlePath,
          filename: 'fallback_en.vtt',
          language: 'English'
        });
        subtitleDownloadStatus = 'complete'; // Set status to 'complete' once subtitles are ready
        console.log(`🌍 Fallback subtitle downloaded: ${subtitlePath}`);
      }
    } catch (e) {
      subtitleDownloadStatus = 'failed'; // If fetching fails
      console.warn('❌ OpenSubtitles fallback failed:', e);
    }
  }
  
// Status check
app.get('/status', (req, res) => {
    res.json({
        status: currentStreamUrl ? 'ready' : 'waiting',
        streamUrl: currentStreamUrl || null,
        localStream: currentFile ? 'http://localhost:4000/stream' : null,
        hasSubtitles: !!currentSubtitleFile,
        subtitles: allSubtitles.map((s, i) => ({
            id: i,
            language: s.language,
            label: s.filename,
            url: `http://localhost:4000/subtitles?id=${i}`
        })),
        subtitleDownloadStatus,
    });
  });
  

// Heartbeat (called by frontend to keep stream alive)
app.post('/heartbeat', (req, res) => {
  lastHeartbeat = Date.now();
  res.sendStatus(200);
});

// Manual stop (e.g. on tab close)
app.post('/stop', (req, res) => {
  if (currentProcess) {
    currentProcess.kill('SIGKILL');
    console.log('🛑 Manual stop triggered');
  }
  currentProcess = null;
  currentFile = null;
  currentStreamUrl = null;
  currentSubtitleFile = null;
  res.sendStatus(200);
});

// Serve subtitles
app.get('/subtitles', (req, res) => {
    const id = parseInt(req.query.id);
    const subtitle = allSubtitles[id];

    if (subtitleDownloadStatus !== 'complete') {
      return res.status(404).send('Subtitle still downloading, please wait...');
    }
  
    if (!subtitle || !fs.existsSync(subtitle.path)) {
      return res.status(404).send('Subtitle not found');
    }
  
    res.setHeader('Content-Type', 'text/vtt');
    if (subtitle.path.endsWith('.srt')) {
      const srt2vtt = require('srt-to-vtt');
      fs.createReadStream(subtitle.path).pipe(srt2vtt()).pipe(res);
    } else {
      fs.createReadStream(subtitle.path).pipe(res);
    }
  });
  
  
  
// Serve stream manually if needed
app.get('/stream', (req, res) => {
  if (!currentFile || !fs.existsSync(currentFile)) {
    return res.status(404).send('Stream not ready');
  }

  const stat = fs.statSync(currentFile);
  const fileSize = stat.size;
  const range = req.headers.range;

  if (!range) {
    res.writeHead(200, {
      'Content-Length': fileSize,
      'Content-Type': 'video/mp4',
    });
    fs.createReadStream(currentFile).pipe(res);
  } else {
    const [startStr, endStr] = range.replace(/bytes=/, '').split('-');
    const start = parseInt(startStr, 10);
    const end = endStr ? parseInt(endStr, 10) : fileSize - 1;
    const chunkSize = end - start + 1;

    const stream = fs.createReadStream(currentFile, { start, end });
    res.writeHead(206, {
      'Content-Range': `bytes ${start}-${end}/${fileSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunkSize,
      'Content-Type': 'video/mp4',
    });
    stream.pipe(res);
  }
});

function extractLanguage(filename) {
    const codeMap = {
      en: 'English', eng: 'English', english: 'English',
      fr: 'French', french: 'French',
      de: 'German', dt: 'German', ger: 'German',
      es: 'Spanish', sp: 'Spanish', spa: 'Spanish',
      it: 'Italian', ita: 'Italian',
      jp: 'Japanese', jpn: 'Japanese'
    };
  
    const lower = filename.toLowerCase();
    for (const code in codeMap) {
      if (new RegExp(`\\b${code}\\w*`).test(lower)) {
        return codeMap[code];
      }
    }
    return 'Unknown';
  }
  
  function findAllSubtitleFiles(dir) {
    const results = [];
  
    function walk(currentDir) {
      const entries = fs.readdirSync(currentDir, { withFileTypes: true });
  
      for (const entry of entries) {
        const fullPath = path.join(currentDir, entry.name);
  
        if (entry.isDirectory()) {
          walk(fullPath);
        } else if (/\.(srt|vtt)$/i.test(entry.name)) {
          results.push({
            path: fullPath,
            filename: entry.name,
            language: extractLanguage(entry.name)
          });
        }
      }
    }
  
    walk(dir);
    return results;
  }
  
// Kill inactive streams
setInterval(() => {
  if (currentProcess && lastHeartbeat && Date.now() - lastHeartbeat > 60_000) {
    console.log('💤 No activity, stopping stream');
    currentProcess.kill('SIGKILL');
    currentProcess = null;
    currentFile = null;
    currentStreamUrl = null;
  }
}, 30_000);

// Start server
app.listen(PORT, () => {
  console.log(`✅ Streaming server running at http://localhost:${PORT}`);
});
