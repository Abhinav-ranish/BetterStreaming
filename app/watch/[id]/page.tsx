// @ts-ignore
import WatchClientWrapper from './WatchClientWrapper';

export async function generateMetadata({ params }: { params: { id: string } }) {
  return {
    title: `Watching ${params.id}`,
  };
}

export default function Page({ params }: { params: { id: string } }) {
  return <WatchClientWrapper imdbId={params.id} />;
}
