'use client';
import dynamic from 'next/dynamic';

// Dynamic import with SSR disabled
const WatchClient = dynamic(() => import('@/components/WatchClient'), {
  ssr: false,
});

export default function WatchClientWrapper({ imdbId }: { imdbId: string }) {
  return <WatchClient imdbId={imdbId} />;
}
