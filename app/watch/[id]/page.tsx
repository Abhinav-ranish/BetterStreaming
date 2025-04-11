import WatchClientWrapper from './watchClientWrapper';

export default function WatchPage({ params }: { params: { id: string } }) {
  return <WatchClientWrapper imdbId={params.id} />;
}
