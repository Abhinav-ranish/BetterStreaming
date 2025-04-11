export function pickBestStream(streams: any[]) {
    if (!Array.isArray(streams)) return null;
  
    // Filter for streams <= 5GB
    const filtered = streams
      .map((s) => {
        const peerMatch = s.title?.match(/👤\s*(\d+)/);
        const sizeMatch = s.title?.match(/💾\s*([\d.]+)\s*GB/);
        const peers = peerMatch ? parseInt(peerMatch[1]) : 0;
        const size = sizeMatch ? parseFloat(sizeMatch[1]) : Infinity;
        return { ...s, peers, size };
      })
      .filter((s) => s.size <= 5);
  
    // Pick the one with the highest peer count (<=5GB)
    return filtered.sort((a, b) => b.peers - a.peers)[0] || null;
  }
  