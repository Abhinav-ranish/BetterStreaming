export function pickBestStream(streams: any[]) {
  if (!streams || streams.length === 0) return null;

  // Prefer 1080p, fallback to highest peers if no 1080p
  const sorted = streams
    .filter(s => s.infoHash)
    .sort((a, b) => {
      const aScore = (a.tag?.includes('1080p') ? 10 : 0) + (a.title?.match(/👤 (\d+)/)?.[1] || 0);
      const bScore = (b.tag?.includes('1080p') ? 10 : 0) + (b.title?.match(/👤 (\d+)/)?.[1] || 0);
      return Number(bScore) - Number(aScore);
    });

  const best = sorted[0];

  return {
    ...best,
    fileIdx: best.fileIdx ?? 0, // fallback
    behaviorHints: best.behaviorHints ?? {},
    name: best.title,
    sources: best.sources ?? [], // may be empty
  };
}
