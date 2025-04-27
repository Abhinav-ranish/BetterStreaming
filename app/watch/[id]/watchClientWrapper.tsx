'use client';

import WatchClient from './WatchClient';

export default function WatchClientWrapper({ imdbId }: { imdbId: string }) {
  console.log("👀 imdbId from wrapper:", imdbId);
  return <WatchClient imdbId={imdbId} />;
}
