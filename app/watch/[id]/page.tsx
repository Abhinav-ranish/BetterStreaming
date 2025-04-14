import WatchClientWrapper from './watchClientWrapper';

export default async function WatchPage({ params }: { params: { id: string } }) {
  return <WatchClientWrapper imdbId={params.id} />;
}
